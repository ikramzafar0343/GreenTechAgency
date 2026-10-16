"use client";

import { useRouter } from "next/navigation";
import { cmsAdminFetch } from "@/features/cmsAdmin/api";
import { CmsResourceList } from "@/features/cmsAdmin/CmsResourceList";
import type { FaqAdminRow } from "@/features/cmsAdmin/types";

export function FaqListPage() {
  const router = useRouter();

  return (
    <CmsResourceList<FaqAdminRow>
      title="FAQ"
      lede="Questions and answers stored in the Backend CMS (draft / publish workflow)."
      apiBase="/api/admin/faq"
      editHref={(item) => `/admin/faqs/${item.id}`}
      reorder
      showSlug={false}
      createLabel="New FAQ"
      onCreate={async () => {
        const created = await cmsAdminFetch<FaqAdminRow>("/api/admin/faq", {
          method: "POST",
          body: {
            doc: {
              question: "New question",
              answer: "Write the answer before publishing.",
            },
          },
        });
        router.push(`/admin/faqs/${created.id}`);
      }}
    />
  );
}
