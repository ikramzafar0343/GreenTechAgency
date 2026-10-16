import "server-only";

import {
  buildServicesHubPageData,
  type ServiceCatalogItem,
} from "@/features/services/model/servicesHubContent";
import type { ServicesHubPageData } from "@/features/services/model/servicesHubTypes";
import { fetchPublishedServices } from "@/features/services/server/fetchPublishedServices";
import { BackendHttpError } from "@/server/backend/client";
import { fetchPublishedSection } from "@/server/backend/fetchPublishedSection";

export type PublicServicesHubResult =
  | { ok: true; data: ServicesHubPageData }
  | { ok: false; error: BackendHttpError };

function toCatalogMap(
  items: readonly ServiceCatalogItem[],
): Map<string, ServiceCatalogItem> {
  return new Map(items.map((item) => [item.slug, item]));
}

export async function getPublicServicesHub(): Promise<PublicServicesHubResult> {
  try {
    const [sectionResult, services] = await Promise.all([
      fetchPublishedSection("services"),
      fetchPublishedServices(),
    ]);

    const intro =
      sectionResult.ok && sectionResult.section.visible
        ? {
            eyebrow: sectionResult.section.eyebrow ?? undefined,
            heading: sectionResult.section.heading,
          }
        : undefined;

    const catalog = toCatalogMap(services);
    const data = buildServicesHubPageData(catalog, {
      eyebrow: intro?.eyebrow ?? "Count on us for",
      heading: intro?.heading ?? "Digital products and solutions",
    });

    return { ok: true, data };
  } catch (err) {
    if (err instanceof BackendHttpError) {
      return { ok: false, error: err };
    }
    throw err;
  }
}
