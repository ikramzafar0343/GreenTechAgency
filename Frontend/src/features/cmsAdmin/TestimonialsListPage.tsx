"use client";

import { useRouter } from "next/navigation";
import { cmsAdminFetch } from "@/features/cmsAdmin/api";
import { CmsResourceList } from "@/features/cmsAdmin/CmsResourceList";
import type { TestimonialAdminRow } from "@/features/cmsAdmin/types";

export function TestimonialsListPage() {
  const router = useRouter();

  return (
    <CmsResourceList<TestimonialAdminRow>
      title="Testimonials"
      lede="Client quotes stored in the Backend CMS (draft / publish workflow)."
      apiBase="/api/admin/testimonials"
      editHref={(item) => `/admin/testimonials/${item.id}`}
      reorder
      showSlug={false}
      createLabel="New testimonial"
      onCreate={async () => {
        const created = await cmsAdminFetch<TestimonialAdminRow>(
          "/api/admin/testimonials",
          {
            method: "POST",
            body: {
              doc: {
                companyName: "New company",
                reviewerName: "Reviewer name",
                quote: "Write the quote before publishing.",
                ratingScale: 5,
              },
            },
          },
        );
        router.push(`/admin/testimonials/${created.id}`);
      }}
    />
  );
}
