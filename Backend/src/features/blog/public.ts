import { and, asc, desc, eq } from "drizzle-orm";
import {
  getPublishedTranslationMap,
  mergeLocalizedDoc,
  type ContentLocale,
} from "../../content/translations.js";
import { getDb } from "../../db/client.js";
import { blogPost } from "../../db/schema/blog.js";
import { AppError } from "../../http/errors.js";
import type { BlogDoc } from "./docs.js";

function publicBlogListDto(
  row: typeof blogPost.$inferSelect,
  overlay?: Record<string, unknown>,
) {
  const doc = mergeLocalizedDoc(
    row.publishedDoc as Record<string, unknown>,
    overlay,
  ) as BlogDoc;
  const slug = row.publishedSlug as string;
  return {
    id: row.id,
    slug,
    title: doc.title,
    excerpt: doc.excerpt,
    coverUrl: doc.coverPath,
    coverAlt: doc.coverAlt,
    railLabel: doc.railLabel,
    category: doc.category,
    authorDisplay: doc.authorDisplay,
    seoTitle: doc.seoTitle ?? doc.title,
    seoDescription: doc.seoDescription ?? doc.excerpt,
    focalX: doc.focalX,
    focalY: doc.focalY,
    readTimeMinutes: doc.readTimeMinutes,
    publishedAt: row.firstPublishedAt?.toISOString() ?? null,
    href: `/blog/${slug}`,
    homepageOrder: row.homepageOrder,
    featured: row.featured,
  };
}

function publicBlogDetailDto(
  row: typeof blogPost.$inferSelect,
  overlay?: Record<string, unknown>,
) {
  const doc = mergeLocalizedDoc(
    row.publishedDoc as Record<string, unknown>,
    overlay,
  ) as BlogDoc;
  return {
    ...publicBlogListDto(row, overlay),
    body: doc.body,
  };
}

export async function listPublishedBlog(
  limit = 50,
  locale: ContentLocale = "en",
) {
  const db = getDb();
  const rows = await db
    .select()
    .from(blogPost)
    .where(eq(blogPost.status, "published"))
    .orderBy(desc(blogPost.firstPublishedAt), asc(blogPost.homepageOrder))
    .limit(Math.min(limit, 50));
  const published = rows.filter((r) => r.publishedSlug && r.publishedDoc);
  const translations = await getPublishedTranslationMap(
    "blog_post",
    published.map((r) => r.id),
    locale,
  );
  return published.map((row) =>
    publicBlogListDto(row, translations.get(row.id)?.doc),
  );
}

export async function getPublishedBlogBySlug(
  slug: string,
  locale: ContentLocale = "en",
) {
  const db = getDb();
  const rows = await db
    .select()
    .from(blogPost)
    .where(
      and(eq(blogPost.status, "published"), eq(blogPost.publishedSlug, slug)),
    )
    .limit(1);
  const row = rows[0];
  if (!row?.publishedDoc) throw new AppError("NOT_FOUND", "Blog post not found");
  const translations = await getPublishedTranslationMap(
    "blog_post",
    [row.id],
    locale,
  );
  return publicBlogDetailDto(row, translations.get(row.id)?.doc);
}
