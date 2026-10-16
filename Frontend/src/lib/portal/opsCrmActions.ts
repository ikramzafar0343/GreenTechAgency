"use server";

import { cast, resolveOpsVersion, tryData, tryOk } from "./opsActionHelpers";
import { opsArchive, opsCreate, opsGet, opsUpdate } from "./opsMutations";
import type {
  AdminLead,
  AdminLeadFollowUp,
  AdminSale,
  AdminSalesMessage,
  SaleStatus,
} from "./types";

export async function createSaleSheetAction(input: Record<string, unknown>) {
  return tryData(async () => cast<AdminSale>(await opsCreate("sales", input)));
}

export async function updateSaleSheetAction(
  input: Record<string, unknown> & { id: string; version: number },
) {
  const { id, version, ...payload } = input;
  return tryData(async () =>
    cast<AdminSale>(await opsUpdate("sales", id, version, payload)),
  );
}

export async function archiveSaleAction(input: {
  id: string;
  version?: number;
}) {
  return tryOk(async () => {
    const version = await resolveOpsVersion("sales", input.id, input.version);
    await opsArchive("sales", input.id, version);
  });
}

export async function changeSaleStatusAction(input: {
  id: string;
  statusCode: SaleStatus;
  version?: number;
}) {
  return tryData(async () => {
    const version = await resolveOpsVersion("sales", input.id, input.version);
    return cast<AdminSale>(
      await opsUpdate("sales", input.id, version, {
        status: input.statusCode,
      }),
    );
  });
}

export async function createLeadAction(input: Record<string, unknown>) {
  return tryData(async () => cast<AdminLead>(await opsCreate("leads", input)));
}

export async function updateLeadAction(
  input: Record<string, unknown> & { id: string; version: number },
) {
  const { id, version, ...payload } = input;
  return tryData(async () =>
    cast<AdminLead>(await opsUpdate("leads", id, version, payload)),
  );
}

export async function archiveLeadAction(input: { id: string; version?: number }) {
  return tryOk(async () => {
    const version = await resolveOpsVersion("leads", input.id, input.version);
    await opsArchive("leads", input.id, version);
  });
}

export async function changeLeadStatusAction(input: {
  id: string;
  statusCode: AdminLead["status"];
  version?: number;
}) {
  return tryData(async () => {
    const version = await resolveOpsVersion("leads", input.id, input.version);
    return cast<AdminLead>(
      await opsUpdate("leads", input.id, version, {
        status: input.statusCode,
      }),
    );
  });
}

export async function createLeadFollowUpAction(input: Record<string, unknown>) {
  const leadId = String(input.leadId ?? "");
  return tryData(async () =>
    cast<AdminLeadFollowUp>(
      await opsCreate("lead-follow-ups", input, { leadId: leadId || null }),
    ),
  );
}

export async function updateLeadFollowUpAction(
  input: Record<string, unknown> & { id: string; version: number },
) {
  const { id, version, ...payload } = input;
  return tryData(async () =>
    cast<AdminLeadFollowUp>(
      await opsUpdate("lead-follow-ups", id, version, payload),
    ),
  );
}

export async function deleteLeadFollowUpAction(input: { id: string }) {
  return tryOk(async () => {
    const version = await resolveOpsVersion("lead-follow-ups", input.id);
    await opsArchive("lead-follow-ups", input.id, version);
  });
}

export async function createSalesMessageAction(input: Record<string, unknown>) {
  return tryData(async () =>
    cast<AdminSalesMessage>(await opsCreate("sales-messages", input)),
  );
}

export async function markSalesMessageReadAction(input: {
  id: string;
  version?: number;
}) {
  return tryData(async () => {
    const version = await resolveOpsVersion(
      "sales-messages",
      input.id,
      input.version,
    );
    return cast<AdminSalesMessage>(
      await opsUpdate("sales-messages", input.id, version, { read: true }),
    );
  });
}

export async function deleteSalesMessageAction(input: { id: string }) {
  return tryOk(async () => {
    const version = await resolveOpsVersion("sales-messages", input.id);
    await opsArchive("sales-messages", input.id, version);
  });
}
