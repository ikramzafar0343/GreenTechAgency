"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { CmsImageField } from "@/features/cmsAdmin/CmsImageField";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import {
  cmsBtnPrimary,
  cmsBtnSecondary,
  cmsCardClass,
} from "@/features/cmsAdmin/cmsUi";
import type { SiteDocumentAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

type GroupPortraitForm = {
  src: string;
  alt: string;
  focalPoint: string;
};

type AboutForm = {
  groupPortrait: GroupPortraitForm;
  /** Full about document; portrait fields are mirrored into this on save. */
  document: Record<string, unknown>;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function portraitFromDoc(doc: Record<string, unknown>): GroupPortraitForm {
  const portrait = asRecord(doc.groupPortrait);
  return {
    src: typeof portrait.src === "string" ? portrait.src : "",
    alt:
      typeof portrait.alt === "string" && portrait.alt.trim()
        ? portrait.alt
        : "GreenTech Agency team working together",
    focalPoint:
      typeof portrait.focalPoint === "string" && portrait.focalPoint.trim()
        ? portrait.focalPoint
        : "50% 42%",
  };
}

function formFromDoc(doc: Record<string, unknown>): AboutForm {
  return {
    groupPortrait: portraitFromDoc(doc),
    document: { ...doc },
  };
}

function docFromForm(form: AboutForm): Record<string, unknown> {
  const src = form.groupPortrait.src.trim();
  return {
    ...form.document,
    groupPortrait: {
      src: src || null,
      alt: form.groupPortrait.alt.trim() || "GreenTech Agency team working together",
      focalPoint: form.groupPortrait.focalPoint.trim() || "50% 42%",
      assetStatus: src ? "ready" : "missing",
    },
  };
}

export function AboutCmsEditor() {
  const [row, setRow] = useState<SiteDocumentAdminRow | null>(null);
  const [form, setForm] = useState<AboutForm | null>(null);
  const [jsonText, setJsonText] = useState("");
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const applyRow = (fresh: SiteDocumentAdminRow) => {
    const nextForm = formFromDoc(fresh.draftDoc);
    const nextDoc = docFromForm(nextForm);
    const nextText = JSON.stringify(nextDoc, null, 2);
    setRow(fresh);
    setForm({ ...nextForm, document: nextDoc });
    setJsonText(nextText);
    setBaseline(
      JSON.stringify({
        groupPortrait: nextForm.groupPortrait,
        document: nextDoc,
      }),
    );
  };

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const fresh = await cmsAdminFetch<SiteDocumentAdminRow>(
          "/api/admin/site/about",
        );
        applyRow(fresh);
      } catch (err) {
        setError(
          err instanceof CmsAdminError
            ? err.message
            : "Could not load About page.",
        );
      }
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const snapshot = useMemo(() => {
    if (!form) return "";
    let document = form.document;
    try {
      const parsed: unknown = JSON.parse(jsonText);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        document = parsed as Record<string, unknown>;
      }
    } catch {
      /* keep last good document until save validates */
    }
    return JSON.stringify({
      groupPortrait: form.groupPortrait,
      document,
    });
  }, [form, jsonText]);

  const dirty = form !== null && snapshot !== baseline;
  useDirtyGuard(dirty);

  const patchPortrait = <K extends keyof GroupPortraitForm>(
    key: K,
    value: GroupPortraitForm[K],
  ) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            groupPortrait: { ...prev.groupPortrait, [key]: value },
          }
        : prev,
    );
  };

  const buildDocForPersist = (): Record<string, unknown> | null => {
    if (!form) return null;
    let document = form.document;
    try {
      const parsed: unknown = JSON.parse(jsonText);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        setError("About document must be a JSON object.");
        return null;
      }
      document = parsed as Record<string, unknown>;
    } catch {
      setError("Invalid About JSON.");
      return null;
    }
    return docFromForm({ ...form, document });
  };

  const persist = async (
    current: SiteDocumentAdminRow,
    doc: Record<string, unknown>,
  ) => {
    return cmsAdminFetch<SiteDocumentAdminRow>("/api/admin/site/about", {
      method: "PATCH",
      body: { version: current.version, doc },
    });
  };

  const onSave = () => {
    if (!row || !form) return;
    const doc = buildDocForPersist();
    if (!doc) return;
    startTransition(async () => {
      setError(null);
      try {
        applyRow(await persist(row, doc));
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Save failed.");
      }
    });
  };

  const onPublish = () => {
    if (!row || !form) return;
    const doc = buildDocForPersist();
    if (!doc) return;
    startTransition(async () => {
      setError(null);
      try {
        let current = row;
        if (dirty) {
          current = await persist(row, doc);
        }
        const published = await cmsAdminFetch<SiteDocumentAdminRow>(
          "/api/admin/site/about/publish",
          { method: "POST", body: { version: current.version } },
        );
        applyRow(published);
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Publish failed.");
      }
    });
  };

  if (!form || !row) {
    return (
      <p className="text-[0.9rem] text-black/45">
        {pending ? "Loading About page…" : error ?? "No About data."}
      </p>
    );
  }

  return (
    <div className="space-y-5">
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

      <div className={`${cmsCardClass} grid gap-4 p-4 sm:p-5 md:grid-cols-2`}>
        <div className="md:col-span-2">
          <h3 className="text-[1rem] font-bold text-[#0d120b]">
            Group portrait (2nd section)
          </h3>
          <p className="mt-1 text-[0.88rem] font-medium text-black/50">
            Full-bleed team photo directly under the About hero. Upload to replace
            the pending placeholder on the public page.
          </p>
        </div>

        <CmsImageField
          label="Group portrait image"
          hint="JPEG, PNG, WebP, or GIF. Shown full-width under the hero."
          value={form.groupPortrait.src}
          altValue={form.groupPortrait.alt}
          onPathChange={(path) => patchPortrait("src", path)}
          onAltChange={(alt) => patchPortrait("alt", alt)}
        />

        <div>
          <label htmlFor="about-portrait-focal" className={adminLabelClass}>
            Focal point (object-position)
          </label>
          <input
            id="about-portrait-focal"
            value={form.groupPortrait.focalPoint}
            onChange={(e) => patchPortrait("focalPoint", e.target.value)}
            className={adminFieldClass}
            placeholder="50% 42%"
          />
        </div>
      </div>

      <div className={`${cmsCardClass} p-4 sm:p-5`}>
        <label htmlFor="about-doc-json" className={adminLabelClass}>
          Full About document (JSON)
        </label>
        <p className="mt-1 text-[0.82rem] font-medium text-black/45">
          Hero, manifesto, team, and other About fields. Group portrait fields
          above overwrite <code>groupPortrait</code> on save.
        </p>
        <textarea
          id="about-doc-json"
          rows={18}
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
