import "server-only";

import type { BackendListResponse } from "@/server/backend/dtos";

export function parseItemsResponse<T>(payload: BackendListResponse<T> | T[]): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === "object" && Array.isArray(payload.items)) {
    return payload.items;
  }
  return [];
}
