import { CREATIVE_SERVICE_DETAILS } from "@/features/services/model/serviceDetails/creative";
import { DEVELOPMENT_SERVICE_DETAILS } from "@/features/services/model/serviceDetails/development";
import { EMERGING_SERVICE_DETAILS } from "@/features/services/model/serviceDetails/emerging";
import { IT_RESOURCE_SERVICE_DETAILS } from "@/features/services/model/serviceDetails/itResource";
import { MARKETING_CONTENT_SERVICE_DETAILS } from "@/features/services/model/serviceDetails/marketingContent";
import { MARKETING_DEMAND_SERVICE_DETAILS } from "@/features/services/model/serviceDetails/marketingDemand";
import type { ServiceDetailContent } from "@/features/services/model/serviceDetailTypes";

export const SERVICE_DETAILS: readonly ServiceDetailContent[] = [
  ...DEVELOPMENT_SERVICE_DETAILS,
  ...IT_RESOURCE_SERVICE_DETAILS,
  ...MARKETING_DEMAND_SERVICE_DETAILS,
  ...MARKETING_CONTENT_SERVICE_DETAILS,
  ...EMERGING_SERVICE_DETAILS,
  ...CREATIVE_SERVICE_DETAILS,
];

export function getServiceDetailContent(
  slug: string,
): ServiceDetailContent | undefined {
  return SERVICE_DETAILS.find((entry) => entry.slug === slug);
}
