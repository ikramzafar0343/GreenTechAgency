"use client";

import { EmployeePageHeader } from "@/components/employee/EmployeePageHeader";
import { adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { leadStatuses, leadStatusLabel } from "@/constants/sales";
import type { AdminLead, AdminLeadFollowUp, LeadStatus } from "@/lib/data/admin";
import { useLeadDetailFields, cardClass } from "./LeadDetailFieldsModel";
import { useParams, useRouter } from "next/navigation";
import { useEmployee } from "@/components/employee/EmployeeProvider";
import { useEffect } from "react";

function LeadDetailFields({
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

  const { router, form, setForm, followUpNote, setFollowUpNote, followUpOutcome, setFollowUpOutcome, deleteOpen, setDeleteOpen, pending, save, addFollowUp, confirmDelete } = useLeadDetailFields({ lead, followUps, leads, allFollowUps, setLeads, setLeadFollowUps });
  return (
    <div className="space-y-6">
      <EmployeePageHeader
        title={lead.company}
        lede={`${lead.contactName} · Updated ${lead.updatedAt}`}
      />

      <section className={`${cardClass} space-y-4`}>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Company</span>
            <input
            className={adminFieldClass}
            value={form.company}
            onChange={(event) =>
              setForm((current) => ({ ...current, company: event.target.value }))
            }
          />
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Contact name</span>
            <input
            className={adminFieldClass}
            value={form.contactName}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                contactName: event.target.value,
              }))
            }
          />
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Phone</span>
            <input
            className={adminFieldClass}
            value={form.phone}
            onChange={(event) =>
              setForm((current) => ({ ...current, phone: event.target.value }))
            }
          />
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Email</span>
            <input
            type="email"
            className={adminFieldClass}
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
          />
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Source</span>
            <input
            className={adminFieldClass}
            value={form.source}
            onChange={(event) =>
              setForm((current) => ({ ...current, source: event.target.value }))
            }
          />
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Status</span>
            <select
            className={adminFieldClass}
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status: event.target.value as LeadStatus,
              }))
            }
          >
            {leadStatuses.map((status) => (
              <option key={status} value={status}>
                {leadStatusLabel[status]}
              </option>
            ))}
          </select>
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Notes</span>
            <textarea
            className={`${adminFieldClass} min-h-[6rem] resize-y`}
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
          />
          </label>
        </div>
        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            disabled={pending}
            onClick={() => setDeleteOpen(true)}
            className="rounded-xl border border-black/12 bg-white px-4 py-2.5 text-[0.88rem] font-semibold text-[#0d120b]"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => router.push("/employee/leads")}
            className="rounded-xl border border-black/12 bg-white px-4 py-2.5 text-[0.88rem] font-semibold"
          >
            Back
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className="rounded-xl bg-brand px-4 py-2.5 text-[0.88rem] font-bold text-cream"
          >
            Save
          </button>
        </div>
      </section>

      <section className={`${cardClass} space-y-4`}>
        <h2 className="text-[1.05rem] font-extrabold tracking-[-0.02em] text-[#0d120b]">
          Follow-ups
        </h2>
        <ul className="divide-y divide-black/8">
          {followUps.map((item) => (
            <li key={item.id} className="py-3.5">
              <p className="text-[0.92rem] font-semibold text-[#0d120b]">
                {item.note}
              </p>
              {item.outcome ? (
                <p className="mt-1 text-[0.84rem] font-medium text-black/50">
                  Outcome: {item.outcome}
                </p>
              ) : null}
              <p className="mt-1 text-[0.8rem] font-medium text-black/35">
                {item.at}
              </p>
            </li>
          ))}
        </ul>
        <div className="space-y-3 border-t border-black/8 pt-4">
          <div>
            <label className="block">
              <span className={adminLabelClass}>Note</span>
              <textarea
              className={`${adminFieldClass} min-h-[4rem] resize-y`}
              value={followUpNote}
              onChange={(event) => setFollowUpNote(event.target.value)}
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>Outcome</span>
              <input
              className={adminFieldClass}
              value={followUpOutcome}
              onChange={(event) => setFollowUpOutcome(event.target.value)}
            />
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              disabled={pending}
              onClick={addFollowUp}
              className="rounded-xl bg-brand px-4 py-2.5 text-[0.88rem] font-bold text-cream"
            >
              Add follow-up
            </button>
          </div>
        </div>
      </section>

      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete lead"
        lede={`Remove "${lead.company}" from your pipeline?`}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, setLeads, setLeadFollowUps } = useEmployee();

  const leadId = typeof params.id === "string" ? params.id : "";
  const lead = state.leads.find((item) => item.id === leadId);

  const followUps = state.leadFollowUps
    .filter((item) => item.leadId === leadId)
    .sort((a, b) => b.at.localeCompare(a.at));

  useEffect(() => {
    if (!lead) {
      router.replace("/employee/leads");
    }
  }, [lead, router]);

  if (!lead) {
    return null;
  }

  return (
    <LeadDetailFields
      key={lead.id}
      lead={lead}
      followUps={followUps}
      leads={state.leads}
      allFollowUps={state.leadFollowUps}
      setLeads={setLeads}
      setLeadFollowUps={setLeadFollowUps}
    />
  );
}
