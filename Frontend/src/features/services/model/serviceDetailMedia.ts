import type { ServiceDetailImage, ServiceDetailPhotoPair } from "@/features/services/model/serviceDetailTypes";

/**
 * Default editorial illustrations for a service detail page. Every service has its
 * own set under /public/services/editorial/{slug}/ so no two pages share artwork.
 * CMS uploads (leadImagePath, pairA, pairB, deliveryRail…) override these.
 */
export type ServiceMedia = {
  lead: ServiceDetailImage;
  pairA: ServiceDetailPhotoPair;
  pairB: ServiceDetailPhotoPair;
  railPhoto: ServiceDetailImage;
  card: ServiceDetailImage;
};

function frame(
  slug: string,
  file: string,
  alt: string,
  width: number,
  height: number,
  tileTitle: string,
  tileCaption = "",
): ServiceDetailImage {
  return {
    src: `/services/editorial/${slug}/${file}.svg`,
    alt,
    width,
    height,
    tileTitle,
    tileCaption,
  };
}

export function getServiceMedia(slug: string, title: string): ServiceMedia {
  return {
    lead: frame(slug, "lead", `${title} — overview illustration`, 2200, 1450, title, "GREENTECH"),
    pairA: {
      left: frame(slug, "pair-a-left", `${title} — planning and discussion`, 1200, 1800, "Discovery"),
      right: frame(slug, "pair-a-right", `${title} — interface detail`, 1200, 1800, "Detail"),
    },
    pairB: {
      left: frame(slug, "pair-b-left", `${title} — craft and build`, 1200, 1800, "Craft"),
      right: frame(slug, "pair-b-right", `${title} — collaboration and delivery`, 1200, 1800, "Collaborate"),
    },
    railPhoto: frame(slug, "rail", `${title} — delivery`, 1000, 1400, "Delivery"),
    card: frame(slug, "card", `${title} service illustration`, 1200, 1347, title),
  };
}
