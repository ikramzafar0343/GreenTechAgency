"use client";

import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CmsImageField } from "@/features/cmsAdmin/CmsImageField";
import { CmsEditorActions } from "@/features/cmsAdmin/CmsEditorActions";
import { cmsCardClass } from "@/features/cmsAdmin/cmsUi";
import { usePortfolioEditor, type PortfolioEditorProps } from "./PortfolioEditorModel";

export function PortfolioEditor({ id }: PortfolioEditorProps) {

  const { row, form, error, pending, dirty, patch, onSave, onPublish, onUnpublish, onArchive, onDelete } = usePortfolioEditor({ id });
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
