import "server-only";

import type { PublicFooterSettings } from "@/features/footer/model/types";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";

export type PublicFooterResult =
  | { ok: true; settings: PublicFooterSettings }
  | { ok: false; error: BackendHttpError };

export async function getPublicFooter(): Promise<PublicFooterResult> {
  try {
    const doc = await backendPublicGet<PublicFooterSettings>("/api/site/footer");
    const year =
      typeof doc.year === "number" && Number.isFinite(doc.year)
        ? doc.year
        : new Date().getFullYear();
    return {
      ok: true,
      settings: {
        ...doc,
        year,
      },
    };
  } catch (err) {
    if (err instanceof BackendHttpError) {
      return { ok: false, error: err };
    }
    throw err;
  }
}
