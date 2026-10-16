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
  archivePortfolioAdmin,
  createPortfolioAdmin,
  deletePortfolioAdmin,
  getPortfolioAdmin,
  listPortfolioAdmin,
  publishPortfolioAdmin,
  unpublishPortfolioAdmin,
  updatePortfolioAdmin,
} from "./admin.js";
import { parseContentLocale } from "../../content/translations.js";
import {
  getPublishedPortfolioBySlug,
  listPublishedPortfolio,
} from "./public.js";

export const publicPortfolioRouter = Router();
export const adminPortfolioRouter = Router();

publicPortfolioRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const raw = req.query.limit;
    const limit =
      raw === undefined ? 50 : Math.min(Math.max(Number(raw) || 50, 1), 50);
    const locale = parseContentLocale(req.query.locale);
    res.json({ items: await listPublishedPortfolio(limit, locale) });
  }),
);

publicPortfolioRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const locale = parseContentLocale(req.query.locale);
    res.json(
      await getPublishedPortfolioBySlug(String(req.params.slug), locale),
    );
  }),
);

adminPortfolioRouter.use(requireAdmin, requireCsrf, rateLimitAdminWrites);

adminPortfolioRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = parseListQuery(
      req.query as Record<string, unknown>,
      CONTENT_STATUSES,
    );
    res.json(await listPortfolioAdmin(query));
  }),
);

adminPortfolioRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.status(201).json(await createPortfolioAdmin(actorId, req.body ?? {}));
  }),
);

adminPortfolioRouter.get(
  "/:id",
  asyncHandler(async (req, res) => {
    res.json(await getPortfolioAdmin(String(req.params.id)));
  }),
);

adminPortfolioRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await updatePortfolioAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);

adminPortfolioRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(await deletePortfolioAdmin(actorId, String(req.params.id)));
  }),
);

adminPortfolioRouter.post(
  "/:id/publish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await publishPortfolioAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);

adminPortfolioRouter.post(
  "/:id/unpublish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await unpublishPortfolioAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);

adminPortfolioRouter.post(
  "/:id/archive",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await archivePortfolioAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);
