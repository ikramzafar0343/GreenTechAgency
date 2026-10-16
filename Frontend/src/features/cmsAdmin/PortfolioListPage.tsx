"use client";

import { useRouter } from "next/navigation";
import { cmsAdminFetch } from "@/features/cmsAdmin/api";
import { CmsResourceList } from "@/features/cmsAdmin/CmsResourceList";
import { docTitle } from "@/features/cmsAdmin/cmsUi";
import type { PortfolioAdminRow } from "@/features/cmsAdmin/types";

export function PortfolioListPage() {
  const router = useRouter();

  return (
    <CmsResourceList<PortfolioAdminRow>
      title="Portfolio"
      lede="Case studies and projects from the Backend CMS."
      apiBase="/api/admin/portfolio"
      editHref={(item) => `/admin/portfolio/${item.id}`}
      allowDelete
      deleteConfirmMessage={(item) =>
        `Permanently delete “${docTitle(item)}”? This cannot be undone.`
      }
      createLabel="New project"
      onCreate={async () => {
        const stamp = Date.now().toString(36);
        const created = await cmsAdminFetch<PortfolioAdminRow>("/api/admin/portfolio", {
          method: "POST",
          body: {
            slug: `new-project-${stamp}`,
            title: "New project",
            summary: "Short summary for listings.",
            description: "Full description for the case study.",
            category: "General",
          },
        });
        router.push(`/admin/portfolio/${created.id}`);
      }}
    />
  );
}
