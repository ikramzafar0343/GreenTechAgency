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
  archiveFaqAdmin,
  createFaqAdmin,
  deleteFaqAdmin,
  getFaqAdmin,
  listFaqAdmin,
  publishFaqAdmin,
  reorderFaqAdmin,
  unpublishFaqAdmin,
  updateFaqAdmin,
} from "./admin.js";
import { parseContentLocale } from "../../content/translations.js";
import { listPublishedFaqs } from "./public.js";

export const publicFaqRouter = Router();
export const adminFaqRouter = Router();

publicFaqRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const locale = parseContentLocale(req.query.locale);
    res.json({ items: await listPublishedFaqs(locale) });
  }),
);

adminFaqRouter.use(requireAdmin, requireCsrf, rateLimitAdminWrites);

adminFaqRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = parseListQuery(
      req.query as Record<string, unknown>,
      CONTENT_STATUSES,
    );
    res.json(await listFaqAdmin(query));
  }),
);

adminFaqRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.status(201).json(await createFaqAdmin(actorId, req.body ?? {}));
  }),
);

adminFaqRouter.post(
  "/reorder",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(await reorderFaqAdmin(actorId, (req.body ?? {}).orderedIds));
  }),
);

adminFaqRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    res.json(await getFaqAdmin(String(req.params.id)));
  }),
);

adminFaqRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(await updateFaqAdmin(actorId, String(req.params.id), req.body ?? {}));
  }),
);

adminFaqRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(await deleteFaqAdmin(actorId, String(req.params.id)));
  }),
);

adminFaqRouter.post(
  "/:id/publish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await publishFaqAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);

adminFaqRouter.post(
  "/:id/unpublish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await unpublishFaqAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);

adminFaqRouter.post(
  "/:id/archive",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await archiveFaqAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);
