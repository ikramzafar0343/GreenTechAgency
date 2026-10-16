import "server-only";

import { redirect } from "next/navigation";
import {
  BackendHttpError,
  backendFetch,
} from "@/server/backend/client";
import type { EmployeeKind } from "@/lib/portal/types";

export type BackendEmployeeMe = {
  id: string;
  email: string;
  name: string;
  role: string;
  employeeKind?: string;
};

export async function getBackendEmployeeMe(): Promise<BackendEmployeeMe | null> {
  try {
    return await backendFetch<BackendEmployeeMe>("/api/employee/me", {
      withSession: true,
      cache: "no-store",
    });
  } catch (err) {
    if (
      err instanceof BackendHttpError &&
      (err.status === 401 || err.status === 403)
    ) {
      return null;
    }
    throw err;
  }
}

export async function requireBackendEmployeeAccess(): Promise<{
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly kind: EmployeeKind;
}> {
  const me = await getBackendEmployeeMe();
  if (!me || me.role !== "employee") {
    redirect("/employee/login");
  }
  const kindRaw = me.employeeKind?.trim().toLowerCase();
  const kind: EmployeeKind =
    kindRaw === "sales" || kindRaw === "delivery" ? kindRaw : "delivery";
  return {
    id: me.id,
    email: me.email,
    name: me.name || me.email,
    kind,
  };
}
