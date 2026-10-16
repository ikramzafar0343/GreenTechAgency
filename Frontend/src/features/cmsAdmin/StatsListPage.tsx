"use client";

import { useRouter } from "next/navigation";
import { cmsAdminFetch } from "@/features/cmsAdmin/api";
import { CmsResourceList } from "@/features/cmsAdmin/CmsResourceList";
import type { StatAdminRow } from "@/features/cmsAdmin/types";

export function StatsListPage() {
  const router = useRouter();

  return (
    <CmsResourceList<StatAdminRow>
      title="Stats"
      lede="Homepage metric cards stored in the Backend CMS (draft / publish workflow)."
      apiBase="/api/admin/stats"
      editHref={(item) => `/admin/stats/${item.id}`}
      reorder
      showSlug={false}
      createLabel="New metric"
      onCreate={async () => {
        const created = await cmsAdminFetch<StatAdminRow>("/api/admin/stats", {
          method: "POST",
          body: {
            doc: {
              metricType: "COUNT",
              preset: "STANDARD_NUMBER",
              value: 0,
              label: "New metric",
            },
          },
        });
        router.push(`/admin/stats/${created.id}`);
      }}
    />
  );
}
