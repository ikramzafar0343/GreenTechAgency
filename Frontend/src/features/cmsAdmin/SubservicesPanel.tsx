"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useTransition } from "react";
import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import {
  cmsBtnPrimary,
  cmsBtnSecondary,
  cmsCardClass,
  docTitle,
  statusBadgeClass,
} from "@/features/cmsAdmin/cmsUi";
import type { CmsListResponse, SubserviceAdminRow } from "@/features/cmsAdmin/types";

type SubservicesPanelProps = {
  readonly serviceId: string;
};

export function SubservicesPanel({ serviceId }: SubservicesPanelProps) {
  const [items, setItems] = useState<readonly SubserviceAdminRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const data = await cmsAdminFetch<CmsListResponse<SubserviceAdminRow>>(
          `/api/admin/subservices?serviceId=${encodeURIComponent(serviceId)}&limit=50`,
        );
        setItems(data.items);
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Could not load subservices.");
      }
    });
  }, [serviceId]);

  useEffect(() => {
    load();
  }, [load]);

  const onCreate = () => {
    startTransition(async () => {
      setError(null);
      try {
        await cmsAdminFetch("/api/admin/subservices", {
          method: "POST",
          body: {
            serviceId,
            slug: slug.trim(),
            title: title.trim() || "New subservice",
            summary: "Summary pending.",
          },
        });
        setSlug("");
        setTitle("");
        load();
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Create failed.");
      }
    });
  };

  const onPublish = (row: SubserviceAdminRow) => {
    startTransition(async () => {
      try {
        await cmsAdminFetch(`/api/admin/subservices/${row.id}/publish`, {
          method: "POST",
          body: { version: row.version },
        });
        load();
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Publish failed.");
      }
    });
  };

  return (
    <section className={`${cmsCardClass} p-4 sm:p-5`}>
      <h2 className="text-[1.1rem] font-extrabold tracking-[-0.03em] text-[#0d120b]">
        Subservices
      </h2>
      <p className="mt-1 text-[0.88rem] font-medium text-black/45">
        Child pages under this service (Backend CMS).
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="sub-slug" className={adminLabelClass}>
            New slug
          </label>
          <input
            id="sub-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={adminFieldClass}
            placeholder="e.g. brand-identity"
          />
        </div>
        <div>
          <label htmlFor="sub-title" className={adminLabelClass}>
            Title
          </label>
          <input
            id="sub-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={adminFieldClass}
          />
        </div>
      </div>
      <button
        type="button"
        className={`${cmsBtnPrimary} mt-3`}
        disabled={pending || !slug.trim()}
        onClick={onCreate}
      >
        Add subservice
      </button>

      {error ? (
        <p className="mt-3 text-[0.88rem] font-medium text-black/65">{error}</p>
      ) : null}

      <ul className="mt-4 divide-y divide-black/6 border-t border-black/8">
        {items.length === 0 ? (
          <li className="py-4 text-[0.88rem] text-black/45">No subservices yet.</li>
        ) : (
          items.map((row) => (
            <li
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3"
            >
              <div>
                <p className="font-semibold text-[#0d120b]">{docTitle(row)}</p>
                <p className="font-mono text-[0.78rem] text-black/45">{row.draftSlug}</p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex rounded-lg px-2 py-0.5 text-[0.72rem] font-bold capitalize ${statusBadgeClass(row.status)}`}
                >
                  {row.status}
                </span>
                <Link href={`/admin/subservices/${row.id}`} className={cmsBtnSecondary}>
                  Edit
                </Link>
                {row.status !== "published" ? (
                  <button
                    type="button"
                    className={cmsBtnSecondary}
                    disabled={pending}
                    onClick={() => onPublish(row)}
                  >
                    Publish
                  </button>
                ) : null}
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
