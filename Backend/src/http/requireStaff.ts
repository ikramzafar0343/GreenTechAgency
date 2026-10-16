import type { Request, Response, NextFunction } from "express";
import {
  requireEmployeeSession,
  type AuthenticatedSession,
} from "../auth/requireSession.js";
import { AppError } from "./errors.js";

export type StaffRequest = Request & {
  staffSession?: AuthenticatedSession;
};

/** Allows Better Auth users with role `admin` or `employee`. */
export async function requireStaff(
  req: StaffRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    req.staffSession = await requireEmployeeSession(req.headers);
    next();
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      next(new AppError("UNAUTHORIZED", "Authentication required"));
      return;
    }
    if (err instanceof Error && err.message === "FORBIDDEN") {
      next(new AppError("FORBIDDEN", "Staff role required"));
      return;
    }
    next(err);
  }
}

export function getStaffActorId(req: StaffRequest): string {
  const id = req.staffSession?.user.id;
  if (!id) {
    throw new AppError("UNAUTHORIZED", "Authentication required");
  }
  return id;
}
