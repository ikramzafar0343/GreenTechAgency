import "server-only";

import { BackendHttpError, backendPublicGet } from "@/server/backend/client";
import type { BackendPortfolioDetail } from "@/server/backend/dtos";
import { resolveMediaUrl } from "@/server/backend/resolveMediaUrl";
import {
  normalizeRichBlocks,
  type PublicRichBlock,
} from "@/shared/lib/normalizeRichBlocks";

export type PublicPortfolioCaseStudy = {
  id: string;
  title: string;
  slug: string;
  clientName: string | null;
  summary: string;
  description: string;
  category: string;
  coverUrl: string | null;
  coverAlt: string;
  projectUrl: string | null;
  relatedServiceSlug: string | null;
  gallery: readonly { path: string; alt: string }[];
  caseStudyBlocks: readonly PublicRichBlock[];
  seoTitle: string;
  seoDescription: string;
};

export async function getPublicPortfolioBySlug(
  slug: string,
): Promise<PublicPortfolioCaseStudy | null> {
  try {
    const row = await backendPublicGet<BackendPortfolioDetail>(
      `/api/portfolio/${encodeURIComponent(slug)}`,
    );
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      clientName: row.clientName,
      summary: row.summary,
      description: row.description,
      category: row.category,
      coverUrl: resolveMediaUrl(row.coverUrl),
      coverAlt: row.coverAlt?.trim() || row.title,
      projectUrl: row.projectUrl,
      relatedServiceSlug: row.relatedServiceSlug,
      gallery: (row.gallery ?? []).map((item) => ({
        path: resolveMediaUrl(item.path) ?? item.path,
        alt: item.alt?.trim() || row.title,
      })),
      caseStudyBlocks: normalizeRichBlocks(row.caseStudy),
      seoTitle: row.seoTitle?.trim() || row.title,
      seoDescription: row.seoDescription?.trim() || row.summary,
    };
  } catch (err) {
    if (err instanceof BackendHttpError && err.status === 404) {
      return null;
    }
    throw err;
  }
}
