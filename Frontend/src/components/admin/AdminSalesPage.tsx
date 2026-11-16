"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormModal, adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { adminEmptyCopy } from "@/constants/admin";
import { saleStatuses, saleStatusLabel, type CarrierSaleFields } from "@/constants/sales";
import type { SaleStatus } from "@/lib/data/admin";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAdminSalesPage, CarrierSalesSheetFields, cardClass, statusPillClass } from "./AdminSalesPageModel";

export function AdminSalesPage() {

  const { state, statusFilter, setStatusFilter, modalOpen, setModalOpen, deleteOpen, setDeleteOpen, editingId, setDeleteId, form, setForm, pending, EditIcon, TrashIcon, salesEmployees, repName, filtered, openAdd, openEdit, save, confirmDelete, deleteTarget } = useAdminSalesPage();
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sales"
        lede="Carrier sales sheets across the sales team."
        actionLabel="Add sale"
        onAction={openAdd}
      />

      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor="admin-sales-status-filter"
          className="text-[0.84rem] font-semibold text-black/50"
        >
          Status
        </label>
        <select
          id="admin-sales-status-filter"
          className={`${adminFieldClass} w-auto min-w-[10rem]`}
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as SaleStatus | "all")
          }
        >
          <option value="all">All</option>
          {saleStatuses.map((status) => (
            <option key={status} value={status}>
              {saleStatusLabel[status]}
            </option>
          ))}
        </select>
      </div>

      <div className={cardClass}>
        {filtered.length === 0 ? (
          <EmptyState message={adminEmptyCopy.sales} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[48rem] text-left">
              <thead>
                <tr className="border-b border-black/8 bg-cream/60">
                  <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                    Carrier
                  </th>
                  <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                    Rep
                  </th>
                  <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                    DOT / MC
                  </th>
                  <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                    Status
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
                {filtered.map((item) => {
                  const rep = repName(item.repId);

                  return (
                    <tr key={item.id} className="hover:bg-cream/40">
                      <td className="px-4 py-3">
                        <p className="text-[0.9rem] font-semibold text-[#0d120b]">
                          {item.legalName}
                        </p>
                        <p className="text-[0.82rem] font-medium text-black/45">
                          {item.truckType || "Carrier"}
                          {item.amount
                            ? ` · ${item.currency} ${item.amount}`
                            : ""}
                          {item.taxId ? ` · Tax ${item.taxId}` : ""}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-[0.84rem] font-medium text-black/50">
                        {rep}
                      </td>
                      <td className="px-4 py-3 text-[0.84rem] font-medium text-black/50">
                        {item.usDot || "—"} / {item.mc || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${statusPillClass[item.status]}`}
                        >
                          {saleStatusLabel[item.status]}
                        </span>
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
                            disabled={pending}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminFormModal
        open={modalOpen}
        title={editingId ? "Edit carrier sales sheet" : "Add carrier sales sheet"}
        onClose={() => setModalOpen(false)}
        onSubmit={save}
      >
        <div>
          <label className="block">
            <span className={adminLabelClass}>Rep</span>
            <select
            className={adminFieldClass}
            value={form.repId}
            onChange={(event) => {
              const nextRepId = event.target.value;
              const rep = salesEmployees.find((item) => item.id === nextRepId);
              setForm((current) => ({
                ...current,
                repId: nextRepId,
                salesAgent: rep?.name ?? current.salesAgent,
              }));
            }}
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
            <span className={adminLabelClass}>Pipeline status</span>
            <select
            className={adminFieldClass}
            value={form.status}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                status: event.target.value as SaleStatus,
              }))
            }
          >
            {saleStatuses.map((status) => (
              <option key={status} value={status}>
                {saleStatusLabel[status]}
              </option>
            ))}
          </select>
          </label>
        </div>
        <CarrierSalesSheetFields
          value={form}
          taxIdEditMode={editingId !== null}
          carrierId={
            editingId === null
              ? undefined
              : state.sales.find((item) => item.id === editingId)?.carrierId
          }
          onChange={(next: CarrierSaleFields) =>
            setForm((current) => ({
              ...current,
              ...next,
              repId: current.repId,
              status: current.status,
            }))
          }
        />      </AdminFormModal>

      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete sales sheet"
        lede={`Remove "${deleteTarget?.legalName ?? "this sheet"}"?`}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
