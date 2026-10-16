import "server-only";

import { backendPublicGet } from "@/server/backend/client";
import type { BackendBlogListItem, BackendListResponse } from "@/server/backend/dtos";
import { parseItemsResponse } from "@/server/backend/parseItemsResponse";

export async function fetchPublishedBlog(
  limit = 50,
): Promise<BackendBlogListItem[]> {
  const payload = await backendPublicGet<
    BackendListResponse<BackendBlogListItem> | BackendBlogListItem[]
  >(`/api/blog?limit=${limit}`);
  return parseItemsResponse(payload);
}
