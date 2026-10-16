import { and, asc, eq } from "drizzle-orm";
import {
  getPublishedTranslationMap,
  mergeLocalizedDoc,
  type ContentLocale,
} from "../../content/translations.js";
import { getDb } from "../../db/client.js";
import { portfolioProject } from "../../db/schema/portfolio.js";
import { AppError } from "../../http/errors.js";
import type { PortfolioDoc } from "./docs.js";

function publicPortfolioListDto(
  row: typeof portfolioProject.$inferSelect,
  overlay?: Record<string, unknown>,
) {
  const doc = mergeLocalizedDoc(
    row.publishedDoc as Record<string, unknown>,
    overlay,
  ) as PortfolioDoc;
  return {
    id: row.id,
    title: doc.title,
    slug: row.publishedSlug as string,
    clientName: doc.clientName,
    summary: doc.summary,
    description: doc.description,
    category: doc.category,
    coverUrl: doc.coverPath,
    featured: row.featured,
    sortOrder: row.sortOrder,
  };
}

function publicPortfolioDetailDto(
  row: typeof portfolioProject.$inferSelect,
  overlay?: Record<string, unknown>,
) {
  const doc = mergeLocalizedDoc(
    row.publishedDoc as Record<string, unknown>,
    overlay,
  ) as PortfolioDoc;
  return {
    ...publicPortfolioListDto(row, overlay),
    coverAlt: doc.coverAlt,
    projectUrl: doc.projectUrl,
    relatedServiceSlug: doc.relatedServiceSlug,
    gallery: doc.gallery,
    caseStudy: doc.caseStudy,
    seoTitle: doc.seoTitle ?? doc.title,
    seoDescription: doc.seoDescription ?? doc.summary,
  };
}

export async function listPublishedPortfolio(
  limit = 50,
  locale: ContentLocale = "en",
) {
  const db = getDb();
  const rows = await db
    .select()
    .from(portfolioProject)
    .where(eq(portfolioProject.status, "published"))
    .orderBy(asc(portfolioProject.sortOrder), asc(portfolioProject.publishedSlug))
    .limit(Math.min(limit, 50));
  const published = rows.filter((r) => r.publishedSlug && r.publishedDoc);
  const translations = await getPublishedTranslationMap(
    "portfolio_project",
    published.map((r) => r.id),
    locale,
  );
  return published.map((row) =>
    publicPortfolioListDto(row, translations.get(row.id)?.doc),
  );
}

export async function getPublishedPortfolioBySlug(
  slug: string,
  locale: ContentLocale = "en",
) {
  const db = getDb();
  const rows = await db
    .select()
    .from(portfolioProject)
    .where(
      and(
        eq(portfolioProject.status, "published"),
        eq(portfolioProject.publishedSlug, slug),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (!row?.publishedDoc) {
    throw new AppError("NOT_FOUND", "Portfolio project not found");
  }
  const translations = await getPublishedTranslationMap(
    "portfolio_project",
    [row.id],
    locale,
  );
  return publicPortfolioDetailDto(row, translations.get(row.id)?.doc);
}
