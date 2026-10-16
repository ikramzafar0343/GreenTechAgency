import "server-only";

import { fetchPublishedBlog } from "@/features/blog/server/fetchPublishedBlog";
import { mapBlogListItem } from "@/features/blog/server/mapBlogArticle";
import type { InsightArticle } from "@/features/insights/model/types";

export async function getBlogArticles(): Promise<InsightArticle[]> {
  const rows = await fetchPublishedBlog();
  return rows.map(mapBlogListItem).sort((a, b) => a.homepageOrder - b.homepageOrder);
}
