"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { AdminLead, AdminLeadFollowUp, LeadStatus } from "@/lib/data/admin";
import { archiveLeadAction, changeLeadStatusAction, createLeadFollowUpAction, updateLeadAction } from "@/lib/submitCrm";

export const cardClass =
  "rounded-2xl border border-black/8 bg-white p-5 shadow-[0_8px_24px_rgba(47,58,40,0.04)] md:p-6";

export type LeadForm = {
  company: string;
  contactName: string;
  phone: string;
  email: string;
  source: string;
  status: LeadStatus;
  notes: string;
};

export function formFromLead(lead: AdminLead): LeadForm {
  return {
    company: lead.company,
    contactName: lead.contactName,
    phone: lead.phone,
    email: lead.email,
    source: lead.source,
    status: lead.status,
    notes: lead.notes,
  };
}

/** All state and handlers of <LeadDetailFields>; the component and its sections only render. */
export function useLeadDetailFields({
  lead,
  followUps,
  leads,
  allFollowUps,
  setLeads,
  setLeadFollowUps,
}: Readonly<{
  lead: AdminLead;
  followUps: AdminLeadFollowUp[];
  leads: AdminLead[];
  allFollowUps: AdminLeadFollowUp[];
  setLeads: (items: AdminLead[]) => void;
  setLeadFollowUps: (items: AdminLeadFollowUp[]) => void;
}>) {
  const router = useRouter();
  const [form, setForm] = useState(() => formFromLead(lead));
  const [followUpNote, setFollowUpNote] = useState("");
  const [followUpOutcome, setFollowUpOutcome] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const save = () => {
    const company = form.company.trim();
    if (!company) {
      return;
    }

    startTransition(async () => {
      const updateResult = await updateLeadAction({
        id: lead.id,
        version: lead.version,
        company,
        contactName: form.contactName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        source: form.source.trim(),
        notes: form.notes.trim(),
      });

      if (!updateResult.ok || !("data" in updateResult)) {
        return;
      }

      let saved = updateResult.data;
      if (form.status !== lead.status) {
        const statusResult = await changeLeadStatusAction({
          id: lead.id,
          version: saved.version,
          statusCode: form.status,
        });
        if (statusResult.ok && "data" in statusResult) {
          saved = statusResult.data;
        }
      }

      setLeads(leads.map((item) => (item.id === lead.id ? saved : item)));
    });
  };

  const addFollowUp = () => {
    const note = followUpNote.trim();
    if (!note) {
      return;
    }

    startTransition(async () => {
      const result = await createLeadFollowUpAction({
        leadId: lead.id,
        note,
        outcome: followUpOutcome.trim(),
      });
      if (result.ok && "data" in result) {
        setLeadFollowUps([...allFollowUps, result.data]);
        setFollowUpNote("");
        setFollowUpOutcome("");
      }
    });
  };

  const confirmDelete = () => {
    startTransition(async () => {
      const result = await archiveLeadAction({
        id: lead.id,
        version: lead.version,
      });
      if (result.ok) {
        setLeads(leads.filter((item) => item.id !== lead.id));
        setLeadFollowUps(allFollowUps.filter((item) => item.leadId !== lead.id));
        setDeleteOpen(false);
        router.push("/employee/leads");
      }
    });
  };
  return { router, form, setForm, followUpNote, setFollowUpNote, followUpOutcome, setFollowUpOutcome, deleteOpen, setDeleteOpen, pending, save, addFollowUp, confirmDelete };
}

export type LeadDetailFieldsModel = ReturnType<typeof useLeadDetailFields>;
