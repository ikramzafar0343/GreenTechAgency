import "server-only";

import { fetchPublishedServices } from "@/features/services/server/fetchPublishedServices";
import { mapBackendServiceDetail } from "@/features/services/server/mapBackendServiceDetail";
import type { PublicServiceDetail } from "@/features/services/model/serviceDetailTypes";
import { BackendHttpError, backendPublicGet } from "@/server/backend/client";
import type { BackendServiceDetail } from "@/server/backend/dtos";

export async function getPublicServiceDetail(
  slug: string,
): Promise<PublicServiceDetail | null> {
  try {
    const [detail, list] = await Promise.all([
      backendPublicGet<BackendServiceDetail>(
        `/api/services/${encodeURIComponent(slug)}`,
      ),
      fetchPublishedServices(),
    ]);
    const catalog = new Map(list.map((item) => [item.slug, item]));
    return mapBackendServiceDetail(detail, catalog);
  } catch (err) {
    if (err instanceof BackendHttpError && err.status === 404) {
      return null;
    }
    throw err;
  }
}
