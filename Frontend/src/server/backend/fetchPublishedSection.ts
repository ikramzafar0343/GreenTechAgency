import "server-only";

import { BackendHttpError, backendPublicGet } from "@/server/backend/client";
import type { BackendPublishedSection } from "@/server/backend/dtos";

export type PublishedSectionResult =
  | { ok: true; section: BackendPublishedSection }
  | { ok: false; notFound: true }
  | { ok: false; notFound: false; error: BackendHttpError };

export async function fetchPublishedSection(
  key: string,
): Promise<PublishedSectionResult> {
  try {
    const section = await backendPublicGet<BackendPublishedSection>(
      `/api/sections/${encodeURIComponent(key)}`,
    );
    return { ok: true, section };
  } catch (err) {
    if (err instanceof BackendHttpError && err.status === 404) {
      return { ok: false, notFound: true };
    }
    if (err instanceof BackendHttpError) {
      return { ok: false, notFound: false, error: err };
    }
    throw err;
  }
}
