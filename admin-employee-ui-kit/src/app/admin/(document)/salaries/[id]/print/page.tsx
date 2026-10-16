import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SalarySlipDocumentClient } from "@/components/salaries/SalarySlipDocumentClient";
import { loadSalarySlipDocument } from "@/lib/portal/actions";
import { requireAdminActor } from "@/lib/portal/session";

export const metadata: Metadata = {
  title: "Salary slip",
};

export default async function AdminSalarySlipPrintPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const { actor } = await requireAdminActor();
  const slip = await loadSalarySlipDocument(actor, id);

  if (!slip) {
    notFound();
  }

  return (
    <SalarySlipDocumentClient
      slip={slip}
      slipId={id}
      backHref="/admin/salaries"
    />
  );
}
