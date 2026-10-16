import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDb } from "../db/client.js";
import {
  CONTENT_LOCALES,
  contentTranslation,
  type ContentEntityType,
  type ContentLocale,
} from "../db/schema/translations.js";

export function parseContentLocale(raw: unknown): ContentLocale {
  const value = typeof raw === "string" ? raw.trim() : "";
  if ((CONTENT_LOCALES as readonly string[]).includes(value)) {
    return value as ContentLocale;
  }
  return "en";
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Deep-merge localized overlay onto English base.
 * Arrays from the overlay replace base arrays (translated lists).
 */
export function mergeLocalizedDoc(
  base: Record<string, unknown> | null | undefined,
  overlay: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
  const source = base && typeof base === "object" ? { ...base } : {};
  if (!overlay || typeof overlay !== "object") {
    return source;
  }

  const out: Record<string, unknown> = { ...source };
  for (const [key, value] of Object.entries(overlay)) {
    if (value === undefined) continue;
    const current = out[key];
    if (Array.isArray(value)) {
      out[key] = value;
    } else if (isPlainObject(value) && isPlainObject(current)) {
      out[key] = mergeLocalizedDoc(current, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export async function getPublishedTranslationMap(
  entityType: ContentEntityType,
  entityIds: readonly string[],
  locale: ContentLocale,
): Promise<Map<string, { doc: Record<string, unknown>; slug: string | null }>> {
  const map = new Map<
    string,
    { doc: Record<string, unknown>; slug: string | null }
  >();
  if (locale === "en" || entityIds.length === 0) {
    return map;
  }
  const db = getDb();
  const rows = await db
    .select()
    .from(contentTranslation)
    .where(
      and(
        eq(contentTranslation.entityType, entityType),
        eq(contentTranslation.locale, locale),
        eq(contentTranslation.publicationStatus, "published"),
        inArray(contentTranslation.entityId, [...entityIds]),
      ),
    );
  for (const row of rows) {
    map.set(row.entityId, {
      doc: (row.doc ?? {}) as Record<string, unknown>,
      slug: row.slug,
    });
  }
  return map;
}

export async function getPublishedTranslationDoc(
  entityType: ContentEntityType,
  entityId: string,
  locale: ContentLocale,
): Promise<Record<string, unknown> | null> {
  const map = await getPublishedTranslationMap(entityType, [entityId], locale);
  return map.get(entityId)?.doc ?? null;
}

export async function upsertPublishedTranslation(input: {
  entityType: ContentEntityType;
  entityId: string;
  locale: ContentLocale;
  doc: Record<string, unknown>;
  slug?: string | null;
}) {
  const db = getDb();
  const now = new Date();
  const existing = await db
    .select({ id: contentTranslation.id })
    .from(contentTranslation)
    .where(
      and(
        eq(contentTranslation.entityType, input.entityType),
        eq(contentTranslation.entityId, input.entityId),
        eq(contentTranslation.locale, input.locale),
      ),
    )
    .limit(1);

  if (existing[0]) {
    await db
      .update(contentTranslation)
      .set({
        doc: input.doc,
        slug: input.slug ?? null,
        publicationStatus: "published",
        updatedAt: now,
      })
      .where(eq(contentTranslation.id, existing[0].id));
    return existing[0].id;
  }

  const id = randomUUID();
  await db.insert(contentTranslation).values({
    id,
    entityType: input.entityType,
    entityId: input.entityId,
    locale: input.locale,
    slug: input.slug ?? null,
    doc: input.doc,
    publicationStatus: "published",
    createdAt: now,
    updatedAt: now,
  });
  return id;
}
