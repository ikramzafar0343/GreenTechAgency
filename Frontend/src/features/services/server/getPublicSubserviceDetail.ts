import "server-only";

import { BackendHttpError, backendPublicGet } from "@/server/backend/client";
import type { BackendSubserviceDetail } from "@/server/backend/dtos";
import { resolveMediaUrl } from "@/server/backend/resolveMediaUrl";
import { richBlocksToPlainText } from "@/shared/lib/richBlocksToPlainText";

export type PublicSubserviceDetail = {
  id: string;
  slug: string;
  serviceSlug: string;
  title: string;
  summary: string;
  body: string;
  cardImageSrc: string | null;
  cardImageAlt: string;
  ctaLabel: string | null;
  ctaHref: string | null;
};

export async function getPublicSubserviceDetail(
  serviceSlug: string,
  slug: string,
): Promise<PublicSubserviceDetail | null> {
  try {
    const row = await backendPublicGet<BackendSubserviceDetail>(
      `/api/services/${encodeURIComponent(serviceSlug)}/subservices/${encodeURIComponent(slug)}`,
    );
    return {
      id: row.id,
      slug: row.slug,
      serviceSlug: row.serviceSlug,
      title: row.title,
      summary: row.summary,
      body: richBlocksToPlainText(row.detailedContent) || row.summary,
      cardImageSrc: resolveMediaUrl(row.cardImagePath),
      cardImageAlt: row.cardImageAlt,
      ctaLabel: row.ctaLabel,
      ctaHref: row.ctaHref,
    };
  } catch (err) {
    if (err instanceof BackendHttpError && err.status === 404) {
      return null;
    }
    throw err;
  }
}
