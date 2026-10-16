import "server-only";

import type { PortfolioProject } from "@/features/portfolio/model/types";
import type { BackendPortfolioListItem } from "@/server/backend/dtos";
import { resolveMediaUrl } from "@/server/backend/resolveMediaUrl";

export function mapPortfolioListItem(
  row: BackendPortfolioListItem,
): PortfolioProject {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    clientName: row.clientName,
    summary: row.summary,
    description: row.description,
    category: row.category,
    coverUrl: resolveMediaUrl(row.coverUrl),
    featured: row.featured,
    sortOrder: row.sortOrder,
  };
}
