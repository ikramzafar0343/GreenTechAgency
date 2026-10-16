import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireBackendAdminIdentity } from "@/server/backend/adminSession";

export const metadata: Metadata = {
  title: "Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const identity = await requireBackendAdminIdentity();
  return <AdminShell identity={identity}>{children}</AdminShell>;
}
