import "server-only";

import type { ProcessStage } from "@/features/how-we-work/model/processStages";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";

export type HowWeWorkSiteContent = {
  intro: {
    eyebrow: string;
    heading: string;
    introduction: string;
    ctaLabel: string;
    ctaHref: string;
  };
  stages: readonly ProcessStage[];
};

export type PublicHowWeWorkResult =
  | { ok: true; data: HowWeWorkSiteContent }
  | { ok: false; notPublished: true }
  | { ok: false; error: BackendHttpError };

export async function getPublicHowWeWork(): Promise<PublicHowWeWorkResult> {
  try {
    const data = await backendPublicGet<HowWeWorkSiteContent>(
      "/api/site/how_we_work",
    );
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
