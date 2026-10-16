import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { adminInitialsFromName } from "@/constants/adminAuth";
import type { AdminIdentity } from "@/components/admin/AdminProvider";
import type {
  Actor,
  EmployeeKind,
  SessionPayload,
  SessionRole,
} from "./types";
import { getStore } from "./mockStore";

const COOKIE = "portal-session";

type CookieBody = {
  readonly role: SessionRole;
  readonly email: string;
  readonly name: string;
  readonly employeeKind?: EmployeeKind;
};

function parseCookie(raw: string | undefined): CookieBody | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as CookieBody;
    if (parsed.role !== "admin" && parsed.role !== "employee") {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function toPayload(body: CookieBody): SessionPayload {
  const store = getStore();
  if (body.role === "employee") {
    const kind = body.employeeKind ?? "delivery";
    const employee =
      store.state.employees.find((item) => item.kind === kind) ??
      store.state.employees[0];
    return {
      subjectId: employee?.id ?? "emp-delivery-1",
      role: "employee",
      name: employee?.name ?? body.name,
      email: employee?.email ?? body.email,
      employeeId: employee?.id ?? "emp-delivery-1",
      employeeKind: employee?.kind ?? kind,
    };
  }
  return {
    subjectId: store.profile.id,
    role: "admin",
    name: store.profile.name,
    email: store.profile.email,
    employeeId: null,
    employeeKind: null,
  };
}

export async function setPortalSession(body: CookieBody): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, JSON.stringify(body), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearSession(_role?: SessionRole): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function verifySession(
  role: SessionRole,
): Promise<SessionPayload | null> {
  const jar = await cookies();
  const body = parseCookie(jar.get(COOKIE)?.value);
  if (!body || body.role !== role) {
    return null;
  }
  return toPayload(body);
}

export async function requireSession(
  role: SessionRole,
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
      image: getStore().profile.imagePath,
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
    const session = await requireSession("employee");
    if (session.employeeId === null || session.employeeKind === null) {
      await clearSession("employee");
      redirect("/employee/login");
    }
    return {
      session,
      employeeId: session.employeeId,
      kind: session.employeeKind,
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
