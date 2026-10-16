import { Router } from "express";
import { asyncHandler } from "../../http/asyncHandler.js";
import { requireCsrf } from "../../http/csrf.js";
import { rateLimitAdminWrites } from "../../http/rateLimit.js";
import { AppError } from "../../http/errors.js";
import {
  getAdminActorId,
  requireAdmin,
  type AdminRequest,
} from "../../http/requireAdmin.js";
import {
  deleteMedia,
  listMedia,
  registerSiteStaticMedia,
  uploadVpsMedia,
} from "./admin.js";

export const adminMediaRouter = Router();

adminMediaRouter.use(requireAdmin, requireCsrf, rateLimitAdminWrites);

adminMediaRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    res.json(await listMedia(req.query as Record<string, unknown>));
  }),
);

adminMediaRouter.post(
  "/site-static",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res
      .status(201)
      .json(await registerSiteStaticMedia(actorId, req.body ?? {}));
  }),
);

adminMediaRouter.post(
  "/upload",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    const contentType = req.headers["content-type"] ?? "";
    if (!contentType.includes("multipart/form-data")) {
      throw new AppError(
        "VALIDATION",
        "Content-Type must be multipart/form-data with a file field",
      );
    }
    const { parseMultipartImage } = await import("./multipart.js");
    const parsed = await parseMultipartImage(req);
    res.status(201).json(
      await uploadVpsMedia(actorId, parsed.buffer, {
        alt: parsed.alt,
        decorative: parsed.decorative,
        visibility: parsed.visibility,
      }),
    );
  }),
);

adminMediaRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    const force =
      req.query.force === "true" ||
      req.query.force === "1" ||
      (req.body ?? {}).force === true;
    res.json(
      await deleteMedia(actorId, String(req.params.id), {
        force: Boolean(force),
      }),
    );
  }),
);
