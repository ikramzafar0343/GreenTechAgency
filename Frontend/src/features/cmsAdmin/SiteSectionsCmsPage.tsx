"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import {
  cmsBtnPrimary,
  cmsBtnSecondary,
  cmsCardClass,
} from "@/features/cmsAdmin/cmsUi";
import { AboutCmsEditor } from "@/features/cmsAdmin/AboutCmsEditor";
import { FooterSettingsEditor } from "@/features/cmsAdmin/FooterSettingsEditor";
import { ImpactCmsEditor } from "@/features/cmsAdmin/ImpactCmsEditor";
import { SiteDocumentDraftEditor } from "@/features/cmsAdmin/SiteDocumentDraftEditor";
import type { SectionAdminRow, SectionKey } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

type MarketingSiteDocumentKey =
  | "hero"
  | "how_we_work"
  | "why_choose"
  | "impact"
  | "cta"
  | "about";

type SiteCmsTab = SectionKey | "footer" | MarketingSiteDocumentKey;

const SECTION_TABS: readonly { key: SiteCmsTab; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "how_we_work", label: "How we work" },
  { key: "why_choose", label: "Why choose us" },
  { key: "impact", label: "Impact block" },
  { key: "cta", label: "Closing CTA" },
  { key: "about", label: "About page" },
  { key: "services", label: "Services hub" },
  { key: "blog", label: "Blog hub" },
  { key: "portfolio", label: "Portfolio hub" },
  { key: "faq", label: "FAQ hub" },
  { key: "testimonials", label: "Testimonials hub" },
  { key: "stats", label: "Stats hub" },
  { key: "footer", label: "Footer" },
];

const MARKETING_SITE_DOC_KEYS = new Set<string>([
  "hero",
  "how_we_work",
  "why_choose",
  "impact",
  "cta",
  "about",
]);

const MARKETING_DOC_LABELS: Record<MarketingSiteDocumentKey, string> = {
  hero: "Homepage hero",
  how_we_work: "How we work",
  why_choose: "Why choose us",
  impact: "Impact made visible",
  cta: "Astronaut closing CTA",
  about: "About page document",
};

function isMarketingSiteDocKey(key: SiteCmsTab): key is MarketingSiteDocumentKey {
  return MARKETING_SITE_DOC_KEYS.has(key);
}

function isSectionKey(key: SiteCmsTab): key is SectionKey {
  return !isMarketingSiteDocKey(key) && key !== "footer";
}

type SectionForm = SectionAdminRow["draftDoc"] & { visible: boolean };

function formFromSection(row: SectionAdminRow): SectionForm {
  return {
    ...row.draftDoc,
    visible: row.visible,
  };
}

export function SiteSectionsCmsPage() {
  const [activeKey, setActiveKey] = useState<SiteCmsTab>("impact");
  const [row, setRow] = useState<SectionAdminRow | null>(null);
  const [form, setForm] = useState<SectionForm | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback((key: SectionKey) => {
    startTransition(async () => {
      setError(null);
      try {
        const fresh = await cmsAdminFetch<SectionAdminRow>(
          `/api/admin/sections/${key}`,
        );
        const nextForm = formFromSection(fresh);
        setRow(fresh);
        setForm(nextForm);
        setBaseline(JSON.stringify(nextForm));
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Could not load section.");
      }
    });
  }, []);

  useEffect(() => {
    if (activeKey === "footer" || isMarketingSiteDocKey(activeKey)) return;
    load(activeKey);
  }, [activeKey, load]);

  const dirty = useMemo(
    () => form !== null && JSON.stringify(form) !== baseline,
    [form, baseline],
  );
  useDirtyGuard(dirty);

  const patch = <K extends keyof SectionForm>(key: K, value: SectionForm[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const persistDraft = async (
    currentRow: SectionAdminRow,
    values: SectionForm,
  ): Promise<SectionAdminRow> => {
    const featuredIds = values.featuredIds.map((id) => id.trim()).filter(Boolean);
    return cmsAdminFetch<SectionAdminRow>(`/api/admin/sections/${currentRow.key}`, {
      method: "PATCH",
      body: {
        version: currentRow.version,
        visible: values.visible,
        doc: {
          eyebrow: values.eyebrow?.trim() || null,
          heading: values.heading.trim(),
          introduction: values.introduction.trim(),
          ctaLabel: values.ctaLabel?.trim() || null,
          ctaHref: values.ctaHref?.trim() || null,
          featuredIds,
          maxItems: values.maxItems,
        },
      },
    });
  };

  const applySection = (updated: SectionAdminRow) => {
    const nextForm = formFromSection(updated);
    setRow(updated);
    setForm(nextForm);
    setBaseline(JSON.stringify(nextForm));
  };

  const onSave = () => {
    if (!row || !form) return;
    startTransition(async () => {
      setError(null);
      try {
        applySection(await persistDraft(row, form));
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
          current = await persistDraft(row, form);
          applySection(current);
        }
        const updated = await cmsAdminFetch<SectionAdminRow>(
          `/api/admin/sections/${current.key}/publish`,
          { method: "POST", body: { version: current.version } },
        );
        applySection(updated);
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Publish failed.");
      }
    });
  };

  const featuredIdsText = form?.featuredIds.join("\n") ?? "";

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Site sections"
        lede="Marketing chrome, homepage module copy, featured IDs, and footer settings."
      />

      <div className="flex flex-wrap gap-2">
        {SECTION_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={
              tab.key === activeKey
                ? cmsBtnPrimary
                : cmsBtnSecondary
            }
            onClick={() => setActiveKey(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-xl border border-black/10 bg-white px-4 py-3 text-[0.9rem] font-medium text-black/70">
          {error}
        </p>
      ) : null}

      {activeKey === "footer" ? <FooterSettingsEditor /> : null}

      {activeKey === "impact" ? <ImpactCmsEditor /> : null}

      {activeKey === "about" ? <AboutCmsEditor /> : null}

      {isMarketingSiteDocKey(activeKey) &&
      activeKey !== "impact" &&
      activeKey !== "about" ? (
        <SiteDocumentDraftEditor
          siteKey={activeKey}
          label={MARKETING_DOC_LABELS[activeKey]}
        />
      ) : null}

      {isSectionKey(activeKey) && form && row ? (
        <>
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
              <label className="flex items-center gap-2 text-[0.88rem] font-bold text-[#0d120b]">
                <input
                  type="checkbox"
                  checked={form.visible}
                  onChange={(e) => patch("visible", e.target.checked)}
                />
                Visible on site when published
              </label>
            </div>
            {(
              [
                ["eyebrow", "Eyebrow"],
                ["heading", "Heading"],
                ["introduction", "Introduction"],
                ["ctaLabel", "CTA label"],
                ["ctaHref", "CTA href"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className={key === "introduction" ? "md:col-span-2" : ""}>
                <label htmlFor={`sec-${key}`} className={adminLabelClass}>
                  {label}
                </label>
                <input
                  id={`sec-${key}`}
                  value={form[key] ?? ""}
                  onChange={(e) =>
                    patch(key, e.target.value as SectionForm[typeof key])
                  }
                  className={adminFieldClass}
                />
              </div>
            ))}
            <div>
              <label htmlFor="sec-max" className={adminLabelClass}>
                Max items
              </label>
              <input
                id="sec-max"
                type="number"
                min={1}
                max={24}
                value={form.maxItems}
                onChange={(e) => patch("maxItems", Number(e.target.value) || 1)}
                className={adminFieldClass}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="sec-featured" className={adminLabelClass}>
                Featured IDs (one per line or comma-separated)
              </label>
              <textarea
                id="sec-featured"
                rows={5}
                value={featuredIdsText}
                onChange={(e) =>
                  patch(
                    "featuredIds",
                    e.target.value
                      .split("\n")
                      .flatMap((line) => line.split(","))
                      .map((id) => id.trim())
                      .filter(Boolean),
                  )
                }
                className={adminFieldClass}
              />
            </div>
          </div>
        </>
      ) : isSectionKey(activeKey) ? (
        <p className="text-[0.9rem] text-black/45">{pending ? "Loading…" : "No data."}</p>
      ) : null}
    </div>
  );
}
