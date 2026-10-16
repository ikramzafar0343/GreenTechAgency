import type { AuthenticatedSession } from "../../auth/requireSession.js";

function readEmployeeKind(user: AuthenticatedSession["user"]): string | null {
  if ("employeeKind" in user && user.employeeKind != null) {
    const value = String(user.employeeKind).trim();
    return value || null;
  }
  return null;
}

export function getEmployeeMe(session: AuthenticatedSession) {
  const role =
    "role" in session.user ? String(session.user.role ?? "") : "user";
  const employeeKind = readEmployeeKind(session.user);
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    role,
    ...(employeeKind ? { employeeKind } : {}),
  };
}
