import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { EmployeeLoginPageClient } from "@/components/employee/EmployeeLoginPageClient";
import { getBackendEmployeeMe } from "@/server/backend/employeeSession";

export const metadata: Metadata = {
  title: "Employee login",
};

export default async function EmployeeLoginPage() {
  const me = await getBackendEmployeeMe();
  if (me?.role === "employee") {
    redirect("/employee");
  }

  return <EmployeeLoginPageClient />;
}
