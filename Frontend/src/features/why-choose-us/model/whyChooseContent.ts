export type WhyChooseImage = {
  src: string;
  alt: string;
};

export type WhyChooseCard = {
  id: string;
  number: string;
  title: string;
  copy: string;
};

export const WHY_CHOOSE_INTRO = {
  eyebrow: "Why Choose Us",
  heading:
    "Principles that guide how we partner, design, and ship digital work that lasts.",
  support:
    "Clear collaboration, durable craft, and outcomes you can measure.",
} as const;

export const WHY_CHOOSE_CARDS: readonly WhyChooseCard[] = [
  {
    id: "strategy",
    number: "01.",
    title: "Strategy Before Execution",
    copy: "Every project starts with your business goals, audience, and growth opportunities—so delivery stays purposeful.",
  },
  {
    id: "expertise",
    number: "02.",
    title: "Expertise Under One Roof",
    copy: "Development, UI/UX, SEO, marketing, branding, and emerging technology work as one coordinated team.",
  },
  {
    id: "performance",
    number: "03.",
    title: "Built for Performance",
    copy: "Fast, scalable, and search-friendly digital experiences designed to convert and stay maintainable.",
  },
  {
    id: "results",
    number: "04.",
    title: "Focused on Real Results",
    copy: "We measure success through visibility, engagement, leads, conversions, and durable growth—not vanity.",
  },
  {
    id: "communication",
    number: "05.",
    title: "Clear Communication",
    copy: "Plain updates, shared priorities, and honest trade-offs so stakeholders always know what happens next.",
  },
  {
    id: "partnership",
    number: "06.",
    title: "Long-Term Partnership",
    copy: "We stay after launch to refine, support, and improve—so your product keeps pace with the business.",
  },
] as const;

/** Temporary demo photos until CMS/media owns this section. */
export const WHY_CHOOSE_MEDIA = {
  largeImage: {
    src: "/why-choose/large.jpg",
    alt: "Detail of a crafted workspace object with soft natural light",
  },
  smallImage: {
    src: "/why-choose/small.jpg",
    alt: "Two teammates collaborating on a laptop in a modern studio",
  },
} as const satisfies {
  largeImage: WhyChooseImage;
  smallImage: WhyChooseImage;
};
