"use client";

import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { cmsCardClass } from "@/features/cmsAdmin/cmsUi";

export type TestimonialFormFields = {
  companyName: string;
  companyLogoUrl: string;
  location: string;
  reviewerName: string;
  reviewerRole: string;
  reviewerPhotoUrl: string;
  quote: string;
  emphasisText: string;
  rating: string;
  ratingScale: number;
  sourceUrl: string;
  sortOrder: number;
  featured: boolean;
};

type TestimonialsEditorFieldsProps = {
  form: TestimonialFormFields;
  locked: boolean;
  onChange: <K extends keyof TestimonialFormFields>(
    key: K,
    value: TestimonialFormFields[K],
  ) => void;
};

export function TestimonialsEditorFields({
  form,
  locked,
  onChange,
}: TestimonialsEditorFieldsProps) {
  return (
    <div className={`${cmsCardClass} grid gap-4 p-4 sm:p-5 md:grid-cols-2`}>
      {(
        [
          ["companyName", "Company name"],
          ["companyLogoUrl", "Company logo URL"],
          ["location", "Location"],
          ["reviewerName", "Reviewer name"],
          ["reviewerRole", "Reviewer role"],
          ["reviewerPhotoUrl", "Reviewer photo URL"],
          ["emphasisText", "Emphasis text"],
          ["sourceUrl", "Source URL"],
        ] as const
      ).map(([key, label]) => (
        <div key={key}>
          <label htmlFor={`tm-${key}`} className={adminLabelClass}>
            {label}
          </label>
          <input
            id={`tm-${key}`}
            value={form[key]}
            onChange={(e) => onChange(key, e.target.value)}
            className={adminFieldClass}
            disabled={locked}
          />
        </div>
      ))}
      <div className="md:col-span-2">
        <label htmlFor="tm-quote" className={adminLabelClass}>
          Quote
        </label>
        <textarea
          id="tm-quote"
          rows={6}
          value={form.quote}
          onChange={(e) => onChange("quote", e.target.value)}
          className={adminFieldClass}
          disabled={locked}
        />
      </div>
      <div>
        <label htmlFor="tm-rating" className={adminLabelClass}>
          Rating (empty = none)
        </label>
        <input
          id="tm-rating"
          value={form.rating}
          onChange={(e) => onChange("rating", e.target.value)}
          className={adminFieldClass}
          disabled={locked}
        />
      </div>
      <div>
        <label htmlFor="tm-scale" className={adminLabelClass}>
          Rating scale
        </label>
        <input
          id="tm-scale"
          type="number"
          value={form.ratingScale}
          onChange={(e) => onChange("ratingScale", Number(e.target.value) || 5)}
          className={adminFieldClass}
          disabled={locked}
        />
      </div>
      <div>
        <label htmlFor="tm-order" className={adminLabelClass}>
          Sort order
        </label>
        <input
          id="tm-order"
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
          Featured
        </label>
      </div>
    </div>
  );
}
