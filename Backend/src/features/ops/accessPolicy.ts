import type { NextFunction, Response } from "express";
import { AppError } from "../../http/errors.js";
import { getStaffActorId, type StaffRequest } from "../../http/requireStaff.js";

/**
 * Who may use an Ops resource.
 * - `adminOnly`: payroll, invoices, team and site content. Employees get 403.
 * - `staff`: day-to-day CRM work (clients, projects, leads, sales, messages, files).
 *   Employees may read, create, update and archive (soft delete); hard delete stays admin-only.
 */
export type OpsAccess = "adminOnly" | "staff";

const EMPLOYEE_SELF_FIELDS = new Set(["image", "version"]);

export function isAdmin(req: StaffRequest): boolean {
  const user = req.staffSession?.user;
  return Boolean(user && "role" in user && String(user.role ?? "") === "admin");
}

export function requireAdminActor(req: StaffRequest): string {
  if (!isAdmin(req)) {
    throw new AppError("FORBIDDEN", "Admin role required");
  }
  return getStaffActorId(req);
}

function pathSegments(req: StaffRequest): string[] {
  return req.path.split("/").filter(Boolean);
}

export function enforceOpsAccess(access: OpsAccess) {
  return (req: StaffRequest, _res: Response, next: NextFunction): void => {
    if (isAdmin(req)) {
      next();
      return;
    }
    if (access === "adminOnly") {
      next(new AppError("FORBIDDEN", "Admin role required"));
      return;
    }
    if (req.method === "DELETE") {
      next(new AppError("FORBIDDEN", "Only an admin can delete records"));
      return;
    }
    next();
  };
}

/**
 * Employee records hold salary and HR data. Employees may list the team
 * directory (safe fields only, see EMPLOYEE_DIRECTORY_FIELDS), read their own
 * record and change their own profile image; everything else is admin-only.
 */
export function enforceEmployeeRecordAccess(
  req: StaffRequest,
  _res: Response,
  next: NextFunction,
): void {
  if (isAdmin(req)) {
    next();
    return;
  }
  const segments = pathSegments(req);
  if (segments.length === 0 && req.method === "GET") {
    next();
    return;
  }
  const actorId = getStaffActorId(req);
  const isOwnRecord = segments.length === 1 && segments[0] === actorId;
  if (!isOwnRecord || (req.method !== "GET" && req.method !== "PATCH")) {
    next(new AppError("FORBIDDEN", "Admin role required"));
    return;
  }
  if (req.method === "PATCH") {
    const body: unknown = req.body;
    const keys =
      body && typeof body === "object" ? Object.keys(body as object) : [];
    if (keys.some((key) => !EMPLOYEE_SELF_FIELDS.has(key))) {
      next(new AppError("FORBIDDEN", "Employees can only update their profile image"));
      return;
    }
  }
  next();
}

export const EMPLOYEE_DIRECTORY_FIELDS = [
  "id",
  "name",
  "email",
  "role",
  "department",
  "kind",
  "image",
  "active",
  "status",
] as const;

/** Strips HR fields (salary, bank, address…) from a directory row for employees. */
export function toEmployeeDirectoryRow(row: unknown): Record<string, unknown> {
  const source = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
  const out: Record<string, unknown> = {};
  for (const key of EMPLOYEE_DIRECTORY_FIELDS) {
    if (key in source) {
      out[key] = source[key];
    }
  }
  return out;
}
