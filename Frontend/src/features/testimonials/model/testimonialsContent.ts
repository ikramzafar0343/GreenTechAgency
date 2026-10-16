import { TESTIMONIAL_ITEMS } from "@/features/testimonials/model/testimonialItems";
import { DEFAULT_TRUST_BADGE } from "@/features/testimonials/model/trustBadge";
import type { TestimonialsSectionData } from "@/features/testimonials/model/types";

/** Approved storefront testimonials until a CMS backend owns this section. */
export const TESTIMONIALS_CONTENT: TestimonialsSectionData = {
  eyebrow: "CLIENT EXPERIENCES",
  heading: "What Our Clients Say",
  supportingText: "Hear from the people behind the projects.",
  scrollAnimationEnabled: false,
  homepageOrder: 70,
  trustBadge: DEFAULT_TRUST_BADGE,
  items: TESTIMONIAL_ITEMS,
};
