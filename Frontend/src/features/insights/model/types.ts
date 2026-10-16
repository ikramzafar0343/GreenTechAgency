export type InsightArticle = {
  id: string;
  slug: string;
  title: string;
  railLabel: string | null;
  category: string;
  excerpt: string;
  coverUrl: string | null;
  coverAlt: string;
  focalX: number;
  focalY: number;
  readTimeMinutes: number | null;
  publishedAt: string | null;
  href: string;
  homepageOrder: number;
};

export type InsightsSectionData = {
  eyebrow: string;
  heading: string;
  supportingText: string;
  viewAllLabel: string;
  viewAllHref: string;
  initialOpenId: string;
  animationEnabled: boolean;
  homepageOrder: number;
  articles: InsightArticle[];
};
