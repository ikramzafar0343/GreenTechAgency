import { hashPassword } from "better-auth/crypto";
import { and, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { writeAudit } from "../../content/audit.js";
import { getDb } from "../../db/client.js";
import { account, user } from "../../db/schema/auth.js";
import { opsEmployee } from "../../db/schema/ops.js";
import { AppError } from "../../http/errors.js";

const EMPLOYEE_KINDS = new Set(["sales", "delivery"]);

type EmployeePayload = {
  name: string;
  email: string;
  role: string;
  department: string;
  kind: string;
  image: string;
  active: boolean;
  teamMemberId: string | null;
};

function normalizeBody(body: Record<string, unknown>): Record<string, unknown> {
  const nested = body.payload;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return {
      ...(nested as Record<string, unknown>),
      ...(body.id !== undefined ? { id: body.id } : {}),
    };
  }
  return body;
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

function parseEmployeeFields(source: Record<string, unknown>): EmployeePayload {
  const name = readString(source, "name");
  const email = readString(source, "email").toLowerCase();
  const kind = readString(source, "kind").toLowerCase() || "delivery";
  const role =
    readString(source, "role") || (kind === "sales" ? "Sales" : "Delivery");
  const department =
    readString(source, "department") ||
    (kind === "sales" ? "Sales" : "Delivery");
  const image = readString(source, "image");
  const teamMemberRaw = source.teamMemberId;
  const teamMemberId =
    teamMemberRaw === null || teamMemberRaw === undefined
      ? null
      : String(teamMemberRaw).trim() || null;

  if (!name || !email.includes("@")) {
    throw new AppError("VALIDATION", "Name and email are required");
  }
  if (!EMPLOYEE_KINDS.has(kind)) {
    throw new AppError("VALIDATION", "kind must be sales or delivery");
  }

  return {
    name,
    email,
    role,
    department,
    kind,
    image,
    active: source.active !== false,
    teamMemberId,
  };
}

function parsePassword(source: Record<string, unknown>): string {
  const password = readString(source, "password");
  if (password.length < 8 || password.length > 200) {
    throw new AppError(
      "VALIDATION",
      "Password must be 8–200 characters",
    );
  }
  return password;
}

function toAdminDto(row: {
  id: string;
  status: string;
  version: number;
  payload: unknown;
  createdAt: Date;
  updatedAt: Date;
}): Record<string, unknown> {
  const payload = (row.payload ?? {}) as Record<string, unknown>;
  const { password: _password, ...safePayload } = payload;
  return {
    ...safePayload,
    id: row.id,
    status: row.status,
    version: row.version,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    active: row.status === "active",
  };
}

async function assertEmailAvailable(email: string, excludeUserId?: string) {
  const db = getDb();
  const existingUser = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);
  if (existingUser[0] && existingUser[0].id !== excludeUserId) {
    throw new AppError("CONFLICT", "That email is already in use");
  }

  const existingOps = await db
    .select({ id: opsEmployee.id })
    .from(opsEmployee)
    .where(
      and(
        sql`${opsEmployee.payload}->>'email' = ${email}`,
        excludeUserId ? sql`${opsEmployee.id} <> ${excludeUserId}` : sql`true`,
      ),
    )
    .limit(1);
  if (existingOps[0]) {
    throw new AppError("CONFLICT", "That email is already in use");
  }
}

/** Create ops employee + Better Auth credential user (same id). */
export async function createEmployeeWithCredentials(
  actorId: string,
  body: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const source = normalizeBody(body);
  const fields = parseEmployeeFields(source);
  const password = parsePassword(source);
  await assertEmailAvailable(fields.email);

  const userId = randomUUID();
  const now = new Date();
  const passwordHash = await hashPassword(password);
  const payload: EmployeePayload = { ...fields };

  const db = getDb();
  await db.transaction(async (tx) => {
    await tx.insert(user).values({
      id: userId,
      name: fields.name,
      email: fields.email,
      emailVerified: true,
      role: "employee",
      employeeKind: fields.kind,
      banned: false,
      createdAt: now,
      updatedAt: now,
    });
    await tx.insert(account).values({
      id: randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
      createdAt: now,
      updatedAt: now,
    });
    await tx.insert(opsEmployee).values({
      id: userId,
      status: "active",
      version: 1,
      payload,
      createdAt: now,
      updatedAt: now,
    });
  });

  await writeAudit({
    actorId,
    action: "create",
    entityType: "ops_employee",
    entityId: userId,
    result: "ok",
  });

  const rows = await db
    .select()
    .from(opsEmployee)
    .where(eq(opsEmployee.id, userId))
    .limit(1);
  const row = rows[0];
  if (!row) {
    throw new AppError("INTERNAL", "Employee created but not readable");
  }
  return toAdminDto(row);
}

/**
 * Set or create credential password for an existing ops employee.
 * Provisions a Better Auth user when the ops row predates auth cutover.
 */
export async function setEmployeePassword(
  actorId: string,
  employeeId: string,
  body: Record<string, unknown>,
): Promise<{ ok: true }> {
  const password = parsePassword(normalizeBody(body));
  const passwordHash = await hashPassword(password);
  const db = getDb();

  const rows = await db
    .select()
    .from(opsEmployee)
    .where(eq(opsEmployee.id, employeeId))
    .limit(1);
  const row = rows[0];
  if (!row || row.status === "archived") {
    throw new AppError("NOT_FOUND", "Employee not found");
  }

  const payload = (row.payload ?? {}) as Record<string, unknown>;
  const fields = parseEmployeeFields({
    ...payload,
    email: payload.email ?? "",
    name: payload.name ?? "",
    kind: payload.kind ?? "delivery",
  });
  const now = new Date();

  const existingById = await db
    .select({ id: user.id, email: user.email })
    .from(user)
    .where(eq(user.id, employeeId))
    .limit(1);

  if (existingById[0]) {
    if (existingById[0].email !== fields.email) {
      await assertEmailAvailable(fields.email, employeeId);
      await db
        .update(user)
        .set({
          email: fields.email,
          name: fields.name,
          employeeKind: fields.kind,
          role: "employee",
          updatedAt: now,
        })
        .where(eq(user.id, employeeId));
    } else {
      await db
        .update(user)
        .set({
          name: fields.name,
          employeeKind: fields.kind,
          role: "employee",
          updatedAt: now,
        })
        .where(eq(user.id, employeeId));
    }

    const accounts = await db
      .select({ id: account.id })
      .from(account)
      .where(
        and(eq(account.userId, employeeId), eq(account.providerId, "credential")),
      )
      .limit(1);

    if (accounts[0]) {
      await db
        .update(account)
        .set({ password: passwordHash, updatedAt: now })
        .where(eq(account.id, accounts[0].id));
    } else {
      await db.insert(account).values({
        id: randomUUID(),
        accountId: employeeId,
        providerId: "credential",
        userId: employeeId,
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      });
    }
  } else {
    await assertEmailAvailable(fields.email, employeeId);
    await db.transaction(async (tx) => {
      await tx.insert(user).values({
        id: employeeId,
        name: fields.name,
        email: fields.email,
        emailVerified: true,
        role: "employee",
        employeeKind: fields.kind,
        banned: false,
        createdAt: now,
        updatedAt: now,
      });
      await tx.insert(account).values({
        id: randomUUID(),
        accountId: employeeId,
        providerId: "credential",
        userId: employeeId,
        password: passwordHash,
        createdAt: now,
        updatedAt: now,
      });
    });
  }

  await writeAudit({
    actorId,
    action: "set_password",
    entityType: "ops_employee",
    entityId: employeeId,
    result: "ok",
  });

  return { ok: true as const };
}
