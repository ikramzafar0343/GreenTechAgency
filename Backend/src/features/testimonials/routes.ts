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
  archiveTestimonialAdmin,
  createTestimonialAdmin,
  deleteTestimonialAdmin,
  getTestimonialAdmin,
  listTestimonialsAdmin,
  publishTestimonialAdmin,
  reorderTestimonialsAdmin,
  unpublishTestimonialAdmin,
  updateTestimonialAdmin,
} from "./admin.js";
import { parseContentLocale } from "../../content/translations.js";
import { listPublishedTestimonials } from "./public.js";

export const publicTestimonialsRouter = Router();
export const adminTestimonialsRouter = Router();

publicTestimonialsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const locale = parseContentLocale(req.query.locale);
    res.json({ items: await listPublishedTestimonials(locale) });
  }),
);

adminTestimonialsRouter.use(requireAdmin, requireCsrf, rateLimitAdminWrites);

adminTestimonialsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = parseListQuery(
      req.query as Record<string, unknown>,
      CONTENT_STATUSES,
    );
    res.json(await listTestimonialsAdmin(query));
  }),
);

adminTestimonialsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.status(201).json(await createTestimonialAdmin(actorId, req.body ?? {}));
  }),
);

adminTestimonialsRouter.post(
  "/reorder",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await reorderTestimonialsAdmin(actorId, (req.body ?? {}).orderedIds),
    );
  }),
);

adminTestimonialsRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    res.json(await getTestimonialAdmin(String(req.params.id)));
  }),
);

adminTestimonialsRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await updateTestimonialAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);

adminTestimonialsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(await deleteTestimonialAdmin(actorId, String(req.params.id)));
  }),
);

adminTestimonialsRouter.post(
  "/:id/publish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await publishTestimonialAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);

adminTestimonialsRouter.post(
  "/:id/unpublish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await unpublishTestimonialAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);

adminTestimonialsRouter.post(
  "/:id/archive",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await archiveTestimonialAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);
