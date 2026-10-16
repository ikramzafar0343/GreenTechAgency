import { Router } from "express";
import { CONTENT_STATUSES } from "../../content/constants.js";
import { asyncHandler } from "../../http/asyncHandler.js";
import { requireCsrf } from "../../http/csrf.js";
import { parseListQuery } from "../../http/pagination.js";
import { rateLimitAdminWrites } from "../../http/rateLimit.js";
import {
  getAdminActorId,
  requireAdmin,
  type AdminRequest,
} from "../../http/requireAdmin.js";
import {
  createSubserviceAdmin,
  deleteSubserviceAdmin,
  getSubserviceAdmin,
  listSubservicesAdmin,
  publishSubserviceAdmin,
  updateSubserviceAdmin,
} from "./admin.js";

export const adminSubservicesRouter = Router();

adminSubservicesRouter.use(requireAdmin, requireCsrf, rateLimitAdminWrites);

adminSubservicesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = parseListQuery(
      req.query as Record<string, unknown>,
      CONTENT_STATUSES,
    );
    const serviceIdRaw = req.query.serviceId;
    const serviceId =
      typeof serviceIdRaw === "string" && serviceIdRaw.trim()
        ? serviceIdRaw.trim()
        : null;
    res.json(await listSubservicesAdmin(query, serviceId));
  }),
);

adminSubservicesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.status(201).json(await createSubserviceAdmin(actorId, req.body ?? {}));
  }),
);

adminSubservicesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    res.json(await getSubserviceAdmin(String(req.params.id)));
  }),
);

adminSubservicesRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await updateSubserviceAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);

adminSubservicesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(await deleteSubserviceAdmin(actorId, String(req.params.id)));
  }),
);

adminSubservicesRouter.post(
  "/:id/publish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await publishSubserviceAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);
