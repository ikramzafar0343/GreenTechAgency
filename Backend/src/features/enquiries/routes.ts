import { Router } from "express";
import { asyncHandler } from "../../http/asyncHandler.js";
import { requireCsrf } from "../../http/csrf.js";
import { parseListQuery } from "../../http/pagination.js";
import { rateLimitAdminWrites } from "../../http/rateLimit.js";
import { rateLimitPublicContact } from "../../http/rateLimitPublicContact.js";
import {
  getAdminActorId,
  requireAdmin,
  type AdminRequest,
} from "../../http/requireAdmin.js";
import { listEnquiriesAdmin, updateEnquiryStatusAdmin } from "./admin.js";
import { ENQUIRY_STATUSES } from "./docs.js";
import { submitEnquiry } from "./public.js";

export const publicEnquiriesRouter = Router();
export const adminEnquiriesRouter = Router();

publicEnquiriesRouter.post(
  "/",
  rateLimitPublicContact,
  asyncHandler(async (req, res) => {
    const result = await submitEnquiry((req.body ?? {}) as Record<string, unknown>);
    if (!result.saved) {
      res.status(200).json({ ok: true });
      return;
    }
    res.status(201).json({ ok: true, id: result.id });
  }),
);

adminEnquiriesRouter.use(requireAdmin, requireCsrf, rateLimitAdminWrites);

adminEnquiriesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = parseListQuery(
      req.query as Record<string, unknown>,
      ENQUIRY_STATUSES,
    );
    res.json(await listEnquiriesAdmin(query));
  }),
);

adminEnquiriesRouter.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = getAdminActorId(req as AdminRequest);
    res.json(
      await updateEnquiryStatusAdmin(
        actorId,
        String(req.params.id),
        req.body ?? {},
      ),
    );
  }),
);
