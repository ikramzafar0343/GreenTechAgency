import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import type { AppDatabase } from "../db/client.js";
import {
  faqItem,
  siteDocument,
  statMetric,
  testimonial,
} from "../db/schema/siteContent.js";
import { SITE_DOCUMENT_KEYS } from "../content/constants.js";
import { parseFaqDoc } from "../features/faq/docs.js";
import {
  assertSiteDocumentKey,
  parseSiteDocumentDoc,
} from "../features/siteDocuments/docs.js";
import { parseStatDoc } from "../features/stats/docs.js";
import { parseTestimonialDoc } from "../features/testimonials/docs.js";

const importDir = join(dirname(fileURLToPath(import.meta.url)), "../../data/import");

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(importDir, name), "utf8")) as T;
}

export async function importSiteExtras(
  db: AppDatabase,
  now: Date,
): Promise<void> {
  const faqs = readJson<
    Array<{ id: string; sortOrder: number; doc: unknown }>
  >("faq.json");
  for (const item of faqs) {
    const existing = await db
      .select({ id: faqItem.id })
      .from(faqItem)
      .where(eq(faqItem.id, item.id))
      .limit(1);
    if (existing[0]) {
      console.log(`skip faq ${item.id}`);
      continue;
    }
    const doc = parseFaqDoc(item.doc);
    await db.insert(faqItem).values({
      id: item.id,
      status: "published",
      version: 1,
      sortOrder: item.sortOrder,
      draftDoc: doc,
      publishedDoc: doc,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`imported faq ${item.id}`);
  }

  const testimonials = readJson<
    Array<{
      id: string;
      sortOrder: number;
      featured: boolean;
      doc: unknown;
    }>
  >("testimonials.json");
  for (const item of testimonials) {
    const existing = await db
      .select({ id: testimonial.id })
      .from(testimonial)
      .where(eq(testimonial.id, item.id))
      .limit(1);
    if (existing[0]) {
      console.log(`skip testimonial ${item.id}`);
      continue;
    }
    const doc = parseTestimonialDoc(item.doc);
    await db.insert(testimonial).values({
      id: item.id,
      status: "published",
      version: 1,
      sortOrder: item.sortOrder,
      featured: item.featured,
      draftDoc: doc,
      publishedDoc: doc,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`imported testimonial ${item.id}`);
  }

  const stats = readJson<
    Array<{ id: string; sortOrder: number; doc: unknown }>
  >("stats.json");
  for (const item of stats) {
    const existing = await db
      .select({ id: statMetric.id })
      .from(statMetric)
      .where(eq(statMetric.id, item.id))
      .limit(1);
    if (existing[0]) {
      console.log(`skip stat ${item.id}`);
      continue;
    }
    const doc = parseStatDoc(item.doc);
    await db.insert(statMetric).values({
      id: item.id,
      status: "published",
      version: 1,
      sortOrder: item.sortOrder,
      draftDoc: doc,
      publishedDoc: doc,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`imported stat ${item.id}`);
  }

  for (const name of SITE_DOCUMENT_KEYS) {
    const payload = readJson<unknown>(`${name}.json`);
    const key = assertSiteDocumentKey(name);
    const existing = await db
      .select({ key: siteDocument.key })
      .from(siteDocument)
      .where(eq(siteDocument.key, key))
      .limit(1);
    if (existing[0]) {
      console.log(`skip ${name}`);
      continue;
    }
    const doc = parseSiteDocumentDoc(payload);
    await db.insert(siteDocument).values({
      key,
      version: 1,
      draftDoc: doc,
      publishedDoc: doc,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`imported ${name}`);
  }
}
