import { randomUUID } from "node:crypto";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { service } from "../../db/schema/services.js";
import { writeAudit } from "../../content/audit.js";
import { reserveRedirect } from "../../content/redirects.js";
import { assertSlug } from "../../content/slug.js";
import {
  assertVersionMatch,
  parseExpectedVersion,
} from "../../content/version.js";
import { AppError } from "../../http/errors.js";
import type { ListQuery } from "../../http/pagination.js";
import {
  assertServicePublishable,
  parseServiceDoc,
  type ServiceDoc,
} from "./docs.js";

function adminDto(row: typeof service.$inferSelect) {
  return {
    id: row.id,
    status: row.status,
    version: row.version,
    sortOrder: row.sortOrder,
    featured: row.featured,
    draftSlug: row.draftSlug,
    publishedSlug: row.publishedSlug,
    draftDoc: row.draftDoc as ServiceDoc,
    publishedDoc: (row.publishedDoc as ServiceDoc | null) ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    firstPublishedAt: row.firstPublishedAt?.toISOString() ?? null,
    publishedUpdatedAt: row.publishedUpdatedAt?.toISOString() ?? null,
  };
}

export async function listServicesAdmin(query: ListQuery) {
  const db = getDb();
  const filters = [];
  if (query.status) filters.push(eq(service.status, query.status));
  if (query.q) {
    filters.push(
      or(
        ilike(service.draftSlug, `%${query.q}%`),
        sql`${service.draftDoc}->>'title' ilike ${`%${query.q}%`}`,
      ),
    );
  }
  const where = filters.length ? and(...filters) : undefined;
  const [totalRow] = await db.select({ value: count() }).from(service).where(where);
  const rows = await db
    .select()
    .from(service)
    .where(where)
    .orderBy(asc(service.sortOrder), desc(service.updatedAt))
    .limit(query.limit)
    .offset(query.offset);
  return {
    items: rows.map(adminDto),
    total: totalRow?.value ?? 0,
    limit: query.limit,
    offset: query.offset,
  };
}

export async function getServiceAdmin(id: string) {
  const db = getDb();
  const rows = await db.select().from(service).where(eq(service.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Service not found");
  return adminDto(row);
}

export async function createServiceAdmin(
  actorId: string,
  body: Record<string, unknown>,
) {
  const slug = assertSlug(body.slug);
  const doc = parseServiceDoc(body.doc ?? body);
  const db = getDb();
  const id = randomUUID();
  const now = new Date();
  await db.insert(service).values({
    id,
    status: "draft",
    version: 1,
    sortOrder: Number(body.sortOrder ?? 0) || 0,
    featured: Boolean(body.featured),
    draftSlug: slug,
    publishedSlug: null,
    draftDoc: doc,
    publishedDoc: null,
    createdAt: now,
    updatedAt: now,
  });
  await writeAudit({
    actorId,
    action: "create",
    entityType: "service",
    entityId: id,
    result: "ok",
  });
  return getServiceAdmin(id);
}

export async function updateServiceAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db.select().from(service).where(eq(service.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Service not found");
  assertVersionMatch(expected, row.version);
  if (row.status === "archived") {
    throw new AppError("VALIDATION", "Archived services cannot be edited");
  }
  const slug = body.slug !== undefined ? assertSlug(body.slug) : row.draftSlug;
  const doc =
    body.doc !== undefined
      ? parseServiceDoc(body.doc)
      : (row.draftDoc as ServiceDoc);
  const sortOrder =
    body.sortOrder !== undefined
      ? Number(body.sortOrder) || 0
      : row.sortOrder;
  const featured =
    body.featured !== undefined ? Boolean(body.featured) : row.featured;
  await db
    .update(service)
    .set({
      draftSlug: slug,
      draftDoc: doc,
      sortOrder,
      featured,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(service.id, id), eq(service.version, expected)));
  await writeAudit({
    actorId,
    action: "update",
    entityType: "service",
    entityId: id,
    result: "ok",
  });
  return getServiceAdmin(id);
}

export async function publishServiceAdmin(actorId: string, id: string, body: Record<string, unknown>) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db.select().from(service).where(eq(service.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Service not found");
  assertVersionMatch(expected, row.version);
  const doc = row.draftDoc as ServiceDoc;
  assertServicePublishable(doc, row.draftSlug);
  const now = new Date();
  const oldPublishedSlug = row.publishedSlug;
  if (oldPublishedSlug && oldPublishedSlug !== row.draftSlug) {
    await reserveRedirect(
      `/services/${oldPublishedSlug}`,
      `/services/${row.draftSlug}`,
    );
  }
  await db
    .update(service)
    .set({
      status: "published",
      publishedSlug: row.draftSlug,
      publishedDoc: doc,
      version: row.version + 1,
      updatedAt: now,
      firstPublishedAt: row.firstPublishedAt ?? now,
      publishedUpdatedAt: now,
    })
    .where(and(eq(service.id, id), eq(service.version, expected)));
  await writeAudit({
    actorId,
    action: "publish",
    entityType: "service",
    entityId: id,
    result: "ok",
  });
  return getServiceAdmin(id);
}

export async function unpublishServiceAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db.select().from(service).where(eq(service.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Service not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(service)
    .set({
      status: "draft",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(service.id, id), eq(service.version, expected)));
  await writeAudit({
    actorId,
    action: "unpublish",
    entityType: "service",
    entityId: id,
    result: "ok",
  });
  return getServiceAdmin(id);
}

export async function archiveServiceAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db.select().from(service).where(eq(service.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Service not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(service)
    .set({
      status: "archived",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(service.id, id), eq(service.version, expected)));
  await writeAudit({
    actorId,
    action: "archive",
    entityType: "service",
    entityId: id,
    result: "ok",
  });
  return getServiceAdmin(id);
}

export async function deleteServiceAdmin(actorId: string, id: string) {
  const db = getDb();
  const rows = await db.select().from(service).where(eq(service.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Service not found");
  if (row.status === "published") {
    throw new AppError(
      "VALIDATION",
      "Unpublish or archive before permanent deletion",
    );
  }
  await db.delete(service).where(eq(service.id, id));
  await writeAudit({
    actorId,
    action: "delete",
    entityType: "service",
    entityId: id,
    result: "ok",
  });
  return { ok: true as const };
}

export async function reorderServicesAdmin(
  actorId: string,
  orderedIds: unknown,
) {
  if (!Array.isArray(orderedIds) || orderedIds.length > 200) {
    throw new AppError("VALIDATION", "orderedIds must be an array (max 200)");
  }
  const db = getDb();
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i += 1) {
      const id = String(orderedIds[i]);
      await tx
        .update(service)
        .set({ sortOrder: i + 1, updatedAt: new Date() })
        .where(eq(service.id, id));
    }
  });
  await writeAudit({
    actorId,
    action: "reorder",
    entityType: "service",
    entityId: "bulk",
    result: "ok",
  });
  return { ok: true as const };
}
