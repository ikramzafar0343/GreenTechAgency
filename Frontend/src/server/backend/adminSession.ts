import "server-only";

import { redirect } from "next/navigation";
import {
  BackendHttpError,
  backendAdminGet,
} from "@/server/backend/client";
import { adminInitialsFromName } from "@/constants/adminAuth";
import type { AdminIdentity } from "@/components/admin/AdminProvider";

export type BackendAdminMe = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function getBackendAdminMe(): Promise<BackendAdminMe | null> {
  try {
    return await backendAdminGet<BackendAdminMe>("/api/admin/me");
  } catch (err) {
    if (err instanceof BackendHttpError && (err.status === 401 || err.status === 403)) {
      return null;
    }
    throw err;
  }
}

export async function requireBackendAdminIdentity(): Promise<AdminIdentity> {
  const me = await getBackendAdminMe();
  if (!me || me.role !== "admin") {
    redirect("/admin/login");
  }
  return {
    name: me.name || me.email,
    email: me.email,
    image: "",
    initials: adminInitialsFromName(me.name || me.email),
  };
}
