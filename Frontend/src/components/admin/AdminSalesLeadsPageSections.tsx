"use client";

import { AdminFormModal, adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { leadStatuses, leadStatusLabel } from "@/constants/sales";
import type { LeadStatus } from "@/lib/data/admin";
import { type AdminSalesLeadsPageModel } from "./AdminSalesLeadsPageModel";

export function AdminSalesLeadsPageSection1({ model }: { model: AdminSalesLeadsPageModel }) {
  const { modalOpen, editingId, pending, setModalOpen, save, form, setForm, salesEmployees } = model;
  return (
    <AdminFormModal
        open={modalOpen}
        title={editingId ? "Edit lead" : "Add lead"}
        onClose={() => {
          if (!pending) {
            setModalOpen(false);
          }
        }}
        onSubmit={save}
      >
        <div>
          <label className="block">
            <span className={adminLabelClass}>Rep</span>
            <select
            className={adminFieldClass}
            value={form.repId}
            onChange={(event) =>
              setForm((current) => ({ ...current, repId: event.target.value }))
            }
          >
            <option value="">Select rep</option>
            {salesEmployees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
          </label>
        </div>
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
            className={`${adminFieldClass} min-h-[5rem] resize-y`}
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({ ...current, notes: event.target.value }))
            }
          />
          </label>
        </div>
      </AdminFormModal>
  );
}
