import "server-only";

import { TESTIMONIALS_CONTENT } from "@/features/testimonials/model/testimonialsContent";
import { DEFAULT_TRUST_BADGE } from "@/features/testimonials/model/trustBadge";
import type {
  TestimonialItem,
  TestimonialsSectionData,
} from "@/features/testimonials/model/types";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";
import { applySectionSelection } from "@/server/backend/applySectionSelection";
import type { BackendTestimonialListItem } from "@/server/backend/dtos";
import { fetchPublishedSection } from "@/server/backend/fetchPublishedSection";
import { parseItemsResponse } from "@/server/backend/parseItemsResponse";
import { resolveMediaUrl } from "@/server/backend/resolveMediaUrl";

export type PublicTestimonialsSectionState =
  | { kind: "hidden" }
  | { kind: "ready"; data: TestimonialsSectionData }
  | { kind: "error"; message: string };

const UI_DEFAULTS = TESTIMONIALS_CONTENT;

function mapTestimonial(row: BackendTestimonialListItem): TestimonialItem {
  return {
    id: row.id,
    companyName: row.companyName,
    companyLogoUrl: resolveMediaUrl(row.companyLogoUrl),
    location: row.location,
    reviewerName: row.reviewerName,
    reviewerRole: row.reviewerRole,
    reviewerPhotoUrl: resolveMediaUrl(row.reviewerPhotoUrl),
    quote: row.quote,
    emphasisText: row.emphasisText,
    rating: row.rating,
    ratingScale: row.ratingScale,
    sourceUrl: row.sourceUrl,
    displayOrder: row.displayOrder,
    featured: row.featured,
  };
}

export async function getPublicTestimonialsSection(): Promise<PublicTestimonialsSectionState> {
  const sectionResult = await fetchPublishedSection("testimonials");
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

  let rows: BackendTestimonialListItem[];
  try {
    const payload = await backendPublicGet<
      { items: BackendTestimonialListItem[] } | BackendTestimonialListItem[]
    >("/api/testimonials");
    rows = parseItemsResponse(payload);
  } catch (err) {
    const message =
      err instanceof BackendHttpError
        ? err.message
        : "Testimonials could not be loaded.";
    return { kind: "error", message };
  }

  const selected = applySectionSelection(
    rows,
    section.featuredIds,
    section.maxItems,
  ).map(mapTestimonial);

  if (selected.length === 0) {
    return { kind: "hidden" };
  }

  return {
    kind: "ready",
    data: {
      eyebrow: section.eyebrow ?? UI_DEFAULTS.eyebrow,
      heading: section.heading,
      supportingText: section.introduction || UI_DEFAULTS.supportingText,
      scrollAnimationEnabled: UI_DEFAULTS.scrollAnimationEnabled,
      homepageOrder: UI_DEFAULTS.homepageOrder,
      trustBadge: UI_DEFAULTS.trustBadge ?? DEFAULT_TRUST_BADGE,
      items: selected,
    },
  };
}

/** @deprecated Prefer getPublicTestimonialsSection for homepage visibility and error rules. */
export async function getPublicTestimonials(): Promise<TestimonialsSectionData | null> {
  const state = await getPublicTestimonialsSection();
  if (state.kind === "ready") {
    return state.data;
  }
  return null;
}
