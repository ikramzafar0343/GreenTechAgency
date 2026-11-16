"use client";

import { type InvoiceLineFormItem } from "@/components/admin/InvoiceLineItemsFields";
import type { AdminClient, AdminInvoice } from "@/lib/data/admin";

export const cardClass =
  "overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_24px_rgba(47,58,40,0.04)]";

export type InvoiceForm = {
  recipientKind: "client" | "outsider";
  clientId: string;
  clientQuery: string;
  number: string;
  currency: string;
  status: AdminInvoice["status"];
  issuedOn: string;
  dueDate: string;
  billToCompany: string;
  billToName: string;
  billToEmail: string;
  billToPhone: string;
  billToLocation: string;
  fromCompany: string;
  fromEmail: string;
  fromPhone: string;
  lines: InvoiceLineFormItem[];
};

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function billToFromClient(client: AdminClient | undefined) {
  return {
    billToCompany: client?.company ?? "",
    billToName: client?.name ?? "",
    billToEmail: client?.email ?? "",
    billToPhone: client?.phone ?? "",
    billToLocation: client?.location ?? "",
  };
}

export function matchesClientQuery(client: AdminClient, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (q.length === 0) {
    return true;
  }
  return (
    client.company.toLowerCase().includes(q) ||
    client.name.toLowerCase().includes(q) ||
    client.email.toLowerCase().includes(q)
  );
}
