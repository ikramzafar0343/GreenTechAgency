import { randomUUID } from "node:crypto";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { testimonial } from "../../db/schema/siteContent.js";
import { writeAudit } from "../../content/audit.js";
import {
  assertVersionMatch,
  parseExpectedVersion,
} from "../../content/version.js";
import { AppError } from "../../http/errors.js";
import type { ListQuery } from "../../http/pagination.js";
import {
  assertTestimonialPublishable,
  parseTestimonialDoc,
  type TestimonialDoc,
} from "./docs.js";

const ENTITY = "testimonial";

function auditTestimonial(actorId: string, action: string, entityId: string) {
  return writeAudit({
    actorId,
    action,
    entityType: ENTITY,
    entityId,
    result: "ok",
  });
}

function adminDto(row: typeof testimonial.$inferSelect) {
  return {
    id: row.id,
    status: row.status,
    version: row.version,
    sortOrder: row.sortOrder,
    featured: row.featured,
    draftDoc: row.draftDoc as TestimonialDoc,
    publishedDoc: (row.publishedDoc as TestimonialDoc | null) ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listTestimonialsAdmin(query: ListQuery) {
  const db = getDb();
  const filters = [];
  if (query.status) filters.push(eq(testimonial.status, query.status));
  if (query.q) {
    filters.push(
      sql`${testimonial.draftDoc}->>'companyName' ilike ${`%${query.q}%`}`,
    );
  }
  const where = filters.length ? and(...filters) : undefined;
  const [totalRow] = await db
    .select({ value: count() })
    .from(testimonial)
    .where(where);
  const rows = await db
    .select()
    .from(testimonial)
    .where(where)
    .orderBy(asc(testimonial.sortOrder), desc(testimonial.updatedAt))
    .limit(query.limit)
    .offset(query.offset);
  return {
    items: rows.map(adminDto),
    total: totalRow?.value ?? 0,
    limit: query.limit,
    offset: query.offset,
  };
}

export async function getTestimonialAdmin(id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(testimonial)
    .where(eq(testimonial.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Testimonial not found");
  return adminDto(row);
}

export async function createTestimonialAdmin(
  actorId: string,
  body: Record<string, unknown>,
) {
  const doc = parseTestimonialDoc(body.doc ?? body);
  const db = getDb();
  const id = randomUUID();
  const now = new Date();
  await db.insert(testimonial).values({
    id,
    status: "draft",
    version: 1,
    sortOrder: Number(body.sortOrder ?? 0) || 0,
    featured: Boolean(body.featured),
    draftDoc: doc,
    publishedDoc: null,
    createdAt: now,
    updatedAt: now,
  });
  await auditTestimonial(actorId, "create", id);
  return getTestimonialAdmin(id);
}

export async function updateTestimonialAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(testimonial)
    .where(eq(testimonial.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Testimonial not found");
  assertVersionMatch(expected, row.version);
  if (row.status === "archived") {
    throw new AppError("VALIDATION", "Archived testimonials cannot be edited");
  }
  const doc =
    body.doc !== undefined
      ? parseTestimonialDoc(body.doc)
      : (row.draftDoc as TestimonialDoc);
  const sortOrder =
    body.sortOrder !== undefined
      ? Number(body.sortOrder) || 0
      : row.sortOrder;
  const featured =
    body.featured !== undefined ? Boolean(body.featured) : row.featured;
  await db
    .update(testimonial)
    .set({
      draftDoc: doc,
      sortOrder,
      featured,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(testimonial.id, id), eq(testimonial.version, expected)));
  await auditTestimonial(actorId, "update", id);
  return getTestimonialAdmin(id);
}

export async function publishTestimonialAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(testimonial)
    .where(eq(testimonial.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Testimonial not found");
  assertVersionMatch(expected, row.version);
  const doc = row.draftDoc as TestimonialDoc;
  assertTestimonialPublishable(doc);
  await db
    .update(testimonial)
    .set({
      status: "published",
      publishedDoc: doc,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(testimonial.id, id), eq(testimonial.version, expected)));
  await auditTestimonial(actorId, "publish", id);
  return getTestimonialAdmin(id);
}

export async function unpublishTestimonialAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(testimonial)
    .where(eq(testimonial.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Testimonial not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(testimonial)
    .set({
      status: "draft",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(testimonial.id, id), eq(testimonial.version, expected)));
  await auditTestimonial(actorId, "unpublish", id);
  return getTestimonialAdmin(id);
}

export async function archiveTestimonialAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(testimonial)
    .where(eq(testimonial.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Testimonial not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(testimonial)
    .set({
      status: "archived",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(testimonial.id, id), eq(testimonial.version, expected)));
  await auditTestimonial(actorId, "archive", id);
  return getTestimonialAdmin(id);
}

export async function deleteTestimonialAdmin(actorId: string, id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(testimonial)
    .where(eq(testimonial.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Testimonial not found");
  if (row.status === "published") {
    throw new AppError(
      "VALIDATION",
      "Unpublish or archive before permanent deletion",
    );
  }
  await db.delete(testimonial).where(eq(testimonial.id, id));
  await auditTestimonial(actorId, "delete", id);
  return { ok: true as const };
}

export async function reorderTestimonialsAdmin(
  actorId: string,
  orderedIds: unknown,
) {
  if (!Array.isArray(orderedIds) || orderedIds.length > 200) {
    throw new AppError("VALIDATION", "orderedIds must be an array (max 200)");
  }
  const db = getDb();
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i += 1) {
      const itemId = String(orderedIds[i]);
      await tx
        .update(testimonial)
        .set({ sortOrder: i + 1, updatedAt: new Date() })
        .where(eq(testimonial.id, itemId));
    }
  });
  await auditTestimonial(actorId, "reorder", "bulk");
  return { ok: true as const };
}
