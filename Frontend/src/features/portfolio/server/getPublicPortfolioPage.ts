import "server-only";

import { PORTFOLIO_PAGE_CONTENT } from "@/features/portfolio/model/portfolioPageContent";
import type {
  ArtworkProject,
  MediaTile,
  PortfolioPageData,
  WebsiteProject,
} from "@/features/portfolio/model/portfolioPageTypes";
import { fetchPublishedPortfolio } from "@/features/portfolio/server/fetchPublishedPortfolio";
import { mapPortfolioListItem } from "@/features/portfolio/server/mapPortfolioFromBackend";
import { fetchPublishedSection } from "@/server/backend/fetchPublishedSection";

const DEFAULT_DIM = { width: 1200, height: 1800 };

function toWebsite(row: ReturnType<typeof mapPortfolioListItem>): WebsiteProject | null {
  if (!row.coverUrl) {
    return null;
  }
  return {
    // Sitemap and deep links use `/portfolio#${slug}` — keep DOM id = slug.
    id: row.slug,
    title: row.title,
    websiteType: "staticWebsite",
    screenshotUrl: row.coverUrl,
    screenshotWidth: DEFAULT_DIM.width,
    screenshotHeight: DEFAULT_DIM.height,
    href: null,
    sortOrder: row.sortOrder,
    isPublished: true,
    showOnPortfolioPage: true,
  };
}

function toArtwork(row: ReturnType<typeof mapPortfolioListItem>): ArtworkProject | null {
  if (!row.coverUrl) {
    return null;
  }
  return {
    id: row.slug,
    title: row.title,
    coverUrl: row.coverUrl,
    coverWidth: DEFAULT_DIM.width,
    coverHeight: DEFAULT_DIM.height,
    galleryUrls: [],
    sortOrder: row.sortOrder,
    isPublished: true,
    showOnPortfolioPage: true,
  };
}

function toMediaTile(row: ReturnType<typeof mapPortfolioListItem>): MediaTile | null {
  if (!row.coverUrl) {
    return null;
  }
  return {
    id: row.slug,
    src: row.coverUrl,
    width: DEFAULT_DIM.width,
    height: DEFAULT_DIM.height,
    alt: row.title,
    sortOrder: row.sortOrder,
    isPublished: true,
    showOnPortfolioPage: true,
  };
}

function bucketCategory(category: string): keyof Pick<
  PortfolioPageData,
  "websites" | "logoDesign" | "socialPosts" | "businessCards" | "photography" | "printDesign"
> {
  const key = category.trim().toLowerCase();
  if (key.includes("logo")) return "logoDesign";
  if (key.includes("social")) return "socialPosts";
  if (key.includes("card")) return "businessCards";
  if (key.includes("photo")) return "photography";
  if (key.includes("print")) return "printDesign";
  return "websites";
}

export async function getPublicPortfolioPage(): Promise<PortfolioPageData> {
  const [sectionResult, rows] = await Promise.all([
    fetchPublishedSection("portfolio"),
    fetchPublishedPortfolio(),
  ]);

  const settings = { ...PORTFOLIO_PAGE_CONTENT.settings };
  if (sectionResult.ok && sectionResult.section.visible) {
    settings.heading = sectionResult.section.heading;
    settings.intro = sectionResult.section.introduction || settings.intro;
  }

  const websites: WebsiteProject[] = [];
  const logoDesign: ArtworkProject[] = [];
  const socialPosts: ArtworkProject[] = [];
  const businessCards: MediaTile[] = [];
  const photography: MediaTile[] = [];
  const printDesign: MediaTile[] = [];

  for (const raw of rows) {
    const row = mapPortfolioListItem(raw);
    const bucket = bucketCategory(row.category);
    if (bucket === "websites") {
      const item = toWebsite(row);
      if (item) websites.push(item);
    } else if (bucket === "logoDesign") {
      const item = toArtwork(row);
      if (item) logoDesign.push(item);
    } else if (bucket === "socialPosts") {
      const item = toArtwork(row);
      if (item) socialPosts.push(item);
    } else if (bucket === "businessCards") {
      const item = toMediaTile(row);
      if (item) businessCards.push(item);
    } else if (bucket === "photography") {
      const item = toMediaTile(row);
      if (item) photography.push(item);
    } else {
      const item = toMediaTile(row);
      if (item) printDesign.push(item);
    }
  }

  return {
    settings,
    websites,
    logoDesign,
    socialPosts,
    socialGrids: [],
    businessCards,
    photography,
    printDesign,
  };
}
