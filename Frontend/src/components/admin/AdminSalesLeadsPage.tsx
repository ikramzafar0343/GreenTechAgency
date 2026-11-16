"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { adminEmptyCopy } from "@/constants/admin";
import { leadStatusLabel } from "@/constants/sales";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAdminSalesLeadsPage, cardClass, statusPillClass } from "./AdminSalesLeadsPageModel";
import { AdminSalesLeadsPageSection1 } from "./AdminSalesLeadsPageSections";

export function AdminSalesLeadsPage() {
  const model = useAdminSalesLeadsPage();
  const { state, deleteOpen, setDeleteOpen, setDeleteId, EditIcon, TrashIcon, repName, followUpCount, openEdit, confirmDelete, deleteTarget } = model;
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sales leads"
        lede="All leads and follow-up activity across the team."
      />

      <div className={cardClass}>
        {state.leads.length === 0 ? (
          <EmptyState message={adminEmptyCopy.leads} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-left">
              <thead>
                <tr className="border-b border-black/8 bg-cream/60">
                  <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                    Company
                  </th>
                  <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                    Rep
                  </th>
                  <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                    Follow-ups
                  </th>
                  <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                    Updated
                  </th>
                  <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/8">
                {state.leads.map((item) => (
                  <tr key={item.id} className="hover:bg-cream/40">
                    <td className="px-4 py-3">
                      <p className="text-[0.9rem] font-semibold text-[#0d120b]">
                        {item.company}
                      </p>
                      <p className="text-[0.82rem] font-medium text-black/45">
                        {item.contactName} · {item.source}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-[0.84rem] font-medium text-black/50">
                      {repName(item.repId)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${statusPillClass[item.status]}`}
                      >
                        {leadStatusLabel[item.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[0.84rem] font-medium text-black/50">
                      {followUpCount(item.id)}
                    </td>
                    <td className="px-4 py-3 text-[0.84rem] font-medium text-black/50">
                      {item.updatedAt}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label="Edit"
                          onClick={() => openEdit(item)}
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-black/10 bg-white"
                        >
                          <EditIcon className="size-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Delete"
                          onClick={() => {
                            setDeleteId(item.id);
                            setDeleteOpen(true);
                          }}
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-black/10 bg-white"
                        >
                          <TrashIcon className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminSalesLeadsPageSection1 model={model} />

      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete lead"
        lede={`Remove "${deleteTarget?.company ?? "this lead"}"?`}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
