import type { InsightArticle } from "@/features/insights/model/types";

export type InsightsViewMode = "large" | "small";

export type InsightsPageSettings = {
  heading: string;
  intro: string;
  ctaHeading: string;
  ctaLabel: string;
  ctaHref: string;
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
  };
};

export type InsightsPageData = {
  settings: InsightsPageSettings;
  articles: readonly InsightArticle[];
};
