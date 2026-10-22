import { ICON_ALLOWLIST, type IconName } from "../../content/constants.js";
import {
  assertNonEmptyString,
  assertSlug,
  optionalString,
} from "../../content/slug.js";
import {
  assertSafeHref,
  parseRichDoc,
  type RichBlock,
} from "../../content/richText.js";
import { AppError } from "../../http/errors.js";

export type ServiceBlock = { id: string; title: string; body: string };

export type ServicePairImage = {
  path: string | null;
  alt: string;
  width: number | null;
  height: number | null;
  tileTitle: string;
  tileCaption: string;
};

export type ServicePhotoPair = {
  left: ServicePairImage;
  right: ServicePairImage;
};

export type ServiceDoc = {
  title: string;
  label: string;
  shortDescription: string;
  detailedContent: RichBlock[];
  iconName: IconName | null;
  cardImagePath: string | null;
  cardImageAlt: string;
  heroHeadline: string;
  heroIntro: string;
  storyLabel: string;
  storyParagraphs: string[];
  storyCtaLabel: string;
  storyCtaHref: string;
  leadImagePath: string | null;
  leadImageAlt: string;
  deliveryRailImagePath: string | null;
  deliveryRailImageAlt: string;
  deliveryRailTileTitle: string;
  deliveryRailTileCaption: string;
  pairA: ServicePhotoPair;
  pairB: ServicePhotoPair;
  principles: ServiceBlock[];
  benefits: ServiceBlock[];
  processSteps: ServiceBlock[];
  faqs: Array<{ id: string; question: string; answer: string }>;
  relatedHeading: string;
  relatedIntro: string;
  relatedSlugs: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
};

function parseBlocks(value: unknown, field: string): ServiceBlock[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 40) {
    throw new AppError("VALIDATION", `${field} must be an array (max 40)`);
  }
  return value.map((item, i) => {
    const row = item as Record<string, unknown>;
    return {
      id: assertNonEmptyString(row.id ?? `b-${i}`, `${field}[${i}].id`, 80),
      title: assertNonEmptyString(row.title, `${field}[${i}].title`, 200),
      body: assertNonEmptyString(row.body, `${field}[${i}].body`, 4000),
    };
  });
}

function parseFaqs(value: unknown) {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 40) {
    throw new AppError("VALIDATION", "faqs must be an array (max 40)");
  }
  return value.map((item, i) => {
    const row = item as Record<string, unknown>;
    return {
      id: assertNonEmptyString(row.id ?? `f-${i}`, `faqs[${i}].id`, 80),
      question: assertNonEmptyString(row.question, `faqs[${i}].question`, 400),
      answer: assertNonEmptyString(row.answer, `faqs[${i}].answer`, 4000),
    };
  });
}

function parsePairImage(
  value: unknown,
  field: string,
  defaults: { tileTitle: string; tileCaption: string },
): ServicePairImage {
  if (!value || typeof value !== "object") {
    return {
      path: null,
      alt: "",
      width: null,
      height: null,
      tileTitle: defaults.tileTitle,
      tileCaption: defaults.tileCaption,
    };
  }
  const row = value as Record<string, unknown>;
  const widthRaw = row.width;
  const heightRaw = row.height;
  const width =
    typeof widthRaw === "number" && Number.isFinite(widthRaw)
      ? Math.round(widthRaw)
      : null;
  const height =
    typeof heightRaw === "number" && Number.isFinite(heightRaw)
      ? Math.round(heightRaw)
      : null;
  return {
    path: optionalString(row.path ?? row.src, `${field}.path`, 500),
    alt: optionalString(row.alt, `${field}.alt`, 300) ?? "",
    width,
    height,
    tileTitle:
      optionalString(row.tileTitle, `${field}.tileTitle`, 80) ??
      defaults.tileTitle,
    tileCaption:
      optionalString(row.tileCaption, `${field}.tileCaption`, 80) ??
      defaults.tileCaption,
  };
}

function parsePhotoPair(
  value: unknown,
  field: string,
  defaults: {
    left: { tileTitle: string; tileCaption: string };
    right: { tileTitle: string; tileCaption: string };
  },
): ServicePhotoPair {
  const row =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  return {
    left: parsePairImage(row.left, `${field}.left`, defaults.left),
    right: parsePairImage(row.right, `${field}.right`, defaults.right),
  };
}

export function parseServiceDoc(input: unknown): ServiceDoc {
  if (!input || typeof input !== "object") {
    throw new AppError("VALIDATION", "Invalid service document");
  }
  const row = input as Record<string, unknown>;
  const iconRaw = optionalString(row.iconName, "iconName", 40);
  const iconName =
    iconRaw === null
      ? null
      : (ICON_ALLOWLIST as readonly string[]).includes(iconRaw)
        ? (iconRaw as IconName)
        : (() => {
            throw new AppError("VALIDATION", "iconName is not in allowlist");
          })();

  const storyParagraphs = Array.isArray(row.storyParagraphs)
    ? row.storyParagraphs.map((p, i) =>
        assertNonEmptyString(p, `storyParagraphs[${i}]`, 4000),
      )
    : [];
  if (storyParagraphs.length > 20) {
    throw new AppError("VALIDATION", "storyParagraphs exceeds limit");
  }

  const relatedSlugs = Array.isArray(row.relatedSlugs)
    ? row.relatedSlugs.map((s, i) => assertSlug(s, `relatedSlugs[${i}]`))
    : [];
  if (relatedSlugs.length > 12) {
    throw new AppError("VALIDATION", "relatedSlugs exceeds limit");
  }

  const detailedContent = Array.isArray(row.detailedContent)
    ? parseRichDoc(row.detailedContent)
    : storyParagraphs.map((text) => ({ type: "paragraph" as const, text }));

  const ctaHref = optionalString(row.ctaHref, "ctaHref", 500);
  const storyCtaHref = optionalString(row.storyCtaHref, "storyCtaHref", 500) ?? "/contact";

  return {
    title: assertNonEmptyString(row.title, "title", 200),
    label: assertNonEmptyString(row.label ?? row.title, "label", 200),
    shortDescription: assertNonEmptyString(
      row.shortDescription,
      "shortDescription",
      600,
    ),
    detailedContent,
    iconName,
    cardImagePath: optionalString(row.cardImagePath, "cardImagePath", 500),
    cardImageAlt: optionalString(row.cardImageAlt, "cardImageAlt", 300) ?? "",
    heroHeadline: assertNonEmptyString(
      row.heroHeadline ?? row.title,
      "heroHeadline",
      300,
    ),
    heroIntro: assertNonEmptyString(
      row.heroIntro ?? row.shortDescription,
      "heroIntro",
      1000,
    ),
    storyLabel: optionalString(row.storyLabel, "storyLabel", 200) ?? "Overview",
    storyParagraphs,
    storyCtaLabel:
      optionalString(row.storyCtaLabel, "storyCtaLabel", 120) ?? "Contact us",
    storyCtaHref: assertSafeHref(storyCtaHref),
    leadImagePath: optionalString(row.leadImagePath, "leadImagePath", 500),
    leadImageAlt: optionalString(row.leadImageAlt, "leadImageAlt", 300) ?? "",
    deliveryRailImagePath: optionalString(
      row.deliveryRailImagePath,
      "deliveryRailImagePath",
      500,
    ),
    deliveryRailImageAlt:
      optionalString(row.deliveryRailImageAlt, "deliveryRailImageAlt", 300) ??
      "",
    deliveryRailTileTitle:
      optionalString(row.deliveryRailTileTitle, "deliveryRailTileTitle", 80) ??
      "Delivery",
    deliveryRailTileCaption:
      optionalString(
        row.deliveryRailTileCaption,
        "deliveryRailTileCaption",
        80,
      ) ?? "",
    pairA: parsePhotoPair(row.pairA, "pairA", {
      left: { tileTitle: "Discussion", tileCaption: "" },
      right: { tileTitle: "Detail", tileCaption: "" },
    }),
    pairB: parsePhotoPair(row.pairB, "pairB", {
      left: { tileTitle: "Craft", tileCaption: "" },
      right: { tileTitle: "Collaborate", tileCaption: "" },
    }),
    principles: parseBlocks(row.principles, "principles"),
    benefits: parseBlocks(row.benefits, "benefits"),
    processSteps: parseBlocks(row.processSteps, "processSteps"),
    faqs: parseFaqs(row.faqs),
    relatedHeading:
      optionalString(row.relatedHeading, "relatedHeading", 200) ??
      "Related services",
    relatedIntro: optionalString(row.relatedIntro, "relatedIntro", 600) ?? "",
    relatedSlugs,
    seoTitle: optionalString(row.seoTitle, "seoTitle", 200),
    seoDescription: optionalString(row.seoDescription, "seoDescription", 400),
    ctaLabel: optionalString(row.ctaLabel, "ctaLabel", 120),
    ctaHref: ctaHref ? assertSafeHref(ctaHref) : null,
  };
}

export function assertServicePublishable(doc: ServiceDoc, slug: string): void {
  assertSlug(slug);
  assertNonEmptyString(doc.title, "title");
  assertNonEmptyString(doc.shortDescription, "shortDescription");
  assertNonEmptyString(doc.heroHeadline, "heroHeadline");
  assertNonEmptyString(doc.heroIntro, "heroIntro");
}
