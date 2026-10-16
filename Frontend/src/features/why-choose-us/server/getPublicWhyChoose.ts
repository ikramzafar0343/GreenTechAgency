import "server-only";

import type {
  WhyChooseCard,
  WhyChooseImage,
} from "@/features/why-choose-us/model/whyChooseContent";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";

export type WhyChooseSiteContent = {
  intro: {
    eyebrow: string;
    heading?: string;
    support: string;
  };
  cards: readonly WhyChooseCard[];
  media: {
    largeImage: WhyChooseImage;
    smallImage: WhyChooseImage;
  };
};

export type PublicWhyChooseResult =
  | { ok: true; data: WhyChooseSiteContent }
  | { ok: false; notPublished: true }
  | { ok: false; error: BackendHttpError };

export async function getPublicWhyChoose(): Promise<PublicWhyChooseResult> {
  try {
    const data = await backendPublicGet<WhyChooseSiteContent>(
      "/api/site/why_choose",
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
