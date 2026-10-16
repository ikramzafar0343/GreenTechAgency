import "server-only";

import { backendPublicGet } from "@/server/backend/client";
import type { BackendListResponse, BackendServiceListItem } from "@/server/backend/dtos";
import { parseItemsResponse } from "@/server/backend/parseItemsResponse";

export async function fetchPublishedServices(): Promise<BackendServiceListItem[]> {
  const payload = await backendPublicGet<
    BackendListResponse<BackendServiceListItem> | BackendServiceListItem[]
  >("/api/services");
  return parseItemsResponse(payload);
}
