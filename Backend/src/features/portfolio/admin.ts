import { randomUUID } from "node:crypto";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { portfolioProject } from "../../db/schema/portfolio.js";
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
  assertPortfolioPublishable,
  parsePortfolioDoc,
  type PortfolioDoc,
} from "./docs.js";

const PORTFOLIO_ENTITY = "portfolio_project";

function auditPortfolio(
  actorId: string,
  action: string,
  entityId: string,
) {
  return writeAudit({
    actorId,
    action,
    entityType: PORTFOLIO_ENTITY,
    entityId,
    result: "ok",
  });
}

function adminDto(row: typeof portfolioProject.$inferSelect) {
  return {
    id: row.id,
    status: row.status,
    version: row.version,
    sortOrder: row.sortOrder,
    featured: row.featured,
    draftSlug: row.draftSlug,
    publishedSlug: row.publishedSlug,
    draftDoc: row.draftDoc as PortfolioDoc,
    publishedDoc: (row.publishedDoc as PortfolioDoc | null) ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    firstPublishedAt: row.firstPublishedAt?.toISOString() ?? null,
    publishedUpdatedAt: row.publishedUpdatedAt?.toISOString() ?? null,
  };
}

export async function listPortfolioAdmin(query: ListQuery) {
  const db = getDb();
  const filters = [];
  if (query.status) filters.push(eq(portfolioProject.status, query.status));
  if (query.q) {
    filters.push(
      or(
        ilike(portfolioProject.draftSlug, `%${query.q}%`),
        sql`${portfolioProject.draftDoc}->>'title' ilike ${`%${query.q}%`}`,
      ),
    );
  }
  const where = filters.length ? and(...filters) : undefined;
  const [totalRow] = await db
    .select({ value: count() })
    .from(portfolioProject)
    .where(where);
  const rows = await db
    .select()
    .from(portfolioProject)
    .where(where)
    .orderBy(asc(portfolioProject.sortOrder), desc(portfolioProject.updatedAt))
    .limit(query.limit)
    .offset(query.offset);
  return {
    items: rows.map(adminDto),
    total: totalRow?.value ?? 0,
    limit: query.limit,
    offset: query.offset,
  };
}

export async function getPortfolioAdmin(id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(portfolioProject)
    .where(eq(portfolioProject.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Portfolio project not found");
  return adminDto(row);
}

export async function createPortfolioAdmin(
  actorId: string,
  body: Record<string, unknown>,
) {
  const slug = assertSlug(body.slug);
  const doc = parsePortfolioDoc(body.doc ?? body);
  const db = getDb();
  const id = randomUUID();
  const now = new Date();
  await db.insert(portfolioProject).values({
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
  await auditPortfolio(actorId, "create", id);
  return getPortfolioAdmin(id);
}

export async function updatePortfolioAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(portfolioProject)
    .where(eq(portfolioProject.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Portfolio project not found");
  assertVersionMatch(expected, row.version);
  if (row.status === "archived") {
    throw new AppError("VALIDATION", "Archived projects cannot be edited");
  }
  const slug = body.slug !== undefined ? assertSlug(body.slug) : row.draftSlug;
  const doc =
    body.doc !== undefined
      ? parsePortfolioDoc(body.doc)
      : (row.draftDoc as PortfolioDoc);
  const sortOrder =
    body.sortOrder !== undefined
      ? Number(body.sortOrder) || 0
      : row.sortOrder;
  const featured =
    body.featured !== undefined ? Boolean(body.featured) : row.featured;
  await db
    .update(portfolioProject)
    .set({
      draftSlug: slug,
      draftDoc: doc,
      sortOrder,
      featured,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(
      and(eq(portfolioProject.id, id), eq(portfolioProject.version, expected)),
    );
  await auditPortfolio(actorId, "update", id);
  return getPortfolioAdmin(id);
}

export async function publishPortfolioAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(portfolioProject)
    .where(eq(portfolioProject.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Portfolio project not found");
  assertVersionMatch(expected, row.version);
  const doc = row.draftDoc as PortfolioDoc;
  assertPortfolioPublishable(doc);
  const now = new Date();
  const oldPublishedSlug = row.publishedSlug;
  if (oldPublishedSlug && oldPublishedSlug !== row.draftSlug) {
    await reserveRedirect(
      `/portfolio/${oldPublishedSlug}`,
      `/portfolio/${row.draftSlug}`,
    );
  }
  await db
    .update(portfolioProject)
    .set({
      status: "published",
      publishedSlug: row.draftSlug,
      publishedDoc: doc,
      version: row.version + 1,
      updatedAt: now,
      firstPublishedAt: row.firstPublishedAt ?? now,
      publishedUpdatedAt: now,
    })
    .where(and(eq(portfolioProject.id, id), eq(portfolioProject.version, expected)));
  await auditPortfolio(actorId, "publish", id);
  return getPortfolioAdmin(id);
}

export async function unpublishPortfolioAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(portfolioProject)
    .where(eq(portfolioProject.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Portfolio project not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(portfolioProject)
    .set({
      status: "draft",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(portfolioProject.id, id), eq(portfolioProject.version, expected)));
  await auditPortfolio(actorId, "unpublish", id);
  return getPortfolioAdmin(id);
}

export async function archivePortfolioAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(portfolioProject)
    .where(eq(portfolioProject.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Portfolio project not found");
  assertVersionMatch(expected, row.version);
  await db
    .update(portfolioProject)
    .set({
      status: "archived",
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(portfolioProject.id, id), eq(portfolioProject.version, expected)));
  await auditPortfolio(actorId, "archive", id);
  return getPortfolioAdmin(id);
}

export async function deletePortfolioAdmin(actorId: string, id: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(portfolioProject)
    .where(eq(portfolioProject.id, id))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Portfolio project not found");
  await db.delete(portfolioProject).where(eq(portfolioProject.id, id));
  await auditPortfolio(actorId, "delete", id);
  return { ok: true as const };
}
