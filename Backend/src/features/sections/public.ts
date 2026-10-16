import { eq } from "drizzle-orm";
import {
  getPublishedTranslationDoc,
  mergeLocalizedDoc,
  type ContentLocale,
} from "../../content/translations.js";
import { getDb } from "../../db/client.js";
import { sectionSetting } from "../../db/schema/sections.js";
import { AppError } from "../../http/errors.js";
import { assertSectionKey, type SectionDoc } from "./docs.js";

export type PublishedSectionDto = {
  key: string;
  visible: boolean;
  eyebrow: string | null;
  heading: string;
  introduction: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  featuredIds: string[];
  maxItems: number;
  items: readonly [];
};

export async function getPublishedSection(
  keyInput: string,
  locale: ContentLocale = "en",
): Promise<PublishedSectionDto> {
  const key = assertSectionKey(keyInput);
  const db = getDb();
  const rows = await db
    .select()
    .from(sectionSetting)
    .where(eq(sectionSetting.key, key))
    .limit(1);
  const row = rows[0];
  if (!row?.publishedDoc) {
    throw new AppError("NOT_FOUND", "Section is not published");
  }
  const base = row.publishedDoc as Record<string, unknown>;
  const overlay =
    locale === "en"
      ? null
      : await getPublishedTranslationDoc("section_setting", key, locale);
  const doc = mergeLocalizedDoc(base, overlay) as SectionDoc;
  return {
    key,
    visible: row.visible,
    eyebrow: doc.eyebrow,
    heading: doc.heading,
    introduction: doc.introduction,
    ctaLabel: doc.ctaLabel,
    ctaHref: doc.ctaHref,
    featuredIds: doc.featuredIds,
    maxItems: doc.maxItems,
    items: [],
  };
}
