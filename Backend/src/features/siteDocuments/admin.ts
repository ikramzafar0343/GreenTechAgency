import { and, eq } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { siteDocument } from "../../db/schema/siteContent.js";
import { writeAudit } from "../../content/audit.js";
import {
  assertVersionMatch,
  parseExpectedVersion,
} from "../../content/version.js";
import { AppError } from "../../http/errors.js";
import {
  assertSiteDocumentKey,
  parseSiteDocumentDoc,
  type SiteDocumentDoc,
} from "./docs.js";

function adminDto(row: typeof siteDocument.$inferSelect) {
  return {
    key: row.key,
    version: row.version,
    draftDoc: row.draftDoc as SiteDocumentDoc,
    publishedDoc: (row.publishedDoc as SiteDocumentDoc | null) ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getSiteDocumentAdmin(keyInput: string) {
  const key = assertSiteDocumentKey(keyInput);
  const db = getDb();
  const rows = await db
    .select()
    .from(siteDocument)
    .where(eq(siteDocument.key, key))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Site document not found");
  return adminDto(row);
}

export async function updateSiteDocumentAdmin(
  actorId: string,
  keyInput: string,
  body: Record<string, unknown>,
) {
  const key = assertSiteDocumentKey(keyInput);
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(siteDocument)
    .where(eq(siteDocument.key, key))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Site document not found");
  assertVersionMatch(expected, row.version);
  const draftDoc =
    body.doc !== undefined
      ? parseSiteDocumentDoc(body.doc)
      : (row.draftDoc as SiteDocumentDoc);
  await db
    .update(siteDocument)
    .set({
      draftDoc,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(siteDocument.key, key), eq(siteDocument.version, expected)));
  await writeAudit({
    actorId,
    action: "update",
    entityType: "site_document",
    entityId: key,
    result: "ok",
  });
  return getSiteDocumentAdmin(key);
}

export async function publishSiteDocumentAdmin(
  actorId: string,
  keyInput: string,
  body: Record<string, unknown>,
) {
  const key = assertSiteDocumentKey(keyInput);
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(siteDocument)
    .where(eq(siteDocument.key, key))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Site document not found");
  assertVersionMatch(expected, row.version);
  const doc = parseSiteDocumentDoc(row.draftDoc);
  const now = new Date();
  await db
    .update(siteDocument)
    .set({
      publishedDoc: doc,
      version: row.version + 1,
      updatedAt: now,
    })
    .where(and(eq(siteDocument.key, key), eq(siteDocument.version, expected)));
  await writeAudit({
    actorId,
    action: "publish",
    entityType: "site_document",
    entityId: key,
    result: "ok",
  });
  return getSiteDocumentAdmin(key);
}
