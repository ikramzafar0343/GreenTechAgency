import { eq, and } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { sectionSetting } from "../../db/schema/sections.js";
import { writeAudit } from "../../content/audit.js";
import {
  assertVersionMatch,
  parseExpectedVersion,
} from "../../content/version.js";
import { AppError } from "../../http/errors.js";
import {
  assertSectionKey,
  parseSectionDoc,
  type SectionDoc,
} from "./docs.js";

function adminDto(row: typeof sectionSetting.$inferSelect) {
  return {
    key: row.key,
    version: row.version,
    visible: row.visible,
    draftDoc: row.draftDoc as SectionDoc,
    publishedDoc: (row.publishedDoc as SectionDoc | null) ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getSectionAdmin(keyInput: string) {
  const key = assertSectionKey(keyInput);
  const db = getDb();
  const rows = await db
    .select()
    .from(sectionSetting)
    .where(eq(sectionSetting.key, key))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Section settings not found");
  return adminDto(row);
}

export async function updateSectionAdmin(
  actorId: string,
  keyInput: string,
  body: Record<string, unknown>,
) {
  const key = assertSectionKey(keyInput);
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(sectionSetting)
    .where(eq(sectionSetting.key, key))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Section settings not found");
  assertVersionMatch(expected, row.version);
  const draftDoc =
    body.doc !== undefined
      ? parseSectionDoc(body.doc, key)
      : (row.draftDoc as SectionDoc);
  const visible =
    body.visible !== undefined ? Boolean(body.visible) : row.visible;
  await db
    .update(sectionSetting)
    .set({
      draftDoc,
      visible,
      version: row.version + 1,
      updatedAt: new Date(),
    })
    .where(and(eq(sectionSetting.key, key), eq(sectionSetting.version, expected)));
  await writeAudit({
    actorId,
    action: "update",
    entityType: "section",
    entityId: key,
    result: "ok",
  });
  return getSectionAdmin(key);
}

export async function publishSectionAdmin(
  actorId: string,
  keyInput: string,
  body: Record<string, unknown>,
) {
  const key = assertSectionKey(keyInput);
  const expected = parseExpectedVersion(body);
  const db = getDb();
  const rows = await db
    .select()
    .from(sectionSetting)
    .where(eq(sectionSetting.key, key))
    .limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Section settings not found");
  assertVersionMatch(expected, row.version);
  const doc = parseSectionDoc(row.draftDoc, key);
  const now = new Date();
  await db
    .update(sectionSetting)
    .set({
      publishedDoc: doc,
      version: row.version + 1,
      updatedAt: now,
    })
    .where(and(eq(sectionSetting.key, key), eq(sectionSetting.version, expected)));
  await writeAudit({
    actorId,
    action: "publish",
    entityType: "section",
    entityId: key,
    result: "ok",
  });
  return getSectionAdmin(key);
}
