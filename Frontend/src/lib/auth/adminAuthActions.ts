"use server";

import { headers } from "next/headers";
import { getBackendUrl } from "@/server/backend/env";
import type {
  AdminLoginSubmitResult,
  LoginFieldErrors,
  LoginFormValues,
} from "@/lib/portal/types";

export async function submitAdminLogin(
  values: LoginFormValues,
): Promise<AdminLoginSubmitResult> {
  if (!values.email.includes("@") || values.password.length < 1) {
    const fieldErrors: LoginFieldErrors = {
      ...(values.email.includes("@") ? {} : { email: "Enter a valid email." }),
      ...(values.password.length > 0
        ? {}
        : { password: "Password is required." }),
    };
    return { ok: false, fieldErrors };
  }

  const headerStore = await headers();
  const cookie = headerStore.get("cookie") ?? "";
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL?.trim() ??
    "http://localhost:3000";

  const response = await fetch(`${getBackendUrl()}/api/auth/sign-in/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify({
      email: values.email.trim().toLowerCase(),
      password: values.password,
    }),
  });

  if (!response.ok) {
    return {
      ok: false,
      fieldErrors: {
        email: "Invalid email or password.",
      },
    };
  }

  // Session cookies are set by Better Auth on the auth proxy path when the
  // browser calls /api/auth directly. Server Action fetch to Backend may not
  // forward Set-Cookie to the browser — prefer client-side sign-in for cookies.
  return { ok: true };
}

export async function submitAdminSignOut(): Promise<void> {
  const headerStore = await headers();
  const cookie = headerStore.get("cookie") ?? "";
  const origin =
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL?.trim() ??
    "http://localhost:3000";
  await fetch(`${getBackendUrl()}/api/auth/sign-out`, {
    method: "POST",
    headers: {
      Origin: origin,
      ...(cookie ? { Cookie: cookie } : {}),
    },
  });
}
