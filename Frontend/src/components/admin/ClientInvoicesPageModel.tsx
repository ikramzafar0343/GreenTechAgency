"use client";

import { useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { useAdmin } from "@/components/admin/AdminProvider";
import { adminIcons } from "@/components/admin/AdminIcons";
import { emptyInvoiceLine, type InvoiceLineFormItem } from "@/components/admin/InvoiceLineItemsFields";
import { site } from "@/constants/site";
import type { AdminClient, AdminInvoice } from "@/lib/data/admin";
import { archiveInvoiceAction, createInvoiceAction, updateInvoiceAction } from "@/lib/submitOps";
import { getAdminSiteContactAction } from "@/lib/submitAdminSiteContact";
import { nextInvoiceNumber } from "@/lib/invoiceNumber";

export const cardClass =
  "overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_24px_rgba(47,58,40,0.04)]";

export type InvoiceForm = {
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

export const emptyForm: InvoiceForm = {
  number: "",
  currency: "USD",
  status: "draft",
  issuedOn: "",
  dueDate: "",
  billToCompany: "",
  billToName: "",
  billToEmail: "",
  billToPhone: "",
  billToLocation: "",
  fromCompany: site.legalName,
  fromEmail: "",
  fromPhone: "",
  lines: [emptyInvoiceLine()],
};

export function formFromInvoice(invoice: AdminInvoice): InvoiceForm {
  return {
    number: invoice.number,
    currency: invoice.currency,
    status: invoice.status,
    issuedOn: invoice.issuedOn ?? "",
    dueDate: invoice.dueDate ?? "",
    billToCompany: invoice.billToCompany,
    billToName: invoice.billToName,
    billToEmail: invoice.billToEmail,
    billToPhone: invoice.billToPhone,
    billToLocation: invoice.billToLocation,
    fromCompany: invoice.fromCompany,
    fromEmail: invoice.fromEmail,
    fromPhone: invoice.fromPhone,
    lines:
      invoice.lineItems.length > 0
        ? invoice.lineItems.map((line) => ({
            description: line.description,
            amount: line.amount,
          }))
        : [emptyInvoiceLine()],
  };
}

export const invoiceStatusClass: Record<AdminInvoice["status"], string> = {
  draft: "bg-black/8 text-black/50",
  sent: "bg-[rgba(249,161,55,0.18)] text-[#e8891a]",
  paid: "bg-brand/16 text-brand",
};

export const invoiceStatusLabel: Record<AdminInvoice["status"], string> = {
  draft: "Draft",
  sent: "Sent",
  paid: "Paid",
};

/** All state and handlers of <ClientInvoicesPage>; the component and its sections only render. */
export function useClientInvoicesPage() {
  const params = useParams();
  const { state, setInvoices } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<InvoiceForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const TrashIcon = adminIcons.trash;
  const EditIcon = adminIcons.edit;

  const clientId = typeof params.id === "string" ? params.id : "";
  const invoices = state.invoices.filter((item) => item.clientId === clientId);

  const openCreate = () => {
    setError(null);
    setEditingId(null);
    startTransition(async () => {
      const client = state.clients.find((item) => item.id === clientId);
      const contact = await getAdminSiteContactAction();
      setForm({
        ...emptyForm,
        number: nextInvoiceNumber(state.invoices.map((item) => item.number)),
        issuedOn: todayIso(),
        ...billToFromClient(client),
        fromCompany: site.legalName,
        fromEmail: contact.ok ? contact.data.email : "",
        fromPhone: contact.ok ? contact.data.phone : "",
        lines: [emptyInvoiceLine()],
      });
      setModalOpen(true);
    });
  };

  const openEdit = (invoice: AdminInvoice) => {
    setError(null);
    setEditingId(invoice.id);
    setForm(formFromInvoice(invoice));
    setModalOpen(true);
  };

  const save = () => {
    const number = form.number.trim();
    const lines = form.lines
      .map((line) => ({
        description: line.description.trim(),
        amount: line.amount.trim(),
      }))
      .filter((line) => line.description.length > 0 || line.amount.length > 0);
    if (!number || lines.length === 0 || !clientId) {
      setError("Add at least one line item with a description.");
      return;
    }
    if (lines.some((line) => line.description.length === 0)) {
      setError("Each line item needs a description.");
      return;
    }

    startTransition(async () => {
      setError(null);
      if (editingId !== null) {
        const existing = invoices.find((item) => item.id === editingId);
        if (!existing) {
          return;
        }
        const result = await updateInvoiceAction({
          id: existing.id,
          version: existing.version,
          currency: form.currency.trim() || "USD",
          statusCode: form.status,
          issuedOn: form.issuedOn.trim() || null,
          dueDate: form.dueDate.trim() || null,
          lineItems: lines,
          billToCompany: form.billToCompany,
          billToName: form.billToName,
          billToEmail: form.billToEmail,
          billToPhone: form.billToPhone,
          billToLocation: form.billToLocation,
          fromCompany: form.fromCompany,
          fromEmail: form.fromEmail,
          fromPhone: form.fromPhone,
        });

        if (!result.ok || !("data" in result)) {
          setError(
            result.ok
              ? "Update failed."
              : result.reason === "conflict"
                ? "This invoice was updated elsewhere. Refresh and try again."
                : "Could not update invoice.",
          );
          return;
        }

        setInvoices(
          state.invoices.map((item) =>
            item.id === editingId ? result.data : item,
          ),
        );
      } else {
        const result = await createInvoiceAction({
          clientId,
          number,
          currency: form.currency.trim() || "USD",
          statusCode: form.status,
          issuedOn: form.issuedOn.trim() || null,
          dueDate: form.dueDate.trim() || null,
          lineItems: lines,
          billToCompany: form.billToCompany,
          billToName: form.billToName,
          billToEmail: form.billToEmail,
          billToPhone: form.billToPhone,
          billToLocation: form.billToLocation,
          fromCompany: form.fromCompany,
          fromEmail: form.fromEmail,
          fromPhone: form.fromPhone,
        });

        if (!result.ok || !("data" in result)) {
          setError(
            result.ok
              ? "Create failed."
              : result.reason === "conflict"
                ? "Invoice number already exists. Use a different number."
                : "Could not create invoice.",
          );
          return;
        }

        setInvoices([...state.invoices, result.data]);
      }

      setModalOpen(false);
      setEditingId(null);
      setForm(emptyForm);
    });
  };

  const confirmDelete = () => {
    if (!deleteId) {
      return;
    }

    const existing = invoices.find((item) => item.id === deleteId);
    if (!existing) {
      return;
    }

    startTransition(async () => {
      setError(null);
      const result = await archiveInvoiceAction({
        id: existing.id,
        version: existing.version,
      });

      if (!result.ok) {
        setError(
          result.reason === "conflict"
            ? "This invoice was updated elsewhere. Refresh and try again."
            : "Could not delete invoice.",
        );
        return;
      }

      setInvoices(state.invoices.filter((item) => item.id !== deleteId));
      setDeleteOpen(false);
      setDeleteId(null);
    });
  };

  const deleteTarget = invoices.find((item) => item.id === deleteId);
  return { modalOpen, setModalOpen, editingId, setEditingId, deleteOpen, setDeleteOpen, setDeleteId, form, setForm, error, pending, TrashIcon, EditIcon, invoices, openCreate, openEdit, save, confirmDelete, deleteTarget };
}

export type ClientInvoicesPageModel = ReturnType<typeof useClientInvoicesPage>;
