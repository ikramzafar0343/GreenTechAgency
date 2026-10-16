import "server-only";

import { backendAdminGet } from "@/server/backend/client";
import {
  mapOpsMutationRow,
  opsArchive,
  opsCreate,
  opsUpdate,
  type OpsMutationRow,
  type OpsResource,
} from "@/lib/portal/opsMutations";

export type OpsListResponse<T> = {
  items: T[];
  total: number;
  limit: number;
  offset: number;
};

export type OpsRecord = OpsMutationRow;

function mapItem(row: OpsRecord): Record<string, unknown> {
  return mapOpsMutationRow(row);
}

export async function listOpsResource(
  path: string,
): Promise<readonly Record<string, unknown>[]> {
  const data = await backendAdminGet<OpsListResponse<OpsRecord>>(
    `/api/admin/ops/${path}?limit=50&offset=0`,
  );
  return data.items.map(mapItem);
}

export async function getOpsOverview(): Promise<Record<string, number>> {
  const data = await backendAdminGet<{ counts: Record<string, number> }>(
    "/api/admin/ops/overview",
  );
  return data.counts;
}

export async function createOpsResource(
  path: string,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  return opsCreate(path as OpsResource, payload);
}

export async function updateOpsResource(
  path: string,
  id: string,
  version: number,
  payload: Record<string, unknown>,
  extra?: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const links = {
    ...(extra?.clientId !== undefined
      ? { clientId: extra.clientId as string | null }
      : {}),
    ...(extra?.leadId !== undefined
      ? { leadId: extra.leadId as string | null }
      : {}),
  };
  return opsUpdate(path as OpsResource, id, version, payload, links);
}

export async function archiveOpsResource(
  path: string,
  id: string,
  version: number,
): Promise<Record<string, unknown>> {
  return opsArchive(path as OpsResource, id, version);
}
