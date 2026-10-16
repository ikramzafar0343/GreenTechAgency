import { mkdir, writeFile, unlink, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { AppError } from "../../http/errors.js";

const MAX_BYTES = 15_000_000;

const MIME_BY_MAGIC: Array<{ mime: string; ext: string; test: (b: Buffer) => boolean }> = [
  {
    mime: "image/jpeg",
    ext: "jpg",
    test: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mime: "image/png",
    ext: "png",
    test: (b) =>
      b.length >= 8 &&
      b[0] === 0x89 &&
      b[1] === 0x50 &&
      b[2] === 0x4e &&
      b[3] === 0x47,
  },
  {
    mime: "image/gif",
    ext: "gif",
    test: (b) =>
      b.length >= 6 &&
      b[0] === 0x47 &&
      b[1] === 0x49 &&
      b[2] === 0x46 &&
      b[3] === 0x38,
  },
  {
    mime: "image/webp",
    ext: "webp",
    test: (b) =>
      b.length >= 12 &&
      b.toString("ascii", 0, 4) === "RIFF" &&
      b.toString("ascii", 8, 12) === "WEBP",
  },
];

export function getMediaRoot(): string {
  const root = process.env.MEDIA_ROOT?.trim();
  if (!root) {
    throw new AppError(
      "UNAVAILABLE",
      "MEDIA_ROOT is required for VPS media storage",
    );
  }
  return path.resolve(root);
}

export function getMediaPublicBaseUrl(): string {
  const base = process.env.MEDIA_PUBLIC_BASE_URL?.trim();
  if (base) {
    return base.replace(/\/$/, "");
  }
  const port = process.env.PORT?.trim() || "4000";
  return `http://localhost:${port}/media`;
}

export function detectImageMime(buffer: Buffer): { mime: string; ext: string } {
  for (const entry of MIME_BY_MAGIC) {
    if (entry.test(buffer)) {
      return { mime: entry.mime, ext: entry.ext };
    }
  }
  throw new AppError(
    "VALIDATION",
    "File must be a JPEG, PNG, WebP, or GIF image",
  );
}

export async function ensureMediaRoot(): Promise<string> {
  const root = getMediaRoot();
  await mkdir(root, { recursive: true });
  return root;
}

export async function writeVpsObject(
  buffer: Buffer,
): Promise<{ objectKey: string; mime: string; byteSize: number }> {
  if (buffer.length < 1 || buffer.length > MAX_BYTES) {
    throw new AppError(
      "VALIDATION",
      `File size must be 1–${MAX_BYTES} bytes`,
    );
  }
  const { mime, ext } = detectImageMime(buffer);
  const root = await ensureMediaRoot();
  const objectKey = `uploads/${randomUUID()}.${ext}`;
  const fullPath = path.join(root, objectKey);
  await mkdir(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, buffer);
  return { objectKey, mime, byteSize: buffer.length };
}

export function resolveVpsPath(objectKey: string): string {
  if (
    !objectKey ||
    objectKey.includes("..") ||
    objectKey.includes("\\") ||
    path.isAbsolute(objectKey)
  ) {
    throw new AppError("VALIDATION", "Invalid media object key");
  }
  const root = getMediaRoot();
  const full = path.resolve(root, objectKey);
  if (!full.startsWith(path.resolve(root))) {
    throw new AppError("VALIDATION", "Invalid media object key");
  }
  return full;
}

export async function deleteVpsObject(objectKey: string): Promise<void> {
  const full = resolveVpsPath(objectKey);
  try {
    await access(full, constants.F_OK);
    await unlink(full);
  } catch {
    /* missing file is fine */
  }
}

export function publicUrlForObjectKey(objectKey: string): string {
  return `${getMediaPublicBaseUrl()}/${objectKey.replace(/^\/+/, "")}`;
}
