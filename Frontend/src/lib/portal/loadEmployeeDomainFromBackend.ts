"use server";

import type {
  AdminEmployee,
  EmployeeCrmBootstrap,
  EmployeeDeliveryBootstrap,
  EmployeeDomain,
} from "@/lib/portal/types";
import { getBackendEmployeeMe } from "@/server/backend/employeeSession";
import { listOpsResource } from "@/server/backend/opsClient";
import { backendFetch } from "@/server/backend/client";

function asEmployee(row: Record<string, unknown>, fallback: AdminEmployee): AdminEmployee {
  return {
    ...fallback,
    ...row,
    id: String(row.id ?? fallback.id),
    name: String(row.name ?? fallback.name),
    email: String(row.email ?? fallback.email),
    role: String(row.role ?? fallback.role),
    department: String(row.department ?? fallback.department),
    kind:
      row.kind === "sales" || row.kind === "delivery"
        ? row.kind
        : fallback.kind,
    image: String(row.image ?? fallback.image ?? ""),
    version: Number(row.version ?? fallback.version ?? 1),
    active: row.active !== false,
    teamMemberId:
      row.teamMemberId == null ? null : String(row.teamMemberId),
    updatedAt: String(row.updatedAt ?? fallback.updatedAt ?? ""),
  };
}

async function resolveSelfEmployee(): Promise<AdminEmployee> {
  const me = await getBackendEmployeeMe();
  if (!me || me.role !== "employee") {
    throw new Error("UNAUTHORIZED");
  }
  const kindRaw = me.employeeKind?.trim().toLowerCase();
  const kind = kindRaw === "sales" || kindRaw === "delivery" ? kindRaw : "delivery";
  const fallback: AdminEmployee = {
    id: me.id,
    name: me.name || me.email,
    email: me.email,
    role: kind === "sales" ? "Sales" : "Delivery",
    department: kind === "sales" ? "Sales" : "Delivery",
    kind,
    image: "",
    version: 1,
    active: true,
    teamMemberId: null,
    updatedAt: "",
  };
  try {
    const profile = await backendFetch<Record<string, unknown>>(
      "/api/employee/profile",
      { withSession: true, cache: "no-store" },
    );
    return asEmployee(profile, fallback);
  } catch {
    return fallback;
  }
}

/** Loads employee CRM/delivery domains from Backend Ops APIs (no mockStore). */
export async function loadEmployeeDomainFromBackend(
  domain: EmployeeDomain,
): Promise<EmployeeCrmBootstrap | EmployeeDeliveryBootstrap> {
  const employee = await resolveSelfEmployee();
  if (domain === "crm") {
    const [sales, leads, leadFollowUps, salesMessages, employees] =
      await Promise.all([
        listOpsResource("sales"),
        listOpsResource("leads"),
        listOpsResource("lead-follow-ups"),
        listOpsResource("sales-messages"),
        listOpsResource("employees"),
      ]);
    const salesPeers = employees.filter(
      (item) => item.kind === "sales" || item.kind === undefined,
    );
    return {
      employee,
      sales: sales as never,
      leads: leads as never,
      leadFollowUps: leadFollowUps as never,
      salesMessages: salesMessages as never,
      salesPeers: salesPeers as never,
    };
  }
  const [clients, projects, messages, files] = await Promise.all([
    listOpsResource("clients"),
    listOpsResource("projects"),
    listOpsResource("messages"),
    listOpsResource("files"),
  ]);
  return {
    employee,
    clients: clients as never,
    projects: projects as never,
    messages: messages as never,
    files: files as never,
  };
}
