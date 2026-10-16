"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import { CmsEditorActions } from "@/features/cmsAdmin/CmsEditorActions";
import { cmsCardClass } from "@/features/cmsAdmin/cmsUi";
import type { SubserviceAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

type SubserviceForm = {
  slug: string;
  title: string;
  summary: string;
  bodyText: string;
  cardImagePath: string;
  cardImageAlt: string;
  ctaLabel: string;
  ctaHref: string;
  seoTitle: string;
  seoDescription: string;
  sortOrder: number;
};

function formFromRow(row: SubserviceAdminRow): SubserviceForm {
  const doc = row.draftDoc;
  const blocks = Array.isArray(doc.detailedContent)
    ? (doc.detailedContent as Array<{ text?: string }>)
    : [];
  return {
    slug: row.draftSlug,
    title: String(doc.title ?? ""),
    summary: String(doc.summary ?? ""),
    bodyText: blocks.map((block) => String(block.text ?? "")).filter(Boolean).join("\n\n"),
    cardImagePath: String(doc.cardImagePath ?? ""),
    cardImageAlt: String(doc.cardImageAlt ?? ""),
    ctaLabel: String(doc.ctaLabel ?? ""),
    ctaHref: String(doc.ctaHref ?? ""),
    seoTitle: String(doc.seoTitle ?? ""),
    seoDescription: String(doc.seoDescription ?? ""),
    sortOrder: row.sortOrder,
  };
}

type SubserviceEditorProps = { readonly id: string };

export function SubserviceEditor({ id }: SubserviceEditorProps) {
  const router = useRouter();
  const [row, setRow] = useState<SubserviceAdminRow | null>(null);
  const [form, setForm] = useState<SubserviceForm | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const fresh = await cmsAdminFetch<SubserviceAdminRow>(
          `/api/admin/subservices/${id}`,
        );
        const nextForm = formFromRow(fresh);
        setRow(fresh);
        setForm(nextForm);
        setBaseline(JSON.stringify(nextForm));
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Could not load.");
      }
    });
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(
    () => form !== null && JSON.stringify(form) !== baseline,
    [form, baseline],
  );
  useDirtyGuard(dirty);

  const patch = <K extends keyof SubserviceForm>(key: K, value: SubserviceForm[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const runMutation = (fn: () => Promise<void>) => {
    startTransition(async () => {
      setError(null);
      try {
        await fn();
        load();
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Request failed.");
      }
    });
  };

  const buildPayload = (current: SubserviceAdminRow, values: SubserviceForm) => ({
    version: current.version,
    sortOrder: values.sortOrder,
    slug: values.slug.trim(),
    doc: {
      title: values.title.trim(),
      summary: values.summary.trim(),
      detailedContent: values.bodyText
        .split(/\n\n+/)
        .map((text) => text.trim())
        .filter(Boolean)
        .map((text) => ({ type: "paragraph", text })),
      cardImagePath: values.cardImagePath.trim() || null,
      cardImageAlt: values.cardImageAlt.trim(),
      ctaLabel: values.ctaLabel.trim() || null,
      ctaHref: values.ctaHref.trim() || null,
      seoTitle: values.seoTitle.trim() || null,
      seoDescription: values.seoDescription.trim() || null,
    },
  });

  const backHref = row ? `/admin/services` : "/admin/services";

  const onSave = () => {
    if (!row || !form) return;
    runMutation(async () => {
      const updated = await cmsAdminFetch<SubserviceAdminRow>(
        `/api/admin/subservices/${row.id}`,
        { method: "PATCH", body: buildPayload(row, form) },
      );
      const nextForm = formFromRow(updated);
      setRow(updated);
      setForm(nextForm);
      setBaseline(JSON.stringify(nextForm));
    });
  };

  const onPublish = () => {
    if (!row || !form) return;
    runMutation(async () => {
      if (dirty) {
        await cmsAdminFetch(`/api/admin/subservices/${row.id}`, {
          method: "PATCH",
          body: buildPayload(row, form),
        });
      }
      const current = await cmsAdminFetch<SubserviceAdminRow>(
        `/api/admin/subservices/${row.id}`,
      );
      await cmsAdminFetch(`/api/admin/subservices/${row.id}/publish`, {
        method: "POST",
        body: { version: current.version },
      });
    });
  };

  const onUnpublish = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/subservices/${row.id}/unpublish`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onArchive = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/subservices/${row.id}/archive`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onDelete = () => {
    if (!row || !window.confirm("Permanently delete this subservice draft?")) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/subservices/${row.id}`, { method: "DELETE" });
      router.push(backHref);
    });
  };

  if (!form || !row) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="Subservice" lede="Loading…" />
        {error ? <p className="text-[0.9rem] text-black/60">{error}</p> : null}
      </div>
    );
  }

  const locked = row.status === "archived";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={form.title || "Subservice"}
        lede={`v${row.version} · ${row.status}`}
      />
      <CmsEditorActions
        backHref={backHref}
        status={row.status}
        pending={pending}
        dirty={dirty}
        onSave={onSave}
        onPublish={onPublish}
        onUnpublish={onUnpublish}
        onArchive={onArchive}
        onDelete={onDelete}
      />
      {error ? (
        <p className="rounded-xl border border-black/10 bg-white px-4 py-3 text-[0.9rem] font-medium text-black/70">
          {error}
        </p>
      ) : null}
      <div className={`${cmsCardClass} grid gap-4 p-4 sm:p-5 md:grid-cols-2`}>
        {(
          [
            ["slug", "Slug"],
            ["title", "Title"],
            ["summary", "Summary"],
            ["cardImagePath", "Card image path"],
            ["cardImageAlt", "Card image alt"],
            ["ctaLabel", "CTA label"],
            ["ctaHref", "CTA href"],
            ["seoTitle", "SEO title"],
            ["seoDescription", "SEO description"],
          ] as const
        ).map(([key, label]) => (
          <div
            key={key}
            className={key === "summary" || key === "seoDescription" ? "md:col-span-2" : ""}
          >
            <label htmlFor={`sub-${key}`} className={adminLabelClass}>
              {label}
            </label>
            <input
              id={`sub-${key}`}
              value={form[key]}
              onChange={(e) => patch(key, e.target.value)}
              className={adminFieldClass}
              disabled={locked}
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <label htmlFor="sub-body" className={adminLabelClass}>
            Body (paragraphs separated by blank lines)
          </label>
          <textarea
            id="sub-body"
            rows={8}
            value={form.bodyText}
            onChange={(e) => patch("bodyText", e.target.value)}
            className={adminFieldClass}
            disabled={locked}
          />
        </div>
        <div>
          <label htmlFor="sub-order" className={adminLabelClass}>
            Sort order
          </label>
          <input
            id="sub-order"
            type="number"
            value={form.sortOrder}
            onChange={(e) => patch("sortOrder", Number(e.target.value) || 0)}
            className={adminFieldClass}
            disabled={locked}
          />
        </div>
      </div>
    </div>
  );
}
