"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { CmsImageField } from "@/features/cmsAdmin/CmsImageField";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import { CmsEditorActions } from "@/features/cmsAdmin/CmsEditorActions";
import { cmsCardClass } from "@/features/cmsAdmin/cmsUi";
import type { BlogAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

type BlogForm = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  bodyText: string;
  coverPath: string;
  coverAlt: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  homepageOrder: number;
};

function paragraphsToText(body: unknown): string {
  if (!Array.isArray(body)) return "";
  return body
    .map((block) => {
      if (!block || typeof block !== "object") return "";
      const row = block as { type?: string; text?: string };
      if (row.type === "heading") return `## ${row.text ?? ""}`;
      return row.text ?? "";
    })
    .filter(Boolean)
    .join("\n\n");
}

function textToBody(text: string) {
  return text
    .split(/\n\n+/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      if (chunk.startsWith("## ")) {
        return { type: "heading" as const, level: 2 as const, text: chunk.slice(3).trim() };
      }
      return { type: "paragraph" as const, text: chunk };
    });
}

function formFromRow(row: BlogAdminRow): BlogForm {
  const doc = row.draftDoc;
  return {
    slug: row.draftSlug,
    title: String(doc.title ?? ""),
    excerpt: String(doc.excerpt ?? ""),
    category: String(doc.category ?? "General"),
    bodyText: paragraphsToText(doc.body),
    coverPath: String(doc.coverPath ?? ""),
    coverAlt: String(doc.coverAlt ?? ""),
    seoTitle: String(doc.seoTitle ?? ""),
    seoDescription: String(doc.seoDescription ?? ""),
    featured: row.featured,
    homepageOrder: row.homepageOrder,
  };
}

type BlogEditorProps = {
  readonly id: string;
};

export function BlogEditor({ id }: BlogEditorProps) {
  const router = useRouter();
  const [row, setRow] = useState<BlogAdminRow | null>(null);
  const [form, setForm] = useState<BlogForm | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const fresh = await cmsAdminFetch<BlogAdminRow>(`/api/admin/blog/${id}`);
        const nextForm = formFromRow(fresh);
        setRow(fresh);
        setForm(nextForm);
        setBaseline(JSON.stringify(nextForm));
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Could not load post.");
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

  const patch = <K extends keyof BlogForm>(key: K, value: BlogForm[K]) => {
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

  const buildPayload = (current: BlogAdminRow, values: BlogForm) => ({
    version: current.version,
    slug: values.slug.trim(),
    featured: values.featured,
    homepageOrder: values.homepageOrder,
    doc: {
      ...current.draftDoc,
      title: values.title.trim(),
      excerpt: values.excerpt.trim(),
      category: values.category.trim() || "General",
      body: textToBody(values.bodyText),
      coverPath: values.coverPath.trim() || null,
      coverAlt: values.coverAlt.trim(),
      seoTitle: values.seoTitle.trim() || null,
      seoDescription: values.seoDescription.trim() || null,
    },
  });

  const onSave = () => {
    if (!row || !form) return;
    runMutation(async () => {
      const updated = await cmsAdminFetch<BlogAdminRow>(`/api/admin/blog/${row.id}`, {
        method: "PATCH",
        body: buildPayload(row, form),
      });
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
        await cmsAdminFetch(`/api/admin/blog/${row.id}`, {
          method: "PATCH",
          body: buildPayload(row, form),
        });
      }
      const current = await cmsAdminFetch<BlogAdminRow>(`/api/admin/blog/${row.id}`);
      await cmsAdminFetch(`/api/admin/blog/${row.id}/publish`, {
        method: "POST",
        body: { version: current.version },
      });
    });
  };

  const onUnpublish = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/blog/${row.id}/unpublish`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onArchive = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/blog/${row.id}/archive`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onDelete = () => {
    if (!row || !window.confirm("Permanently delete this draft post?")) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/blog/${row.id}`, { method: "DELETE" });
      router.push("/admin/blog");
    });
  };

  if (!form || !row) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="Insight / Blog post" lede="Loading…" />
        {error ? <p className="text-[0.9rem] text-black/60">{error}</p> : null}
      </div>
    );
  }

  const locked = row.status === "archived";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={form.title || "Insight / Blog post"}
        lede={`v${row.version} · ${row.status}`}
      />
      <CmsEditorActions
        backHref="/admin/blog"
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
            ["category", "Category"],
            ["excerpt", "Excerpt"],
            ["seoTitle", "SEO title"],
            ["seoDescription", "SEO description"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className={key === "excerpt" ? "md:col-span-2" : ""}>
            <label htmlFor={`blog-${key}`} className={adminLabelClass}>
              {label}
            </label>
            <input
              id={`blog-${key}`}
              value={form[key]}
              onChange={(e) => patch(key, e.target.value)}
              className={adminFieldClass}
              disabled={locked}
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <label htmlFor="blog-body" className={adminLabelClass}>
            Body (paragraphs separated by blank lines; prefix ## for headings)
          </label>
          <textarea
            id="blog-body"
            rows={12}
            value={form.bodyText}
            onChange={(e) => patch("bodyText", e.target.value)}
            className={adminFieldClass}
            disabled={locked}
          />
        </div>
        <div>
          <label htmlFor="blog-order" className={adminLabelClass}>
            Homepage order
          </label>
          <input
            id="blog-order"
            type="number"
            value={form.homepageOrder}
            onChange={(e) => patch("homepageOrder", Number(e.target.value) || 0)}
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
          <h3 className="text-[1rem] font-bold text-[#0d120b]">Insight picture</h3>
          <p className="mt-1 text-[0.88rem] font-medium text-black/50">
            Cover image on the Insights page cards and homepage Insights section.
            Upload, replace, or clear, then save and publish.
          </p>
        </div>
        <CmsImageField
          label="Cover image"
          hint="JPEG, PNG, WebP, or GIF."
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
