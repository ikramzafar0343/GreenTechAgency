"use client";

import { AdminFormModal, adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { InvoiceLineItemsFields } from "@/components/admin/InvoiceLineItemsFields";
import type { AdminInvoice } from "@/lib/data/admin";
import { type ClientInvoicesPageModel } from "./ClientInvoicesPageModel";

export function ClientInvoicesPageSection1({ model }: { model: ClientInvoicesPageModel }) {
  const { modalOpen, editingId, pending, setModalOpen, setEditingId, save, form, setForm } = model;
  return (
    <AdminFormModal
        open={modalOpen}
        title={editingId ? "Edit invoice" : "Create invoice"}
        wide
        onClose={() => {
          if (!pending) {
            setModalOpen(false);
            setEditingId(null);
          }
        }}
        onSubmit={save}
        submitLabel={editingId ? "Save" : "Create"}
      >
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
        <div className="space-y-3">
          <p className={adminLabelClass}>Bill to</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={adminLabelClass}>Company</span>
              <input
                className={adminFieldClass}
                value={form.billToCompany}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    billToCompany: event.target.value,
                  }))
                }
              />
            </label>
            <label className="block">
              <span className={adminLabelClass}>Contact name</span>
              <input
                className={adminFieldClass}
                value={form.billToName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    billToName: event.target.value,
                  }))
                }
              />
            </label>
            <label className="block">
              <span className={adminLabelClass}>Email</span>
              <input
                className={adminFieldClass}
                value={form.billToEmail}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    billToEmail: event.target.value,
                  }))
                }
              />
            </label>
            <label className="block">
              <span className={adminLabelClass}>Phone</span>
              <input
                className={adminFieldClass}
                value={form.billToPhone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    billToPhone: event.target.value,
                  }))
                }
              />
            </label>
          </div>
          <label className="block">
            <span className={adminLabelClass}>Location</span>
            <input
              className={adminFieldClass}
              value={form.billToLocation}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  billToLocation: event.target.value,
                }))
              }
            />
          </label>
        </div>
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
  );
}
