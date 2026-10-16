import { Router } from "express";
import { asyncHandler } from "../../http/asyncHandler.js";
import { AppError } from "../../http/errors.js";
import { getRedirect } from "./public.js";

export const publicRedirectsRouter = Router();

publicRedirectsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const pathRaw = req.query.path;
    if (typeof pathRaw !== "string" || !pathRaw.startsWith("/")) {
      throw new AppError(
        "VALIDATION",
        "path query must be an absolute site path starting with /",
      );
    }
    const redirect = await getRedirect(pathRaw);
    if (!redirect) {
      throw new AppError("NOT_FOUND", "No redirect for this path");
    }
    res.json(redirect);
  }),
);
