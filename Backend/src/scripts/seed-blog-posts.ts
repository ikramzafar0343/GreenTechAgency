import { config as loadEnv } from "dotenv";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { eq } from "drizzle-orm";
import { getBackendEnv } from "../config/env.js";
import { getDb } from "../db/client.js";
import { closeAppPool } from "../db/pool.js";
import { blogPost } from "../db/schema/blog.js";
import { assertBlogPublishable, parseBlogDoc } from "../features/blog/docs.js";

loadEnv({ path: ".env.local" });
loadEnv();

type SeedPost = {
  id: string;
  slug: string;
  featured: boolean;
  homepageOrder: number;
  firstPublishedAt: string;
  doc: unknown;
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = join(__dirname, "../../data/import/blog.json");

/**
 * Publishes the GreenTech articles in data/import/blog.json.
 * - New posts are inserted as published.
 * - Existing posts still at version 1 (never edited in the admin) get the new content.
 * - Posts an admin has edited (version > 1) are left alone.
 * Safe to run repeatedly:  npm run content:seed-blog
 */
async function main() {
  getBackendEnv();
  const db = getDb();
  const posts = JSON.parse(readFileSync(SOURCE, "utf8")) as SeedPost[];
  const now = new Date();
  const counts = { inserted: 0, updated: 0, skipped: 0 };

  for (const post of posts) {
    const doc = parseBlogDoc(post.doc);
    assertBlogPublishable(doc);
    const publishedAt = new Date(post.firstPublishedAt);
    const [existing] = await db
      .select({ id: blogPost.id, version: blogPost.version })
      .from(blogPost)
      .where(eq(blogPost.id, post.id))
      .limit(1);

    if (!existing) {
      await db.insert(blogPost).values({
        id: post.id,
        status: "published",
        version: 1,
        featured: post.featured,
        homepageOrder: post.homepageOrder,
        draftSlug: post.slug,
        publishedSlug: post.slug,
        draftDoc: doc,
        publishedDoc: doc,
        createdAt: now,
        updatedAt: now,
        firstPublishedAt: publishedAt,
        publishedUpdatedAt: now,
      });
      counts.inserted += 1;
      console.log(`inserted ${post.slug}`);
      continue;
    }
    if (existing.version > 1) {
      counts.skipped += 1;
      console.log(`skip ${post.slug} (edited in admin, version ${existing.version})`);
      continue;
    }
    await db
      .update(blogPost)
      .set({
        status: "published",
        version: 2,
        draftSlug: post.slug,
        publishedSlug: post.slug,
        draftDoc: doc,
        publishedDoc: doc,
        updatedAt: now,
        publishedUpdatedAt: now,
      })
      .where(eq(blogPost.id, post.id));
    counts.updated += 1;
    console.log(`updated ${post.slug}`);
  }

  console.log(
    `blog seed done: ${counts.inserted} inserted, ${counts.updated} updated, ${counts.skipped} skipped`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeAppPool();
  });
