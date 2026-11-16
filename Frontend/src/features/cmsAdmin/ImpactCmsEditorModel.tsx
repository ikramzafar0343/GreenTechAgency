"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { cmsAdminFetch, CmsAdminError } from "@/features/cmsAdmin/api";
import type { SiteDocumentAdminRow } from "@/features/cmsAdmin/types";
import { useDirtyGuard } from "@/features/cmsAdmin/useDirtyGuard";

export type ImpactImageCardForm = {
  id: string;
  kind: "image";
  size: string;
  theme: string;
  src: string;
  alt: string;
  objectPosition: string;
  tileTitle: string;
  tileCaption: string;
  caption: string;
};

export type ImpactOtherCardForm = {
  id: string;
  kind: "metric" | "cta" | "statement";
  size: string;
  theme: string;
  metric?: string;
  heading?: string;
  description?: string;
  linkLabel?: string;
  href?: string;
};

export type ImpactCardForm = ImpactImageCardForm | ImpactOtherCardForm;

export type ImpactForm = {
  id: string;
  eyebrow: string;
  heading: string;
  description: string;
  cards: ImpactCardForm[];
};

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function cardFromDoc(raw: unknown): ImpactCardForm {
  const row = asRecord(raw);
  const kind = String(row.kind ?? "statement");
  const base = {
    id: String(row.id ?? ""),
    size: String(row.size ?? "medium"),
    theme: String(row.theme ?? "dark"),
  };

  if (kind === "image") {
    const image = asRecord(row.image);
    return {
      ...base,
      kind: "image",
      src: String(image.src ?? ""),
      alt: String(image.alt ?? ""),
      objectPosition: String(image.objectPosition ?? "center"),
      tileTitle: String(image.tileTitle ?? "Delivery"),
      tileCaption: String(image.tileCaption ?? "GreenTech"),
      caption: String(row.caption ?? ""),
    };
  }

  if (kind === "metric") {
    return {
      ...base,
      kind: "metric",
      metric: String(row.metric ?? ""),
      description: String(row.description ?? ""),
    };
  }

  if (kind === "cta") {
    return {
      ...base,
      kind: "cta",
      heading: String(row.heading ?? ""),
      description: String(row.description ?? ""),
      linkLabel: String(row.linkLabel ?? "Work with us"),
      href: String(row.href ?? "/contact"),
    };
  }

  return {
    ...base,
    kind: "statement",
    heading: String(row.heading ?? ""),
    description: String(row.description ?? ""),
  };
}

export const DEFAULT_DELIVERY_CARD: ImpactImageCardForm = {
  id: "impact-creative-lead",
  kind: "image",
  size: "tall",
  theme: "mint",
  src: "/impact/delivery.svg",
  alt: "Collaborative digital craft across design and engineering.",
  objectPosition: "center",
  tileTitle: "Delivery",
  tileCaption: "GreenTech",
  caption: "",
};

export function formFromDoc(doc: Record<string, unknown>): ImpactForm {
  const cards = Array.isArray(doc.cards) ? doc.cards.map(cardFromDoc) : [];
  const hasImage = cards.some((card) => card.kind === "image");
  return {
    id: String(doc.id ?? "impactMadeVisible"),
    eyebrow: String(doc.eyebrow ?? "Impact made visible"),
    heading: String(doc.heading ?? ""),
    description: String(doc.description ?? ""),
    cards: hasImage ? cards : [DEFAULT_DELIVERY_CARD, ...cards],
  };
}

export function docFromForm(form: ImpactForm): Record<string, unknown> {
  return {
    id: form.id.trim() || "impactMadeVisible",
    eyebrow: form.eyebrow.trim(),
    heading: form.heading.trim(),
    description: form.description.trim(),
    cards: form.cards.map((card) => {
      if (card.kind === "image") {
        return {
          id: card.id,
          kind: "image",
          size: card.size,
          theme: card.theme,
          image: {
            src: card.src.trim(),
            alt: card.alt.trim(),
            objectPosition: card.objectPosition.trim() || "center",
            tileTitle: card.tileTitle.trim() || "Delivery",
            tileCaption: card.tileCaption.trim() || "GreenTech",
          },
          ...(card.caption.trim() ? { caption: card.caption.trim() } : {}),
        };
      }
      if (card.kind === "metric") {
        return {
          id: card.id,
          kind: "metric",
          size: card.size,
          theme: card.theme,
          metric: card.metric?.trim() ?? "",
          description: card.description?.trim() ?? "",
        };
      }
      if (card.kind === "cta") {
        return {
          id: card.id,
          kind: "cta",
          size: card.size,
          theme: card.theme,
          heading: card.heading?.trim() ?? "",
          description: card.description?.trim() ?? "",
          linkLabel: card.linkLabel?.trim() || "Work with us",
          href: card.href?.trim() || "/contact",
        };
      }
      return {
        id: card.id,
        kind: "statement",
        size: card.size,
        theme: card.theme,
        heading: card.heading?.trim() ?? "",
        description: card.description?.trim() ?? "",
      };
    }),
  };
}

export function cardLabel(card: ImpactCardForm, index: number): string {
  if (card.kind === "image") {
    return `Delivery photo ${index + 1}`;
  }
  if (card.kind === "metric") {
    return `Metric — ${card.metric || card.id}`;
  }
  if (card.kind === "cta") {
    return `CTA — ${card.heading || card.id}`;
  }
  return `Statement — ${card.heading || card.id}`;
}

/** All state and handlers of <ImpactCmsEditor>; the component and its sections only render. */
export function useImpactCmsEditor() {
  const [row, setRow] = useState<SiteDocumentAdminRow | null>(null);
  const [form, setForm] = useState<ImpactForm | null>(null);
  const [baseline, setBaseline] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const load = useCallback(() => {
    startTransition(async () => {
      setError(null);
      try {
        const fresh = await cmsAdminFetch<SiteDocumentAdminRow>(
          "/api/admin/site/impact",
        );
        const nextForm = formFromDoc(fresh.draftDoc);
        setRow(fresh);
        setForm(nextForm);
        setBaseline(JSON.stringify(nextForm));
      } catch (err) {
        setError(
          err instanceof CmsAdminError
            ? err.message
            : "Could not load Impact block.",
        );
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

  const patchIntro = <K extends keyof ImpactForm>(key: K, value: ImpactForm[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const patchCard = (index: number, next: ImpactCardForm) => {
    setForm((prev) => {
      if (!prev) return prev;
      const cards = [...prev.cards];
      cards[index] = next;
      return { ...prev, cards };
    });
  };

  const persist = async (current: SiteDocumentAdminRow, values: ImpactForm) => {
    return cmsAdminFetch<SiteDocumentAdminRow>("/api/admin/site/impact", {
      method: "PATCH",
      body: { version: current.version, doc: docFromForm(values) },
    });
  };

  const onSave = () => {
    if (!row || !form) return;
    startTransition(async () => {
      setError(null);
      try {
        const updated = await persist(row, form);
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
          current = await persist(row, form);
          const nextForm = formFromDoc(current.draftDoc);
          setForm(nextForm);
          setBaseline(JSON.stringify(nextForm));
        }
        const published = await cmsAdminFetch<SiteDocumentAdminRow>(
          "/api/admin/site/impact/publish",
          { method: "POST", body: { version: current.version } },
        );
        setRow(published);
        const nextForm = formFromDoc(published.draftDoc);
        setForm(nextForm);
        setBaseline(JSON.stringify(nextForm));
      } catch (err) {
        setError(err instanceof CmsAdminError ? err.message : "Publish failed.");
      }
    });
  };
  return { row, form, error, pending, dirty, patchIntro, patchCard, onSave, onPublish };
}

export type ImpactCmsEditorModel = ReturnType<typeof useImpactCmsEditor>;
