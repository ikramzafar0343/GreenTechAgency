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

type FooterForm = {
  brandName: string;
  logoUrl: string;
  showClosingCta: boolean;
  ctaEyebrow: string;
  ctaHeading: string;
  ctaBody: string;
  ctaLabel: string;
  ctaHref: string;
  contactEmail: string;
  contactAddress: string;
  copyrightName: string;
  privacyHref: string;
  termsHref: string;
};

function formFromDoc(doc: Record<string, unknown>): FooterForm {
  const contact =
    doc.contact && typeof doc.contact === "object"
      ? (doc.contact as Record<string, unknown>)
      : {};
  return {
    brandName: String(doc.brandName ?? ""),
    logoUrl: String(doc.logoUrl ?? ""),
    showClosingCta: Boolean(doc.showClosingCta),
    ctaEyebrow: String(doc.ctaEyebrow ?? ""),
    ctaHeading: String(doc.ctaHeading ?? ""),
    ctaBody: String(doc.ctaBody ?? ""),
    ctaLabel: String(doc.ctaLabel ?? ""),
    ctaHref: String(doc.ctaHref ?? ""),
    contactEmail: String(contact.email ?? ""),
    contactAddress: String(contact.address ?? ""),
    copyrightName: String(doc.copyrightName ?? ""),
    privacyHref: String(doc.privacyHref ?? ""),
    termsHref: String(doc.termsHref ?? ""),
  };
}

function formToDoc(current: Record<string, unknown>, values: FooterForm): Record<string, unknown> {
  const contact =
    current.contact && typeof current.contact === "object"
      ? { ...(current.contact as Record<string, unknown>) }
      : {};
  return {
    ...current,
    brandName: values.brandName.trim(),
    logoUrl: values.logoUrl.trim(),
    showClosingCta: values.showClosingCta,
    ctaEyebrow: values.ctaEyebrow.trim(),
    ctaHeading: values.ctaHeading.trim(),
    ctaBody: values.ctaBody.trim(),
    ctaLabel: values.ctaLabel.trim(),
    ctaHref: values.ctaHref.trim(),
    copyrightName: values.copyrightName.trim(),
    privacyHref: values.privacyHref.trim() || null,
    termsHref: values.termsHref.trim() || null,
    contact: {
      ...contact,
      email: values.contactEmail.trim() || null,
      address: values.contactAddress.trim() || null,
    },
  };
}

export function FooterSettingsEditor() {
  const [row, setRow] = useState<SiteDocumentAdminRow | null>(null);
  const [form, setForm] = useState<FooterForm | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const fresh = await cmsAdminFetch<SiteDocumentAdminRow>("/api/admin/site/footer");
        const nextForm = formFromDoc(fresh.draftDoc);
        setRow(fresh);
        setForm(nextForm);
        setBaseline(JSON.stringify(nextForm));
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Could not load footer.");
      }
    });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dirty = useMemo(
    () => form !== null && JSON.stringify(form) !== baseline,
    [form, baseline],
  );
  useDirtyGuard(dirty);

  const patch = <K extends keyof FooterForm>(key: K, value: FooterForm[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const onSave = () => {
    if (!row || !form) return;
    startTransition(async () => {
      setError(null);
      try {
        const updated = await cmsAdminFetch<SiteDocumentAdminRow>("/api/admin/site/footer", {
          method: "PATCH",
          body: {
            version: row.version,
            doc: formToDoc(row.draftDoc, form),
          },
        });
        const nextForm = formFromDoc(updated.draftDoc);
        setRow(updated);
        setForm(nextForm);
        setBaseline(JSON.stringify(nextForm));
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Save failed.");
      }
    });
  };

  const onPublish = () => {
    if (!row || !form) return;
    startTransition(async () => {
      setError(null);
      try {
        let current = row;
        if (dirty) {
          current = await cmsAdminFetch<SiteDocumentAdminRow>("/api/admin/site/footer", {
            method: "PATCH",
            body: {
              version: row.version,
              doc: formToDoc(row.draftDoc, form),
            },
          });
          const nextForm = formFromDoc(current.draftDoc);
          setForm(nextForm);
          setBaseline(JSON.stringify(nextForm));
        }
        const published = await cmsAdminFetch<SiteDocumentAdminRow>(
          "/api/admin/site/footer/publish",
          { method: "POST", body: { version: current.version } },
        );
        setRow(published);
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Publish failed.");
      }
    });
  };

  if (!form || !row) {
    return <p className="text-[0.9rem] text-black/45">{pending ? "Loading…" : "No data."}</p>;
  }

  const fields: readonly (readonly [keyof FooterForm, string, boolean?])[] = [
    ["brandName", "Brand name"],
    ["logoUrl", "Logo URL"],
    ["ctaEyebrow", "CTA eyebrow"],
    ["ctaHeading", "CTA heading"],
    ["ctaBody", "CTA body", true],
    ["ctaLabel", "CTA label"],
    ["ctaHref", "CTA href"],
    ["contactEmail", "Contact email"],
    ["contactAddress", "Contact address", true],
    ["copyrightName", "Copyright name"],
    ["privacyHref", "Privacy href"],
    ["termsHref", "Terms href"],
  ];

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
        <button type="button" className={cmsBtnSecondary} disabled={pending} onClick={onPublish}>
          Publish
        </button>
        <span className="self-center text-[0.85rem] font-medium text-black/45">
          v{row.version}
        </span>
      </div>
      <div className={`${cmsCardClass} grid gap-4 p-4 sm:p-5 md:grid-cols-2`}>
        <label className="flex items-center gap-2 text-[0.88rem] font-bold text-[#0d120b] md:col-span-2">
          <input
            type="checkbox"
            checked={form.showClosingCta}
            onChange={(e) => patch("showClosingCta", e.target.checked)}
          />
          Show closing CTA block
        </label>
        {fields.map(([key, label, multiline]) => (
          <div key={key} className={multiline ? "md:col-span-2" : ""}>
            <label htmlFor={`footer-${key}`} className={adminLabelClass}>
              {label}
            </label>
            {multiline ? (
              <textarea
                id={`footer-${key}`}
                rows={3}
                value={form[key] as string}
                onChange={(e) => patch(key, e.target.value as FooterForm[typeof key])}
                className={adminFieldClass}
              />
            ) : (
              <input
                id={`footer-${key}`}
                value={form[key] as string}
                onChange={(e) => patch(key, e.target.value as FooterForm[typeof key])}
                className={adminFieldClass}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
