"use client";

import { adminFieldClass, adminLabelClass } from "@/components/admin/adminFormStyles";
import { cmsCardClass } from "@/features/cmsAdmin/cmsUi";
import type { ContentStatus } from "@/features/cmsAdmin/types";

const STATUSES: readonly (ContentStatus | "")[] = ["", "draft", "published", "archived"];

type CmsListFiltersProps = {
  readonly q: string;
  readonly status: ContentStatus | "";
  readonly onQChange: (value: string) => void;
  readonly onStatusChange: (value: ContentStatus | "") => void;
};

export function CmsListFilters({
  q,
  status,
  onQChange,
  onStatusChange,
}: CmsListFiltersProps) {
  return (
    <div className={`${cmsCardClass} p-4 sm:p-5`}>
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label htmlFor="cms-list-search" className={adminLabelClass}>
            Search
          </label>
          <input
            id="cms-list-search"
            type="search"
            value={q}
            onChange={(e) => onQChange(e.target.value)}
            className={adminFieldClass}
            placeholder="Title or slug"
          />
        </div>
        <div className="sm:w-44">
          <label htmlFor="cms-list-status" className={adminLabelClass}>
            Status
          </label>
          <select
            id="cms-list-status"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as ContentStatus | "")}
            className={adminFieldClass}
          >
            {STATUSES.map((value) => (
              <option key={value || "all"} value={value}>
                {value === "" ? "All statuses" : value}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
