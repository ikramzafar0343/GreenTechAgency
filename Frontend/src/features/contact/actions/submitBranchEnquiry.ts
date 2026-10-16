"use server";

import {
  careersPayload,
  generalPayload,
  projectPayload,
  validateCareersDraft,
  validateGeneralDraft,
  validateProjectDraft,
  type BranchFieldErrors,
} from "@/features/contact/model/branchEnquiry";
import type {
  CareersDraft,
  GeneralDraft,
  ProjectDraft,
} from "@/features/contact/model/contactFlowState";
import {
  CONTACT_BUDGET_BANDS,
  CONTACT_BUDGET_CURRENCY,
  CONTACT_CAREERS_ROLES,
} from "@/features/contact/model/contactPageContent";
import { getContactServiceCatalog } from "@/features/services/server/getContactServiceCatalog";
import { BackendHttpError } from "@/server/backend/client";
import { submitPublicContact } from "@/server/backend/submitPublicContact";

export type BranchSubmitResult =
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: BranchFieldErrors };

function honeypotHit(website: string): boolean {
  return website.trim().length > 0;
}

function budgetLabel(budgetId: string): string {
  return (
    CONTACT_BUDGET_BANDS.find((band) => band.id === budgetId)?.label ?? budgetId
  );
}

function roleLabel(roleId: string): string {
  return (
    CONTACT_CAREERS_ROLES.find((role) => role.id === roleId)?.label ?? roleId
  );
}

function serviceLabels(
  serviceIds: string[],
  catalog: { id: string; label: string }[],
): string {
  const byId = new Map(catalog.map((row) => [row.id, row.label]));
  return serviceIds.map((id) => byId.get(id) ?? id).join(", ");
}

async function postBranchContact(
  body: Parameters<typeof submitPublicContact>[0],
): Promise<BranchSubmitResult> {
  const result = await submitPublicContact(body);
  if (result.status === "success") {
    return { status: "success" };
  }
  return {
    status: "error",
    message: result.message,
    ...(result.fieldErrors ? { fieldErrors: result.fieldErrors } : {}),
  };
}

function backendFailureMessage(err: BackendHttpError): string {
  return err.message || "We could not send your message. Please try again.";
}

export async function submitProjectEnquiry(
  draft: ProjectDraft,
): Promise<BranchSubmitResult> {
  if (honeypotHit(draft.website)) {
    return { status: "success" };
  }

  let catalog;
  try {
    catalog = await getContactServiceCatalog();
  } catch (err) {
    const message =
      err instanceof BackendHttpError
        ? backendFailureMessage(err)
        : "We could not send your message. Please try again.";
    return { status: "error", message };
  }

  const serviceIds = new Set(catalog.map((row) => row.id));
  const fieldErrors = validateProjectDraft(draft, serviceIds);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  const payload = projectPayload(draft);
  if (!payload || payload.type !== "project") {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: { budgetId: "Choose a budget range." },
    };
  }

  const message = [
    payload.description,
    "",
    `Services: ${serviceLabels(payload.serviceIds, catalog)}`,
    `Budget: ${budgetLabel(payload.budgetId)} (${payload.budgetCurrency})`,
  ].join("\n");

  return postBranchContact({
    name: payload.name,
    email: payload.email,
    company: payload.company || null,
    phone: payload.phone || null,
    service: serviceLabels(payload.serviceIds, catalog),
    message,
    kind: "project",
    website: payload.website,
  });
}

export async function submitCareersEnquiry(
  draft: CareersDraft,
): Promise<BranchSubmitResult> {
  if (honeypotHit(draft.website)) {
    return { status: "success" };
  }

  const fieldErrors = validateCareersDraft(draft);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  const payload = careersPayload(draft);
  if (!payload || payload.type !== "careers") {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors: { roleId: "Choose a role." },
    };
  }

  const message = [
    payload.application,
    payload.portfolio ? `Portfolio: ${payload.portfolio}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return postBranchContact({
    name: payload.name,
    email: payload.email,
    company: null,
    phone: null,
    service: roleLabel(payload.roleId),
    message,
    kind: "careers",
    website: payload.website,
  });
}

export async function submitGeneralEnquiry(
  draft: GeneralDraft,
): Promise<BranchSubmitResult> {
  if (honeypotHit(draft.website)) {
    return { status: "success" };
  }

  const fieldErrors = validateGeneralDraft(draft);
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  const payload = generalPayload(draft);
  if (payload.type !== "general") {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
    };
  }

  return postBranchContact({
    name: payload.name,
    email: payload.email,
    company: null,
    phone: payload.phone || null,
    service: null,
    message: payload.message,
    kind: "general",
    website: payload.website,
  });
}
