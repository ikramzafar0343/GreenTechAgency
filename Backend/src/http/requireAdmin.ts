import type { Request, Response, NextFunction } from "express";
import {
  requireAdminSession,
  type AuthenticatedSession,
} from "../auth/requireSession.js";
import { AppError } from "./errors.js";

export type AdminRequest = Request & {
  adminSession?: AuthenticatedSession;
};

export async function requireAdmin(
  req: AdminRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    req.adminSession = await requireAdminSession(req.headers);
    next();
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      next(new AppError("UNAUTHORIZED", "Authentication required"));
      return;
    }
    if (err instanceof Error && err.message === "FORBIDDEN") {
      next(new AppError("FORBIDDEN", "Admin role required"));
      return;
    }
    next(err);
  }
}

export function getAdminActorId(req: AdminRequest): string {
  const id = req.adminSession?.user.id;
  if (!id) {
    throw new AppError("UNAUTHORIZED", "Authentication required");
  }
  return id;
}
