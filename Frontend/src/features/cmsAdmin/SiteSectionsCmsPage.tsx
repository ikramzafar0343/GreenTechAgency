"use client";

import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { cmsBtnPrimary, cmsBtnSecondary, cmsCardClass } from "@/features/cmsAdmin/cmsUi";
import { AboutCmsEditor } from "@/features/cmsAdmin/AboutCmsEditor";
import { FooterSettingsEditor } from "@/features/cmsAdmin/FooterSettingsEditor";
import { ImpactCmsEditor } from "@/features/cmsAdmin/ImpactCmsEditor";
import { SiteDocumentDraftEditor } from "@/features/cmsAdmin/SiteDocumentDraftEditor";
import { useSiteSectionsCmsPage, SECTION_TABS, MARKETING_DOC_LABELS, isMarketingSiteDocKey, isSectionKey, type SectionForm } from "./SiteSectionsCmsPageModel";

export function SiteSectionsCmsPage() {

  const { activeKey, setActiveKey, row, form, error, pending, dirty, patch, onSave, onPublish, featuredIdsText } = useSiteSectionsCmsPage();
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
