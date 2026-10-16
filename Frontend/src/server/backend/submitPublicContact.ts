import "server-only";

import { backendFetch, BackendHttpError } from "@/server/backend/client";

export type PublicContactBody = {
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  service?: string | null;
  message: string;
  kind: string;
  website?: string;
};

export type PublicContactSubmitResult =
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

function mapContactError(err: BackendHttpError): PublicContactSubmitResult {
  if (err.code === "RATE_LIMIT" || err.status === 429) {
    return {
      status: "error",
      message: err.message || "Too many submissions. Please try again later.",
    };
  }
  if (err.code === "VALIDATION" || err.status === 400) {
    const details = err.details;
    if (details && typeof details === "object" && !Array.isArray(details)) {
      const fieldErrors: Record<string, string> = {};
      for (const [key, value] of Object.entries(
        details as Record<string, unknown>,
      )) {
        if (typeof value === "string" && value.trim()) {
          fieldErrors[key] = value;
        }
      }
      if (Object.keys(fieldErrors).length > 0) {
        return {
          status: "error",
          message: err.message || "Please correct the highlighted fields.",
          fieldErrors,
        };
      }
    }
    return {
      status: "error",
      message: err.message || "Please correct the highlighted fields.",
    };
  }
  return {
    status: "error",
    message: err.message || "We could not send your message. Please try again.",
  };
}

export async function submitPublicContact(
  body: PublicContactBody,
): Promise<PublicContactSubmitResult> {
  try {
    await backendFetch<{ ok?: boolean }>("/api/contact", {
      method: "POST",
      body,
    });
    return { status: "success" };
  } catch (err) {
    if (err instanceof BackendHttpError) {
      return mapContactError(err);
    }
    throw err;
  }
}
