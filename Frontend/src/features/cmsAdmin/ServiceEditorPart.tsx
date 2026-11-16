"use client";

import { type ServiceFormState } from "@/features/cmsAdmin/ServiceEditorForm";
import type { ServiceAdminRow } from "@/features/cmsAdmin/types";

export function pairSide(
  doc: Record<string, unknown>,
  pairKey: "pairA" | "pairB",
  side: "left" | "right",
  defaults: {
    path: string;
    alt: string;
    title: string;
    caption: string;
  },
) {
  const pair = (doc[pairKey] ?? {}) as Record<string, unknown>;
  const image = (pair[side] ?? {}) as Record<string, unknown>;
  return {
    path: String(image.path ?? image.src ?? defaults.path),
    alt: String(image.alt ?? defaults.alt),
    tileTitle: String(image.tileTitle ?? defaults.title),
    tileCaption: String(image.tileCaption ?? defaults.caption),
  };
}

export function formFromRow(row: ServiceAdminRow): ServiceFormState {
  const doc = row.draftDoc;
  const paragraphs = Array.isArray(doc.storyParagraphs)
    ? (doc.storyParagraphs as string[]).join("\n")
    : "";
  const principles = Array.isArray(doc.principles)
    ? (doc.principles as Array<{ title?: string; body?: string }>)
        .map((item) => `${item.title ?? ""}|${item.body ?? ""}`.trim())
        .filter(Boolean)
        .join("\n")
    : "";
  const relatedSlugs = Array.isArray(doc.relatedSlugs)
    ? (doc.relatedSlugs as string[]).join(", ")
    : "";
  const pairALeft = pairSide(doc, "pairA", "left", {
    path: `/services/editorial/${row.draftSlug}/pair-a-left.svg`,
    alt: "Team discussion at a workstation",
    title: "Discovery",
    caption: "GreenTech",
  });
  const pairARight = pairSide(doc, "pairA", "right", {
    path: `/services/editorial/${row.draftSlug}/pair-a-right.svg`,
    alt: "Close detail of interface design work",
    title: "Detail",
    caption: "GreenTech",
  });
  const pairBLeft = pairSide(doc, "pairB", "left", {
    path: `/services/editorial/${row.draftSlug}/pair-b-left.svg`,
    alt: "Craft and environment detail",
    title: "Craft",
    caption: "GreenTech",
  });
  const pairBRight = pairSide(doc, "pairB", "right", {
    path: `/services/editorial/${row.draftSlug}/pair-b-right.svg`,
    alt: "Collaborative working session",
    title: "Collaborate",
    caption: "GreenTech",
  });
  return {
    slug: row.draftSlug,
    title: String(doc.title ?? ""),
    label: String(doc.label ?? doc.title ?? ""),
    shortDescription: String(doc.shortDescription ?? ""),
    heroHeadline: String(doc.heroHeadline ?? doc.title ?? ""),
    heroIntro: String(doc.heroIntro ?? doc.shortDescription ?? ""),
    storyParagraphs: paragraphs,
    storyLabel: String(doc.storyLabel ?? ""),
    storyCtaLabel: String(doc.storyCtaLabel ?? ""),
    storyCtaHref: String(doc.storyCtaHref ?? "/contact"),
    leadImagePath: String(doc.leadImagePath ?? ""),
    leadImageAlt: String(doc.leadImageAlt ?? ""),
    cardImagePath: String(doc.cardImagePath ?? ""),
    cardImageAlt: String(doc.cardImageAlt ?? ""),
    deliveryRailImagePath: String(
      doc.deliveryRailImagePath ?? `/services/editorial/${row.draftSlug}/rail.svg`,
    ),
    deliveryRailImageAlt: String(
      doc.deliveryRailImageAlt ?? "Delivery illustration",
    ),
    deliveryRailTileTitle: String(doc.deliveryRailTileTitle ?? "Delivery"),
    deliveryRailTileCaption: String(
      doc.deliveryRailTileCaption ?? "GreenTech",
    ),
    pairALeftPath: pairALeft.path,
    pairALeftAlt: pairALeft.alt,
    pairALeftTileTitle: pairALeft.tileTitle,
    pairALeftTileCaption: pairALeft.tileCaption,
    pairARightPath: pairARight.path,
    pairARightAlt: pairARight.alt,
    pairARightTileTitle: pairARight.tileTitle,
    pairARightTileCaption: pairARight.tileCaption,
    pairBLeftPath: pairBLeft.path,
    pairBLeftAlt: pairBLeft.alt,
    pairBLeftTileTitle: pairBLeft.tileTitle,
    pairBLeftTileCaption: pairBLeft.tileCaption,
    pairBRightPath: pairBRight.path,
    pairBRightAlt: pairBRight.alt,
    pairBRightTileTitle: pairBRight.tileTitle,
    pairBRightTileCaption: pairBRight.tileCaption,
    principlesText: principles,
    relatedSlugsText: relatedSlugs,
    relatedHeading: String(doc.relatedHeading ?? ""),
    relatedIntro: String(doc.relatedIntro ?? ""),
    seoTitle: String(doc.seoTitle ?? ""),
    seoDescription: String(doc.seoDescription ?? ""),
    featured: row.featured,
    sortOrder: row.sortOrder,
  };
}

export function buildDoc(base: Record<string, unknown>, form: ServiceFormState) {
  const storyParagraphs = form.storyParagraphs
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const principles = form.principlesText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [title, ...rest] = line.split("|");
      return {
        id: `principle-${index + 1}`,
        title: (title ?? "").trim(),
        body: rest.join("|").trim(),
      };
    })
    .filter((item) => item.title && item.body);
  const relatedSlugs = form.relatedSlugsText
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);
  return {
    ...base,
    title: form.title.trim(),
    label: form.label.trim() || form.title.trim(),
    shortDescription: form.shortDescription.trim(),
    heroHeadline: form.heroHeadline.trim() || form.title.trim(),
    heroIntro: form.heroIntro.trim() || form.shortDescription.trim(),
    storyParagraphs,
    storyLabel: form.storyLabel.trim() || `About ${form.title.trim()}`,
    storyCtaLabel: form.storyCtaLabel.trim() || "Talk about your project",
    storyCtaHref: form.storyCtaHref.trim() || "/contact",
    leadImagePath: form.leadImagePath.trim() || null,
    leadImageAlt: form.leadImageAlt.trim(),
    cardImagePath: form.cardImagePath.trim() || null,
    cardImageAlt: form.cardImageAlt.trim(),
    deliveryRailImagePath: form.deliveryRailImagePath.trim() || null,
    deliveryRailImageAlt: form.deliveryRailImageAlt.trim(),
    deliveryRailTileTitle: form.deliveryRailTileTitle.trim() || "Delivery",
    deliveryRailTileCaption:
      form.deliveryRailTileCaption.trim() || "GreenTech",
    pairA: {
      left: {
        path: form.pairALeftPath.trim() || null,
        alt: form.pairALeftAlt.trim(),
        tileTitle: form.pairALeftTileTitle.trim() || "Discussion",
        tileCaption: form.pairALeftTileCaption.trim() || "GreenTech",
      },
      right: {
        path: form.pairARightPath.trim() || null,
        alt: form.pairARightAlt.trim(),
        tileTitle: form.pairARightTileTitle.trim() || "Detail",
        tileCaption: form.pairARightTileCaption.trim() || "GreenTech",
      },
    },
    pairB: {
      left: {
        path: form.pairBLeftPath.trim() || null,
        alt: form.pairBLeftAlt.trim(),
        tileTitle: form.pairBLeftTileTitle.trim() || "Craft",
        tileCaption: form.pairBLeftTileCaption.trim() || "GreenTech",
      },
      right: {
        path: form.pairBRightPath.trim() || null,
        alt: form.pairBRightAlt.trim(),
        tileTitle: form.pairBRightTileTitle.trim() || "Collaborate",
        tileCaption: form.pairBRightTileCaption.trim() || "GreenTech",
      },
    },
    principles,
    relatedSlugs,
    relatedHeading: form.relatedHeading.trim(),
    relatedIntro: form.relatedIntro.trim(),
    seoTitle: form.seoTitle.trim() || null,
    seoDescription: form.seoDescription.trim() || null,
  };
}
