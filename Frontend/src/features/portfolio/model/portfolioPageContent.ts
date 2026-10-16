import type { PortfolioPageData } from "@/features/portfolio/model/portfolioPageTypes";

/**
 * Dedicated /portfolio page content. Homepage timeline uses portfolioContent.ts separately.
 * Existing /public/portfolio covers seed the Websites gallery; other categories stay empty
 * until approved media is published through the future admin.
 */
export const PORTFOLIO_PAGE_CONTENT: PortfolioPageData = {
  settings: {
    heading: "Portfolio",
    intro:
      "Explore our work across websites, brand identity, social media, photography, and print.",
    seo: {
      title: "Portfolio | GreenTech Agency",
      description:
        "Selected GreenTech Agency work across websites, brand identity, social media, photography, and print.",
      canonicalPath: "/portfolio",
    },
  },
  websites: [
    {
      id: "web-atlas",
      title: "Atlas Operations Dashboard",
      websiteType: "staticWebsite",
      screenshotUrl: "/portfolio/atlas-dashboard.jpg",
      screenshotWidth: 1200,
      screenshotHeight: 1800,
      href: null,
      sortOrder: 1,
      isPublished: true,
      showOnPortfolioPage: true,
    },
    {
      id: "web-lumen",
      title: "Lumen Commerce Experience",
      websiteType: "ecommerce",
      screenshotUrl: "/portfolio/lumen-shop.jpg",
      screenshotWidth: 1200,
      screenshotHeight: 1800,
      href: null,
      sortOrder: 2,
      isPublished: true,
      showOnPortfolioPage: true,
    },
    {
      id: "web-northline",
      title: "Northline Mobile Banking",
      websiteType: "staticWebsite",
      screenshotUrl: "/portfolio/northline-banking.jpg",
      screenshotWidth: 1200,
      screenshotHeight: 1800,
      href: null,
      sortOrder: 3,
      isPublished: true,
      showOnPortfolioPage: true,
    },
    {
      id: "web-carepath",
      title: "CarePath Patient Portal",
      websiteType: "staticWebsite",
      screenshotUrl: "/portfolio/carepath-portal.jpg",
      screenshotWidth: 1200,
      screenshotHeight: 1800,
      href: null,
      sortOrder: 4,
      isPublished: true,
      showOnPortfolioPage: true,
    },
  ],
  logoDesign: [],
  socialPosts: [],
  socialGrids: [],
  businessCards: [],
  photography: [],
  printDesign: [],
};
