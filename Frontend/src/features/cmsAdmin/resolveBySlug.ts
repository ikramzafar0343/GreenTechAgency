import { cmsAdminFetch } from "@/features/cmsAdmin/api";
import type { CmsAdminEntity, CmsListResponse } from "@/features/cmsAdmin/types";

export async function findAdminEntityBySlug<T extends CmsAdminEntity>(
  apiBase: string,
  slug: string,
): Promise<T | null> {
  const limit = 50;
  let offset = 0;
  for (;;) {
    const page = await cmsAdminFetch<CmsListResponse<T>>(
      `${apiBase}?limit=${limit}&offset=${offset}`,
    );
    const match = page.items.find(
      (item) => item.draftSlug === slug || item.publishedSlug === slug,
    );
    if (match) return match;
    if (offset + page.items.length >= page.total) {
      return null;
    }
    offset += limit;
  }
}
