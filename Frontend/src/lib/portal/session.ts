import { cache } from "react";
import { redirect } from "next/navigation";
import { adminInitialsFromName } from "@/constants/adminAuth";
import type { AdminIdentity } from "@/components/admin/AdminProvider";
import type { Actor, EmployeeKind, SessionPayload } from "./types";
import {
  getBackendAdminMe,
} from "@/server/backend/adminSession";
import {
  getBackendEmployeeMe,
  requireBackendEmployeeAccess,
} from "@/server/backend/employeeSession";

export async function clearSession(): Promise<void> {
  /* Better Auth sign-out is handled in the browser or auth actions. */
}

export async function verifySession(
  role: "admin" | "employee",
): Promise<SessionPayload | null> {
  if (role === "admin") {
    const me = await getBackendAdminMe();
    if (!me || me.role !== "admin") {
      return null;
    }
    return {
      subjectId: me.id,
      role: "admin",
      name: me.name || me.email,
      email: me.email,
      employeeId: null,
      employeeKind: null,
    };
  }
  const me = await getBackendEmployeeMe();
  if (!me || me.role !== "employee") {
    return null;
  }
  const kindRaw = me.employeeKind?.trim().toLowerCase();
  const kind: EmployeeKind =
    kindRaw === "sales" || kindRaw === "delivery" ? kindRaw : "delivery";
  return {
    subjectId: me.id,
    role: "employee",
    name: me.name || me.email,
    email: me.email,
    employeeId: me.id,
    employeeKind: kind,
  };
}

export async function requireSession(
  role: "admin" | "employee",
): Promise<SessionPayload> {
  const session = await verifySession(role);
  if (!session) {
    redirect(role === "employee" ? "/employee/login" : "/admin/login");
  }
  return session;
}

export const requireAdminActor = cache(async function requireAdminActor(): Promise<{
  readonly actor: Actor;
  readonly identity: AdminIdentity;
}> {
  const session = await requireSession("admin");
  return {
    actor: {
      subjectId: session.subjectId,
      role: "admin",
      employeeKind: null,
    },
    identity: {
      name: session.name,
      email: session.email,
      initials: adminInitialsFromName(session.name),
      image: "",
    },
  };
});

export type EmployeeSession = {
  readonly session: SessionPayload;
  readonly employeeId: string;
  readonly kind: EmployeeKind;
};

export const requireEmployeeSession = cache(
  async function requireEmployeeSession(): Promise<EmployeeSession> {
    const access = await requireBackendEmployeeAccess();
    const session: SessionPayload = {
      subjectId: access.id,
      role: "employee",
      name: access.name,
      email: access.email,
      employeeId: access.id,
      employeeKind: access.kind,
    };
    return {
      session,
      employeeId: access.id,
      kind: access.kind,
    };
  },
);

export const requireEmployeeKind = cache(async function requireEmployeeKind(
  kind: EmployeeKind,
): Promise<EmployeeSession> {
  const access = await requireEmployeeSession();
  if (access.kind !== kind) {
    redirect("/employee");
  }
  return access;
});
