import type { Request, Response, NextFunction } from "express";
import { getBackendEnv } from "../config/env.js";
import { AppError } from "./errors.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function originAllowed(origin: string, allowed: readonly string[]): boolean {
  return allowed.some((entry) => entry === origin);
}

/** Cookie-authenticated mutations must come from an allowlisted Frontend origin. */
export function requireCsrf(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (SAFE_METHODS.has(req.method)) {
    next();
    return;
  }
  const { frontendOrigins } = getBackendEnv();
  const origin = req.get("origin")?.trim();
  if (origin && originAllowed(origin, frontendOrigins)) {
    next();
    return;
  }
  const referer = req.get("referer")?.trim();
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      if (originAllowed(refererOrigin, frontendOrigins)) {
        next();
        return;
      }
    } catch {
      /* fall through */
    }
  }
  next(
    new AppError(
      "FORBIDDEN",
      "CSRF validation failed: Origin/Referer must match FRONTEND_ORIGIN",
    ),
  );
}
