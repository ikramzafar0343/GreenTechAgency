import { asc, eq } from "drizzle-orm";
import {
  getPublishedTranslationMap,
  mergeLocalizedDoc,
  type ContentLocale,
} from "../../content/translations.js";
import { getDb } from "../../db/client.js";
import { testimonial } from "../../db/schema/siteContent.js";
import type { TestimonialDoc } from "./docs.js";

export type PublishedTestimonialItem = {
  id: string;
  companyName: string;
  companyLogoUrl: string | null;
  location: string | null;
  reviewerName: string;
  reviewerRole: string | null;
  reviewerPhotoUrl: string | null;
  quote: string;
  emphasisText: string | null;
  rating: number | null;
  ratingScale: number;
  sourceUrl: string | null;
  displayOrder: number;
  featured: boolean;
};

function publicDto(
  row: typeof testimonial.$inferSelect,
  overlay?: Record<string, unknown>,
): PublishedTestimonialItem {
  const doc = mergeLocalizedDoc(
    row.publishedDoc as Record<string, unknown>,
    overlay,
  ) as TestimonialDoc;
  return {
    id: row.id,
    companyName: doc.companyName,
    companyLogoUrl: doc.companyLogoUrl,
    location: doc.location,
    reviewerName: doc.reviewerName,
    reviewerRole: doc.reviewerRole,
    reviewerPhotoUrl: doc.reviewerPhotoUrl,
    quote: doc.quote,
    emphasisText: doc.emphasisText,
    rating: doc.rating,
    ratingScale: doc.ratingScale,
    sourceUrl: doc.sourceUrl,
    displayOrder: row.sortOrder,
    featured: row.featured,
  };
}

export async function listPublishedTestimonials(
  locale: ContentLocale = "en",
): Promise<PublishedTestimonialItem[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(testimonial)
    .where(eq(testimonial.status, "published"))
    .orderBy(asc(testimonial.sortOrder));
  const published = rows.filter((r) => r.publishedDoc);
  const translations = await getPublishedTranslationMap(
    "testimonial",
    published.map((r) => r.id),
    locale,
  );
  return published.map((row) =>
    publicDto(row, translations.get(row.id)?.doc),
  );
}
