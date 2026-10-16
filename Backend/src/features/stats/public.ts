import { asc, eq } from "drizzle-orm";
import {
  getPublishedTranslationDoc,
  getPublishedTranslationMap,
  mergeLocalizedDoc,
  type ContentLocale,
} from "../../content/translations.js";
import { getDb } from "../../db/client.js";
import { sectionSetting } from "../../db/schema/sections.js";
import { statMetric } from "../../db/schema/siteContent.js";
import type { SectionDoc } from "../sections/docs.js";
import type { StatDoc } from "./docs.js";

export const DEFAULT_STATS_HEADING = "Results that stay measurable";

export type PublishedStatMetric = {
  id: string;
  metricType: StatDoc["metricType"];
  preset: StatDoc["preset"];
  value: number;
  prefix: string | null;
  suffix: string | null;
  label: string;
  emphasisWord: string | null;
  displayOrder: number;
};

function metricDto(
  row: typeof statMetric.$inferSelect,
  overlay?: Record<string, unknown>,
): PublishedStatMetric {
  const doc = mergeLocalizedDoc(
    row.publishedDoc as Record<string, unknown>,
    overlay,
  ) as StatDoc;
  return {
    id: row.id,
    metricType: doc.metricType,
    preset: doc.preset,
    value: doc.value,
    prefix: doc.prefix,
    suffix: doc.suffix,
    label: doc.label,
    emphasisWord: doc.emphasisWord,
    displayOrder: row.sortOrder,
  };
}

async function listPublishedStatMetrics(
  locale: ContentLocale,
): Promise<PublishedStatMetric[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(statMetric)
    .where(eq(statMetric.status, "published"))
    .orderBy(asc(statMetric.sortOrder));
  const published = rows.filter((r) => r.publishedDoc);
  const translations = await getPublishedTranslationMap(
    "stat_metric",
    published.map((r) => r.id),
    locale,
  );
  return published.map((row) =>
    metricDto(row, translations.get(row.id)?.doc),
  );
}

async function resolveStatsHeading(locale: ContentLocale): Promise<string> {
  const db = getDb();
  const rows = await db
    .select()
    .from(sectionSetting)
    .where(eq(sectionSetting.key, "stats"))
    .limit(1);
  const row = rows[0];
  const base = (row?.publishedDoc ?? null) as Record<string, unknown> | null;
  const overlay =
    row && locale !== "en"
      ? await getPublishedTranslationDoc("section_setting", "stats", locale)
      : null;
  const doc = mergeLocalizedDoc(base, overlay) as SectionDoc | Record<
    string,
    never
  >;
  const heading =
    typeof (doc as SectionDoc).heading === "string"
      ? (doc as SectionDoc).heading.trim()
      : "";
  return heading || DEFAULT_STATS_HEADING;
}

export async function getPublishedStatsSection(
  locale: ContentLocale = "en",
) {
  const [heading, metrics] = await Promise.all([
    resolveStatsHeading(locale),
    listPublishedStatMetrics(locale),
  ]);
  return { heading, metrics };
}
