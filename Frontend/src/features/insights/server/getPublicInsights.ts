import "server-only";

import { fetchPublishedBlog } from "@/features/blog/server/fetchPublishedBlog";
import { mapBlogListItem } from "@/features/blog/server/mapBlogArticle";
import { INSIGHTS_CONTENT } from "@/features/insights/model/insightsContent";
import type { InsightsSectionData } from "@/features/insights/model/types";
import { BackendHttpError } from "@/server/backend/client";
import { applySectionSelection } from "@/server/backend/applySectionSelection";
import { fetchPublishedSection } from "@/server/backend/fetchPublishedSection";

export type PublicInsightsSectionState =
  | { kind: "hidden" }
  | { kind: "ready"; data: InsightsSectionData }
  | { kind: "error"; message: string };

export async function getPublicInsightsSection(): Promise<PublicInsightsSectionState> {
  const sectionResult = await fetchPublishedSection("blog");
  if (!sectionResult.ok) {
    if (sectionResult.notFound) {
      return { kind: "hidden" };
    }
    return { kind: "error", message: sectionResult.error.message };
  }

  const section = sectionResult.section;
  if (!section.visible) {
    return { kind: "hidden" };
  }

  let rows;
  try {
    rows = await fetchPublishedBlog();
  } catch (err) {
    const message =
      err instanceof BackendHttpError ? err.message : "Insights could not be loaded.";
    return { kind: "error", message };
  }

  const articles = applySectionSelection(
    rows.map(mapBlogListItem),
    section.featuredIds,
    section.maxItems,
  );

  if (articles.length === 0) {
    return { kind: "hidden" };
  }

  return {
    kind: "ready",
    data: {
      eyebrow: section.eyebrow ?? INSIGHTS_CONTENT.eyebrow,
      heading: section.heading,
      supportingText: section.introduction || INSIGHTS_CONTENT.supportingText,
      viewAllLabel: section.ctaLabel ?? INSIGHTS_CONTENT.viewAllLabel,
      viewAllHref: section.ctaHref ?? INSIGHTS_CONTENT.viewAllHref,
      initialOpenId: articles[0]?.id ?? INSIGHTS_CONTENT.initialOpenId,
      animationEnabled: INSIGHTS_CONTENT.animationEnabled,
      homepageOrder: INSIGHTS_CONTENT.homepageOrder,
      articles,
    },
  };
}
