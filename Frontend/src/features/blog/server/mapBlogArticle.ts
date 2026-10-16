import "server-only";

import { normalizeInsightCoverUrl } from "@/features/insights/lib/normalizeInsightCoverUrl";
import type { InsightArticle } from "@/features/insights/model/types";
import type { BackendBlogListItem } from "@/server/backend/dtos";
import { resolveMediaUrl } from "@/server/backend/resolveMediaUrl";

export function mapBlogListItem(row: BackendBlogListItem): InsightArticle {
  const cover = resolveMediaUrl(row.coverUrl);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    railLabel: row.railLabel,
    category: row.category,
    excerpt: row.excerpt,
    coverUrl: normalizeInsightCoverUrl(cover),
    coverAlt: row.coverAlt,
    focalX: row.focalX,
    focalY: row.focalY,
    readTimeMinutes: row.readTimeMinutes,
    publishedAt: row.publishedAt,
    href: row.href.startsWith("/") ? row.href : `/blog/${row.slug}`,
    homepageOrder: row.homepageOrder,
  };
}
