import { Router } from "express";
import { asyncHandler } from "../../http/asyncHandler.js";
import { requireCsrf } from "../../http/csrf.js";
import { rateLimitAdminWrites } from "../../http/rateLimit.js";
import {
  getAdminActorId,
  requireAdmin,
  type AdminRequest,
} from "../../http/requireAdmin.js";
import {
  getSiteDocumentAdmin,
  publishSiteDocumentAdmin,
  updateSiteDocumentAdmin,
} from "./admin.js";
import { parseContentLocale } from "../../content/translations.js";
import { getPublishedSiteDocument } from "./public.js";

export const publicSiteDocumentsRouter = Router();
export const adminSiteDocumentsRouter = Router();

publicSiteDocumentsRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    const locale = parseContentLocale(req.query.locale);
    res.json(await getPublishedSiteDocument(String(req.params.key), locale));
  }),
);

adminSiteDocumentsRouter.use(requireAdmin, requireCsrf, rateLimitAdminWrites);

adminSiteDocumentsRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    res.json(await getSiteDocumentAdmin(String(req.params.key)));
  }),
);

adminSiteDocumentsRouter.patch(
  "/:key",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await updateSiteDocumentAdmin(
        actorId,
        String(req.params.key),
        req.body ?? {},
      ),
    );
  }),
);

adminSiteDocumentsRouter.post(
  "/:key/publish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await publishSiteDocumentAdmin(
        actorId,
        String(req.params.key),
        req.body ?? {},
      ),
    );
  }),
);
