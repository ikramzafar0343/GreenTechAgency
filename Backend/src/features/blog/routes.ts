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
  archiveBlogAdmin,
  createBlogAdmin,
  deleteBlogAdmin,
  getBlogAdmin,
  listBlogAdmin,
  publishBlogAdmin,
  unpublishBlogAdmin,
  updateBlogAdmin,
} from "./admin.js";
import { parseContentLocale } from "../../content/translations.js";
import {
  getPublishedBlogBySlug,
  listPublishedBlog,
} from "./public.js";

export const publicBlogRouter = Router();
export const adminBlogRouter = Router();

publicBlogRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const raw = req.query.limit;
    const limit =
      raw === undefined ? 50 : Math.min(Math.max(Number(raw) || 50, 1), 50);
    const locale = parseContentLocale(req.query.locale);
    res.json({ items: await listPublishedBlog(limit, locale) });
  }),
);

publicBlogRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const locale = parseContentLocale(req.query.locale);
    res.json(await getPublishedBlogBySlug(String(req.params.slug), locale));
  }),
);

adminBlogRouter.use(requireAdmin, requireCsrf, rateLimitAdminWrites);

adminBlogRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = parseListQuery(
      req.query as Record<string, unknown>,
      CONTENT_STATUSES,
    );
    res.json(await listBlogAdmin(query));
  }),
);

adminBlogRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.status(201).json(await createBlogAdmin(actorId, req.body ?? {}));
  }),
);

adminBlogRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    res.json(await getBlogAdmin(String(req.params.id)));
  }),
);

adminBlogRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await updateBlogAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);

adminBlogRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(await deleteBlogAdmin(actorId, String(req.params.id)));
  }),
);

adminBlogRouter.post(
  "/:id/publish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await publishBlogAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);

adminBlogRouter.post(
  "/:id/unpublish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await unpublishBlogAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);

adminBlogRouter.post(
  "/:id/archive",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await archiveBlogAdmin(actorId, String(req.params.id), req.body ?? {}),
    );
  }),
);
