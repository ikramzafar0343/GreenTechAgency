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
  archiveStatAdmin,
  createStatAdmin,
  deleteStatAdmin,
  getStatAdmin,
  listStatsAdmin,
  publishStatAdmin,
  reorderStatsAdmin,
  unpublishStatAdmin,
  updateStatAdmin,
} from "./admin.js";
import { parseContentLocale } from "../../content/translations.js";
import { getPublishedStatsSection } from "./public.js";

export const publicStatsRouter = Router();
export const adminStatsRouter = Router();

publicStatsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const locale = parseContentLocale(req.query.locale);
    res.json(await getPublishedStatsSection(locale));
  }),
);

adminStatsRouter.use(requireAdmin, requireCsrf, rateLimitAdminWrites);

adminStatsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = parseListQuery(
      req.query as Record<string, unknown>,
      CONTENT_STATUSES,
    );
    res.json(await listStatsAdmin(query));
  }),
);

adminStatsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.status(201).json(await createStatAdmin(actorId, req.body ?? {}));
  }),
);

adminStatsRouter.post(
  "/reorder",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(await reorderStatsAdmin(actorId, (req.body ?? {}).orderedIds));
  }),
);

adminStatsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    res.json(await getStatAdmin(String(req.params.id)));
  }),
);

adminStatsRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(await updateStatAdmin(actorId, String(req.params.id), req.body ?? {}));
  }),
);

adminStatsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(await deleteStatAdmin(actorId, String(req.params.id)));
  }),
);

adminStatsRouter.post(
  "/:id/publish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await publishStatAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);

adminStatsRouter.post(
  "/:id/unpublish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await unpublishStatAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);

adminStatsRouter.post(
  "/:id/archive",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await archiveStatAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);
