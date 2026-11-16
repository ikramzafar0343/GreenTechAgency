"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { adminEmptyCopy } from "@/constants/admin";
import { EmptyState } from "@/components/ui/EmptyState";
import { useClientInvoicesPage, cardClass, invoiceStatusClass, invoiceStatusLabel } from "./ClientInvoicesPageModel";
import { ClientInvoicesPageSection1 } from "./ClientInvoicesPageSections";

export function ClientInvoicesPage() {
  const model = useClientInvoicesPage();
  const { deleteOpen, setDeleteOpen, setDeleteId, error, pending, TrashIcon, EditIcon, invoices, openCreate, openEdit, confirmDelete, deleteTarget } = model;
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Invoices"
        lede="Professional billing documents for this client."
        actionLabel="Create invoice"
        onAction={openCreate}
      />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.88rem] font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className={cardClass} aria-busy={pending}>
        {invoices.length === 0 ? (
          <EmptyState message={adminEmptyCopy.clientInvoices} />
        ) : (
          <ul className="divide-y divide-black/8">
            {invoices.map((invoice) => (
              <li
                key={invoice.id}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-[0.92rem] font-semibold text-[#0d120b]">
                    {invoice.title}
                  </p>
                  <p className="text-[0.82rem] font-medium text-black/45">
                    {invoice.number} · {invoice.amount} · {invoice.updatedAt}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${invoiceStatusClass[invoice.status]}`}
                  >
                    {invoiceStatusLabel[invoice.status]}
                  </span>
                  <a
                    href={`/admin/invoices/${invoice.id}/print`}
                    className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[0.8rem] font-semibold text-brand"
                  >
                    View
                  </a>
                  <a
                    href={`/api/invoices/${invoice.id}/pdf`}
                    className="rounded-lg border border-black/10 bg-white px-3 py-1.5 text-[0.8rem] font-semibold text-brand"
                  >
                    Download
                  </a>
                  <button
                    type="button"
                    aria-label="Edit"
                    disabled={pending}
                    onClick={() => openEdit(invoice)}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-black/10 bg-white disabled:opacity-40"
                  >
                    <EditIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Delete"
                    disabled={pending}
                    onClick={() => {
                      setDeleteId(invoice.id);
                      setDeleteOpen(true);
                    }}
                    className="inline-flex size-8 items-center justify-center rounded-lg border border-black/10 bg-white disabled:opacity-40"
                  >
                    <TrashIcon className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ClientInvoicesPageSection1 model={model} />

      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete invoice"
        lede={`Remove "${deleteTarget?.title ?? "this invoice"}" from billing records?`}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
