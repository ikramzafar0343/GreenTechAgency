import "server-only";

import { mapBlogListItem } from "@/features/blog/server/mapBlogArticle";
import type { InsightArticle } from "@/features/insights/model/types";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";
import type { BackendBlogDetail } from "@/server/backend/dtos";
import {
  normalizeRichBlocks,
  type PublicRichBlock,
} from "@/shared/lib/normalizeRichBlocks";

export type BlogArticleDetail = InsightArticle & {
  bodyBlocks: readonly PublicRichBlock[];
  seoTitle: string;
  seoDescription: string;
};

export async function getBlogArticle(
  slug: string,
): Promise<BlogArticleDetail | null> {
  try {
    const row = await backendPublicGet<BackendBlogDetail>(
      `/api/blog/${encodeURIComponent(slug)}`,
    );
    const base = mapBlogListItem(row);
    return {
      ...base,
      bodyBlocks: normalizeRichBlocks(row.body),
      seoTitle: row.seoTitle?.trim() || base.title,
      seoDescription: row.seoDescription?.trim() || base.excerpt,
    };
  } catch (err) {
    if (err instanceof BackendHttpError && err.status === 404) {
      return null;
    }
    throw err;
  }
}
