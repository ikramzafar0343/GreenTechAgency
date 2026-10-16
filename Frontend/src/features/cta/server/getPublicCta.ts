import "server-only";

import type { AstronautCtaContent } from "@/features/cta/model/astronautCtaContent";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";

export type PublicCtaResult =
  | { ok: true; data: AstronautCtaContent }
  | { ok: false; notPublished: true }
  | { ok: false; error: BackendHttpError };

export async function getPublicCta(): Promise<PublicCtaResult> {
  try {
    const data = await backendPublicGet<AstronautCtaContent>("/api/site/cta");
    return { ok: true, data };
  } catch (err) {
    if (err instanceof BackendHttpError && err.status === 404) {
      return { ok: false, notPublished: true };
    }
    if (err instanceof BackendHttpError) {
      return { ok: false, error: err };
    }
    throw err;
  }
}
