"use server";

import type { InvoiceDocumentModel } from "@/components/invoices/InvoiceDocument";
import type { SalarySlipDocumentModel } from "@/components/salaries/SalarySlipDocument";
import type { Actor } from "@/lib/portal/types";
import { getAdminSiteContactAction } from "./portalBackendActions";
import { opsGet } from "./opsMutations";

export async function loadInvoiceDocument(
  _actor: Actor,
  invoiceId: string,
): Promise<InvoiceDocumentModel | null> {
  try {
    const invoice = await opsGet("invoices", invoiceId);
    const contactResult = await getAdminSiteContactAction();
    const contact =
      contactResult.ok
        ? contactResult.data
        : {
            phone: "",
            email: "",
            addressLines: [] as readonly string[],
          };
    const lineItems = Array.isArray(invoice.lineItems)
      ? (invoice.lineItems as Array<Record<string, unknown>>)
      : [];
    const statusRaw = String(invoice.status ?? "draft");
    const status =
      statusRaw === "sent" || statusRaw === "paid" ? statusRaw : "draft";
    return {
      number: String(invoice.number ?? ""),
      title: String(invoice.title ?? ""),
      amount: String(invoice.amount ?? ""),
      currency: String(invoice.currency ?? "USD"),
      status,
      issuedOn: invoice.issuedOn == null ? null : String(invoice.issuedOn),
      dueDate: invoice.dueDate == null ? null : String(invoice.dueDate),
      createdAt: String(invoice.createdAt ?? new Date().toISOString()),
      lineItems: lineItems.map((line) => ({
        description: String(line.description ?? ""),
        amount: String(line.amount ?? ""),
      })),
      company: {
        legalName: String(invoice.fromCompany ?? ""),
        email: String(invoice.fromEmail ?? ""),
        phone: String(invoice.fromPhone ?? ""),
      },
      client: {
        company: String(invoice.billToCompany ?? ""),
        name: String(invoice.billToName ?? ""),
        email: String(invoice.billToEmail ?? ""),
        phone: String(invoice.billToPhone ?? ""),
        location: String(invoice.billToLocation ?? ""),
      },
      footer: {
        phone: contact.phone,
        email: contact.email,
        locationLines: [...contact.addressLines],
      },
    };
  } catch {
    return null;
  }
}

export async function loadSalarySlipDocument(
  _actor: Actor,
  slipId: string,
): Promise<SalarySlipDocumentModel | null> {
  try {
    const slip = await opsGet("salary-slips", slipId);
    const contactResult = await getAdminSiteContactAction();
    const contact =
      contactResult.ok
        ? contactResult.data
        : {
            phone: "",
            email: "",
            addressLines: [] as readonly string[],
          };
    return {
      employeeName: String(slip.employeeName ?? ""),
      designation: String(slip.designation ?? ""),
      slipDate: String(slip.slipDate ?? ""),
      salaryMonth: String(slip.salaryMonth ?? ""),
      basicSalary: String(slip.basicSalary ?? ""),
      punctuality: String(slip.punctuality ?? ""),
      medicalAllowance: String(slip.medicalAllowance ?? ""),
      incentives: String(slip.incentives ?? ""),
      bonus: String(slip.bonus ?? ""),
      advance: String(slip.advance ?? ""),
      incomeTax: String(slip.incomeTax ?? ""),
      whTax: String(slip.whTax ?? ""),
      fuelAdvances: String(slip.fuelAdvances ?? ""),
      unpaidDays: String(slip.unpaidDays ?? ""),
      totalEarnings: String(slip.totalEarnings ?? ""),
      totalDeduction: String(slip.totalDeduction ?? ""),
      netSalary: String(slip.netSalary ?? ""),
      currency: String(slip.currency ?? "USD"),
      status: String(slip.status ?? "") === "issued" ? "issued" : "draft",
      company: {
        legalName: String(slip.fromCompany ?? ""),
        email: String(slip.fromEmail ?? ""),
        phone: String(slip.fromPhone ?? ""),
      },
      footer: {
        phone: contact.phone,
        email: contact.email,
        locationLines: [...contact.addressLines],
      },
    };
  } catch {
    return null;
  }
}
