import "server-only";

import type { ServiceItem } from "@/features/services/model/serviceItems";
import { SERVICES_INTRO } from "@/features/services/model/serviceItems";
import { fetchPublishedServices } from "@/features/services/server/fetchPublishedServices";
import { BackendHttpError } from "@/server/backend/client";
import { applySectionSelection } from "@/server/backend/applySectionSelection";
import { fetchPublishedSection } from "@/server/backend/fetchPublishedSection";

export type PublicServicesSectionState =
  | { kind: "hidden" }
  | {
      kind: "ready";
      eyebrow: string;
      heading: string;
      supporting: string;
      items: readonly ServiceItem[];
    }
  | { kind: "error"; message: string };

function mapServiceItem(row: {
  id: string;
  slug: string;
  title: string;
  label: string;
  summary: string;
}): ServiceItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    label: row.label,
    summary: row.summary,
  };
}

export async function getPublicServicesSection(): Promise<PublicServicesSectionState> {
  const sectionResult = await fetchPublishedSection("services");
  if (!sectionResult.ok) {
    if (sectionResult.notFound) {
      return { kind: "hidden" };
    }
    return {
      kind: "error",
      message: sectionResult.error.message,
    };
  }

  const section = sectionResult.section;
  if (!section.visible) {
    return { kind: "hidden" };
  }

  let services;
  try {
    services = await fetchPublishedServices();
  } catch (err) {
    const message =
      err instanceof BackendHttpError
        ? err.message
        : "Services could not be loaded.";
    return { kind: "error", message };
  }

  const selected = applySectionSelection(
    services,
    section.featuredIds,
    section.maxItems,
  ).map(mapServiceItem);

  if (selected.length === 0) {
    return { kind: "hidden" };
  }

  return {
    kind: "ready",
    eyebrow: section.eyebrow ?? SERVICES_INTRO.eyebrow,
    heading: section.heading,
    supporting: section.introduction || SERVICES_INTRO.supporting,
    items: selected,
  };
}
