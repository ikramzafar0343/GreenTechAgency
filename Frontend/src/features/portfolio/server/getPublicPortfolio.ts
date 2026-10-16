import "server-only";

import { fetchPublishedPortfolio } from "@/features/portfolio/server/fetchPublishedPortfolio";
import { mapPortfolioListItem } from "@/features/portfolio/server/mapPortfolioFromBackend";
import type { PortfolioSectionData } from "@/features/portfolio/model/types";
import { BackendHttpError } from "@/server/backend/client";
import { applySectionSelection } from "@/server/backend/applySectionSelection";
import { fetchPublishedSection } from "@/server/backend/fetchPublishedSection";

const PORTFOLIO_SUBTITLE_FALLBACK =
  "Products and digital experiences built for brands that need clarity, craft, and measurable outcomes.";

export type PublicPortfolioSectionState =
  | { kind: "hidden" }
  | { kind: "ready"; data: PortfolioSectionData }
  | { kind: "error"; message: string };

export async function getPublicPortfolioSection(): Promise<PublicPortfolioSectionState> {
  const sectionResult = await fetchPublishedSection("portfolio");
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
    rows = await fetchPublishedPortfolio();
  } catch (err) {
    const message =
      err instanceof BackendHttpError
        ? err.message
        : "Portfolio could not be loaded.";
    return { kind: "error", message };
  }

  const projects = applySectionSelection(
    rows.map(mapPortfolioListItem),
    section.featuredIds,
    section.maxItems,
  );

  if (projects.length === 0) {
    return { kind: "hidden" };
  }

  return {
    kind: "ready",
    data: {
      heading: section.heading,
      subtitle: section.introduction || PORTFOLIO_SUBTITLE_FALLBACK,
      projects,
    },
  };
}
