"use server";

import {
  cast,
  resolveOpsVersion,
  tryData,
  tryNamed,
  tryOk,
} from "./opsActionHelpers";
import { opsArchive, opsCreate, opsGet, opsUpdate } from "./opsMutations";
import type {
  AdminClient,
  AdminFile,
  AdminInvoice,
  AdminMessage,
  AdminProject,
  AdminSalarySlip,
  SalarySlipPublic,
} from "./types";

export async function getSalarySlipAction(id: string) {
  return tryData(async () =>
    cast<SalarySlipPublic>(await opsGet("salary-slips", id)),
  );
}

export async function createSalarySlipAction(input: Record<string, unknown>) {
  return tryData(async () =>
    cast<AdminSalarySlip>(await opsCreate("salary-slips", input)),
  );
}

export async function updateSalarySlipAction(
  input: Record<string, unknown> & { id: string; version: number },
) {
  const { id, version, ...payload } = input;
  return tryData(async () =>
    cast<AdminSalarySlip>(await opsUpdate("salary-slips", id, version, payload)),
  );
}

export async function archiveSalarySlipAction(input: {
  readonly id: string;
  readonly version: number;
}) {
  return tryOk(async () => {
    await opsArchive("salary-slips", input.id, input.version);
  });
}

export async function createInvoiceAction(
  input: Record<string, unknown> & {
    clientId: string | null;
    statusCode: string;
    lineItems: readonly unknown[];
  },
) {
  const { statusCode, lineItems, clientId, ...rest } = input;
  return tryData(async () =>
    cast<AdminInvoice>(
      await opsCreate(
        "invoices",
        { ...rest, status: statusCode, lineItems },
        { clientId },
      ),
    ),
  );
}

export async function updateInvoiceAction(
  input: Record<string, unknown> & {
    id: string;
    version: number;
    clientId: string | null;
    statusCode: string;
  },
) {
  const { id, version, statusCode, clientId, ...rest } = input;
  return tryData(async () =>
    cast<AdminInvoice>(
      await opsUpdate(
        "invoices",
        id,
        version,
        { ...rest, status: statusCode },
        { clientId },
      ),
    ),
  );
}

export async function archiveInvoiceAction(input: {
  readonly id: string;
  readonly version: number;
}) {
  return tryOk(async () => {
    await opsArchive("invoices", input.id, input.version);
  });
}

export async function createProjectAction(input: {
  readonly clientId: string;
  readonly serviceId: string;
  readonly title: string;
  readonly notes?: string;
}) {
  return tryData(async () =>
    cast<AdminProject>(
      await opsCreate(
        "projects",
        {
          clientId: input.clientId,
          title: input.title,
          service: input.serviceId,
          status: "requested",
          notes: input.notes ?? "",
        },
        { clientId: input.clientId },
      ),
    ),
  );
}

export async function changeProjectStatusAction(input: {
  readonly id: string;
  readonly version: number;
  readonly statusCode: AdminProject["status"];
}) {
  return tryData(async () =>
    cast<AdminProject>(
      await opsUpdate("projects", input.id, input.version, {
        status: input.statusCode,
      }),
    ),
  );
}

export async function putAssignmentsAction(input: {
  readonly clientId: string;
  readonly employeeIds: readonly string[];
}) {
  return tryOk(async () => {
    const row = await opsGet("clients", input.clientId);
    await opsUpdate("clients", input.clientId, Number(row.version), {
      assignedEmployeeIds: [...input.employeeIds],
    });
  });
}

export async function createMessageAction(input: {
  readonly clientId: string;
  readonly body: string;
  readonly fileIds?: readonly string[];
}) {
  return tryData(async () =>
    cast<AdminMessage>(
      await opsCreate(
        "messages",
        {
          clientId: input.clientId,
          from: "admin",
          body: input.body,
          read: true,
          attachments: input.fileIds ?? [],
        },
        { clientId: input.clientId },
      ),
    ),
  );
}

export async function archiveFileAction(input: { readonly id: string }) {
  return tryOk(async () => {
    const version = await resolveOpsVersion("files", input.id);
    await opsArchive("files", input.id, version);
  });
}

export async function uploadFileAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const name = String(formData.get("name") ?? "file");
  return tryData(async () =>
    cast<AdminFile>(
      await opsCreate(
        "files",
        { clientId, name, kind: "upload", url: null },
        { clientId: clientId || null },
      ),
    ),
  );
}

export async function updateAdminClientContactAction(
  input: Record<string, unknown> & { id: string; version: number },
) {
  const { id, version, ...payload } = input;
  return tryNamed("client", async () =>
    cast<AdminClient>(await opsUpdate("clients", id, version, payload)),
  );
}

export async function archiveAdminClientAction(input: {
  readonly id: string;
  readonly version: number;
}) {
  return tryOk(async () => {
    await opsArchive("clients", input.id, input.version);
  });
}

export async function updateProjectNotesAction(input: {
  readonly id: string;
  readonly notes: string;
  readonly version: number;
}) {
  return tryData(async () =>
    cast<AdminProject>(
      await opsUpdate("projects", input.id, input.version, {
        notes: input.notes,
      }),
    ),
  );
}

export async function changeDeliveryProjectStatusAction(input: {
  readonly id: string;
  readonly version: number;
  readonly statusCode: AdminProject["status"];
}) {
  return changeProjectStatusAction(input);
}

export async function createDeliveryMessageAction(input: {
  readonly clientId: string;
  readonly body: string;
}) {
  return createMessageAction(input);
}

export async function markDeliveryMessageReadAction(input: {
  id: string;
  version?: number;
}) {
  return tryOk(async () => {
    const version = await resolveOpsVersion("messages", input.id, input.version);
    await opsUpdate("messages", input.id, version, { read: true });
  });
}

export async function uploadDeliveryFileAction(formData: FormData) {
  return uploadFileAction(formData);
}

export async function archiveDeliveryFileAction(input: { id: string }) {
  return archiveFileAction(input);
}
