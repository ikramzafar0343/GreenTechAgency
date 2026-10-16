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
  archiveServiceAdmin,
  createServiceAdmin,
  deleteServiceAdmin,
  getServiceAdmin,
  listServicesAdmin,
  publishServiceAdmin,
  reorderServicesAdmin,
  unpublishServiceAdmin,
  updateServiceAdmin,
} from "./admin.js";
import { parseContentLocale } from "../../content/translations.js";
import {
  getPublishedServiceBySlug,
  getPublishedSubservice,
  listPublishedServices,
  listPublishedSubservices,
} from "./public.js";

export const publicServicesRouter = Router();
export const adminServicesRouter = Router();

publicServicesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const locale = parseContentLocale(req.query.locale);
    res.json({ items: await listPublishedServices(50, locale) });
  }),
);

publicServicesRouter.get(
  "/:serviceSlug/subservices/:slug",
  asyncHandler(async (req, res) => {
    const locale = parseContentLocale(req.query.locale);
    res.json(
      await getPublishedSubservice(
        String(req.params.serviceSlug),
        String(req.params.slug),
        locale,
      ),
    );
  }),
);

publicServicesRouter.get(
  "/:serviceSlug/subservices",
  asyncHandler(async (req, res) => {
    const locale = parseContentLocale(req.query.locale);
    res.json({
      items: await listPublishedSubservices(
        String(req.params.serviceSlug),
        50,
        locale,
      ),
    });
  }),
);

publicServicesRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const locale = parseContentLocale(req.query.locale);
    res.json(await getPublishedServiceBySlug(String(req.params.slug), locale));
  }),
);

adminServicesRouter.use(requireAdmin, requireCsrf, rateLimitAdminWrites);

adminServicesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = parseListQuery(
      req.query as Record<string, unknown>,
      CONTENT_STATUSES,
    );
    res.json(await listServicesAdmin(query));
  }),
);

adminServicesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.status(201).json(await createServiceAdmin(actorId, req.body ?? {}));
  }),
);

adminServicesRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    res.json(await getServiceAdmin(String(req.params.id)));
  }),
);

adminServicesRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await updateServiceAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);

adminServicesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(await deleteServiceAdmin(actorId, String(req.params.id)));
  }),
);

adminServicesRouter.post(
  "/:id/publish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await publishServiceAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);

adminServicesRouter.post(
  "/:id/unpublish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await unpublishServiceAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);

adminServicesRouter.post(
  "/:id/archive",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await archiveServiceAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);

adminServicesRouter.post(
  "/reorder",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await reorderServicesAdmin(actorId, (req.body ?? {}).orderedIds),
    );
  }),
);
