"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormModal, adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { InvoiceLineItemsFields } from "@/components/admin/InvoiceLineItemsFields";
import type { AdminInvoice } from "@/lib/data/admin";
import { useInvoicesPage } from "./InvoicesPageModel";
import { InvoicesPageSection1, InvoicesPageSection2, InvoicesPageSection3 } from "./InvoicesPageSections";

export function InvoicesPage() {
  const model = useInvoicesPage();
  const { modalOpen, setModalOpen, editingId, setEditingId, deleteOpen, setDeleteOpen, form, setForm, error, pending, openCreate, save, confirmDelete, deleteTarget } = model;
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Invoices"
        lede="Professional billing documents across all clients."
        actionLabel="Create invoice"
        onAction={openCreate}
      />

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[0.88rem] font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <InvoicesPageSection1 model={model} />

      <AdminFormModal
        open={modalOpen}
        title={editingId ? "Edit invoice" : "Create invoice"}
        submitLabel={editingId ? "Save" : "Create"}
        wide
        onClose={() => {
          if (!pending) {
            setModalOpen(false);
            setEditingId(null);
          }
        }}
        onSubmit={save}
      >
        {editingId === null ? (
          <InvoicesPageSection2 model={model} />
        ) : null}
        <div>
          <span className={adminLabelClass}>Invoice number</span>
          <p
            className={`${adminFieldClass} bg-cream/70 text-black/55`}
            aria-live="polite"
          >
            {form.number}
          </p>
        </div>
        <InvoiceLineItemsFields
          lines={form.lines}
          currency={form.currency.trim() || "USD"}
          onChange={(lines) =>
            setForm((current) => ({
              ...current,
              lines,
            }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={adminLabelClass}>Currency</span>
            <select
              className={adminFieldClass}
              value={form.currency}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  currency: event.target.value,
                }))
              }
            >
              <option value="USD">USD</option>
              <option value="PKR">PKR</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>
          <label className="block">
            <span className={adminLabelClass}>Category / status</span>
            <select
              className={adminFieldClass}
              value={form.status}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  status: event.target.value as AdminInvoice["status"],
                }))
              }
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
            </select>
          </label>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={adminLabelClass}>Issued on</span>
            <input
              type="date"
              className={adminFieldClass}
              value={form.issuedOn}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  issuedOn: event.target.value,
                }))
              }
            />
          </label>
          <label className="block">
            <span className={adminLabelClass}>Due date</span>
            <input
              type="date"
              className={adminFieldClass}
              value={form.dueDate}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  dueDate: event.target.value,
                }))
              }
            />
          </label>
        </div>
        <InvoicesPageSection3 model={model} />
        <div className="space-y-3">
          <p className={adminLabelClass}>From</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={adminLabelClass}>Company</span>
              <input
                className={adminFieldClass}
                value={form.fromCompany}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    fromCompany: event.target.value,
                  }))
                }
              />
            </label>
            <label className="block">
              <span className={adminLabelClass}>Email</span>
              <input
                className={adminFieldClass}
                value={form.fromEmail}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    fromEmail: event.target.value,
                  }))
                }
              />
            </label>
            <label className="block">
              <span className={adminLabelClass}>Phone</span>
              <input
                className={adminFieldClass}
                value={form.fromPhone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    fromPhone: event.target.value,
                  }))
                }
              />
            </label>
          </div>
        </div>
      </AdminFormModal>

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
