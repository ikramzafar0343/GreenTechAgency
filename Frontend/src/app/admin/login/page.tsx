import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginPageClient } from "@/components/admin/AdminLoginPageClient";
import { getBackendAdminMe } from "@/server/backend/adminSession";

export const metadata: Metadata = {
  title: "Admin login",
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const me = await getBackendAdminMe();
  if (me?.role === "admin") {
    redirect("/admin");
  }

  return <AdminLoginPageClient />;
}
