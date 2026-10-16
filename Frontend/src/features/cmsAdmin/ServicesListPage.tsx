"use client";

import { useRouter } from "next/navigation";
import { cmsAdminFetch } from "@/features/cmsAdmin/api";
import { CmsResourceList } from "@/features/cmsAdmin/CmsResourceList";
import type { ServiceAdminRow } from "@/features/cmsAdmin/types";

export function ServicesListPage() {
  const router = useRouter();

  return (
    <CmsResourceList<ServiceAdminRow>
      title="Services"
      lede="Manage service pillars wired to the Backend CMS."
      apiBase="/api/admin/services"
      editHref={(item) => `/admin/services/${item.draftSlug}`}
      reorder
      createLabel="New service"
      onCreate={async () => {
        const stamp = Date.now().toString(36);
        const slug = `new-service-${stamp}`;
        const created = await cmsAdminFetch<ServiceAdminRow>("/api/admin/services", {
          method: "POST",
          body: {
            slug,
            title: "New service",
            shortDescription: "Update this description before publishing.",
            heroHeadline: "New service",
            heroIntro: "Update this intro before publishing.",
          },
        });
        router.push(`/admin/services/${created.draftSlug}`);
      }}
    />
  );
}
