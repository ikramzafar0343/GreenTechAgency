"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import {
  cmsBtnPrimary,
  cmsBtnSecondary,
  cmsCardClass,
} from "@/features/cmsAdmin/cmsUi";
import type { SiteDocumentAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

type SiteDocumentDraftEditorProps = {
  siteKey: string;
  label: string;
};

export function SiteDocumentDraftEditor({
  siteKey,
  label,
}: SiteDocumentDraftEditorProps) {
  const [row, setRow] = useState<SiteDocumentAdminRow | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const fresh = await cmsAdminFetch<SiteDocumentAdminRow>(
          `/api/admin/site/${siteKey}`,
        );
        const nextText = JSON.stringify(fresh.draftDoc, null, 2);
        setRow(fresh);
        setJsonText(nextText);
        setBaseline(nextText);
      } catch (err) {
        setError(
          err instanceof CmsAdminError
            ? err.message
            : `Could not load ${label}.`,
        );
      }
    });
  }, [label, siteKey]);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(
    () => jsonText !== baseline,
    [jsonText, baseline],
  );
  useDirtyGuard(dirty);

  const parseDraft = (): Record<string, unknown> | null => {
    try {
      const parsed: unknown = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        setError("Document must be a JSON object.");
        return null;
      }
      return parsed as Record<string, unknown>;
    } catch {
      setError("Invalid JSON.");
      return null;
    }
  };

  const onSave = () => {
    if (!row) return;
    const doc = parseDraft();
    if (!doc) return;
    startTransition(async () => {
      setError(null);
      try {
        const updated = await cmsAdminFetch<SiteDocumentAdminRow>(
          `/api/admin/site/${siteKey}`,
          {
            method: "PATCH",
            body: { version: row.version, doc },
          },
        );
        const nextText = JSON.stringify(updated.draftDoc, null, 2);
        setRow(updated);
        setJsonText(nextText);
        setBaseline(nextText);
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Save failed.");
      }
    });
  };

  const onPublish = () => {
    if (!row) return;
    const doc = parseDraft();
    if (!doc) return;
    startTransition(async () => {
      setError(null);
      try {
        let current = row;
        if (dirty) {
          current = await cmsAdminFetch<SiteDocumentAdminRow>(
            `/api/admin/site/${siteKey}`,
            {
              method: "PATCH",
              body: { version: row.version, doc },
            },
          );
          const nextText = JSON.stringify(current.draftDoc, null, 2);
          setJsonText(nextText);
          setBaseline(nextText);
        }
        const published = await cmsAdminFetch<SiteDocumentAdminRow>(
          `/api/admin/site/${siteKey}/publish`,
          { method: "POST", body: { version: current.version } },
        );
        setRow(published);
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Publish failed.");
      }
    });
  };

  if (!row) {
    return (
      <p className="text-[0.9rem] text-black/45">
        {pending ? "Loading…" : "No data."}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-xl border border-black/10 bg-white px-4 py-3 text-[0.9rem] font-medium text-black/70">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={cmsBtnPrimary}
          disabled={pending || !dirty}
          onClick={onSave}
        >
          Save draft
        </button>
        <button
          type="button"
          className={cmsBtnSecondary}
          disabled={pending}
          onClick={onPublish}
        >
          Publish
        </button>
        <span className="self-center text-[0.85rem] font-medium text-black/45">
          v{row.version}
        </span>
      </div>
      <div className={`${cmsCardClass} p-4 sm:p-5`}>
        <label htmlFor={`site-doc-${siteKey}`} className={adminLabelClass}>
          {label} document (JSON)
        </label>
        <textarea
          id={`site-doc-${siteKey}`}
          rows={24}
          value={jsonText}
          onChange={(e) => {
            setError(null);
            setJsonText(e.target.value);
          }}
          className={`${adminFieldClass} mt-2 font-mono text-[0.82rem] leading-relaxed`}
          spellCheck={false}
        />
      </div>
    </div>
  );
}
