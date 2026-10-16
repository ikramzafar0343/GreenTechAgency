export type PortfolioCategory =
  | "websites"
  | "logoDesign"
  | "socialMedia"
  | "businessCards"
  | "photography"
  | "printDesign";

export type WebsiteType = "all" | "ecommerce" | "staticWebsite";
export type SocialType = "socialPost" | "socialGrid";

export type WebsiteProject = {
  id: string;
  title: string;
  websiteType: "ecommerce" | "staticWebsite";
  screenshotUrl: string;
  screenshotWidth: number;
  screenshotHeight: number;
  href: string | null;
  sortOrder: number;
  isPublished: boolean;
  showOnPortfolioPage: boolean;
};

export type ArtworkProject = {
  id: string;
  title: string;
  coverUrl: string;
  coverWidth: number;
  coverHeight: number;
  galleryUrls: readonly string[];
  sortOrder: number;
  isPublished: boolean;
  showOnPortfolioPage: boolean;
};

export type SocialGridTile = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type SocialGridCampaign = {
  id: string;
  title: string;
  tiles: readonly SocialGridTile[];
  sortOrder: number;
  isPublished: boolean;
  showOnPortfolioPage: boolean;
};

export type MediaTile = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  sortOrder: number;
  isPublished: boolean;
  showOnPortfolioPage: boolean;
};

export type PortfolioPageSettings = {
  heading: string;
  intro: string;
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
  };
};

export type PortfolioPageData = {
  settings: PortfolioPageSettings;
  websites: readonly WebsiteProject[];
  logoDesign: readonly ArtworkProject[];
  socialPosts: readonly ArtworkProject[];
  socialGrids: readonly SocialGridCampaign[];
  businessCards: readonly MediaTile[];
  photography: readonly MediaTile[];
  printDesign: readonly MediaTile[];
};

export const PORTFOLIO_CATEGORIES: readonly {
  id: PortfolioCategory;
  label: string;
}[] = [
  { id: "websites", label: "Websites" },
  { id: "logoDesign", label: "Logo Design" },
  { id: "socialMedia", label: "Social Media" },
  { id: "businessCards", label: "Business Cards" },
  { id: "photography", label: "Photography" },
  { id: "printDesign", label: "Print Design" },
] as const;
