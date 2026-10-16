"use client";

import type { ReactNode } from "react";
import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { CmsImageField } from "@/features/cmsAdmin/CmsImageField";
import { cmsCardClass } from "@/features/cmsAdmin/cmsUi";
import type { ContentStatus } from "@/features/cmsAdmin/types";

export type ServiceFormState = {
  slug: string;
  title: string;
  label: string;
  shortDescription: string;
  heroHeadline: string;
  heroIntro: string;
  storyParagraphs: string;
  storyLabel: string;
  storyCtaLabel: string;
  storyCtaHref: string;
  leadImagePath: string;
  leadImageAlt: string;
  cardImagePath: string;
  cardImageAlt: string;
  deliveryRailImagePath: string;
  deliveryRailImageAlt: string;
  deliveryRailTileTitle: string;
  deliveryRailTileCaption: string;
  pairALeftPath: string;
  pairALeftAlt: string;
  pairALeftTileTitle: string;
  pairALeftTileCaption: string;
  pairARightPath: string;
  pairARightAlt: string;
  pairARightTileTitle: string;
  pairARightTileCaption: string;
  pairBLeftPath: string;
  pairBLeftAlt: string;
  pairBLeftTileTitle: string;
  pairBLeftTileCaption: string;
  pairBRightPath: string;
  pairBRightAlt: string;
  pairBRightTileTitle: string;
  pairBRightTileCaption: string;
  principlesText: string;
  relatedSlugsText: string;
  relatedHeading: string;
  relatedIntro: string;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  sortOrder: number;
};

type ServiceEditorFormProps = {
  readonly form: ServiceFormState;
  readonly status: ContentStatus;
  readonly onChange: <K extends keyof ServiceFormState>(
    key: K,
    value: ServiceFormState[K],
  ) => void;
};

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <p className="md:col-span-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-black/45">
      {children}
    </p>
  );
}

function TileFields({
  form,
  locked,
  onChange,
  titleKey,
  captionKey,
}: {
  form: ServiceFormState;
  locked: boolean;
  onChange: ServiceEditorFormProps["onChange"];
  titleKey: keyof ServiceFormState;
  captionKey: keyof ServiceFormState;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor={`svc-${String(titleKey)}`} className={adminLabelClass}>
          Tile title
        </label>
        <input
          id={`svc-${String(titleKey)}`}
          value={String(form[titleKey])}
          onChange={(e) =>
            onChange(titleKey, e.target.value as ServiceFormState[typeof titleKey])
          }
          className={adminFieldClass}
          disabled={locked}
        />
      </div>
      <div>
        <label htmlFor={`svc-${String(captionKey)}`} className={adminLabelClass}>
          Tile caption
        </label>
        <input
          id={`svc-${String(captionKey)}`}
          value={String(form[captionKey])}
          onChange={(e) =>
            onChange(
              captionKey,
              e.target.value as ServiceFormState[typeof captionKey],
            )
          }
          className={adminFieldClass}
          disabled={locked}
        />
      </div>
    </div>
  );
}

export function ServiceEditorForm({ form, status, onChange }: ServiceEditorFormProps) {
  const locked = status === "archived";

  return (
    <div className="space-y-5">
      <div className={`${cmsCardClass} grid gap-4 p-4 sm:p-5 md:grid-cols-2`}>
        <SectionHeading>Hub &amp; lead photography</SectionHeading>
        <CmsImageField
          label="Services hub picture"
          hint="Stage media on /services. JPEG, PNG, WebP, or GIF (max 15 MB)."
          value={form.cardImagePath}
          altValue={form.cardImageAlt}
          locked={locked}
          onPathChange={(path) => onChange("cardImagePath", path)}
          onAltChange={(alt) => onChange("cardImageAlt", alt)}
        />
        <CmsImageField
          label="Detail lead image"
          hint="Wide lead photograph under the service hero."
          value={form.leadImagePath}
          altValue={form.leadImageAlt}
          locked={locked}
          onPathChange={(path) => onChange("leadImagePath", path)}
          onAltChange={(alt) => onChange("leadImageAlt", alt)}
        />
      </div>

      <div className={`${cmsCardClass} grid gap-4 p-4 sm:p-5 md:grid-cols-2`}>
        <SectionHeading>Impact Delivery photograph</SectionHeading>
        <p className="md:col-span-2 text-[0.84rem] font-medium text-black/50">
          Tall card in the Impact strip (Delivery / EDITORIAL DEMO tile). Upload
          replaces the gradient background; the tile stays on top.
        </p>
        <CmsImageField
          label="Delivery rail photo"
          hint="JPEG, PNG, WebP, or GIF (max 15 MB). Shown behind the Delivery tile."
          value={form.deliveryRailImagePath}
          altValue={form.deliveryRailImageAlt}
          locked={locked}
          spanFull={false}
          onPathChange={(path) => onChange("deliveryRailImagePath", path)}
          onAltChange={(alt) => onChange("deliveryRailImageAlt", alt)}
        />
        <div className="space-y-3">
          <TileFields
            form={form}
            locked={locked}
            onChange={onChange}
            titleKey="deliveryRailTileTitle"
            captionKey="deliveryRailTileCaption"
          />
        </div>
      </div>

      <div className={`${cmsCardClass} grid gap-5 p-4 sm:p-5`}>
        <SectionHeading>Detail photo pair A</SectionHeading>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <CmsImageField
              label="Left — Discussion"
              hint="Background photo; tile stays on top."
              value={form.pairALeftPath}
              altValue={form.pairALeftAlt}
              locked={locked}
              onPathChange={(path) => onChange("pairALeftPath", path)}
              onAltChange={(alt) => onChange("pairALeftAlt", alt)}
            />
            <TileFields
              form={form}
              locked={locked}
              onChange={onChange}
              titleKey="pairALeftTileTitle"
              captionKey="pairALeftTileCaption"
            />
          </div>
          <div className="space-y-3">
            <CmsImageField
              label="Right — Detail"
              hint="Background photo; tile stays on top."
              value={form.pairARightPath}
              altValue={form.pairARightAlt}
              locked={locked}
              onPathChange={(path) => onChange("pairARightPath", path)}
              onAltChange={(alt) => onChange("pairARightAlt", alt)}
            />
            <TileFields
              form={form}
              locked={locked}
              onChange={onChange}
              titleKey="pairARightTileTitle"
              captionKey="pairARightTileCaption"
            />
          </div>
        </div>
      </div>

      <div className={`${cmsCardClass} grid gap-5 p-4 sm:p-5`}>
        <SectionHeading>Detail photo pair B</SectionHeading>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <CmsImageField
              label="Left — Craft"
              hint="Background photo; tile stays on top."
              value={form.pairBLeftPath}
              altValue={form.pairBLeftAlt}
              locked={locked}
              onPathChange={(path) => onChange("pairBLeftPath", path)}
              onAltChange={(alt) => onChange("pairBLeftAlt", alt)}
            />
            <TileFields
              form={form}
              locked={locked}
              onChange={onChange}
              titleKey="pairBLeftTileTitle"
              captionKey="pairBLeftTileCaption"
            />
          </div>
          <div className="space-y-3">
            <CmsImageField
              label="Right — Collaborate"
              hint="Background photo; tile stays on top."
              value={form.pairBRightPath}
              altValue={form.pairBRightAlt}
              locked={locked}
              onPathChange={(path) => onChange("pairBRightPath", path)}
              onAltChange={(alt) => onChange("pairBRightAlt", alt)}
            />
            <TileFields
              form={form}
              locked={locked}
              onChange={onChange}
              titleKey="pairBRightTileTitle"
              captionKey="pairBRightTileCaption"
            />
          </div>
        </div>
      </div>

      <div className={`${cmsCardClass} grid gap-4 p-4 sm:p-5 md:grid-cols-2`}>
        <SectionHeading>Service copy</SectionHeading>
        {(
          [
            ["slug", "Slug"],
            ["title", "Title"],
            ["label", "Label"],
            ["shortDescription", "Short description"],
            ["heroHeadline", "Hero headline"],
            ["heroIntro", "Hero intro"],
            ["storyLabel", "Story label"],
            ["storyCtaLabel", "Story CTA label"],
            ["storyCtaHref", "Story CTA href"],
            ["relatedHeading", "Related heading"],
            ["relatedIntro", "Related intro"],
            ["seoTitle", "SEO title"],
            ["seoDescription", "SEO description"],
          ] as const
        ).map(([key, label]) => (
          <div
            key={key}
            className={
              key === "shortDescription" ||
              key === "heroIntro" ||
              key === "relatedIntro" ||
              key === "seoDescription"
                ? "md:col-span-2"
                : ""
            }
          >
            <label htmlFor={`svc-${key}`} className={adminLabelClass}>
              {label}
            </label>
            <input
              id={`svc-${key}`}
              value={form[key]}
              onChange={(e) => onChange(key, e.target.value)}
              className={adminFieldClass}
              disabled={locked}
            />
          </div>
        ))}
        <div className="md:col-span-2">
          <label htmlFor="svc-story" className={adminLabelClass}>
            Story paragraphs (one per line)
          </label>
          <textarea
            id="svc-story"
            rows={5}
            value={form.storyParagraphs}
            onChange={(e) => onChange("storyParagraphs", e.target.value)}
            className={adminFieldClass}
            disabled={locked}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="svc-principles" className={adminLabelClass}>
            Principles (title|body per line)
          </label>
          <textarea
            id="svc-principles"
            rows={6}
            value={form.principlesText}
            onChange={(e) => onChange("principlesText", e.target.value)}
            className={adminFieldClass}
            disabled={locked}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="svc-related" className={adminLabelClass}>
            Related service slugs (comma-separated)
          </label>
          <input
            id="svc-related"
            value={form.relatedSlugsText}
            onChange={(e) => onChange("relatedSlugsText", e.target.value)}
            className={adminFieldClass}
            disabled={locked}
          />
        </div>
        <div>
          <label htmlFor="svc-sort" className={adminLabelClass}>
            Sort order
          </label>
          <input
            id="svc-sort"
            type="number"
            value={form.sortOrder}
            onChange={(e) => onChange("sortOrder", Number(e.target.value) || 0)}
            className={adminFieldClass}
            disabled={locked}
          />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-[0.88rem] font-bold text-[#0d120b]">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => onChange("featured", e.target.checked)}
              disabled={locked}
            />
            Featured on hub
          </label>
        </div>
      </div>
    </div>
  );
}
