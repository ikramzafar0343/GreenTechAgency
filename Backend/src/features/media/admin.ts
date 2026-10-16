import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { mediaAsset } from "../../db/schema/media.js";
import { writeAudit } from "../../content/audit.js";
import { AppError } from "../../http/errors.js";
import {
  DEFAULT_LIST_LIMIT,
  MAX_LIST_LIMIT,
  type ListQuery,
} from "../../http/pagination.js";

const SITE_STATIC_MIMES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function mediaDto(row: typeof mediaAsset.$inferSelect) {
  return {
    id: row.id,
    storageKind: row.storageKind,
    objectKey: row.objectKey,
    mime: row.mime,
    byteSize: row.byteSize,
    width: row.width,
    height: row.height,
    alt: row.alt,
    decorative: row.decorative,
    visibility: row.visibility,
    createdBy: row.createdBy,
    createdAt: row.createdAt.toISOString(),
  };
}

function parseMediaListQuery(query: Record<string, unknown>): ListQuery {
  const limitRaw = Number(query.limit ?? DEFAULT_LIST_LIMIT);
  const offsetRaw = Number(query.offset ?? 0);
  if (
    !Number.isInteger(limitRaw) ||
    limitRaw < 1 ||
    limitRaw > MAX_LIST_LIMIT
  ) {
    throw new AppError(
      "VALIDATION",
      `limit must be an integer from 1 to ${MAX_LIST_LIMIT}`,
    );
  }
  if (!Number.isInteger(offsetRaw) || offsetRaw < 0) {
    throw new AppError("VALIDATION", "offset must be a non-negative integer");
  }
  return { limit: limitRaw, offset: offsetRaw, q: null, status: null };
}

function assertSiteStaticMime(mime: unknown): string {
  if (typeof mime !== "string" || !SITE_STATIC_MIMES.has(mime)) {
    throw new AppError(
      "VALIDATION",
      "mime must be image/jpeg, image/png, image/webp, or image/gif",
    );
  }
  return mime;
}

function assertSiteStaticPath(path: unknown): string {
  if (typeof path !== "string" || !path.startsWith("/") || path.includes("//")) {
    throw new AppError(
      "VALIDATION",
      "path must be an absolute site path starting with /",
    );
  }
  if (path.length > 500) {
    throw new AppError("VALIDATION", "path is too long");
  }
  return path;
}

export async function listMedia(query: Record<string, unknown>) {
  const parsed = parseMediaListQuery(query);
  const db = getDb();
  const rows = await db
    .select()
    .from(mediaAsset)
    .orderBy(desc(mediaAsset.createdAt))
    .limit(parsed.limit)
    .offset(parsed.offset);
  return {
    items: rows.map(mediaDto),
    limit: parsed.limit,
    offset: parsed.offset,
  };
}

export async function registerSiteStaticMedia(
  actorId: string,
  body: Record<string, unknown>,
) {
  const objectKey = assertSiteStaticPath(body.path ?? body.objectKey);
  const mime = assertSiteStaticMime(body.mime);
  const alt = typeof body.alt === "string" ? body.alt.slice(0, 500) : "";
  const decorative = Boolean(body.decorative);
  const db = getDb();
  const id = randomUUID();
  await db.insert(mediaAsset).values({
    id,
    storageKind: "site_static",
    objectKey,
    mime,
    byteSize: null,
    width: null,
    height: null,
    alt,
    decorative,
    visibility: "public",
    createdBy: actorId,
  });
  await writeAudit({
    actorId,
    action: "register_site_static",
    entityType: "media",
    entityId: id,
    result: "ok",
  });
  const rows = await db
    .select()
    .from(mediaAsset)
    .where(eq(mediaAsset.id, id))
    .limit(1);
  return mediaDto(rows[0]!);
}

export async function uploadVpsMedia(
  actorId: string,
  buffer: Buffer,
  meta: { alt?: string; decorative?: boolean; visibility?: "private" | "public" },
) {
  const { writeVpsObject, publicUrlForObjectKey } = await import(
    "./vpsStorage.js"
  );
  const written = await writeVpsObject(buffer);
  const alt = typeof meta.alt === "string" ? meta.alt.slice(0, 500) : "";
  const visibility = meta.visibility === "public" ? "public" : "private";
  const db = getDb();
  const id = randomUUID();
  await db.insert(mediaAsset).values({
    id,
    storageKind: "vps",
    objectKey: written.objectKey,
    mime: written.mime,
    byteSize: written.byteSize,
    width: null,
    height: null,
    alt,
    decorative: Boolean(meta.decorative),
    visibility,
    createdBy: actorId,
  });
  await writeAudit({
    actorId,
    action: "upload_vps",
    entityType: "media",
    entityId: id,
    result: "ok",
  });
  const rows = await db
    .select()
    .from(mediaAsset)
    .where(eq(mediaAsset.id, id))
    .limit(1);
  return {
    ...mediaDto(rows[0]!),
    url: publicUrlForObjectKey(written.objectKey),
  };
}

/**
 * Removes a media row only. Clear content references before deleting shared assets.
 */
export async function deleteMedia(
  actorId: string,
  id: string,
  options?: { force?: boolean },
) {
  const db = getDb();
  const rows = await db.select().from(mediaAsset).where(eq(mediaAsset.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Media asset not found");
  if (row.storageKind === "site_static") {
    if (!options?.force) {
      throw new AppError(
        "VALIDATION",
        "site_static assets require force=true to delete",
      );
    }
  } else if (row.storageKind === "s3" || row.storageKind === "vps") {
    if (row.visibility !== "private" && !options?.force) {
      throw new AppError(
        "VALIDATION",
        "Only private media may be deleted without force=true",
      );
    }
    if (row.storageKind === "vps") {
      const { deleteVpsObject } = await import("./vpsStorage.js");
      await deleteVpsObject(row.objectKey);
    }
  } else {
    throw new AppError("VALIDATION", "Unsupported storage kind");
  }
  await db.delete(mediaAsset).where(eq(mediaAsset.id, id));
  await writeAudit({
    actorId,
    action: "delete",
    entityType: "media",
    entityId: id,
    result: "ok",
  });
  return { ok: true as const };
}
