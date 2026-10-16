import { Router } from "express";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { asyncHandler } from "../../http/asyncHandler.js";
import { AppError } from "../../http/errors.js";
import { objectKeyFromRequest } from "./objectKeyFromRequest.js";
import { getMediaRoot, resolveVpsPath } from "./vpsStorage.js";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

export const publicMediaRouter = Router();

publicMediaRouter.get(
  "/*splat",
  asyncHandler(async (req, res) => {
    getMediaRoot();
    const objectKey = objectKeyFromRequest(req.params.splat, req.path);
    if (!objectKey.startsWith("uploads/")) {
      throw new AppError("NOT_FOUND", "Media not found");
    }
    const full = resolveVpsPath(objectKey);
    try {
      await access(full, constants.R_OK);
    } catch {
      throw new AppError("NOT_FOUND", "Media not found");
    }
    const ext = path.extname(full).toLowerCase();
    const mime = MIME_BY_EXT[ext] ?? "application/octet-stream";
    res.setHeader("Content-Type", mime);
    res.setHeader("Cache-Control", "public, max-age=86400");
    createReadStream(full).pipe(res);
  }),
);
