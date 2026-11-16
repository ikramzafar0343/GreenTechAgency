"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { useSalariesPage, cardClass, statusClass, statusLabel } from "./SalariesPageModel";
import { SalariesPageSection1 } from "./SalariesPageSections";

export function SalariesPage() {
  const model = useSalariesPage();
  const { state, pending, formOpen, deleteOpen, setDeleteOpen, setDeleteId, error, openCreate, openEdit, confirmDelete, deleteTarget } = model;
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Salaries"
        lede="Create, edit, and print salary slips for anyone — registered employees or custom names."
        actionLabel="Create salary slip"
        onAction={openCreate}
      />

      {error && !formOpen ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.88rem] font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className={cardClass} aria-busy={pending}>
        {state.salarySlips.length === 0 ? (
          <EmptyState message="No salary slips yet. Create one to get started." />
        ) : (
          <ul className="divide-y divide-black/8">
            {state.salarySlips.map((slip) => (
              <li
                key={slip.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-[0.92rem] font-semibold text-[#0d120b]">
                    {slip.employeeName}
                  </p>
                  <p className="text-[0.82rem] font-medium text-black/45">
                    {slip.salaryMonth}
                    {slip.designation ? ` · ${slip.designation}` : ""} ·{" "}
                    {slip.currency} {slip.netSalary}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${statusClass[slip.status]}`}
                  >
                    {statusLabel[slip.status]}
                  </span>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => openEdit(slip)}
                    className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[0.8rem] font-semibold text-[#0d120b] disabled:opacity-40"
                  >
                    Edit
                  </button>
                  <a
                    href={`/admin/salaries/${slip.id}/print`}
                    className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[0.8rem] font-semibold text-brand"
                  >
                    View
                  </a>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      setDeleteId(slip.id);
                      setDeleteOpen(true);
                    }}
                    className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[0.8rem] font-semibold text-[#0d120b] disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <SalariesPageSection1 model={model} />

      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete salary slip"
        lede={
          deleteTarget
            ? `Delete the salary slip for ${deleteTarget.employeeName} (${deleteTarget.salaryMonth})?`
            : "Delete this salary slip?"
        }
        onClose={() => {
          setDeleteOpen(false);
          setDeleteId(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
