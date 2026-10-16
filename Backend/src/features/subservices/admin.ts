import { randomUUID } from "node:crypto";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { service, subservice } from "../../db/schema/services.js";
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
  assertSubservicePublishable,
  parseSubserviceDoc,
  type SubserviceDoc,
} from "./docs.js";

function adminDto(row: typeof subservice.$inferSelect) {
  return {
    id: row.id,
    serviceId: row.serviceId,
    status: row.status,
    version: row.version,
    sortOrder: row.sortOrder,
    draftSlug: row.draftSlug,
    publishedSlug: row.publishedSlug,
    draftDoc: row.draftDoc as SubserviceDoc,
    publishedDoc: (row.publishedDoc as SubserviceDoc | null) ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    firstPublishedAt: row.firstPublishedAt?.toISOString() ?? null,
    publishedUpdatedAt: row.publishedUpdatedAt?.toISOString() ?? null,
  };
}

async function requireParentService(serviceId: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(service)
    .where(eq(service.id, serviceId))
    .limit(1);
  const parent = rows[0];
  if (!parent) {
    throw new AppError("VALIDATION", "Parent service not found");
  }
  return parent;
}

export async function listSubservicesAdmin(
  query: ListQuery,
  serviceId: string | null,
) {
  const db = getDb();
  const filters = [];
  if (serviceId) {
    filters.push(eq(subservice.serviceId, serviceId));
  }
  if (query.status) {
    filters.push(eq(subservice.status, query.status));
  }
  if (query.q) {
    filters.push(
      or(
        ilike(subservice.draftSlug, `%${query.q}%`),
        sql`${subservice.draftDoc}->>'title' ilike ${`%${query.q}%`}`,
      ),
    );
  }
  const where = filters.length ? and(...filters) : undefined;
  const [totalRow] = await db
    .select({ value: count() })
    .from(subservice)
    .where(where);
  const rows = await db
    .select()
    .from(subservice)
    .where(where)
    .orderBy(asc(subservice.sortOrder), desc(subservice.updatedAt))
    .limit(query.limit)
    .offset(query.offset);
  return {
    items: rows.map(adminDto),
    total: totalRow?.value ?? 0,
    limit: query.limit,
    offset: query.offset,
  };
}

export async function getSubserviceAdmin(id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(subservice)
    .where(eq(subservice.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Subservice not found");
  return adminDto(row);
}

export async function createSubserviceAdmin(
  actorId: string,
  body: Record<string, unknown>,
) {
  const serviceId =
    typeof body.serviceId === "string" && body.serviceId.trim()
      ? body.serviceId.trim()
      : null;
  if (!serviceId) {
    throw new AppError("VALIDATION", "serviceId is required");
  }
  await requireParentService(serviceId);
  const slug = assertSlug(body.slug);
  const doc = parseSubserviceDoc(body.doc ?? body);
  const db = getDb();
  const id = randomUUID();
  const now = new Date();
  await db.insert(subservice).values({
    id,
    serviceId,
    status: "draft",
    version: 1,
    sortOrder: Number(body.sortOrder ?? 0) || 0,
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
    entityType: "subservice",
    entityId: id,
    result: "ok",
  });
  return getSubserviceAdmin(id);
}

export async function updateSubserviceAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db.select().from(subservice).where(eq(subservice.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Subservice not found");
  assertVersionMatch(expected, row.version);
  if (row.status === "archived") {
    throw new AppError("VALIDATION", "Archived subservices cannot be edited");
  }
  let serviceId = row.serviceId;
  if (body.serviceId !== undefined) {
    const nextId =
      typeof body.serviceId === "string" && body.serviceId.trim()
        ? body.serviceId.trim()
        : null;
    if (!nextId) {
      throw new AppError("VALIDATION", "serviceId must be a non-empty string");
    }
    await requireParentService(nextId);
    serviceId = nextId;
  }
  const slug = body.slug !== undefined ? assertSlug(body.slug) : row.draftSlug;
  const doc =
    body.doc !== undefined
      ? parseSubserviceDoc(body.doc)
      : (row.draftDoc as SubserviceDoc);
  const sortOrder =
    body.sortOrder !== undefined
      ? Number(body.sortOrder) || 0
      : row.sortOrder;
  await db
    .update(subservice)
    .set({
      serviceId,
      draftSlug: slug,
      draftDoc: doc,
      sortOrder,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(subservice.id, id), eq(subservice.version, expected)));
  await writeAudit({
    actorId,
    action: "update",
    entityType: "subservice",
    entityId: id,
    result: "ok",
  });
  return getSubserviceAdmin(id);
}

export async function publishSubserviceAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db.select().from(subservice).where(eq(subservice.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Subservice not found");
  assertVersionMatch(expected, row.version);
  const parent = await requireParentService(row.serviceId);
  if (parent.status !== "published" || !parent.publishedSlug) {
    throw new AppError(
      "VALIDATION",
      "Parent service must be published before publishing a subservice",
    );
  }
  const doc = row.draftDoc as SubserviceDoc;
  assertSubservicePublishable(doc);
  const now = new Date();
  const oldPublishedSlug = row.publishedSlug;
  if (oldPublishedSlug && oldPublishedSlug !== row.draftSlug) {
    await reserveRedirect(
      `/services/${parent.publishedSlug}/${oldPublishedSlug}`,
      `/services/${parent.publishedSlug}/${row.draftSlug}`,
    );
  }
  await db
    .update(subservice)
    .set({
      status: "published",
      publishedSlug: row.draftSlug,
      publishedDoc: doc,
      version: row.version + 1,
      updatedAt: now,
      firstPublishedAt: row.firstPublishedAt ?? now,
      publishedUpdatedAt: now,
    })
    .where(and(eq(subservice.id, id), eq(subservice.version, expected)));
  await writeAudit({
    actorId,
    action: "publish",
    entityType: "subservice",
    entityId: id,
    result: "ok",
  });
  return getSubserviceAdmin(id);
}

export async function deleteSubserviceAdmin(actorId: string, id: string) {
  const db = getDb();
  const rows = await db.select().from(subservice).where(eq(subservice.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Subservice not found");
  if (row.status === "published") {
    throw new AppError(
      "VALIDATION",
      "Unpublish or archive before permanent deletion",
    );
  }
  await db.delete(subservice).where(eq(subservice.id, id));
  await writeAudit({
    actorId,
    action: "delete",
    entityType: "subservice",
    entityId: id,
    result: "ok",
  });
  return { ok: true as const };
}
