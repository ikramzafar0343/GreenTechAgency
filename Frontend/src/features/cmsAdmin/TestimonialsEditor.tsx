"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import { CmsEditorActions } from "@/features/cmsAdmin/CmsEditorActions";
import {
  TestimonialsEditorFields,
  type TestimonialFormFields,
} from "@/features/cmsAdmin/TestimonialsEditorFields";
import type { TestimonialAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

function formFromRow(row: TestimonialAdminRow): TestimonialFormFields {
  const doc = row.draftDoc;
  return {
    companyName: String(doc.companyName ?? ""),
    companyLogoUrl: String(doc.companyLogoUrl ?? ""),
    location: String(doc.location ?? ""),
    reviewerName: String(doc.reviewerName ?? ""),
    reviewerRole: String(doc.reviewerRole ?? ""),
    reviewerPhotoUrl: String(doc.reviewerPhotoUrl ?? ""),
    quote: String(doc.quote ?? ""),
    emphasisText: String(doc.emphasisText ?? ""),
    rating: doc.rating === null || doc.rating === undefined ? "" : String(doc.rating),
    ratingScale: Number(doc.ratingScale ?? 5) || 5,
    sourceUrl: String(doc.sourceUrl ?? ""),
    sortOrder: row.sortOrder,
    featured: row.featured,
  };
}

function buildDoc(values: TestimonialFormFields) {
  const ratingTrim = values.rating.trim();
  return {
    companyName: values.companyName.trim(),
    companyLogoUrl: values.companyLogoUrl.trim() || null,
    location: values.location.trim() || null,
    reviewerName: values.reviewerName.trim(),
    reviewerRole: values.reviewerRole.trim() || null,
    reviewerPhotoUrl: values.reviewerPhotoUrl.trim() || null,
    quote: values.quote.trim(),
    emphasisText: values.emphasisText.trim() || null,
    rating: ratingTrim === "" ? null : Number(ratingTrim),
    ratingScale: values.ratingScale,
    sourceUrl: values.sourceUrl.trim() || null,
  };
}

type TestimonialsEditorProps = { readonly id: string };

export function TestimonialsEditor({ id }: TestimonialsEditorProps) {
  const router = useRouter();
  const [row, setRow] = useState<TestimonialAdminRow | null>(null);
  const [form, setForm] = useState<TestimonialFormFields | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const fresh = await cmsAdminFetch<TestimonialAdminRow>(
          `/api/admin/testimonials/${id}`,
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

  const patch = <K extends keyof TestimonialFormFields>(
    key: K,
    value: TestimonialFormFields[K],
  ) => {
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

  const buildPayload = (current: TestimonialAdminRow, values: TestimonialFormFields) => ({
    version: current.version,
    sortOrder: values.sortOrder,
    featured: values.featured,
    doc: buildDoc(values),
  });

  const onSave = () => {
    if (!row || !form) return;
    runMutation(async () => {
      const updated = await cmsAdminFetch<TestimonialAdminRow>(
        `/api/admin/testimonials/${row.id}`,
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
        await cmsAdminFetch(`/api/admin/testimonials/${row.id}`, {
          method: "PATCH",
          body: buildPayload(row, form),
        });
      }
      const current = await cmsAdminFetch<TestimonialAdminRow>(
        `/api/admin/testimonials/${row.id}`,
      );
      await cmsAdminFetch(`/api/admin/testimonials/${row.id}/publish`, {
        method: "POST",
        body: { version: current.version },
      });
    });
  };

  const onUnpublish = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/testimonials/${row.id}/unpublish`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onArchive = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/testimonials/${row.id}/archive`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onDelete = () => {
    if (!row || !window.confirm("Permanently delete this testimonial draft?")) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/testimonials/${row.id}`, { method: "DELETE" });
      router.push("/admin/testimonials");
    });
  };

  if (!form || !row) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="Testimonial" lede="Loading…" />
        {error ? <p className="text-[0.9rem] text-black/60">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={form.companyName || "Testimonial"}
        lede={`v${row.version} · ${row.status} · order ${row.sortOrder}`}
      />
      <CmsEditorActions
        backHref="/admin/testimonials"
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
      <TestimonialsEditorFields
        form={form}
        locked={row.status === "archived"}
        onChange={patch}
      />
    </div>
  );
}
