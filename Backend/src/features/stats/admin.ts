import { randomUUID } from "node:crypto";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { statMetric } from "../../db/schema/siteContent.js";
import { writeAudit } from "../../content/audit.js";
import {
  assertVersionMatch,
  parseExpectedVersion,
} from "../../content/version.js";
import { AppError } from "../../http/errors.js";
import type { ListQuery } from "../../http/pagination.js";
import {
  assertStatPublishable,
  parseStatDoc,
  type StatDoc,
} from "./docs.js";

const ENTITY = "stat_metric";

function auditStat(actorId: string, action: string, entityId: string) {
  return writeAudit({
    actorId,
    action,
    entityType: ENTITY,
    entityId,
    result: "ok",
  });
}

function adminDto(row: typeof statMetric.$inferSelect) {
  return {
    id: row.id,
    status: row.status,
    version: row.version,
    sortOrder: row.sortOrder,
    draftDoc: row.draftDoc as StatDoc,
    publishedDoc: (row.publishedDoc as StatDoc | null) ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listStatsAdmin(query: ListQuery) {
  const db = getDb();
  const filters = [];
  if (query.status) filters.push(eq(statMetric.status, query.status));
  if (query.q) {
    filters.push(
      sql`${statMetric.draftDoc}->>'label' ilike ${`%${query.q}%`}`,
    );
  }
  const where = filters.length ? and(...filters) : undefined;
  const [totalRow] = await db
    .select({ value: count() })
    .from(statMetric)
    .where(where);
  const rows = await db
    .select()
    .from(statMetric)
    .where(where)
    .orderBy(asc(statMetric.sortOrder), desc(statMetric.updatedAt))
    .limit(query.limit)
    .offset(query.offset);
  return {
    items: rows.map(adminDto),
    total: totalRow?.value ?? 0,
    limit: query.limit,
    offset: query.offset,
  };
}

export async function getStatAdmin(id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(statMetric)
    .where(eq(statMetric.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Stat metric not found");
  return adminDto(row);
}

export async function createStatAdmin(
  actorId: string,
  body: Record<string, unknown>,
) {
  const doc = parseStatDoc(body.doc ?? body);
  const db = getDb();
  const id = randomUUID();
  const now = new Date();
  await db.insert(statMetric).values({
    id,
    status: "draft",
    version: 1,
    sortOrder: Number(body.sortOrder ?? 0) || 0,
    draftDoc: doc,
    publishedDoc: null,
    createdAt: now,
    updatedAt: now,
  });
  await auditStat(actorId, "create", id);
  return getStatAdmin(id);
}

export async function updateStatAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(statMetric)
    .where(eq(statMetric.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Stat metric not found");
  assertVersionMatch(expected, row.version);
  if (row.status === "archived") {
    throw new AppError("VALIDATION", "Archived stat metrics cannot be edited");
  }
  const doc =
    body.doc !== undefined ? parseStatDoc(body.doc) : (row.draftDoc as StatDoc);
  const sortOrder =
    body.sortOrder !== undefined
      ? Number(body.sortOrder) || 0
      : row.sortOrder;
  await db
    .update(statMetric)
    .set({
      draftDoc: doc,
      sortOrder,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(statMetric.id, id), eq(statMetric.version, expected)));
  await auditStat(actorId, "update", id);
  return getStatAdmin(id);
}

export async function publishStatAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(statMetric)
    .where(eq(statMetric.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Stat metric not found");
  assertVersionMatch(expected, row.version);
  const doc = row.draftDoc as StatDoc;
  assertStatPublishable(doc);
  await db
    .update(statMetric)
    .set({
      status: "published",
      publishedDoc: doc,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(statMetric.id, id), eq(statMetric.version, expected)));
  await auditStat(actorId, "publish", id);
  return getStatAdmin(id);
}

export async function unpublishStatAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(statMetric)
    .where(eq(statMetric.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Stat metric not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(statMetric)
    .set({
      status: "draft",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(statMetric.id, id), eq(statMetric.version, expected)));
  await auditStat(actorId, "unpublish", id);
  return getStatAdmin(id);
}

export async function archiveStatAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(statMetric)
    .where(eq(statMetric.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Stat metric not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(statMetric)
    .set({
      status: "archived",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(statMetric.id, id), eq(statMetric.version, expected)));
  await auditStat(actorId, "archive", id);
  return getStatAdmin(id);
}

export async function deleteStatAdmin(actorId: string, id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(statMetric)
    .where(eq(statMetric.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Stat metric not found");
  if (row.status === "published") {
    throw new AppError(
      "VALIDATION",
      "Unpublish or archive before permanent deletion",
    );
  }
  await db.delete(statMetric).where(eq(statMetric.id, id));
  await auditStat(actorId, "delete", id);
  return { ok: true as const };
}

export async function reorderStatsAdmin(actorId: string, orderedIds: unknown) {
  if (!Array.isArray(orderedIds) || orderedIds.length > 200) {
    throw new AppError("VALIDATION", "orderedIds must be an array (max 200)");
  }
  const db = getDb();
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i += 1) {
      const itemId = String(orderedIds[i]);
      await tx
        .update(statMetric)
        .set({ sortOrder: i + 1, updatedAt: new Date() })
        .where(eq(statMetric.id, itemId));
    }
  });
  await auditStat(actorId, "reorder", "bulk");
  return { ok: true as const };
}
