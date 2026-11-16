"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import type { SectionAdminRow, SectionKey } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

export type MarketingSiteDocumentKey =
  | "hero"
  | "how_we_work"
  | "why_choose"
  | "impact"
  | "cta"
  | "about";

export type SiteCmsTab = SectionKey | "footer" | MarketingSiteDocumentKey;

export const SECTION_TABS: readonly { key: SiteCmsTab; label: string }[] = [
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

export const MARKETING_SITE_DOC_KEYS = new Set<string>([
  "hero",
  "how_we_work",
  "why_choose",
  "impact",
  "cta",
  "about",
]);

export const MARKETING_DOC_LABELS: Record<MarketingSiteDocumentKey, string> = {
  hero: "Homepage hero",
  how_we_work: "How we work",
  why_choose: "Why choose us",
  impact: "Impact made visible",
  cta: "Astronaut closing CTA",
  about: "About page document",
};

export function isMarketingSiteDocKey(key: SiteCmsTab): key is MarketingSiteDocumentKey {
  return MARKETING_SITE_DOC_KEYS.has(key);
}

export function isSectionKey(key: SiteCmsTab): key is SectionKey {
  return !isMarketingSiteDocKey(key) && key !== "footer";
}

export type SectionForm = SectionAdminRow["draftDoc"] & { visible: boolean };

export function formFromSection(row: SectionAdminRow): SectionForm {
  return {
    ...row.draftDoc,
    visible: row.visible,
  };
}

/** All state and handlers of <SiteSectionsCmsPage>; the component and its sections only render. */
export function useSiteSectionsCmsPage() {
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
  return { activeKey, setActiveKey, row, form, error, pending, dirty, patch, onSave, onPublish, featuredIdsText };
}

export type SiteSectionsCmsPageModel = ReturnType<typeof useSiteSectionsCmsPage>;
