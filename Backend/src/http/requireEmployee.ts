import type { Request, Response, NextFunction } from "express";
import {
  requireEmployeeSession,
  type AuthenticatedSession,
} from "../auth/requireSession.js";
import { AppError } from "./errors.js";

export type EmployeeRequest = Request & {
  employeeSession?: AuthenticatedSession;
};

export async function requireEmployee(
  req: EmployeeRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    req.employeeSession = await requireEmployeeSession(req.headers);
    next();
  } catch (err) {
    if (err instanceof Error && err.message === "UNAUTHORIZED") {
      next(new AppError("UNAUTHORIZED", "Authentication required"));
      return;
    }
    if (err instanceof Error && err.message === "FORBIDDEN") {
      next(new AppError("FORBIDDEN", "Employee role required"));
      return;
    }
    next(err);
  }
}
