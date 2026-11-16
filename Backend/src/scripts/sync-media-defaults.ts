import { config as loadEnv } from "dotenv";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import { getBackendEnv } from "../config/env.js";
import { getDb } from "../db/client.js";
import { closeAppPool } from "../db/pool.js";
import { portfolioProject } from "../db/schema/portfolio.js";
import { service } from "../db/schema/services.js";
import { siteDocument } from "../db/schema/siteContent.js";
import {
  upgradePortfolioDoc,
  upgradeServiceDoc,
  upgradeSiteDocument,
} from "./mediaDefaults.js";

loadEnv({ path: ".env.local" });
loadEnv();

type Faq = { id: string; question: string; answer: string };

const FAQ_FILE = join(dirname(fileURLToPath(import.meta.url)), "../../data/import/service-faqs.json");

/** Adds the default FAQs to a service doc only when it has none yet. */
function withDefaultFaqs(doc: Record<string, unknown>, faqs: Faq[] | undefined) {
  const current = doc.faqs;
  if (faqs && (!Array.isArray(current) || current.length === 0)) {
    return { ...doc, faqs };
  }
  return doc;
}

/**
 * One-off, idempotent: points existing CMS rows at the new per-page illustrations
 * and fills empty service FAQ lists (used for the FAQ section and FAQPage schema).
 * Run after deploying the new Frontend/public assets:
 *   npm run content:sync-media
 */
function changed(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) !== JSON.stringify(b);
}

async function main() {
  getBackendEnv();
  const db = getDb();
  const now = new Date();
  let updates = 0;
  const faqsBySlug = JSON.parse(readFileSync(FAQ_FILE, "utf8")) as Record<string, Faq[]>;

  for (const row of await db.select().from(service)) {
    const slug = row.publishedSlug ?? row.draftSlug;
    const faqs = faqsBySlug[slug];
    const draftDoc = withDefaultFaqs(upgradeServiceDoc(slug, row.draftDoc), faqs);
    const publishedDoc = row.publishedDoc
      ? withDefaultFaqs(upgradeServiceDoc(slug, row.publishedDoc), faqs)
      : null;
    if (!changed(draftDoc, row.draftDoc) && !changed(publishedDoc, row.publishedDoc)) continue;
    await db
      .update(service)
      .set({ draftDoc, publishedDoc, version: row.version + 1, updatedAt: now })
      .where(eq(service.id, row.id));
    updates += 1;
    console.log(`service ${slug}: media/FAQ defaults updated`);
  }

  for (const row of await db.select().from(siteDocument)) {
    const draftDoc = upgradeSiteDocument(row.key, row.draftDoc);
    const publishedDoc = row.publishedDoc ? upgradeSiteDocument(row.key, row.publishedDoc) : null;
    if (!changed(draftDoc, row.draftDoc) && !changed(publishedDoc, row.publishedDoc)) continue;
    await db
      .update(siteDocument)
      .set({ draftDoc, publishedDoc, version: row.version + 1, updatedAt: now })
      .where(eq(siteDocument.key, row.key));
    updates += 1;
    console.log(`site document ${row.key}: media updated`);
  }

  for (const row of await db.select().from(portfolioProject)) {
    const draftDoc = upgradePortfolioDoc(row.draftDoc);
    const publishedDoc = row.publishedDoc ? upgradePortfolioDoc(row.publishedDoc) : null;
    if (!changed(draftDoc, row.draftDoc) && !changed(publishedDoc, row.publishedDoc)) continue;
    await db
      .update(portfolioProject)
      .set({ draftDoc, publishedDoc, version: row.version + 1, updatedAt: now })
      .where(eq(portfolioProject.id, row.id));
    updates += 1;
    console.log(`portfolio ${row.draftSlug}: cover updated`);
  }

  console.log(`done: ${updates} row(s) updated`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeAppPool();
  });
