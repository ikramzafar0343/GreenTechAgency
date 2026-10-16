import type {
  ServiceDetailImage,
  ServiceDetailPhotoPair,
} from "@/features/services/model/serviceDetailTypes";

export type ServiceMediaSetId = "dev" | "marketing" | "emerging" | "creative";

type MediaSet = {
  lead: ServiceDetailImage;
  pairA: ServiceDetailPhotoPair;
  pairB: ServiceDetailPhotoPair;
  railPhoto: ServiceDetailImage;
};

const img = (
  file: string,
  alt: string,
  width: number,
  height: number,
  tileTitle: string,
  tileCaption = "EDITORIAL DEMO",
): ServiceDetailImage => ({
  src: `/services/editorial/${file}`,
  alt,
  width,
  height,
  tileTitle,
  tileCaption,
});

const SETS: Record<ServiceMediaSetId, MediaSet> = {
  dev: {
    lead: img(
      "lead-dev.svg",
      "Editorial workspace scene for development services",
      2200,
      1450,
      "Development",
      "GREENTECH",
    ),
    pairA: {
      left: img("pair-a-left.svg", "Team discussion at a workstation", 1200, 1800, "Discussion"),
      right: img("pair-a-right.svg", "Close detail of interface design work", 1200, 1800, "Detail"),
    },
    pairB: {
      left: img("pair-b-left.svg", "Craft and environment detail", 1200, 1800, "Craft"),
      right: img("pair-b-right.svg", "Collaborative working session", 1200, 1800, "Collaborate"),
    },
    railPhoto: img("rail-photo.svg", "Delivery detail photograph", 1000, 1400, "Delivery"),
  },
  marketing: {
    lead: img("lead-marketing.svg", "Editorial scene for marketing services", 2200, 1450, "Marketing", "GREENTECH"),
    pairA: {
      left: img("pair-a-left.svg", "Campaign planning discussion", 1200, 1800, "Discussion"),
      right: img("pair-a-right.svg", "Content and brand detail", 1200, 1800, "Detail"),
    },
    pairB: {
      left: img("pair-b-left.svg", "Creative production environment", 1200, 1800, "Craft"),
      right: img("pair-b-right.svg", "Team reviewing channel work", 1200, 1800, "Collaborate"),
    },
    railPhoto: img("rail-photo.svg", "Marketing delivery detail", 1000, 1400, "Delivery"),
  },
  emerging: {
    lead: img("lead-emerging.svg", "Editorial scene for emerging technology", 2200, 1450, "Emerging Tech", "GREENTECH"),
    pairA: {
      left: img("pair-a-left.svg", "Product exploration session", 1200, 1800, "Discussion"),
      right: img("pair-a-right.svg", "Immersive experience detail", 1200, 1800, "Detail"),
    },
    pairB: {
      left: img("pair-b-left.svg", "Technology craft detail", 1200, 1800, "Craft"),
      right: img("pair-b-right.svg", "Collaborative prototyping", 1200, 1800, "Collaborate"),
    },
    railPhoto: img("rail-photo.svg", "Emerging tech delivery detail", 1000, 1400, "Delivery"),
  },
  creative: {
    lead: img("lead-creative.svg", "Editorial scene for creative services", 2200, 1450, "Creative", "GREENTECH"),
    pairA: {
      left: img("pair-a-left.svg", "Brand and creative discussion", 1200, 1800, "Discussion"),
      right: img("pair-a-right.svg", "Motion and visual detail", 1200, 1800, "Detail"),
    },
    pairB: {
      left: img("pair-b-left.svg", "Studio craft environment", 1200, 1800, "Craft"),
      right: img("pair-b-right.svg", "Creative collaboration", 1200, 1800, "Collaborate"),
    },
    railPhoto: img("rail-photo.svg", "Creative delivery detail", 1000, 1400, "Delivery"),
  },
};

export function getServiceMediaSet(id: ServiceMediaSetId): MediaSet {
  return SETS[id];
}
