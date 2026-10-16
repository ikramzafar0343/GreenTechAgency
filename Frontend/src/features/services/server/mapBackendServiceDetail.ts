import "server-only";

import type {
  BackendServiceDetail,
  BackendServiceListItem,
  BackendServicePairImage,
  BackendServicePhotoPair,
} from "@/server/backend/dtos";
import { resolveMediaUrl } from "@/server/backend/resolveMediaUrl";
import {
  getServiceMediaSet,
  type ServiceMediaSetId,
} from "@/features/services/model/serviceDetailMedia";
import type {
  PublicServiceDetail,
  ServiceDetailImage,
  ServiceDetailLink,
  ServiceDetailPhotoPair,
} from "@/features/services/model/serviceDetailTypes";
import { getServiceHref } from "@/features/services/model/serviceItems";

const MEDIA_SET_BY_SLUG: Record<string, ServiceMediaSetId> = {
  "web-development": "dev",
  "mobile-app-development": "dev",
  "ecommerce-development": "dev",
  "ui-ux-design": "creative",
  "content-marketing": "marketing",
  "copywriting": "marketing",
  "digital-marketing": "marketing",
  "social-media-marketing": "marketing",
  "search-engine-optimization": "marketing",
  "generative-engine-optimization": "marketing",
  "digital-branding-creatives": "creative",
  "video-animation-2d-3d": "creative",
  "artificial-intelligence": "emerging",
  "augmented-reality": "emerging",
  "virtual-reality": "emerging",
  "it-resource-outsourcing": "dev",
};

function toImage(
  path: string | null | undefined,
  alt: string | null | undefined,
  fallback: ServiceDetailImage,
  tileTitle?: string | null,
  tileCaption?: string | null,
): ServiceDetailImage {
  const src = resolveMediaUrl(path);
  return {
    src: src ?? fallback.src,
    alt: (alt && alt.trim()) || fallback.alt,
    width: fallback.width,
    height: fallback.height,
    tileTitle: (tileTitle && tileTitle.trim()) || fallback.tileTitle,
    tileCaption: (tileCaption && tileCaption.trim()) || fallback.tileCaption,
  };
}

function toPairImage(
  raw: BackendServicePairImage | null | undefined,
  fallback: ServiceDetailImage,
): ServiceDetailImage {
  if (!raw) {
    return fallback;
  }
  return toImage(
    raw.path,
    raw.alt,
    {
      ...fallback,
      width: raw.width && raw.width > 0 ? raw.width : fallback.width,
      height: raw.height && raw.height > 0 ? raw.height : fallback.height,
    },
    raw.tileTitle,
    raw.tileCaption,
  );
}

function toPair(
  raw: BackendServicePhotoPair | null | undefined,
  fallback: ServiceDetailPhotoPair,
): ServiceDetailPhotoPair {
  return {
    left: toPairImage(raw?.left, fallback.left),
    right: toPairImage(raw?.right, fallback.right),
  };
}

function relatedLinks(
  slugs: readonly string[],
  catalog: ReadonlyMap<string, BackendServiceListItem>,
): ServiceDetailLink[] {
  return slugs.flatMap((slug) => {
    const item = catalog.get(slug);
    if (!item) {
      return [];
    }
    return [
      {
        slug: item.slug,
        title: item.title,
        href: getServiceHref(item.slug),
        summary: item.summary,
      },
    ];
  });
}

export function mapBackendServiceDetail(
  detail: BackendServiceDetail,
  catalog: ReadonlyMap<string, BackendServiceListItem>,
): PublicServiceDetail {
  const media = getServiceMediaSet(MEDIA_SET_BY_SLUG[detail.slug] ?? "dev");
  const storyCtaHref =
    detail.storyCtaHref?.startsWith("/") ? detail.storyCtaHref : "/contact";

  return {
    id: detail.id,
    slug: detail.slug,
    title: detail.title,
    label: detail.label,
    summary: detail.summary,
    heroHeadline: detail.heroHeadline,
    heroIntro: detail.heroIntro,
    storyLabel: detail.storyLabel,
    storyParagraphs: detail.storyParagraphs,
    storyCtaLabel: detail.storyCtaLabel,
    storyCtaHref: storyCtaHref as "/contact",
    leadImage: toImage(detail.leadImagePath, detail.leadImageAlt, media.lead),
    deliveryRail: toImage(
      detail.deliveryRailImagePath,
      detail.deliveryRailImageAlt,
      media.railPhoto,
      detail.deliveryRailTileTitle,
      detail.deliveryRailTileCaption,
    ),
    pairA: toPair(detail.pairA, media.pairA),
    pairB: toPair(detail.pairB, media.pairB),
    principles: detail.principles,
    relatedHeading: detail.relatedHeading,
    relatedIntro: detail.relatedIntro,
    related: relatedLinks(detail.relatedSlugs, catalog),
  };
}
