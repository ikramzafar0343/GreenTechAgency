"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import { CmsEditorActions } from "@/features/cmsAdmin/CmsEditorActions";
import {
  STAT_METRIC_TYPES,
  STAT_PRESETS,
  StatsEditorFields,
  type StatFormFields,
} from "@/features/cmsAdmin/StatsEditorFields";
import type { StatAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

function formFromRow(row: StatAdminRow): StatFormFields {
  const doc = row.draftDoc;
  const metricType = STAT_METRIC_TYPES.includes(
    doc.metricType as (typeof STAT_METRIC_TYPES)[number],
  )
    ? (doc.metricType as (typeof STAT_METRIC_TYPES)[number])
    : "COUNT";
  const preset = STAT_PRESETS.includes(doc.preset as (typeof STAT_PRESETS)[number])
    ? (doc.preset as (typeof STAT_PRESETS)[number])
    : "STANDARD_NUMBER";
  return {
    metricType,
    preset,
    value: Number(doc.value ?? 0) || 0,
    prefix: String(doc.prefix ?? ""),
    suffix: String(doc.suffix ?? ""),
    label: String(doc.label ?? ""),
    emphasisWord: String(doc.emphasisWord ?? ""),
    sortOrder: row.sortOrder,
  };
}

type StatsEditorProps = { readonly id: string };

export function StatsEditor({ id }: StatsEditorProps) {
  const router = useRouter();
  const [row, setRow] = useState<StatAdminRow | null>(null);
  const [form, setForm] = useState<StatFormFields | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const fresh = await cmsAdminFetch<StatAdminRow>(`/api/admin/stats/${id}`);
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

  const patch = <K extends keyof StatFormFields>(
    key: K,
    value: StatFormFields[K],
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

  const buildPayload = (current: StatAdminRow, values: StatFormFields) => ({
    version: current.version,
    sortOrder: values.sortOrder,
    doc: {
      metricType: values.metricType,
      preset: values.preset,
      value: values.value,
      prefix: values.prefix.trim() || null,
      suffix: values.suffix.trim() || null,
      label: values.label.trim(),
      emphasisWord: values.emphasisWord.trim() || null,
    },
  });

  const onSave = () => {
    if (!row || !form) return;
    runMutation(async () => {
      const updated = await cmsAdminFetch<StatAdminRow>(`/api/admin/stats/${row.id}`, {
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
        await cmsAdminFetch(`/api/admin/stats/${row.id}`, {
          method: "PATCH",
          body: buildPayload(row, form),
        });
      }
      const current = await cmsAdminFetch<StatAdminRow>(`/api/admin/stats/${row.id}`);
      await cmsAdminFetch(`/api/admin/stats/${row.id}/publish`, {
        method: "POST",
        body: { version: current.version },
      });
    });
  };

  const onUnpublish = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/stats/${row.id}/unpublish`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onArchive = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/stats/${row.id}/archive`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onDelete = () => {
    if (!row || !window.confirm("Permanently delete this metric draft?")) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/stats/${row.id}`, { method: "DELETE" });
      router.push("/admin/stats");
    });
  };

  if (!form || !row) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="Stat metric" lede="Loading…" />
        {error ? <p className="text-[0.9rem] text-black/60">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={form.label || "Stat metric"}
        lede={`v${row.version} · ${row.status} · order ${row.sortOrder}`}
      />
      <CmsEditorActions
        backHref="/admin/stats"
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
      <StatsEditorFields
        form={form}
        locked={row.status === "archived"}
        onChange={patch}
      />
    </div>
  );
}
