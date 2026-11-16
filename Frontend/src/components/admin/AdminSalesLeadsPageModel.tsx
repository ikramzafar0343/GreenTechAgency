"use client";

import { useState, useTransition } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { adminIcons } from "@/components/admin/AdminIcons";
import type { AdminLead, LeadStatus } from "@/lib/data/admin";
import { archiveLeadAction, changeLeadStatusAction, createLeadAction, updateLeadAction } from "@/lib/submitCrm";

export const cardClass =
  "overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_24px_rgba(47,58,40,0.04)]";

export const statusPillClass: Record<LeadStatus, string> = {
  new: "bg-brand/12 text-brand",
  contacted: "bg-[rgba(249,161,55,0.18)] text-[#e8891a]",
  qualified: "bg-[rgba(47,58,40,0.12)] text-brand-deep",
  converted: "bg-brand/16 text-brand",
  closed: "bg-black/8 text-black/50",
};

export type LeadForm = {
  repId: string;
  company: string;
  contactName: string;
  phone: string;
  email: string;
  source: string;
  status: LeadStatus;
  notes: string;
};

export const emptyForm: LeadForm = {
  repId: "",
  company: "",
  contactName: "",
  phone: "",
  email: "",
  source: "",
  status: "new",
  notes: "",
};

/** All state and handlers of <AdminSalesLeadsPage>; the component and its sections only render. */
export function useAdminSalesLeadsPage() {
  const { state, setLeads } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [pending, startTransition] = useTransition();

  const EditIcon = adminIcons.edit;
  const TrashIcon = adminIcons.trash;

  const salesEmployees = state.employees.filter(
    (item) => item.kind === "sales" && item.active,
  );

  const repName = (repId: string) =>
    state.employees.find((item) => item.id === repId)?.name ?? "Unknown";

  const followUpCount = (leadId: string) =>
    state.leadFollowUps.filter((item) => item.leadId === leadId).length;

  const openEdit = (item: AdminLead) => {
    setEditingId(item.id);
    setForm({
      repId: item.repId,
      company: item.company,
      contactName: item.contactName,
      phone: item.phone,
      email: item.email,
      source: item.source,
      status: item.status,
      notes: item.notes,
    });
    setModalOpen(true);
  };

  const save = () => {
    const company = form.company.trim();
    if (!company || !form.repId) {
      return;
    }

    startTransition(async () => {
      if (editingId) {
        const existing = state.leads.find((item) => item.id === editingId);
        if (!existing) {
          return;
        }
        const updated = await updateLeadAction({
          id: existing.id,
          version: existing.version,
          company,
          contactName: form.contactName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          source: form.source.trim(),
          notes: form.notes.trim(),
        });
        if (!updated.ok || !("data" in updated)) {
          return;
        }
        let next = state.leads.map((item) =>
          item.id === updated.data.id ? updated.data : item,
        );
        if (form.status !== existing.status) {
          const statused = await changeLeadStatusAction({
            id: updated.data.id,
            version: updated.data.version,
            statusCode: form.status,
          });
          if (statused.ok && "data" in statused) {
            next = next.map((item) =>
              item.id === statused.data.id ? statused.data : item,
            );
          }
        }
        setLeads(next);
      } else {
        const created = await createLeadAction({
          repId: form.repId,
          company,
          contactName: form.contactName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          source: form.source.trim(),
          statusCode: form.status,
          notes: form.notes.trim(),
        });
        if (!created.ok || !("data" in created)) {
          return;
        }
        setLeads([...state.leads, created.data]);
      }
      setModalOpen(false);
    });
  };

  const confirmDelete = () => {
    if (!deleteId) {
      return;
    }
    const existing = state.leads.find((item) => item.id === deleteId);
    if (!existing) {
      return;
    }
    startTransition(async () => {
      const result = await archiveLeadAction({
        id: existing.id,
        version: existing.version,
      });
      if (!result.ok) {
        return;
      }
      setLeads(state.leads.filter((item) => item.id !== deleteId));
      setDeleteOpen(false);
      setDeleteId(null);
    });
  };

  const deleteTarget = state.leads.find((item) => item.id === deleteId);
  return { state, modalOpen, setModalOpen, deleteOpen, setDeleteOpen, editingId, setDeleteId, form, setForm, pending, EditIcon, TrashIcon, salesEmployees, repName, followUpCount, openEdit, save, confirmDelete, deleteTarget };
}

export type AdminSalesLeadsPageModel = ReturnType<typeof useAdminSalesLeadsPage>;
