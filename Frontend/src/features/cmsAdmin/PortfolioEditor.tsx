"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CmsImageField } from "@/features/cmsAdmin/CmsImageField";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import { CmsEditorActions } from "@/features/cmsAdmin/CmsEditorActions";
import { cmsCardClass } from "@/features/cmsAdmin/cmsUi";
import type { PortfolioAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

type PortfolioForm = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  clientName: string;
  relatedServiceSlug: string;
  coverPath: string;
  coverAlt: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  sortOrder: number;
};

function formFromRow(row: PortfolioAdminRow): PortfolioForm {
  const doc = row.draftDoc;
  return {
    slug: row.draftSlug,
    title: String(doc.title ?? ""),
    summary: String(doc.summary ?? ""),
    description: String(doc.description ?? ""),
    category: String(doc.category ?? "General"),
    clientName: String(doc.clientName ?? ""),
    relatedServiceSlug: String(doc.relatedServiceSlug ?? ""),
    coverPath: String(doc.coverPath ?? ""),
    coverAlt: String(doc.coverAlt ?? ""),
    seoTitle: String(doc.seoTitle ?? ""),
    seoDescription: String(doc.seoDescription ?? ""),
    featured: row.featured,
    sortOrder: row.sortOrder,
  };
}

type PortfolioEditorProps = {
  readonly id: string;
};

export function PortfolioEditor({ id }: PortfolioEditorProps) {
  const router = useRouter();
  const [row, setRow] = useState<PortfolioAdminRow | null>(null);
  const [form, setForm] = useState<PortfolioForm | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const fresh = await cmsAdminFetch<PortfolioAdminRow>(
          `/api/admin/portfolio/${id}`,
        );
        const nextForm = formFromRow(fresh);
        setRow(fresh);
        setForm(nextForm);
        setBaseline(JSON.stringify(nextForm));
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Could not load project.");
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

  const patch = <K extends keyof PortfolioForm>(key: K, value: PortfolioForm[K]) => {
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

  const buildPayload = (current: PortfolioAdminRow, values: PortfolioForm) => ({
    version: current.version,
    slug: values.slug.trim(),
    featured: values.featured,
    sortOrder: values.sortOrder,
    doc: {
      ...current.draftDoc,
      title: values.title.trim(),
      summary: values.summary.trim(),
      description: values.description.trim(),
      category: values.category.trim() || "General",
      clientName: values.clientName.trim() || null,
      relatedServiceSlug: values.relatedServiceSlug.trim() || null,
      coverPath: values.coverPath.trim() || null,
      coverAlt: values.coverAlt.trim(),
      seoTitle: values.seoTitle.trim() || null,
      seoDescription: values.seoDescription.trim() || null,
    },
  });

  const onSave = () => {
    if (!row || !form) return;
    runMutation(async () => {
      const updated = await cmsAdminFetch<PortfolioAdminRow>(
        `/api/admin/portfolio/${row.id}`,
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
        await cmsAdminFetch(`/api/admin/portfolio/${row.id}`, {
          method: "PATCH",
          body: buildPayload(row, form),
        });
      }
      const current = await cmsAdminFetch<PortfolioAdminRow>(
        `/api/admin/portfolio/${row.id}`,
      );
      await cmsAdminFetch(`/api/admin/portfolio/${row.id}/publish`, {
        method: "POST",
        body: { version: current.version },
      });
    });
  };

  const onUnpublish = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/portfolio/${row.id}/unpublish`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onArchive = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/portfolio/${row.id}/archive`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onDelete = () => {
    if (
      !row ||
      !window.confirm(
        `Permanently delete “${form?.title || "this project"}”? This cannot be undone.`,
      )
    ) {
      return;
    }
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/portfolio/${row.id}`, { method: "DELETE" });
      router.push("/admin/portfolio");
    });
  };

  if (!form || !row) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="Portfolio" lede="Loading…" />
        {error ? <p className="text-[0.9rem] text-black/60">{error}</p> : null}
      </div>
    );
  }

  const locked = row.status === "archived";

  return (
    <div className="space-y-6">
      <AdminPageHeader title={form.title || "Project"} lede={`v${row.version} · ${row.status}`} />
      <CmsEditorActions
        backHref="/admin/portfolio"
        status={row.status}
        pending={pending}
        dirty={dirty}
        onSave={onSave}
        onPublish={onPublish}
        onUnpublish={onUnpublish}
        onArchive={onArchive}
        onDelete={onDelete}
        allowDeleteWhenPublished
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
            ["category", "Category"],
            ["clientName", "Client name"],
            ["relatedServiceSlug", "Related service slug"],
            ["summary", "Summary"],
            ["seoTitle", "SEO title"],
            ["seoDescription", "SEO description"],
          ] as const
        ).map(([key, label]) => (
          <div
            key={key}
            className={key === "summary" ? "md:col-span-2" : ""}
          >
            <label htmlFor={`pf-${key}`} className={adminLabelClass}>
              {label}
            </label>
            <input
              id={`pf-${key}`}
              value={form[key]}
              onChange={(e) => patch(key, e.target.value)}
              className={adminFieldClass}
              disabled={locked}
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <label htmlFor="pf-description" className={adminLabelClass}>
            Description
          </label>
          <textarea
            id="pf-description"
            rows={8}
            value={form.description}
            onChange={(e) => patch("description", e.target.value)}
            className={adminFieldClass}
            disabled={locked}
          />
        </div>
        <div>
          <label htmlFor="pf-sort" className={adminLabelClass}>
            Sort order
          </label>
          <input
            id="pf-sort"
            type="number"
            value={form.sortOrder}
            onChange={(e) => patch("sortOrder", Number(e.target.value) || 0)}
            className={adminFieldClass}
            disabled={locked}
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-[0.88rem] font-bold text-[#0d120b]">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => patch("featured", e.target.checked)}
              disabled={locked}
            />
            Featured
          </label>
        </div>
      </div>

      <div className={`${cmsCardClass} grid gap-4 p-4 sm:p-5`}>
        <div>
          <h3 className="text-[1rem] font-bold text-[#0d120b]">Project picture</h3>
          <p className="mt-1 text-[0.88rem] font-medium text-black/50">
            Cover image shown on the portfolio grid and homepage timeline. Upload,
            replace, or clear, then save and publish.
          </p>
        </div>
        <CmsImageField
          label="Cover image"
          hint="JPEG, PNG, WebP, or GIF. Used as the project thumbnail."
          value={form.coverPath}
          altValue={form.coverAlt}
          locked={locked}
          onPathChange={(path) => patch("coverPath", path)}
          onAltChange={(alt) => patch("coverAlt", alt)}
        />
      </div>
    </div>
  );
}
