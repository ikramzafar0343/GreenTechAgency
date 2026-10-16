import { SERVICE_GROUP_SEEDS } from "@/features/services/model/servicesHubGroupSeeds";
import type { ServiceEntrySeed } from "@/features/services/model/servicesHubGroupSeeds";
import { getServiceHref } from "@/features/services/model/serviceItems";
import type {
  ServiceShowcaseEntry,
  ServiceShowcaseGroup,
  ServicesHubPageData,
  ServiceSpecialty,
} from "@/features/services/model/servicesHubTypes";
import { resolveMediaUrl } from "@/server/backend/resolveMediaUrl";
import type { BackendServiceListItem } from "@/server/backend/dtos";

export type ServiceCatalogItem = Pick<
  BackendServiceListItem,
  "id" | "slug" | "title" | "label" | "summary" | "cardImagePath" | "cardImageAlt"
>;

export const SERVICES_HUB_INTRO = {
  eyebrow: "Count on us for",
  heading: "Digital products and solutions",
} as const;

function specialtyFromSlug(
  slug: string,
  catalog: ReadonlyMap<string, ServiceCatalogItem>,
): ServiceSpecialty | null {
  const service = catalog.get(slug);
  if (!service) {
    return null;
  }
  return {
    id: service.id,
    label: service.title,
    href: getServiceHref(service.slug),
  };
}

function buildEntry(
  seed: ServiceEntrySeed,
  catalog: ReadonlyMap<string, ServiceCatalogItem>,
): ServiceShowcaseEntry | null {
  const service = catalog.get(seed.slug);
  if (!service) {
    return null;
  }

  const specialties: ServiceSpecialty[] = seed.specialtySlugs.flatMap((slug) => {
    const item = specialtyFromSlug(slug, catalog);
    return item ? [item] : [];
  });

  for (const label of seed.plainSpecialties ?? []) {
    specialties.push({
      id: `${service.id}-plain-${label.toLowerCase().replace(/\s+/g, "-")}`,
      label,
      href: null,
    });
  }

  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    summary: service.summary,
    description: seed.description,
    href: getServiceHref(service.slug),
    imageSrc: resolveMediaUrl(service.cardImagePath),
    imageAlt: service.cardImageAlt || `${service.title} service overview`,
    specialties,
  };
}

function buildGroup(
  id: string,
  eyebrow: string,
  title: string,
  outlineLabel: string,
  seeds: readonly ServiceEntrySeed[],
  catalog: ReadonlyMap<string, ServiceCatalogItem>,
): ServiceShowcaseGroup | null {
  const entries = seeds.flatMap((seed) => {
    const entry = buildEntry(seed, catalog);
    return entry ? [entry] : [];
  });
  if (entries.length === 0) {
    return null;
  }
  return { id, eyebrow, title, outlineLabel, entries };
}

export function buildServicesHubPageData(
  catalogBySlug: ReadonlyMap<string, ServiceCatalogItem>,
  intro?: { eyebrow: string; heading: string },
): ServicesHubPageData {
  const groups = SERVICE_GROUP_SEEDS.flatMap((group) => {
    const built = buildGroup(
      group.id,
      group.eyebrow,
      group.title,
      group.outlineLabel,
      group.seeds,
      catalogBySlug,
    );
    return built ? [built] : [];
  });

  return {
    eyebrow: intro?.eyebrow ?? SERVICES_HUB_INTRO.eyebrow,
    heading: intro?.heading ?? SERVICES_HUB_INTRO.heading,
    groups,
  };
}
