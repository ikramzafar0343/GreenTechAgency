"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import { CmsEditorActions } from "@/features/cmsAdmin/CmsEditorActions";
import { findAdminEntityBySlug } from "@/features/cmsAdmin/resolveBySlug";
import { ServiceEditorForm, type ServiceFormState } from "@/features/cmsAdmin/ServiceEditorForm";
import { SubservicesPanel } from "@/features/cmsAdmin/SubservicesPanel";
import type { ServiceAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";
import { formFromRow, buildDoc } from "./ServiceEditorPart";

type ServiceEditorProps = {
  readonly slug: string;
};

export function ServiceEditor({ slug }: ServiceEditorProps) {
  const router = useRouter();
  const [row, setRow] = useState<ServiceAdminRow | null>(null);
  const [form, setForm] = useState<ServiceFormState | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const found = await findAdminEntityBySlug<ServiceAdminRow>(
          "/api/admin/services",
          slug,
        );
        if (!found) {
          setError("Service not found.");
          return;
        }
        const fresh = await cmsAdminFetch<ServiceAdminRow>(
          `/api/admin/services/${found.id}`,
        );
        const nextForm = formFromRow(fresh);
        setRow(fresh);
        setForm(nextForm);
        setBaseline(JSON.stringify(nextForm));
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Could not load service.");
      }
    });
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(
    () => form !== null && JSON.stringify(form) !== baseline,
    [form, baseline],
  );
  useDirtyGuard(dirty);

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

  const onSave = () => {
    if (!row || !form) return;
    runMutation(async () => {
      const updated = await cmsAdminFetch<ServiceAdminRow>(
        `/api/admin/services/${row.id}`,
        {
          method: "PATCH",
          body: {
            version: row.version,
            slug: form.slug.trim(),
            featured: form.featured,
            sortOrder: form.sortOrder,
            doc: buildDoc(row.draftDoc, form),
          },
        },
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
        await cmsAdminFetch(`/api/admin/services/${row.id}`, {
          method: "PATCH",
          body: {
            version: row.version,
            slug: form.slug.trim(),
            featured: form.featured,
            sortOrder: form.sortOrder,
            doc: buildDoc(row.draftDoc, form),
          },
        });
      }
      const current = await cmsAdminFetch<ServiceAdminRow>(
        `/api/admin/services/${row.id}`,
      );
      await cmsAdminFetch(`/api/admin/services/${row.id}/publish`, {
        method: "POST",
        body: { version: current.version },
      });
    });
  };

  const onUnpublish = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/services/${row.id}/unpublish`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onArchive = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/services/${row.id}/archive`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onDelete = () => {
    if (!row || !window.confirm("Permanently delete this draft service?")) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/services/${row.id}`, { method: "DELETE" });
      router.push("/admin/services");
    });
  };

  if (!form || !row) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="Service" lede="Loading CMS service…" />
        {error ? <p className="text-[0.9rem] text-black/60">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={form.title || "Service"}
        lede={`Draft slug: ${form.slug} · v${row.version}`}
      />
      <CmsEditorActions
        backHref="/admin/services"
        status={row.status}
        pending={pending}
        dirty={dirty}
        sticky
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

      <ServiceEditorForm
        form={form}
        status={row.status}
        onChange={(key, value) => setForm((prev) => (prev ? { ...prev, [key]: value } : prev))}
      />

      <SubservicesPanel serviceId={row.id} />

      <CmsEditorActions
        backHref="/admin/services"
        status={row.status}
        pending={pending}
        dirty={dirty}
        onSave={onSave}
        onPublish={onPublish}
        onUnpublish={onUnpublish}
        onArchive={onArchive}
        onDelete={onDelete}
      />
    </div>
  );
}
