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

type ImpactImageCardForm = {
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

type ImpactOtherCardForm = {
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

type ImpactCardForm = ImpactImageCardForm | ImpactOtherCardForm;

type ImpactForm = {
  id: string;
  eyebrow: string;
  heading: string;
  description: string;
  cards: ImpactCardForm[];
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function cardFromDoc(raw: unknown): ImpactCardForm {
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
      tileCaption: String(image.tileCaption ?? "EDITORIAL DEMO"),
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

const DEFAULT_DELIVERY_CARD: ImpactImageCardForm = {
  id: "impact-creative-lead",
  kind: "image",
  size: "tall",
  theme: "mint",
  src: "/services/editorial/rail-photo.svg",
  alt: "Collaborative digital craft across design and engineering.",
  objectPosition: "center",
  tileTitle: "Delivery",
  tileCaption: "EDITORIAL DEMO",
  caption: "",
};

function formFromDoc(doc: Record<string, unknown>): ImpactForm {
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

function docFromForm(form: ImpactForm): Record<string, unknown> {
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
            tileCaption: card.tileCaption.trim() || "EDITORIAL DEMO",
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

function cardLabel(card: ImpactCardForm, index: number): string {
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

export function ImpactCmsEditor() {
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

  if (!form || !row) {
    return (
      <p className="text-[0.9rem] text-black/45">
        {pending ? "Loading Impact block…" : error ?? "No Impact data."}
      </p>
    );
  }

  const imageCards = form.cards
    .map((card, index) => ({ card, index }))
    .filter((entry) => entry.card.kind === "image");
  const otherCards = form.cards
    .map((card, index) => ({ card, index }))
    .filter((entry) => entry.card.kind !== "image");

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
          Impact · v{row.version}
        </span>
      </div>

      <p className="text-[0.9rem] font-medium text-black/55">
        The Delivery photograph appears behind the Delivery / EDITORIAL DEMO tile on
        service pages. Upload a JPEG, PNG, WebP, or GIF, then Save draft and Publish.
      </p>

      {imageCards.map(({ card, index }) => {
        if (card.kind !== "image") return null;
        return (
          <div
            key={card.id || `image-${index}`}
            className={`${cmsCardClass} space-y-4 p-4 sm:p-5`}
          >
            <p className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-black/45">
              Delivery photograph
            </p>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(16rem,0.9fr)]">
              <CmsImageField
                label="Background image"
                hint="Shown behind the Delivery tile. Tile text stays on top."
                value={card.src}
                altValue={card.alt}
                spanFull={false}
                onPathChange={(path) => patchCard(index, { ...card, src: path })}
                onAltChange={(alt) => patchCard(index, { ...card, alt })}
              />
              <div className="space-y-3">
                <div>
                  <label className={adminLabelClass} htmlFor={`impact-tile-${index}`}>
                    Tile title
                  </label>
                  <input
                    id={`impact-tile-${index}`}
                    value={card.tileTitle}
                    onChange={(e) =>
                      patchCard(index, { ...card, tileTitle: e.target.value })
                    }
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass} htmlFor={`impact-caption-${index}`}>
                    Tile caption
                  </label>
                  <input
                    id={`impact-caption-${index}`}
                    value={card.tileCaption}
                    onChange={(e) =>
                      patchCard(index, { ...card, tileCaption: e.target.value })
                    }
                    className={adminFieldClass}
                  />
                </div>
                <div>
                  <label className={adminLabelClass} htmlFor={`impact-pos-${index}`}>
                    Focal position
                  </label>
                  <input
                    id={`impact-pos-${index}`}
                    value={card.objectPosition}
                    onChange={(e) =>
                      patchCard(index, { ...card, objectPosition: e.target.value })
                    }
                    className={adminFieldClass}
                    placeholder="center"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className={`${cmsCardClass} grid gap-4 p-4 sm:p-5 md:grid-cols-2`}>
        <p className="md:col-span-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-black/45">
          Section copy
        </p>
        <div>
          <label htmlFor="impact-eyebrow" className={adminLabelClass}>
            Eyebrow
          </label>
          <input
            id="impact-eyebrow"
            value={form.eyebrow}
            onChange={(e) => patchIntro("eyebrow", e.target.value)}
            className={adminFieldClass}
          />
        </div>
        <div>
          <label htmlFor="impact-heading" className={adminLabelClass}>
            Heading
          </label>
          <input
            id="impact-heading"
            value={form.heading}
            onChange={(e) => patchIntro("heading", e.target.value)}
            className={adminFieldClass}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="impact-description" className={adminLabelClass}>
            Description
          </label>
          <textarea
            id="impact-description"
            rows={3}
            value={form.description}
            onChange={(e) => patchIntro("description", e.target.value)}
            className={adminFieldClass}
          />
        </div>
      </div>

      {otherCards.map(({ card, index }) => (
        <div key={card.id || `card-${index}`} className={`${cmsCardClass} space-y-4 p-4 sm:p-5`}>
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-black/45">
            {cardLabel(card, index)}
          </p>

          {card.kind === "metric" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className={adminLabelClass}>Metric</label>
                <input
                  value={card.metric ?? ""}
                  onChange={(e) =>
                    patchCard(index, { ...card, metric: e.target.value })
                  }
                  className={adminFieldClass}
                />
              </div>
              <div>
                <label className={adminLabelClass}>Supporting line</label>
                <input
                  value={card.description ?? ""}
                  onChange={(e) =>
                    patchCard(index, { ...card, description: e.target.value })
                  }
                  className={adminFieldClass}
                />
              </div>
            </div>
          ) : null}

          {card.kind === "cta" || card.kind === "statement" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className={adminLabelClass}>Heading</label>
                <input
                  value={card.heading ?? ""}
                  onChange={(e) =>
                    patchCard(index, { ...card, heading: e.target.value })
                  }
                  className={adminFieldClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className={adminLabelClass}>Description</label>
                <textarea
                  rows={3}
                  value={card.description ?? ""}
                  onChange={(e) =>
                    patchCard(index, { ...card, description: e.target.value })
                  }
                  className={adminFieldClass}
                />
              </div>
              {card.kind === "cta" ? (
                <>
                  <div>
                    <label className={adminLabelClass}>Link label</label>
                    <input
                      value={card.linkLabel ?? ""}
                      onChange={(e) =>
                        patchCard(index, { ...card, linkLabel: e.target.value })
                      }
                      className={adminFieldClass}
                    />
                  </div>
                  <div>
                    <label className={adminLabelClass}>Link href</label>
                    <input
                      value={card.href ?? ""}
                      onChange={(e) =>
                        patchCard(index, { ...card, href: e.target.value })
                      }
                      className={adminFieldClass}
                    />
                  </div>
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
