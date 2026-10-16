import { TESTIMONIAL_ITEMS_A } from "@/features/testimonials/model/testimonialItemsA";
import { TESTIMONIAL_ITEMS_B } from "@/features/testimonials/model/testimonialItemsB";
import type { TestimonialItem } from "@/features/testimonials/model/types";

export const TESTIMONIAL_ITEMS: TestimonialItem[] = [
  ...TESTIMONIAL_ITEMS_A,
  ...TESTIMONIAL_ITEMS_B,
];
