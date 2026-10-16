import "server-only";

import {
  backendAdminGet,
  backendAdminMutate,
} from "@/server/backend/client";

/** Ops admin API resource segments (`/api/admin/ops/{resource}`). */
export type OpsResource =
  | "team"
  | "employees"
  | "clients"
  | "projects"
  | "messages"
  | "invoices"
  | "salary-slips"
  | "files"
  | "callbacks"
  | "sales"
  | "leads"
  | "lead-follow-ups"
  | "sales-messages"
  | "site-gallery"
  | "site-principles";

export type OpsMutationRow = {
  id: string;
  status: string;
  version: number;
  payload: Record<string, unknown>;
  clientId?: string | null;
  leadId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export function mapOpsMutationRow(
  row: OpsMutationRow,
): Record<string, unknown> {
  return {
    id: row.id,
    status: row.status,
    version: row.version,
    ...row.payload,
    ...(row.clientId !== undefined ? { clientId: row.clientId } : {}),
    ...(row.leadId !== undefined ? { leadId: row.leadId } : {}),
    updatedAt: row.updatedAt,
    active: row.status === "active",
  };
}

export type OpsMutationLinks = {
  readonly clientId?: string | null;
  readonly leadId?: string | null;
};

function opsBasePath(resource: OpsResource): string {
  return `/api/admin/ops/${resource}`;
}

/** Same contract as browser `cmsAdminFetch` POST create. */
export async function opsCreate(
  resource: OpsResource,
  payload: Record<string, unknown>,
  links: OpsMutationLinks = {},
): Promise<Record<string, unknown>> {
  const body: Record<string, unknown> = { payload };
  if (links.clientId !== undefined) {
    body.clientId = links.clientId;
  }
  if (links.leadId !== undefined) {
    body.leadId = links.leadId;
  }
  const row = await backendAdminMutate<OpsMutationRow>(
    opsBasePath(resource),
    "POST",
    body,
  );
  return mapOpsMutationRow(row);
}

/** Same contract as browser `cmsAdminFetch` PATCH update. */
export async function opsUpdate(
  resource: OpsResource,
  id: string,
  version: number,
  payload: Record<string, unknown>,
  links: OpsMutationLinks = {},
): Promise<Record<string, unknown>> {
  const body: Record<string, unknown> = { version, payload };
  if (links.clientId !== undefined) {
    body.clientId = links.clientId;
  }
  if (links.leadId !== undefined) {
    body.leadId = links.leadId;
  }
  const row = await backendAdminMutate<OpsMutationRow>(
    `${opsBasePath(resource)}/${id}`,
    "PATCH",
    body,
  );
  return mapOpsMutationRow(row);
}

/** Same contract as browser `cmsAdminFetch` POST archive. */
export async function opsGet(
  resource: OpsResource,
  id: string,
): Promise<Record<string, unknown>> {
  const row = await backendAdminGet<OpsMutationRow>(
    `${opsBasePath(resource)}/${id}`,
  );
  return mapOpsMutationRow(row);
}

export async function opsArchive(
  resource: OpsResource,
  id: string,
  version: number,
): Promise<Record<string, unknown>> {
  const row = await backendAdminMutate<OpsMutationRow>(
    `${opsBasePath(resource)}/${id}/archive`,
    "POST",
    { version },
  );
  return mapOpsMutationRow(row);
}
