/** Browser calls go through the Frontend /api/auth proxy (same-origin cookies). */

export async function browserAdminSignIn(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const response = await fetch("/api/auth/sign-in/email", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });
  if (!response.ok) {
    return { ok: false, message: "Invalid email or password." };
  }
  // Proxied to Backend GET /api/admin/me (same path shape as cmsAdminFetch).
  const me = await fetch("/api/backend/api/admin/me", { credentials: "include" });
  if (!me.ok) {
    return {
      ok: false,
      message: "Signed in but admin role is required.",
    };
  }
  const body = (await me.json()) as { role?: string };
  if (body.role !== "admin") {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });
    return { ok: false, message: "Admin role is required." };
  }
  return { ok: true };
}

export async function browserAdminSignOut(): Promise<void> {
  await fetch("/api/auth/sign-out", {
    method: "POST",
    credentials: "include",
  });
}

export async function browserEmployeeSignIn(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const response = await fetch("/api/auth/sign-in/email", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });
  if (!response.ok) {
    return { ok: false, message: "Invalid email or password." };
  }
  // Proxied to Backend GET /api/employee/me (same path shape as cmsAdminFetch).
  const me = await fetch("/api/backend/api/employee/me", {
    credentials: "include",
  });
  if (!me.ok) {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });
    return {
      ok: false,
      message: "Signed in but employee role is required.",
    };
  }
  const body = (await me.json()) as { role?: string };
  if (body.role !== "employee") {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });
    return { ok: false, message: "Employee role is required." };
  }
  return { ok: true };
}

export async function browserEmployeeSignOut(): Promise<void> {
  await fetch("/api/auth/sign-out", {
    method: "POST",
    credentials: "include",
  });
}
