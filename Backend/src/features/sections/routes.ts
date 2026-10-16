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
  getSectionAdmin,
  publishSectionAdmin,
  updateSectionAdmin,
} from "./admin.js";
import { parseContentLocale } from "../../content/translations.js";
import { getPublishedSection } from "./public.js";

export const publicSectionsRouter = Router();
export const adminSectionsRouter = Router();

publicSectionsRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    const locale = parseContentLocale(req.query.locale);
    res.json(await getPublishedSection(String(req.params.key), locale));
  }),
);

adminSectionsRouter.use(requireAdmin, requireCsrf, rateLimitAdminWrites);

adminSectionsRouter.get(
  "/:key",
  asyncHandler(async (req, res) => {
    res.json(await getSectionAdmin(String(req.params.key)));
  }),
);

adminSectionsRouter.patch(
  "/:key",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await updateSectionAdmin(
        actorId,
        String(req.params.key),
        req.body ?? {},
      ),
    );
  }),
);

adminSectionsRouter.post(
  "/:key/publish",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await publishSectionAdmin(
        actorId,
        String(req.params.key),
        req.body ?? {},
      ),
    );
  }),
);
