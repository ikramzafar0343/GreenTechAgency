import { asc, eq } from "drizzle-orm";
import {
  getPublishedTranslationMap,
  mergeLocalizedDoc,
  type ContentLocale,
} from "../../content/translations.js";
import { getDb } from "../../db/client.js";
import { faqItem } from "../../db/schema/siteContent.js";
import type { FaqDoc } from "./docs.js";

export type PublishedFaqItem = {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
};

function publicDto(
  row: typeof faqItem.$inferSelect,
  overlay?: Record<string, unknown>,
): PublishedFaqItem {
  const doc = mergeLocalizedDoc(
    row.publishedDoc as Record<string, unknown>,
    overlay,
  ) as FaqDoc;
  return {
    id: row.id,
    question: doc.question,
    answer: doc.answer,
    displayOrder: row.sortOrder,
  };
}

export async function listPublishedFaqs(
  locale: ContentLocale = "en",
): Promise<PublishedFaqItem[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(faqItem)
    .where(eq(faqItem.status, "published"))
    .orderBy(asc(faqItem.sortOrder));
  const published = rows.filter((r) => r.publishedDoc);
  const translations = await getPublishedTranslationMap(
    "faq_item",
    published.map((r) => r.id),
    locale,
  );
  return published.map((row) =>
    publicDto(row, translations.get(row.id)?.doc),
  );
}
