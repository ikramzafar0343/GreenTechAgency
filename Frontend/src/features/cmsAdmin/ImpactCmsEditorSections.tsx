"use client";

import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { cmsCardClass } from "@/features/cmsAdmin/cmsUi";
import { type ImpactCmsEditorModel } from "./ImpactCmsEditorModel";

export function ImpactCmsEditorSection1({ model }: { model: ImpactCmsEditorModel }) {
  const { form, patchIntro } = model;
  return (
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
  );
}
