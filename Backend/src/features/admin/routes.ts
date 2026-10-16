import { Router } from "express";
import { asyncHandler } from "../../http/asyncHandler.js";
import { requireAdmin, type AdminRequest } from "../../http/requireAdmin.js";
import { getAdminMe } from "./me.js";

export const adminMeRouter = Router();

adminMeRouter.get(
  "/me",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const session = (req as AdminRequest).adminSession;
    if (!session) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required" });
      return;
    }
    res.json(getAdminMe(session));
  }),
);
