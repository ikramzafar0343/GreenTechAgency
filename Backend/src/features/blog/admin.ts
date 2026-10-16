import { randomUUID } from "node:crypto";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { blogPost } from "../../db/schema/blog.js";
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
  assertBlogPublishable,
  parseBlogDoc,
  type BlogDoc,
} from "./docs.js";

function auditBlog(actorId: string, action: string, entityId: string) {
  return writeAudit({
    actorId,
    action,
    entityType: "blog_post",
    entityId,
    result: "ok",
  });
}

function adminDto(row: typeof blogPost.$inferSelect) {
  return {
    id: row.id,
    status: row.status,
    version: row.version,
    featured: row.featured,
    homepageOrder: row.homepageOrder,
    draftSlug: row.draftSlug,
    publishedSlug: row.publishedSlug,
    draftDoc: row.draftDoc as BlogDoc,
    publishedDoc: (row.publishedDoc as BlogDoc | null) ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    firstPublishedAt: row.firstPublishedAt?.toISOString() ?? null,
    publishedUpdatedAt: row.publishedUpdatedAt?.toISOString() ?? null,
  };
}

export async function listBlogAdmin(query: ListQuery) {
  const db = getDb();
  const filters = [];
  if (query.status) filters.push(eq(blogPost.status, query.status));
  if (query.q) {
    filters.push(
      or(
        ilike(blogPost.draftSlug, `%${query.q}%`),
        sql`${blogPost.draftDoc}->>'title' ilike ${`%${query.q}%`}`,
      ),
    );
  }
  const where = filters.length ? and(...filters) : undefined;
  const [totalRow] = await db
    .select({ value: count() })
    .from(blogPost)
    .where(where);
  const rows = await db
    .select()
    .from(blogPost)
    .where(where)
    .orderBy(asc(blogPost.homepageOrder), desc(blogPost.updatedAt))
    .limit(query.limit)
    .offset(query.offset);
  return {
    items: rows.map(adminDto),
    total: totalRow?.value ?? 0,
    limit: query.limit,
    offset: query.offset,
  };
}

export async function getBlogAdmin(id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(blogPost)
    .where(eq(blogPost.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Blog post not found");
  return adminDto(row);
}

export async function createBlogAdmin(
  actorId: string,
  body: Record<string, unknown>,
) {
  const slug = assertSlug(body.slug);
  const doc = parseBlogDoc(body.doc ?? body);
  const db = getDb();
  const id = randomUUID();
  const now = new Date();
  await db.insert(blogPost).values({
    id,
    status: "draft",
    version: 1,
    featured: Boolean(body.featured),
    homepageOrder: Number(body.homepageOrder ?? 0) || 0,
    draftSlug: slug,
    publishedSlug: null,
    draftDoc: doc,
    publishedDoc: null,
    createdAt: now,
    updatedAt: now,
  });
  await auditBlog(actorId, "create", id);
  return getBlogAdmin(id);
}

export async function updateBlogAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(blogPost)
    .where(eq(blogPost.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Blog post not found");
  assertVersionMatch(expected, row.version);
  if (row.status === "archived") {
    throw new AppError("VALIDATION", "Archived blog posts cannot be edited");
  }
  const slug = body.slug !== undefined ? assertSlug(body.slug) : row.draftSlug;
  const doc =
    body.doc !== undefined
      ? parseBlogDoc(body.doc)
      : (row.draftDoc as BlogDoc);
  const homepageOrder =
    body.homepageOrder !== undefined
      ? Number(body.homepageOrder) || 0
      : row.homepageOrder;
  const featured =
    body.featured !== undefined ? Boolean(body.featured) : row.featured;
  await db
    .update(blogPost)
    .set({
      draftSlug: slug,
      draftDoc: doc,
      homepageOrder,
      featured,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(blogPost.id, id), eq(blogPost.version, expected)));
  await auditBlog(actorId, "update", id);
  return getBlogAdmin(id);
}

export async function publishBlogAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(blogPost)
    .where(eq(blogPost.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Blog post not found");
  assertVersionMatch(expected, row.version);
  const doc = row.draftDoc as BlogDoc;
  assertBlogPublishable(doc);
  const now = new Date();
  const oldPublishedSlug = row.publishedSlug;
  if (oldPublishedSlug && oldPublishedSlug !== row.draftSlug) {
    await reserveRedirect(
      `/blog/${oldPublishedSlug}`,
      `/blog/${row.draftSlug}`,
    );
  }
  await db
    .update(blogPost)
    .set({
      status: "published",
      publishedSlug: row.draftSlug,
      publishedDoc: doc,
      version: row.version + 1,
      updatedAt: now,
      firstPublishedAt: row.firstPublishedAt ?? now,
      publishedUpdatedAt: now,
    })
    .where(and(eq(blogPost.id, id), eq(blogPost.version, expected)));
  await auditBlog(actorId, "publish", id);
  return getBlogAdmin(id);
}

export async function unpublishBlogAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(blogPost)
    .where(eq(blogPost.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Blog post not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(blogPost)
    .set({
      status: "draft",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(blogPost.id, id), eq(blogPost.version, expected)));
  await auditBlog(actorId, "unpublish", id);
  return getBlogAdmin(id);
}

export async function archiveBlogAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(blogPost)
    .where(eq(blogPost.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Blog post not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(blogPost)
    .set({
      status: "archived",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(blogPost.id, id), eq(blogPost.version, expected)));
  await auditBlog(actorId, "archive", id);
  return getBlogAdmin(id);
}

export async function deleteBlogAdmin(actorId: string, id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(blogPost)
    .where(eq(blogPost.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Blog post not found");
  if (row.status === "published") {
    throw new AppError(
      "VALIDATION",
      "Unpublish or archive before permanent deletion",
    );
  }
  await db.delete(blogPost).where(eq(blogPost.id, id));
  await auditBlog(actorId, "delete", id);
  return { ok: true as const };
}
