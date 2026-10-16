"use client";

import { Fragment, useCallback, useEffect, useState, useTransition } from "react";
import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import {
  cmsBtnSecondary,
  cmsCardClass,
  statusBadgeClass,
} from "@/features/cmsAdmin/cmsUi";
import type {
  CmsListResponse,
  EnquiryAdminRow,
  EnquiryStatus,
} from "@/features/cmsAdmin/types";

const PAGE_SIZE = 20;
const STATUSES: readonly (EnquiryStatus | "")[] = ["", "new", "read", "archived", "spam"];

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function EnquiriesAdminPage() {
  const [items, setItems] = useState<readonly EnquiryAdminRow[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState<EnquiryStatus | "">("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const params = new URLSearchParams({
          limit: String(PAGE_SIZE),
          offset: String(offset),
        });
        if (status) params.set("status", status);
        const data = await cmsAdminFetch<CmsListResponse<EnquiryAdminRow>>(
          `/api/admin/enquiries?${params.toString()}`,
        );
        setItems(data.items);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Could not load enquiries.");
      }
    });
  }, [offset, status]);

  useEffect(() => {
    load();
  }, [load]);

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pageIndex = Math.floor(offset / PAGE_SIZE) + 1;

  const setEnquiryStatus = (row: EnquiryAdminRow, next: EnquiryStatus) => {
    startTransition(async () => {
      setError(null);
      try {
        await cmsAdminFetch<EnquiryAdminRow>(`/api/admin/enquiries/${row.id}`, {
          method: "PATCH",
          body: { status: next },
        });
        load();
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Status update failed.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Enquiries"
        lede="Contact and project submissions from the public site."
      />

      <div className={`${cmsCardClass} p-4 sm:p-5`}>
        <label htmlFor="enq-status" className={adminLabelClass}>
          Status
        </label>
        <select
          id="enq-status"
          value={status}
          onChange={(e) => {
            setOffset(0);
            setStatus(e.target.value as EnquiryStatus | "");
          }}
          className={`${adminFieldClass} max-w-xs`}
        >
          {STATUSES.map((value) => (
            <option key={value || "all"} value={value}>
              {value === "" ? "All statuses" : value}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <p className="rounded-xl border border-black/10 bg-white px-4 py-3 text-[0.9rem] font-medium text-black/70">
          {error}
        </p>
      ) : null}

      <div className={cmsCardClass}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[0.88rem]">
            <thead>
              <tr className="border-b border-black/8 text-[0.78rem] font-bold uppercase tracking-wide text-black/45">
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Kind</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-black/45">
                    {pending ? "Loading…" : "No enquiries found."}
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <Fragment key={row.id}>
                    <tr className="border-b border-black/6">
                      <td className="px-4 py-3 text-black/55">{formatWhen(row.createdAt)}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#0d120b]">{row.name}</p>
                        <p className="text-[0.82rem] text-black/50">{row.email}</p>
                      </td>
                      <td className="px-4 py-3 capitalize text-black/60">{row.kind}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-lg px-2 py-0.5 text-[0.75rem] font-bold capitalize ${statusBadgeClass(row.status === "new" ? "draft" : row.status === "read" ? "published" : "archived")}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-1.5">
                          <button
                            type="button"
                            className={cmsBtnSecondary}
                            onClick={() =>
                              setExpandedId((id) => (id === row.id ? null : row.id))
                            }
                          >
                            {expandedId === row.id ? "Hide" : "View"}
                          </button>
                          <select
                            className={adminFieldClass}
                            value={row.status}
                            disabled={pending}
                            onChange={(e) =>
                              setEnquiryStatus(row, e.target.value as EnquiryStatus)
                            }
                            aria-label={`Status for ${row.name}`}
                          >
                            {STATUSES.filter(Boolean).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                    {expandedId === row.id ? (
                      <tr className="border-b border-black/6 bg-black/[0.02]">
                        <td colSpan={5} className="px-4 py-4 text-[0.88rem] text-black/70">
                          {row.service ? (
                            <p>
                              <span className="font-bold">Service:</span> {row.service}
                            </p>
                          ) : null}
                          {row.company ? (
                            <p>
                              <span className="font-bold">Company:</span> {row.company}
                            </p>
                          ) : null}
                          {row.phone ? (
                            <p>
                              <span className="font-bold">Phone:</span> {row.phone}
                            </p>
                          ) : null}
                          <p className="mt-2 whitespace-pre-wrap">{row.message}</p>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.85rem] font-medium text-black/45">
          {total} total · page {pageIndex} of {pageCount}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className={cmsBtnSecondary}
            disabled={pending || offset <= 0}
            onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}
          >
            Previous
          </button>
          <button
            type="button"
            className={cmsBtnSecondary}
            disabled={pending || offset + PAGE_SIZE >= total}
            onClick={() => setOffset(offset + PAGE_SIZE)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
