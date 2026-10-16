import { config as loadEnv } from "dotenv";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import { getBackendEnv } from "../config/env.js";
import { getDb } from "../db/client.js";
import { closeAppPool } from "../db/pool.js";
import { blogPost } from "../db/schema/blog.js";
import { portfolioProject } from "../db/schema/portfolio.js";
import { sectionSetting } from "../db/schema/sections.js";
import { service } from "../db/schema/services.js";
import { parseBlogDoc } from "../features/blog/docs.js";
import { parsePortfolioDoc } from "../features/portfolio/docs.js";
import {
  assertSectionKey,
  parseSectionDoc,
} from "../features/sections/docs.js";
import { parseServiceDoc } from "../features/services/docs.js";
import { importSiteExtras } from "./importSiteExtras.js";

loadEnv({ path: ".env.local" });
loadEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const importDir = join(__dirname, "../../data/import");

function readJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(importDir, name), "utf8")) as T;
}

async function main() {
  getBackendEnv();
  const db = getDb();
  const now = new Date();

  const services = readJson<
    Array<{
      id: string;
      slug: string;
      sortOrder: number;
      featured: boolean;
      doc: unknown;
    }>
  >("services.json");

  for (const item of services) {
    const existing = await db
      .select({ id: service.id, version: service.version })
      .from(service)
      .where(eq(service.id, item.id))
      .limit(1);
    if (existing[0]) {
      if (existing[0].version > 1) {
        console.log(`skip service ${item.id} (admin-edited version)`);
        continue;
      }
      console.log(`skip service ${item.id} (already imported)`);
      continue;
    }
    const doc = parseServiceDoc(item.doc);
    await db.insert(service).values({
      id: item.id,
      status: "published",
      version: 1,
      sortOrder: item.sortOrder,
      featured: item.featured,
      draftSlug: item.slug,
      publishedSlug: item.slug,
      draftDoc: doc,
      publishedDoc: doc,
      createdAt: now,
      updatedAt: now,
      firstPublishedAt: now,
      publishedUpdatedAt: now,
    });
    console.log(`imported service ${item.slug}`);
  }

  const posts = readJson<
    Array<{
      id: string;
      slug: string;
      featured: boolean;
      homepageOrder: number;
      firstPublishedAt: string | null;
      doc: unknown;
    }>
  >("blog.json");

  for (const item of posts) {
    const existing = await db
      .select({ id: blogPost.id, version: blogPost.version })
      .from(blogPost)
      .where(eq(blogPost.id, item.id))
      .limit(1);
    if (existing[0]) {
      console.log(`skip blog ${item.id}`);
      continue;
    }
    const doc = parseBlogDoc(item.doc);
    const publishedAt = item.firstPublishedAt
      ? new Date(item.firstPublishedAt)
      : now;
    await db.insert(blogPost).values({
      id: item.id,
      status: "published",
      version: 1,
      featured: item.featured,
      homepageOrder: item.homepageOrder,
      draftSlug: item.slug,
      publishedSlug: item.slug,
      draftDoc: doc,
      publishedDoc: doc,
      createdAt: now,
      updatedAt: now,
      firstPublishedAt: publishedAt,
      publishedUpdatedAt: publishedAt,
    });
    console.log(`imported blog ${item.slug}`);
  }

  const projects = readJson<
    Array<{
      id: string;
      slug: string;
      sortOrder: number;
      featured: boolean;
      doc: unknown;
    }>
  >("portfolio.json");

  for (const item of projects) {
    const existing = await db
      .select({ id: portfolioProject.id, version: portfolioProject.version })
      .from(portfolioProject)
      .where(eq(portfolioProject.id, item.id))
      .limit(1);
    if (existing[0]) {
      console.log(`skip portfolio ${item.id}`);
      continue;
    }
    const doc = parsePortfolioDoc(item.doc);
    await db.insert(portfolioProject).values({
      id: item.id,
      status: "published",
      version: 1,
      sortOrder: item.sortOrder,
      featured: item.featured,
      draftSlug: item.slug,
      publishedSlug: item.slug,
      draftDoc: doc,
      publishedDoc: doc,
      createdAt: now,
      updatedAt: now,
      firstPublishedAt: now,
      publishedUpdatedAt: now,
    });
    console.log(`imported portfolio ${item.slug}`);
  }

  const sections = readJson<
    Array<{ key: string; visible: boolean; doc: unknown }>
  >("sections.json");

  for (const item of sections) {
    const key = assertSectionKey(item.key);
    const existing = await db
      .select({ key: sectionSetting.key, version: sectionSetting.version })
      .from(sectionSetting)
      .where(eq(sectionSetting.key, key))
      .limit(1);
    if (existing[0]) {
      console.log(`skip section ${key}`);
      continue;
    }
    const doc = parseSectionDoc(item.doc, key);
    await db.insert(sectionSetting).values({
      key,
      version: 1,
      visible: item.visible,
      draftDoc: doc,
      publishedDoc: doc,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`imported section ${key}`);
  }

  await importSiteExtras(db, now);
  console.log("Import complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeAppPool();
  });
