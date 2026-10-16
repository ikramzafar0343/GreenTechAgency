import "server-only";

import { fetchPublishedBlog } from "@/features/blog/server/fetchPublishedBlog";
import { mapBlogListItem } from "@/features/blog/server/mapBlogArticle";
import { normalizeInsightCoverUrl } from "@/features/insights/lib/normalizeInsightCoverUrl";
import { INSIGHTS_PAGE_SETTINGS } from "@/features/insights/model/insightsPageContent";
import type { InsightsPageData } from "@/features/insights/model/insightsPageTypes";
import type { InsightArticle } from "@/features/insights/model/types";
import { fetchPublishedSection } from "@/server/backend/fetchPublishedSection";

function sortByPublishedDesc(articles: readonly InsightArticle[]) {
  return [...articles].sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });
}

export async function getPublicInsightsPage(): Promise<InsightsPageData> {
  const [sectionResult, rows] = await Promise.all([
    fetchPublishedSection("blog"),
    fetchPublishedBlog(),
  ]);

  const articles = sortByPublishedDesc(rows.map(mapBlogListItem)).map(
    (article) => ({
      ...article,
      coverUrl: normalizeInsightCoverUrl(article.coverUrl),
    }),
  );

  const settings = { ...INSIGHTS_PAGE_SETTINGS };
  if (sectionResult.ok && sectionResult.section.visible) {
    settings.heading = sectionResult.section.heading;
    settings.intro = sectionResult.section.introduction || settings.intro;
  }

  return {
    settings,
    articles,
  };
}
