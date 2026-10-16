import "server-only";

import type {
  ImpactCardData,
  ImpactMadeVisibleContent,
} from "@/features/impact/model/impactTypes";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";
import { resolveMediaUrl } from "@/server/backend/resolveMediaUrl";

export type PublicImpactResult =
  | { ok: true; data: ImpactMadeVisibleContent }
  | { ok: false; notPublished: true }
  | { ok: false; error: BackendHttpError };

function mapCard(card: ImpactCardData): ImpactCardData {
  if (card.kind !== "image") {
    return card;
  }
  const resolved = resolveMediaUrl(card.image.src) ?? card.image.src;
  return {
    ...card,
    image: {
      ...card.image,
      src: resolved,
      tileTitle: card.image.tileTitle?.trim() || "Delivery",
      tileCaption: card.image.tileCaption?.trim() || "EDITORIAL DEMO",
    },
  };
}

export async function getPublicImpact(): Promise<PublicImpactResult> {
  try {
    const data = await backendPublicGet<ImpactMadeVisibleContent>(
      "/api/site/impact",
    );
    return {
      ok: true,
      data: {
        ...data,
        cards: data.cards.map(mapCard),
      },
    };
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
