import "server-only";

import { FAQ_CONTENT } from "@/features/faq/model/faqContent";
import type { FaqSectionData } from "@/features/faq/model/types";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";
import { applySectionSelection } from "@/server/backend/applySectionSelection";
import type { BackendFaqListItem } from "@/server/backend/dtos";
import { fetchPublishedSection } from "@/server/backend/fetchPublishedSection";
import { parseItemsResponse } from "@/server/backend/parseItemsResponse";

export type PublicFaqSectionState =
  | { kind: "hidden" }
  | { kind: "ready"; data: FaqSectionData }
  | { kind: "error"; message: string };

const UI_DEFAULTS = FAQ_CONTENT;

export async function getPublicFaqSection(): Promise<PublicFaqSectionState> {
  const sectionResult = await fetchPublishedSection("faq");
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

  let items: BackendFaqListItem[];
  try {
    const payload = await backendPublicGet<
      { items: BackendFaqListItem[] } | BackendFaqListItem[]
    >("/api/faq");
    items = parseItemsResponse(payload);
  } catch (err) {
    const message =
      err instanceof BackendHttpError
        ? err.message
        : "FAQ could not be loaded.";
    return { kind: "error", message };
  }

  const selected = applySectionSelection(
    items,
    section.featuredIds,
    section.maxItems,
  );

  if (selected.length === 0) {
    return { kind: "hidden" };
  }

  return {
    kind: "ready",
    data: {
      eyebrow: section.eyebrow ?? UI_DEFAULTS.eyebrow,
      heading: section.heading,
      supportingText: section.introduction || UI_DEFAULTS.supportingText,
      contactPrompt: "Have a project in mind?",
      ctaLabel: section.ctaLabel ?? UI_DEFAULTS.ctaLabel,
      ctaHref: section.ctaHref ?? UI_DEFAULTS.ctaHref,
      initialOpenId: selected[0]?.id ?? null,
      animationEnabled: UI_DEFAULTS.animationEnabled,
      homepageOrder: UI_DEFAULTS.homepageOrder,
      items: selected,
    },
  };
}

/** @deprecated Prefer getPublicFaqSection for homepage visibility and error rules. */
export async function getPublicFaq(): Promise<FaqSectionData | null> {
  const state = await getPublicFaqSection();
  if (state.kind === "ready") {
    return state.data;
  }
  return null;
}
