"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import { CmsEditorActions } from "@/features/cmsAdmin/CmsEditorActions";
import { cmsCardClass } from "@/features/cmsAdmin/cmsUi";
import type { FaqAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

type FaqForm = {
  question: string;
  answer: string;
  sortOrder: number;
};

function formFromRow(row: FaqAdminRow): FaqForm {
  const doc = row.draftDoc as { question?: string; answer?: string };
  return {
    question: String(doc.question ?? ""),
    answer: String(doc.answer ?? ""),
    sortOrder: row.sortOrder,
  };
}

type FaqEditorProps = {
  readonly id: string;
};

export function FaqEditor({ id }: FaqEditorProps) {
  const router = useRouter();
  const [row, setRow] = useState<FaqAdminRow | null>(null);
  const [form, setForm] = useState<FaqForm | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const fresh = await cmsAdminFetch<FaqAdminRow>(`/api/admin/faq/${id}`);
        const nextForm = formFromRow(fresh);
        setRow(fresh);
        setForm(nextForm);
        setBaseline(JSON.stringify(nextForm));
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Could not load FAQ.");
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

  const patch = <K extends keyof FaqForm>(key: K, value: FaqForm[K]) => {
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

  const buildPayload = (current: FaqAdminRow, values: FaqForm) => ({
    version: current.version,
    sortOrder: values.sortOrder,
    doc: {
      question: values.question.trim(),
      answer: values.answer.trim(),
    },
  });

  const onSave = () => {
    if (!row || !form) return;
    runMutation(async () => {
      const updated = await cmsAdminFetch<FaqAdminRow>(`/api/admin/faq/${row.id}`, {
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
        await cmsAdminFetch(`/api/admin/faq/${row.id}`, {
          method: "PATCH",
          body: buildPayload(row, form),
        });
      }
      const current = await cmsAdminFetch<FaqAdminRow>(`/api/admin/faq/${row.id}`);
      await cmsAdminFetch(`/api/admin/faq/${row.id}/publish`, {
        method: "POST",
        body: { version: current.version },
      });
    });
  };

  const onUnpublish = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/faq/${row.id}/unpublish`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onArchive = () => {
    if (!row) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/faq/${row.id}/archive`, {
        method: "POST",
        body: { version: row.version },
      });
    });
  };

  const onDelete = () => {
    if (!row || !window.confirm("Permanently delete this FAQ draft?")) return;
    runMutation(async () => {
      await cmsAdminFetch(`/api/admin/faq/${row.id}`, { method: "DELETE" });
      router.push("/admin/faqs");
    });
  };

  if (!form || !row) {
    return (
      <div className="space-y-4">
        <AdminPageHeader title="FAQ item" lede="Loading…" />
        {error ? <p className="text-[0.9rem] text-black/60">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={form.question || "FAQ item"}
        lede={`v${row.version} · ${row.status} · order ${row.sortOrder}`}
      />
      <CmsEditorActions
        backHref="/admin/faqs"
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
      <div className={`${cmsCardClass} grid gap-4 p-4 sm:p-5`}>
        <div>
          <label htmlFor="faq-question" className={adminLabelClass}>
            Question
          </label>
          <input
            id="faq-question"
            value={form.question}
            onChange={(e) => patch("question", e.target.value)}
            className={adminFieldClass}
            disabled={row.status === "archived"}
          />
        </div>
        <div>
          <label htmlFor="faq-answer" className={adminLabelClass}>
            Answer
          </label>
          <textarea
            id="faq-answer"
            rows={8}
            value={form.answer}
            onChange={(e) => patch("answer", e.target.value)}
            className={adminFieldClass}
            disabled={row.status === "archived"}
          />
        </div>
        <div className="max-w-xs">
          <label htmlFor="faq-order" className={adminLabelClass}>
            Sort order
          </label>
          <input
            id="faq-order"
            type="number"
            value={form.sortOrder}
            onChange={(e) => patch("sortOrder", Number(e.target.value) || 0)}
            className={adminFieldClass}
            disabled={row.status === "archived"}
          />
        </div>
      </div>
    </div>
  );
}
