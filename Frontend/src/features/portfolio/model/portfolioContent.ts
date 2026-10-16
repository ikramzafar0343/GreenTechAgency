import type { PortfolioSectionData } from "@/features/portfolio/model/types";

/**
 * Storefront portfolio content until a CMS backend owns this section.
 * Cover images under /public/portfolio are temporary demos — replace after admin/media exists.
 */
export const PORTFOLIO_CONTENT: PortfolioSectionData = {
  heading: "Selected Work",
  subtitle:
    "Products and digital experiences built for brands that need clarity, craft, and measurable outcomes.",
  projects: [
    {
      id: "project-atlas",
      title: "Atlas Operations Dashboard",
      slug: "atlas-dashboard",
      clientName: "Atlas Logistics",
      summary:
        "A multi-tenant operations console that replaced spreadsheet-heavy shipping workflows.",
      description:
        "We designed and shipped a live operations dashboard with role-based views, shipment tracking, and reporting.",
      category: "Product Design",
      coverUrl: "/portfolio/atlas-dashboard.jpg",
      featured: true,
      sortOrder: 1,
    },
    {
      id: "project-lumen",
      title: "Lumen Commerce Experience",
      slug: "lumen-shop",
      clientName: "Lumen Apparel",
      summary:
        "A conversion-focused storefront for a sustainable fashion brand expanding online.",
      description:
        "We rebuilt the ecommerce journey across mobile and desktop with clearer merchandising and checkout.",
      category: "Ecommerce",
      coverUrl: "/portfolio/lumen-shop.jpg",
      featured: true,
      sortOrder: 2,
    },
    {
      id: "project-northline",
      title: "Northline Mobile Banking",
      slug: "northline-banking",
      clientName: "Northline Finance",
      summary:
        "A calm banking app for everyday money decisions, balances, and card controls.",
      description:
        "We delivered a mobile-first banking experience with spending insights and accessible navigation.",
      category: "Mobile App",
      coverUrl: "/portfolio/northline-banking.jpg",
      featured: true,
      sortOrder: 3,
    },
    {
      id: "project-carepath",
      title: "CarePath Patient Portal",
      slug: "carepath-portal",
      clientName: "CarePath Health",
      summary:
        "A patient portal that makes appointments, records, and follow-ups easier to manage.",
      description:
        "We created a healthcare portal with scheduling, visit summaries, and clear next steps.",
      category: "Web Platform",
      coverUrl: "/portfolio/carepath-portal.jpg",
      featured: false,
      sortOrder: 4,
    },
  ],
};
