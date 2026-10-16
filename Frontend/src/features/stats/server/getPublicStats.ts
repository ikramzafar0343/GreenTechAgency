import "server-only";

import { STATS_CONTENT } from "@/features/stats/model/statsContent";
import type { PublicStatsSection } from "@/features/stats/model/types";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";
import type { BackendStatsPayload } from "@/server/backend/dtos";
import { fetchPublishedSection } from "@/server/backend/fetchPublishedSection";

export type PublicStatsSectionState =
  | { kind: "hidden" }
  | { kind: "ready"; data: PublicStatsSection }
  | { kind: "error"; message: string };

const UI_DEFAULTS = STATS_CONTENT;

export async function getPublicStatsSection(): Promise<PublicStatsSectionState> {
  const sectionResult = await fetchPublishedSection("stats");
  if (!sectionResult.ok) {
    if (sectionResult.notFound) {
      return { kind: "hidden" };
    }
    return { kind: "error", message: sectionResult.error.message };
  }

  if (!sectionResult.section.visible) {
    return { kind: "hidden" };
  }

  let payload: BackendStatsPayload;
  try {
    payload = await backendPublicGet<BackendStatsPayload>("/api/stats");
  } catch (err) {
    const message =
      err instanceof BackendHttpError
        ? err.message
        : "Stats could not be loaded.";
    return { kind: "error", message };
  }

  const metrics = payload.metrics ?? [];
  if (metrics.length === 0) {
    return { kind: "hidden" };
  }

  return {
    kind: "ready",
    data: {
      heading: payload.heading?.trim() || UI_DEFAULTS.heading,
      entryAnimationEnabled: UI_DEFAULTS.entryAnimationEnabled,
      countUpEnabled: UI_DEFAULTS.countUpEnabled,
      homepageOrder: UI_DEFAULTS.homepageOrder,
      metrics,
    },
  };
}

/** @deprecated Prefer getPublicStatsSection for homepage visibility and error rules. */
export async function getPublicStats(): Promise<PublicStatsSection | null> {
  const state = await getPublicStatsSection();
  if (state.kind === "ready") {
    return state.data;
  }
  return null;
}
