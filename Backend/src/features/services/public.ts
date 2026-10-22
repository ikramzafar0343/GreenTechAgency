import { and, asc, eq } from "drizzle-orm";
import {
  getPublishedTranslationMap,
  mergeLocalizedDoc,
  type ContentLocale,
} from "../../content/translations.js";
import { getDb } from "../../db/client.js";
import { service, subservice } from "../../db/schema/services.js";
import { AppError } from "../../http/errors.js";
import type { ServiceDoc } from "./docs.js";

function publicServiceDto(
  row: typeof service.$inferSelect,
  overlay?: Record<string, unknown>,
) {
  const doc = mergeLocalizedDoc(
    row.publishedDoc as Record<string, unknown>,
    overlay,
  ) as ServiceDoc;
  return {
    id: row.id,
    slug: row.publishedSlug as string,
    title: doc.title,
    label: doc.label,
    summary: doc.shortDescription,
    shortDescription: doc.shortDescription,
    iconName: doc.iconName,
    cardImagePath: doc.cardImagePath,
    cardImageAlt: doc.cardImageAlt,
    featured: row.featured,
    sortOrder: row.sortOrder,
    seoTitle: doc.seoTitle ?? doc.title,
    seoDescription: doc.seoDescription ?? doc.shortDescription,
    href: `/services/${row.publishedSlug}`,
  };
}

function publicServiceDetailDto(
  row: typeof service.$inferSelect,
  overlay?: Record<string, unknown>,
) {
  const doc = mergeLocalizedDoc(
    row.publishedDoc as Record<string, unknown>,
    overlay,
  ) as ServiceDoc;
  return {
    ...publicServiceDto(row, overlay),
    detailedContent: doc.detailedContent,
    heroHeadline: doc.heroHeadline,
    heroIntro: doc.heroIntro,
    storyLabel: doc.storyLabel,
    storyParagraphs: doc.storyParagraphs,
    storyCtaLabel: doc.storyCtaLabel,
    storyCtaHref: doc.storyCtaHref,
    leadImagePath: doc.leadImagePath,
    leadImageAlt: doc.leadImageAlt,
    deliveryRailImagePath: doc.deliveryRailImagePath ?? null,
    deliveryRailImageAlt: doc.deliveryRailImageAlt ?? "",
    deliveryRailTileTitle: doc.deliveryRailTileTitle ?? "Delivery",
    deliveryRailTileCaption: doc.deliveryRailTileCaption ?? "",
    pairA: doc.pairA ?? null,
    pairB: doc.pairB ?? null,
    principles: doc.principles,
    benefits: doc.benefits,
    processSteps: doc.processSteps,
    faqs: doc.faqs,
    relatedHeading: doc.relatedHeading,
    relatedIntro: doc.relatedIntro,
    relatedSlugs: doc.relatedSlugs,
    ctaLabel: doc.ctaLabel,
    ctaHref: doc.ctaHref,
  };
}

export async function listPublishedServices(
  limit = 50,
  locale: ContentLocale = "en",
) {
  const db = getDb();
  const rows = await db
    .select()
    .from(service)
    .where(eq(service.status, "published"))
    .orderBy(asc(service.sortOrder), asc(service.publishedSlug))
    .limit(Math.min(limit, 50));
  const published = rows.filter((r) => r.publishedSlug && r.publishedDoc);
  const translations = await getPublishedTranslationMap(
    "service",
    published.map((r) => r.id),
    locale,
  );
  return published.map((row) =>
    publicServiceDto(row, translations.get(row.id)?.doc),
  );
}

export async function getPublishedServiceBySlug(
  slug: string,
  locale: ContentLocale = "en",
) {
  const db = getDb();
  const rows = await db
    .select()
    .from(service)
    .where(and(eq(service.status, "published"), eq(service.publishedSlug, slug)))
    .limit(1);
  const row = rows[0];
  if (!row?.publishedDoc) throw new AppError("NOT_FOUND", "Service not found");
  const translations = await getPublishedTranslationMap(
    "service",
    [row.id],
    locale,
  );
  return publicServiceDetailDto(row, translations.get(row.id)?.doc);
}

export async function listPublishedSubservices(
  serviceSlug: string,
  limit = 50,
  locale: ContentLocale = "en",
) {
  const db = getDb();
  const parents = await db
    .select()
    .from(service)
    .where(
      and(eq(service.status, "published"), eq(service.publishedSlug, serviceSlug)),
    )
    .limit(1);
  const parent = parents[0];
  if (!parent) throw new AppError("NOT_FOUND", "Service not found");
  const rows = await db
    .select()
    .from(subservice)
    .where(
      and(
        eq(subservice.serviceId, parent.id),
        eq(subservice.status, "published"),
      ),
    )
    .orderBy(asc(subservice.sortOrder))
    .limit(Math.min(limit, 50));
  const published = rows.filter((r) => r.publishedSlug && r.publishedDoc);
  const translations = await getPublishedTranslationMap(
    "subservice",
    published.map((r) => r.id),
    locale,
  );
  return published.map((r) => {
    const doc = mergeLocalizedDoc(
      r.publishedDoc as Record<string, unknown>,
      translations.get(r.id)?.doc,
    ) as {
      title: string;
      summary: string;
      cardImagePath: string | null;
      cardImageAlt: string;
      seoTitle: string | null;
      seoDescription: string | null;
    };
    return {
      id: r.id,
      slug: r.publishedSlug as string,
      serviceSlug,
      title: doc.title,
      summary: doc.summary,
      cardImagePath: doc.cardImagePath,
      cardImageAlt: doc.cardImageAlt,
      sortOrder: r.sortOrder,
      seoTitle: doc.seoTitle ?? doc.title,
      seoDescription: doc.seoDescription ?? doc.summary,
      href: `/services/${serviceSlug}/${r.publishedSlug}`,
    };
  });
}

export async function getPublishedSubservice(
  serviceSlug: string,
  slug: string,
  locale: ContentLocale = "en",
) {
  const list = await listPublishedSubservices(serviceSlug, 50, locale);
  const summary = list.find((item) => item.slug === slug);
  if (!summary) throw new AppError("NOT_FOUND", "Subservice not found");
  const db = getDb();
  const rows = await db
    .select()
    .from(subservice)
    .where(eq(subservice.id, summary.id))
    .limit(1);
  const row = rows[0];
  if (!row?.publishedDoc) throw new AppError("NOT_FOUND", "Subservice not found");
  const translations = await getPublishedTranslationMap(
    "subservice",
    [row.id],
    locale,
  );
  const doc = mergeLocalizedDoc(
    row.publishedDoc as Record<string, unknown>,
    translations.get(row.id)?.doc,
  ) as {
    title: string;
    summary: string;
    detailedContent: unknown;
    cardImagePath: string | null;
    cardImageAlt: string;
    ctaLabel: string | null;
    ctaHref: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
  };
  return {
    ...summary,
    detailedContent: doc.detailedContent,
    ctaLabel: doc.ctaLabel,
    ctaHref: doc.ctaHref,
  };
}
