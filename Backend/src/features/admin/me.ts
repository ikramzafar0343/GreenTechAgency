import type { AuthenticatedSession } from "../../auth/requireSession.js";

export function getAdminMe(session: AuthenticatedSession) {
  const role =
    "role" in session.user ? String(session.user.role ?? "") : "user";
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role,
  };
}
