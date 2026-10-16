import { eq } from "drizzle-orm";
import {
  getPublishedTranslationDoc,
  mergeLocalizedDoc,
  type ContentLocale,
} from "../../content/translations.js";
import { getDb } from "../../db/client.js";
import { siteDocument } from "../../db/schema/siteContent.js";
import { AppError } from "../../http/errors.js";
import { assertSiteDocumentKey, type SiteDocumentDoc } from "./docs.js";

export async function getPublishedSiteDocument(
  keyInput: string,
  locale: ContentLocale = "en",
): Promise<SiteDocumentDoc> {
  const key = assertSiteDocumentKey(keyInput);
  const db = getDb();
  const rows = await db
    .select()
    .from(siteDocument)
    .where(eq(siteDocument.key, key))
    .limit(1);
  const row = rows[0];
  if (!row?.publishedDoc) {
    throw new AppError("NOT_FOUND", "Site document is not published");
  }
  const base = row.publishedDoc as Record<string, unknown>;
  if (locale === "en") {
    return base as SiteDocumentDoc;
  }
  const overlay = await getPublishedTranslationDoc(
    "site_document",
    key,
    locale,
  );
  return mergeLocalizedDoc(base, overlay) as SiteDocumentDoc;
}
