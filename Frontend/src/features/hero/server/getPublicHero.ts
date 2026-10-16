import "server-only";

import type { HeroContent } from "@/features/hero/model/heroTypes";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";

export type PublicHeroResult =
  | { ok: true; data: HeroContent }
  | { ok: false; notPublished: true }
  | { ok: false; error: BackendHttpError };

export async function getPublicHero(): Promise<PublicHeroResult> {
  try {
    const data = await backendPublicGet<HeroContent>("/api/site/hero");
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
