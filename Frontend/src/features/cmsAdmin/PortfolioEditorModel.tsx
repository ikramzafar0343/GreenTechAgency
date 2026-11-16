"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import type { PortfolioAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

export type PortfolioForm = {
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

export function formFromRow(row: PortfolioAdminRow): PortfolioForm {
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

export type PortfolioEditorProps = {
  readonly id: string;
};

/** All state and handlers of <PortfolioEditor>; the component and its sections only render. */
export function usePortfolioEditor({ id }: PortfolioEditorProps) {
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
  return { row, form, error, pending, dirty, patch, onSave, onPublish, onUnpublish, onArchive, onDelete };
}

export type PortfolioEditorModel = ReturnType<typeof usePortfolioEditor>;
