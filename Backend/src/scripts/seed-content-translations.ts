import { config as loadEnv } from "dotenv";
import { and, eq } from "drizzle-orm";
import { upsertPublishedTranslation } from "../content/translations.js";
import { getDb } from "../db/client.js";
import { blogPost } from "../db/schema/blog.js";
import { portfolioProject } from "../db/schema/portfolio.js";
import { sectionSetting } from "../db/schema/sections.js";
import { service, subservice } from "../db/schema/services.js";
import { faqItem, siteDocument, statMetric, testimonial } from "../db/schema/siteContent.js";
import { closeAppPool } from "../db/pool.js";
import { CONTENT_LOCALES, contentTranslation, type ContentEntityType, type ContentLocale } from "../db/schema/translations.js";
import { TARGETS, FORCE, CONCURRENCY, collectStrings, applyTranslations, buildLocaleMap } from "./seed-content-translationsPart.js";

loadEnv({ path: ".env.local" });
loadEnv();

function sampleTranslatableStrings(doc: unknown, limit = 8): string[] {
  const set = new Set<string>();
  collectStrings(doc, null, set);
  return [...set].filter((s) => s.length > 12).slice(0, limit);
}

async function alreadyPublished(
  entityType: ContentEntityType,
  entityId: string,
  locale: ContentLocale,
  sourceDoc: unknown,
): Promise<boolean> {
  if (FORCE) return false;
  const db = getDb();
  const rows = await db
    .select({
      id: contentTranslation.id,
      doc: contentTranslation.doc,
    })
    .from(contentTranslation)
    .where(
      and(
        eq(contentTranslation.entityType, entityType),
        eq(contentTranslation.entityId, entityId),
        eq(contentTranslation.locale, locale),
        eq(contentTranslation.publicationStatus, "published"),
      ),
    )
    .limit(1);
  if (!rows[0]) return false;

  // Re-seed if overlay still matches English (failed provider / blocked API).
  const sourceSamples = sampleTranslatableStrings(sourceDoc);
  if (sourceSamples.length === 0) return true;
  const overlaySamples = new Set(sampleTranslatableStrings(rows[0].doc));
  const identical = sourceSamples.filter((s) => overlaySamples.has(s)).length;
  if (identical >= Math.ceil(sourceSamples.length * 0.6)) {
    console.log(
      `stale ${entityType} ${entityId} ${locale} (${identical}/${sourceSamples.length} English samples) — re-seeding`,
    );
    return false;
  }
  return true;
}

async function seedEntity(
  entityType: ContentEntityType,
  id: string,
  publishedDoc: unknown,
  label: string,
) {
  if (!publishedDoc || typeof publishedDoc !== "object") return;
  const strings = new Set<string>();
  collectStrings(publishedDoc, null, strings);
  const list = [...strings];

  for (const locale of TARGETS) {
    if (await alreadyPublished(entityType, id, locale, publishedDoc)) {
      console.log(`skip ${entityType} ${label} ${locale}`);
      continue;
    }
    const map = await buildLocaleMap(list, locale);
    const doc = applyTranslations(
      publishedDoc,
      null,
      map,
    ) as Record<string, unknown>;
    await upsertPublishedTranslation({
      entityType,
      entityId: id,
      locale,
      doc,
    });
    console.log(`ok ${entityType} ${label} ${locale} (${list.length} strings)`);
  }
}

type Job = {
  entityType: ContentEntityType;
  id: string;
  doc: unknown;
  label: string;
  priority: number;
};

async function main() {
  const only =
    process.env.SEED_LOCALES?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? null;
  if (only?.length) {
    TARGETS = only.filter(
      (locale): locale is ContentLocale =>
        (CONTENT_LOCALES as readonly string[]).includes(locale) &&
        locale !== "en",
    );
  }

  console.log(
    `Seeding locales: ${TARGETS.join(", ")} (concurrency=${CONCURRENCY}, force=${FORCE})`,
  );
  const db = getDb();

  const [
    services,
    subservices,
    blogs,
    portfolio,
    faqs,
    testimonials,
    stats,
    siteDocs,
    sections,
  ] = await Promise.all([
    db.select().from(service).where(eq(service.status, "published")),
    db.select().from(subservice).where(eq(subservice.status, "published")),
    db.select().from(blogPost).where(eq(blogPost.status, "published")),
    db
      .select()
      .from(portfolioProject)
      .where(eq(portfolioProject.status, "published")),
    db.select().from(faqItem).where(eq(faqItem.status, "published")),
    db.select().from(testimonial).where(eq(testimonial.status, "published")),
    db.select().from(statMetric).where(eq(statMetric.status, "published")),
    db.select().from(siteDocument),
    db.select().from(sectionSetting),
  ]);

  const jobs: Job[] = [];

  for (const row of siteDocs) {
    if (!row.publishedDoc) continue;
    const priority =
      row.key === "hero"
        ? 0
        : row.key === "about"
          ? 2
          : 1;
    jobs.push({
      entityType: "site_document",
      id: row.key,
      doc: row.publishedDoc,
      label: row.key,
      priority,
    });
  }
  for (const row of sections) {
    if (!row.publishedDoc) continue;
    jobs.push({
      entityType: "section_setting",
      id: row.key,
      doc: row.publishedDoc,
      label: row.key,
      priority: 1,
    });
  }
  for (const row of faqs) {
    jobs.push({
      entityType: "faq_item",
      id: row.id,
      doc: row.publishedDoc,
      label: row.id,
      priority: 1,
    });
  }
  for (const row of services) {
    jobs.push({
      entityType: "service",
      id: row.id,
      doc: row.publishedDoc,
      label: row.publishedSlug ?? row.id,
      priority: 3,
    });
  }
  for (const row of subservices) {
    jobs.push({
      entityType: "subservice",
      id: row.id,
      doc: row.publishedDoc,
      label: row.publishedSlug ?? row.id,
      priority: 4,
    });
  }
  for (const row of blogs) {
    jobs.push({
      entityType: "blog_post",
      id: row.id,
      doc: row.publishedDoc,
      label: row.publishedSlug ?? row.id,
      priority: 4,
    });
  }
  for (const row of portfolio) {
    jobs.push({
      entityType: "portfolio_project",
      id: row.id,
      doc: row.publishedDoc,
      label: row.publishedSlug ?? row.id,
      priority: 4,
    });
  }
  for (const row of testimonials) {
    jobs.push({
      entityType: "testimonial",
      id: row.id,
      doc: row.publishedDoc,
      label: row.id,
      priority: 3,
    });
  }
  for (const row of stats) {
    jobs.push({
      entityType: "stat_metric",
      id: row.id,
      doc: row.publishedDoc,
      label: row.id,
      priority: 3,
    });
  }

  jobs.sort((a, b) => a.priority - b.priority || a.label.localeCompare(b.label));

  const onlyKeys = process.env.SEED_KEYS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const skipKeys = new Set(
    (process.env.SEED_SKIP_KEYS || "hero")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
  const filtered = (
    onlyKeys?.length
      ? jobs.filter((j) => onlyKeys.includes(j.label) || onlyKeys.includes(j.id))
      : jobs
  ).filter((j) => !skipKeys.has(j.label) && !skipKeys.has(j.id));

  console.log(`Jobs: ${filtered.length}`);
  for (const job of filtered) {
    await seedEntity(job.entityType, job.id, job.doc, job.label);
  }

  console.log("Content translation seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeAppPool();
  });
