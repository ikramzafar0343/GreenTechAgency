import { Router } from "express";
import { eq } from "drizzle-orm";
import { asyncHandler } from "../../http/asyncHandler.js";
import {
  requireEmployee,
  type EmployeeRequest,
} from "../../http/requireEmployee.js";
import { getDb } from "../../db/client.js";
import { opsEmployee } from "../../db/schema/ops.js";
import { getEmployeeMe } from "./me.js";

export const employeeMeRouter = Router();

employeeMeRouter.get(
  "/me",
  requireEmployee,
  asyncHandler(async (req, res) => {
    const session = (req as EmployeeRequest).employeeSession;
    if (!session) {
      res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Authentication required",
      });
      return;
    }
    res.json(getEmployeeMe(session));
  }),
);

employeeMeRouter.get(
  "/profile",
  requireEmployee,
  asyncHandler(async (req, res) => {
    const session = (req as EmployeeRequest).employeeSession;
    if (!session) {
      res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Authentication required",
      });
      return;
    }
    const db = getDb();
    const rows = await db
      .select()
      .from(opsEmployee)
      .where(eq(opsEmployee.id, session.user.id))
      .limit(1);
    const row = rows[0];
    if (!row || row.status === "archived") {
      res.status(404).json({
        error: "NOT_FOUND",
        message: "Employee profile not found",
      });
      return;
    }
    const payload = (row.payload ?? {}) as Record<string, unknown>;
    res.json({
      ...payload,
      id: row.id,
      status: row.status,
      version: row.version,
      updatedAt: row.updatedAt.toISOString(),
      active: row.status === "active",
    });
  }),
);
