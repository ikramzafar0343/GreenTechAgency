import { randomUUID } from "node:crypto";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { writeAudit } from "../../content/audit.js";
import type { opsTeamMember, OpsResourceTable } from "../../db/schema/ops.js";
import {
  assertVersionMatch,
  parseExpectedVersion,
} from "../../content/version.js";
import { getDb } from "../../db/client.js";
import { AppError } from "../../http/errors.js";
import type { ListQuery } from "../../http/pagination.js";

export const OPS_STATUSES = ["active", "archived"] as const;

const SYSTEM_BODY_KEYS = new Set([
  "id",
  "status",
  "version",
  "createdAt",
  "updatedAt",
]);

type OpsRow = {
  id: string;
  status: string;
  version: number;
  payload: unknown;
  createdAt: Date;
  updatedAt: Date;
  clientId?: string | null;
  leadId?: string | null;
};

export type OpsExtraColumns = Record<string, string | null | undefined>;

export type OpsResourceCrudConfig = {
  table: OpsResourceTable;
  entityType: string;
  extraFromBody?: (body: Record<string, unknown>) => OpsExtraColumns;
};

function opsTable(table: OpsResourceTable): typeof opsTeamMember {
  return table as typeof opsTeamMember;
}

function auditOk(actorId: string, entityType: string, action: string, id: string) {
  return writeAudit({
    actorId,
    action,
    entityType,
    entityId: id,
    result: "ok",
  });
}

function normalizeMutationBody(
  body: Record<string, unknown>,
): Record<string, unknown> {
  const nested = body.payload;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return {
      ...(nested as Record<string, unknown>),
      ...(body.version !== undefined ? { version: body.version } : {}),
      ...(body.clientId !== undefined ? { clientId: body.clientId } : {}),
      ...(body.leadId !== undefined ? { leadId: body.leadId } : {}),
      ...(body.id !== undefined ? { id: body.id } : {}),
    };
  }
  return body;
}

function payloadFromBody(body: Record<string, unknown>): Record<string, unknown> {
  const source = normalizeMutationBody(body);
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (!SYSTEM_BODY_KEYS.has(key)) {
      out[key] = value;
    }
  }
  return out;
}

function toAdminDto(row: OpsRow): Record<string, unknown> {
  const payload = (row.payload ?? {}) as Record<string, unknown>;
  const dto: Record<string, unknown> = {
    ...payload,
    id: row.id,
    status: row.status,
    version: row.version,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
  if ("clientId" in row) {
    dto.clientId = row.clientId ?? null;
  }
  if ("leadId" in row) {
    dto.leadId = row.leadId ?? null;
  }
  return dto;
}

function readStringField(
  body: Record<string, unknown>,
  key: string,
): string | null | undefined {
  if (body[key] === undefined) return undefined;
  if (body[key] === null) return null;
  const value = String(body[key]).trim();
  return value || null;
}

export function createOpsResourceCrud(config: OpsResourceCrudConfig) {
  const { entityType, extraFromBody } = config;
  const table = opsTable(config.table);

  async function getRow(id: string): Promise<OpsRow> {
    const db = getDb();
    const rows = await db.select().from(table).where(eq(table.id, id)).limit(1);
    const row = rows[0] as OpsRow | undefined;
    if (!row) {
      throw new AppError("NOT_FOUND", `${entityType} not found`);
    }
    return row;
  }

  return {
    async list(query: ListQuery) {
      const db = getDb();
      const filters = [];
      if (query.status) {
        filters.push(eq(table.status, query.status));
      }
      if (query.q) {
        filters.push(sql`${table.payload}::text ilike ${`%${query.q}%`}`);
      }
      const where = filters.length ? and(...filters) : undefined;
      const [totalRow] = await db
        .select({ value: count() })
        .from(table)
        .where(where);
      const rows = (await db
        .select()
        .from(table)
        .where(where)
        .orderBy(desc(table.updatedAt))
        .limit(query.limit)
        .offset(query.offset)) as OpsRow[];
      return {
        items: rows.map(toAdminDto),
        total: totalRow?.value ?? 0,
        limit: query.limit,
        offset: query.offset,
      };
    },

    async get(id: string) {
      return toAdminDto(await getRow(id));
    },

    async create(actorId: string, body: Record<string, unknown>) {
      const db = getDb();
      const normalized = normalizeMutationBody(body);
      const id =
        typeof normalized.id === "string" && normalized.id.trim()
          ? normalized.id.trim()
          : randomUUID();
      const now = new Date();
      const payload = payloadFromBody(body);
      const extra = extraFromBody?.(normalized) ?? {};
      if (extra.clientId === undefined && normalized.clientId !== undefined) {
        extra.clientId = readStringField(normalized, "clientId");
      }
      if (extra.leadId === undefined && normalized.leadId !== undefined) {
        extra.leadId = readStringField(normalized, "leadId");
      }
      await db.insert(table).values({
        id,
        status: "active",
        version: 1,
        payload,
        ...extra,
        createdAt: now,
        updatedAt: now,
      });
      await auditOk(actorId, entityType, "create", id);
      return toAdminDto(await getRow(id));
    },

    async update(actorId: string, id: string, body: Record<string, unknown>) {
      const normalized = normalizeMutationBody(body);
      const expected = parseExpectedVersion(normalized);
      const row = await getRow(id);
      assertVersionMatch(expected, row.version);
      if (row.status === "archived") {
        throw new AppError("VALIDATION", "Archived records cannot be edited");
      }
      const existingPayload = (row.payload ?? {}) as Record<string, unknown>;
      const patch = payloadFromBody(body);
      const payload = { ...existingPayload, ...patch };
      const extra = extraFromBody?.(normalized) ?? {};
      if (normalized.clientId !== undefined) {
        extra.clientId = readStringField(normalized, "clientId");
      }
      if (normalized.leadId !== undefined) {
        extra.leadId = readStringField(normalized, "leadId");
      }
      const db = getDb();
      await db
        .update(table)
        .set({
          payload,
          ...extra,
          version: row.version + 1,
          updatedAt: new Date(),
        })
        .where(and(eq(table.id, id), eq(table.version, expected)));
      await auditOk(actorId, entityType, "update", id);
      return toAdminDto(await getRow(id));
    },

    async archive(actorId: string, id: string, body: Record<string, unknown>) {
      const expected = parseExpectedVersion(normalizeMutationBody(body));
      const row = await getRow(id);
      assertVersionMatch(expected, row.version);
      const db = getDb();
      await db
        .update(table)
        .set({
          status: "archived",
          version: row.version + 1,
          updatedAt: new Date(),
        })
        .where(and(eq(table.id, id), eq(table.version, expected)));
      await auditOk(actorId, entityType, "archive", id);
      return toAdminDto(await getRow(id));
    },

    async delete(actorId: string, id: string) {
      const row = await getRow(id);
      if (row.status !== "archived") {
        throw new AppError(
          "VALIDATION",
          "Only archived records can be permanently deleted",
        );
      }
      const db = getDb();
      await db.delete(table).where(eq(table.id, id));
      await auditOk(actorId, entityType, "delete", id);
      return { ok: true as const };
    },
  };
}

export type OpsResourceCrud = ReturnType<typeof createOpsResourceCrud>;
