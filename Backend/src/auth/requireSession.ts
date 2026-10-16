import type { IncomingHttpHeaders } from "node:http";
import { fromNodeHeaders } from "better-auth/node";
import { getAuth } from "./auth.js";

export type AuthenticatedSession = NonNullable<
  Awaited<ReturnType<typeof getSessionFromHeaders>>
>;

export async function getSessionFromHeaders(headers: IncomingHttpHeaders) {
  const auth = getAuth();
  return auth.api.getSession({
    headers: fromNodeHeaders(headers),
  });
}

/** Requires a verified Better Auth session. Does not grant permissions alone. */
export async function requireSession(
  headers: IncomingHttpHeaders,
): Promise<AuthenticatedSession> {
  const session = await getSessionFromHeaders(headers);
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

function sessionRole(session: AuthenticatedSession): string {
  return "role" in session.user ? String(session.user.role ?? "") : "";
}

/** Requires session whose user has the admin role (deny by default). */
export async function requireAdminSession(
  headers: IncomingHttpHeaders,
): Promise<AuthenticatedSession> {
  const session = await requireSession(headers);
  if (sessionRole(session) !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return session;
}

/** Requires session whose user has employee or admin role. */
export async function requireEmployeeSession(
  headers: IncomingHttpHeaders,
): Promise<AuthenticatedSession> {
  const session = await requireSession(headers);
  const role = sessionRole(session);
  if (role !== "employee" && role !== "admin") {
    throw new Error("FORBIDDEN");
  }
  return session;
}
