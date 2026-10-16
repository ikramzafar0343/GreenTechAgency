import { randomUUID } from "node:crypto";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { faqItem } from "../../db/schema/siteContent.js";
import { writeAudit } from "../../content/audit.js";
import {
  assertVersionMatch,
  parseExpectedVersion,
} from "../../content/version.js";
import { AppError } from "../../http/errors.js";
import type { ListQuery } from "../../http/pagination.js";
import {
  assertFaqPublishable,
  parseFaqDoc,
  type FaqDoc,
} from "./docs.js";

const ENTITY = "faq_item";

function auditFaq(actorId: string, action: string, entityId: string) {
  return writeAudit({
    actorId,
    action,
    entityType: ENTITY,
    entityId,
    result: "ok",
  });
}

function adminDto(row: typeof faqItem.$inferSelect) {
  return {
    id: row.id,
    status: row.status,
    version: row.version,
    sortOrder: row.sortOrder,
    draftDoc: row.draftDoc as FaqDoc,
    publishedDoc: (row.publishedDoc as FaqDoc | null) ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listFaqAdmin(query: ListQuery) {
  const db = getDb();
  const filters = [];
  if (query.status) filters.push(eq(faqItem.status, query.status));
  if (query.q) {
    filters.push(
      sql`${faqItem.draftDoc}->>'question' ilike ${`%${query.q}%`}`,
    );
  }
  const where = filters.length ? and(...filters) : undefined;
  const [totalRow] = await db.select({ value: count() }).from(faqItem).where(where);
  const rows = await db
    .select()
    .from(faqItem)
    .where(where)
    .orderBy(asc(faqItem.sortOrder), desc(faqItem.updatedAt))
    .limit(query.limit)
    .offset(query.offset);
  return {
    items: rows.map(adminDto),
    total: totalRow?.value ?? 0,
    limit: query.limit,
    offset: query.offset,
  };
}

export async function getFaqAdmin(id: string) {
  const db = getDb();
  const rows = await db.select().from(faqItem).where(eq(faqItem.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "FAQ item not found");
  return adminDto(row);
}

export async function createFaqAdmin(
  actorId: string,
  body: Record<string, unknown>,
) {
  const doc = parseFaqDoc(body.doc ?? body);
  const db = getDb();
  const id = randomUUID();
  const now = new Date();
  await db.insert(faqItem).values({
    id,
    status: "draft",
    version: 1,
    sortOrder: Number(body.sortOrder ?? 0) || 0,
    draftDoc: doc,
    publishedDoc: null,
    createdAt: now,
    updatedAt: now,
  });
  await auditFaq(actorId, "create", id);
  return getFaqAdmin(id);
}

export async function updateFaqAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db.select().from(faqItem).where(eq(faqItem.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "FAQ item not found");
  assertVersionMatch(expected, row.version);
  if (row.status === "archived") {
    throw new AppError("VALIDATION", "Archived FAQ items cannot be edited");
  }
  const doc =
    body.doc !== undefined ? parseFaqDoc(body.doc) : (row.draftDoc as FaqDoc);
  const sortOrder =
    body.sortOrder !== undefined
      ? Number(body.sortOrder) || 0
      : row.sortOrder;
  await db
    .update(faqItem)
    .set({
      draftDoc: doc,
      sortOrder,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(faqItem.id, id), eq(faqItem.version, expected)));
  await auditFaq(actorId, "update", id);
  return getFaqAdmin(id);
}

export async function publishFaqAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db.select().from(faqItem).where(eq(faqItem.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "FAQ item not found");
  assertVersionMatch(expected, row.version);
  const doc = row.draftDoc as FaqDoc;
  assertFaqPublishable(doc);
  await db
    .update(faqItem)
    .set({
      status: "published",
      publishedDoc: doc,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(faqItem.id, id), eq(faqItem.version, expected)));
  await auditFaq(actorId, "publish", id);
  return getFaqAdmin(id);
}

export async function unpublishFaqAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db.select().from(faqItem).where(eq(faqItem.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "FAQ item not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(faqItem)
    .set({
      status: "draft",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(faqItem.id, id), eq(faqItem.version, expected)));
  await auditFaq(actorId, "unpublish", id);
  return getFaqAdmin(id);
}

export async function archiveFaqAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db.select().from(faqItem).where(eq(faqItem.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "FAQ item not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(faqItem)
    .set({
      status: "archived",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(faqItem.id, id), eq(faqItem.version, expected)));
  await auditFaq(actorId, "archive", id);
  return getFaqAdmin(id);
}

export async function deleteFaqAdmin(actorId: string, id: string) {
  const db = getDb();
  const rows = await db.select().from(faqItem).where(eq(faqItem.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "FAQ item not found");
  if (row.status === "published") {
    throw new AppError(
      "VALIDATION",
      "Unpublish or archive before permanent deletion",
    );
  }
  await db.delete(faqItem).where(eq(faqItem.id, id));
  await auditFaq(actorId, "delete", id);
  return { ok: true as const };
}

export async function reorderFaqAdmin(actorId: string, orderedIds: unknown) {
  if (!Array.isArray(orderedIds) || orderedIds.length > 200) {
    throw new AppError("VALIDATION", "orderedIds must be an array (max 200)");
  }
  const db = getDb();
  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i += 1) {
      const itemId = String(orderedIds[i]);
      await tx
        .update(faqItem)
        .set({ sortOrder: i + 1, updatedAt: new Date() })
        .where(eq(faqItem.id, itemId));
    }
  });
  await auditFaq(actorId, "reorder", "bulk");
  return { ok: true as const };
}
