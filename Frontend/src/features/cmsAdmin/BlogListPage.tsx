"use client";

import { useRouter } from "next/navigation";
import { cmsAdminFetch } from "@/features/cmsAdmin/api";
import { CmsResourceList } from "@/features/cmsAdmin/CmsResourceList";
import type { BlogAdminRow } from "@/features/cmsAdmin/types";

export function BlogListPage() {
  const router = useRouter();

  return (
    <CmsResourceList<BlogAdminRow>
      title="Insights / Blog"
      lede="Insight posts for /insights and the homepage (draft / publish workflow)."
      apiBase="/api/admin/blog"
      editHref={(item) => `/admin/blog/${item.id}`}
      createLabel="New post"
      onCreate={async () => {
        const stamp = Date.now().toString(36);
        const created = await cmsAdminFetch<BlogAdminRow>("/api/admin/blog", {
          method: "POST",
          body: {
            slug: `new-post-${stamp}`,
            title: "New blog post",
            excerpt: "Write an excerpt before publishing.",
            category: "General",
            body: [{ type: "paragraph", text: "Start writing here." }],
          },
        });
        router.push(`/admin/blog/${created.id}`);
      }}
    />
  );
}
