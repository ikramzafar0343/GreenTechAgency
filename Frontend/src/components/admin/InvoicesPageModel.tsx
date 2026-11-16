"use client";

import { useState, useTransition } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { adminIcons } from "@/components/admin/AdminIcons";
import { emptyInvoiceLine } from "@/components/admin/InvoiceLineItemsFields";
import { site } from "@/constants/site";
import type { AdminInvoice } from "@/lib/data/admin";
import { archiveInvoiceAction, createInvoiceAction, updateInvoiceAction } from "@/lib/submitOps";
import { getAdminSiteContactAction } from "@/lib/submitAdminSiteContact";
import { nextInvoiceNumber } from "@/lib/invoiceNumber";
import { type InvoiceForm, todayIso } from "./InvoicesPageModelPart";
export { cardClass, todayIso, billToFromClient, matchesClientQuery } from "./InvoicesPageModelPart";
export type { InvoiceForm } from "./InvoicesPageModelPart";

export const emptyForm: InvoiceForm = {
  recipientKind: "client",
  clientId: "",
  clientQuery: "",
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
    recipientKind: invoice.clientId === null ? "outsider" : "client",
    clientId: invoice.clientId ?? "",
    clientQuery: "",
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

/** All state and handlers of <InvoicesPage>; the component and its sections only render. */
export function useInvoicesPage() {
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

  const openCreate = () => {
    setError(null);
    setEditingId(null);
    startTransition(async () => {
      const contact = await getAdminSiteContactAction();
      setForm({
        ...emptyForm,
        recipientKind: "client",
        clientId: "",
        clientQuery: "",
        number: nextInvoiceNumber(state.invoices.map((item) => item.number)),
        issuedOn: todayIso(),
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
    const client =
      invoice.clientId === null
        ? undefined
        : state.clients.find((item) => item.id === invoice.clientId);
    setForm({
      ...formFromInvoice(invoice),
      clientQuery: client?.company ?? "",
    });
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
    const isOutsider = form.recipientKind === "outsider";
    const clientId = isOutsider ? null : form.clientId.trim() || null;
    if (!number || lines.length === 0) {
      setError("Add at least one line item with a description.");
      return;
    }
    if (lines.some((line) => line.description.length === 0)) {
      setError("Each line item needs a description.");
      return;
    }
    if (!isOutsider && clientId === null && editingId === null) {
      setError("Select a registered client, or switch to Outsider.");
      return;
    }
    if (
      isOutsider &&
      form.billToCompany.trim().length === 0 &&
      form.billToName.trim().length === 0
    ) {
      setError("Outsider invoices need a Bill to company or name.");
      return;
    }

    startTransition(async () => {
      setError(null);
      if (editingId !== null) {
        const existing = state.invoices.find((item) => item.id === editingId);
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

    const existing = state.invoices.find((item) => item.id === deleteId);
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

  const deleteTarget = state.invoices.find((item) => item.id === deleteId);
  return { state, modalOpen, setModalOpen, editingId, setEditingId, deleteOpen, setDeleteOpen, setDeleteId, form, setForm, error, pending, TrashIcon, EditIcon, openCreate, openEdit, save, confirmDelete, deleteTarget };
}

export type InvoicesPageModel = ReturnType<typeof useInvoicesPage>;
