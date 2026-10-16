import { getServiceMediaSet, type ServiceMediaSetId } from "@/features/services/model/serviceDetailMedia";
import type {
  ServiceDetailBlock,
  ServiceDetailContent,
} from "@/features/services/model/serviceDetailTypes";

export type ServiceDetailSeed = {
  slug: string;
  mediaSet: ServiceMediaSetId;
  heroHeadline: string;
  heroIntro: string;
  storyLabel: string;
  storyParagraphs: readonly string[];
  principles: readonly { title: string; body: string }[];
  relatedSlugs: readonly string[];
  relatedHeading: string;
  relatedIntro: string;
};

function toPrinciples(
  slug: string,
  items: readonly { title: string; body: string }[],
): ServiceDetailBlock[] {
  return items.map((item, index) => ({
    id: `${slug}-p${index + 1}`,
    title: item.title,
    body: item.body,
  }));
}

export function buildServiceDetail(seed: ServiceDetailSeed): ServiceDetailContent {
  if (seed.principles.length !== 6) {
    throw new Error(`Service ${seed.slug} must define exactly 6 principles`);
  }
  const media = getServiceMediaSet(seed.mediaSet);
  return {
    slug: seed.slug,
    heroHeadline: seed.heroHeadline,
    heroIntro: seed.heroIntro,
    storyLabel: seed.storyLabel,
    storyParagraphs: seed.storyParagraphs,
    storyCtaLabel: "Talk about your project",
    leadImage: media.lead,
    pairA: media.pairA,
    pairB: media.pairB,
    principles: toPrinciples(seed.slug, seed.principles),
    relatedHeading: seed.relatedHeading,
    relatedIntro: seed.relatedIntro,
    relatedSlugs: seed.relatedSlugs,
    ctaHref: "/contact",
  };
}
