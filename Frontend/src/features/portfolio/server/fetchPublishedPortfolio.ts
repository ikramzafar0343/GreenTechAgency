import "server-only";

import { backendPublicGet } from "@/server/backend/client";
import type {
  BackendListResponse,
  BackendPortfolioListItem,
} from "@/server/backend/dtos";
import { parseItemsResponse } from "@/server/backend/parseItemsResponse";

export async function fetchPublishedPortfolio(
  limit = 50,
): Promise<BackendPortfolioListItem[]> {
  const payload = await backendPublicGet<
    BackendListResponse<BackendPortfolioListItem> | BackendPortfolioListItem[]
  >(`/api/portfolio?limit=${limit}`);
  return parseItemsResponse(payload);
}
