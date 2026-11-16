"use client";

import type { ReactNode } from "react";
import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
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

export type ServiceEditorFormProps = {
  readonly form: ServiceFormState;
  readonly status: ContentStatus;
  readonly onChange: <K extends keyof ServiceFormState>(
    key: K,
    value: ServiceFormState[K],
  ) => void;
};

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <p className="md:col-span-2 text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-black/45">
      {children}
    </p>
  );
}

export function TileFields({
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
