"use client";

import { adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { type InvoicesPageModel, cardClass, billToFromClient, matchesClientQuery, invoiceStatusClass, invoiceStatusLabel } from "./InvoicesPageModel";

export function InvoicesPageSection1({ model }: { model: InvoicesPageModel }) {
  const { pending, state, openEdit, EditIcon, setDeleteId, setDeleteOpen, TrashIcon } = model;
  return (
    <div className={cardClass} aria-busy={pending}>
        {state.invoices.length === 0 ? (
          <EmptyState message="No invoices yet. Create one to get started." />
        ) : (
          <ul className="divide-y divide-black/8">
            {state.invoices.map((invoice) => {
              const client =
                invoice.clientId === null
                  ? undefined
                  : state.clients.find((c) => c.id === invoice.clientId);
              const recipient =
                invoice.billToCompany ||
                client?.company ||
                (invoice.clientId === null ? "Outsider" : "Client");

              return (
                <li
                  key={invoice.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[0.92rem] font-semibold text-[#0d120b]">
                      {invoice.title}
                    </p>
                    <p className="text-[0.82rem] font-medium text-black/45">
                      {recipient} · {invoice.number} · {invoice.amount}
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
              );
            })}
          </ul>
        )}
      </div>
  );
}

export function InvoicesPageSection2({ model }: { model: InvoicesPageModel }) {
  const { form, setForm, state } = model;
  return (
    <div className="space-y-3">
            <span className={adminLabelClass}>Recipient</span>
            <div className="grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                className={`rounded-xl border px-3 py-2.5 text-left text-[0.88rem] font-semibold ${
                  form.recipientKind === "client"
                    ? "border-brand bg-brand/12 text-brand"
                    : "border-black/10 bg-white text-black/60"
                }`}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    recipientKind: "client",
                  }))
                }
              >
                Registered client
              </button>
              <button
                type="button"
                className={`rounded-xl border px-3 py-2.5 text-left text-[0.88rem] font-semibold ${
                  form.recipientKind === "outsider"
                    ? "border-brand bg-brand/12 text-brand"
                    : "border-black/10 bg-white text-black/60"
                }`}
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    recipientKind: "outsider",
                    clientId: "",
                    clientQuery: "",
                    billToCompany: "",
                    billToName: "",
                    billToEmail: "",
                    billToPhone: "",
                    billToLocation: "",
                  }))
                }
              >
                Outsider (not a client)
              </button>
            </div>
            {form.recipientKind === "client" ? (
              <div>
                <label className="block">
                  <span className={adminLabelClass}>Search clients</span>
                  <input
                    className={adminFieldClass}
                    value={form.clientQuery}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        clientQuery: event.target.value,
                      }))
                    }
                    placeholder="Company, name, or email"
                  />
                </label>
                <ul className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-black/10 bg-white">
                  {state.clients.filter((client) =>
                    matchesClientQuery(client, form.clientQuery),
                  ).length === 0 ? (
                    <li className="px-3 py-2 text-[0.84rem] font-medium text-black/45">
                      No matching clients
                    </li>
                  ) : (
                    state.clients
                      .filter((client) =>
                        matchesClientQuery(client, form.clientQuery),
                      )
                      .map((client) => {
                        const selected = form.clientId === client.id;
                        return (
                          <li key={client.id}>
                            <button
                              type="button"
                              className={`flex w-full flex-col gap-0.5 px-3 py-2 text-left ${
                                selected
                                  ? "bg-brand/14"
                                  : "hover:bg-black/[0.03]"
                              }`}
                              onClick={() =>
                                setForm((current) => ({
                                  ...current,
                                  clientId: client.id,
                                  clientQuery: client.company,
                                  ...billToFromClient(client),
                                }))
                              }
                            >
                              <span className="text-[0.88rem] font-semibold text-[#0d120b]">
                                {client.company || client.name}
                              </span>
                              <span className="text-[0.78rem] font-medium text-black/45">
                                {[client.name, client.email]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </span>
                            </button>
                          </li>
                        );
                      })
                  )}
                </ul>
              </div>
            ) : (
              <p className="text-[0.82rem] font-medium text-black/45">
                Fill Bill to below. This invoice will not appear in any client
                portal.
              </p>
            )}
          </div>
  );
}

export function InvoicesPageSection3({ model }: { model: InvoicesPageModel }) {
  const { form, setForm } = model;
  return (
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
  );
}
