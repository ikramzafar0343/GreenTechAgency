"use client";

import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { cmsCardClass } from "@/features/cmsAdmin/cmsUi";

export const STAT_METRIC_TYPES = ["COUNT", "YEAR"] as const;
export const STAT_PRESETS = [
  "WORD_EMPHASIS",
  "STANDARD_NUMBER",
  "OVERSIZED_NUMBER",
  "YEAR",
] as const;

export type StatFormFields = {
  metricType: (typeof STAT_METRIC_TYPES)[number];
  preset: (typeof STAT_PRESETS)[number];
  value: number;
  prefix: string;
  suffix: string;
  label: string;
  emphasisWord: string;
  sortOrder: number;
};

type StatsEditorFieldsProps = {
  form: StatFormFields;
  locked: boolean;
  onChange: <K extends keyof StatFormFields>(
    key: K,
    value: StatFormFields[K],
  ) => void;
};

export function StatsEditorFields({
  form,
  locked,
  onChange,
}: StatsEditorFieldsProps) {
  return (
    <div className={`${cmsCardClass} grid gap-4 p-4 sm:p-5 md:grid-cols-2`}>
      <div>
        <label htmlFor="st-type" className={adminLabelClass}>
          Metric type
        </label>
        <select
          id="st-type"
          value={form.metricType}
          onChange={(e) =>
            onChange("metricType", e.target.value as StatFormFields["metricType"])
          }
          className={adminFieldClass}
          disabled={locked}
        >
          {STAT_METRIC_TYPES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="st-preset" className={adminLabelClass}>
          Preset
        </label>
        <select
          id="st-preset"
          value={form.preset}
          onChange={(e) =>
            onChange("preset", e.target.value as StatFormFields["preset"])
          }
          className={adminFieldClass}
          disabled={locked}
        >
          {STAT_PRESETS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      {(
        [
          ["value", "Value", "number"],
          ["label", "Label", "text"],
          ["prefix", "Prefix", "text"],
          ["suffix", "Suffix", "text"],
          ["emphasisWord", "Emphasis word", "text"],
          ["sortOrder", "Sort order", "number"],
        ] as const
      ).map(([key, label, type]) => (
        <div key={key}>
          <label htmlFor={`st-${key}`} className={adminLabelClass}>
            {label}
          </label>
          <input
            id={`st-${key}`}
            type={type}
            value={form[key]}
            onChange={(e) =>
              onChange(
                key,
                type === "number"
                  ? (Number(e.target.value) || 0)
                  : e.target.value,
              )
            }
            className={adminFieldClass}
            disabled={locked}
          />
        </div>
      ))}
    </div>
  );
}
