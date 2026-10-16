import "server-only";

import type { AboutPageContent } from "@/features/about/model/aboutPageTypes";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";
import { resolveMediaUrl } from "@/server/backend/resolveMediaUrl";

export type PublicAboutPageResult =
  | { ok: true; content: AboutPageContent }
  | { ok: false; notPublished: true }
  | { ok: false; error: BackendHttpError };

function mapAboutContent(content: AboutPageContent): AboutPageContent {
  const resolvedSrc = resolveMediaUrl(content.groupPortrait.src);
  return {
    ...content,
    groupPortrait: {
      ...content.groupPortrait,
      src: resolvedSrc,
      assetStatus: resolvedSrc ? "ready" : "missing",
    },
  };
}

export async function getPublicAboutPage(): Promise<PublicAboutPageResult> {
  try {
    const content = await backendPublicGet<AboutPageContent>("/api/site/about");
    return { ok: true, content: mapAboutContent(content) };
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
