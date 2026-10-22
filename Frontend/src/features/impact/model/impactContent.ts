import type { ImpactMadeVisibleContent } from "@/features/impact/model/impactTypes";

/**
 * Shared Impact Made Visible sequence for service detail pages.
 * Metrics/year match approved STATS_CONTENT. Photos use owned editorial SVGs
 * until licensed photography is supplied (do not use Brandium crops).
 */
export const IMPACT_CONTENT: ImpactMadeVisibleContent = {
  id: "impactMadeVisible",
  eyebrow: "Impact made visible",
  heading: "From clear ideas to results that matter.",
  description:
    "Creative direction and practical delivery come together as measurable outcomes—sites people use, products teams can own, and growth your business can track.",
  cards: [
    {
      id: "impact-creative-lead",
      kind: "image",
      size: "tall",
      theme: "mint",
      image: {
        src: "/services/editorial/rail-photo.svg",
        alt: "Collaborative digital craft across design and engineering.",
        objectPosition: "center",
        tileTitle: "Delivery",
        tileCaption: "",
      },
    },
    {
      id: "impact-projects",
      kind: "metric",
      size: "compact",
      theme: "dark",
      metric: "120+ projects delivered",
      description: "across websites, products, and growth systems",
    },
    {
      id: "impact-outcome-photo",
      kind: "image",
      size: "tall",
      theme: "dark",
      image: {
        src: "/services/editorial/lead-dev.svg",
        alt: "Product and engineering delivery in progress.",
        objectPosition: "center 30%",
        tileTitle: "Delivery",
        tileCaption: "",
      },
      caption:
        "Practical delivery that keeps scope clear from brief to launch.",
    },
    {
      id: "impact-cta",
      kind: "cta",
      size: "medium",
      theme: "muted",
      heading: "Ready for digital experiences that support real growth.",
      description:
        "Tell us what you are planning, what needs improving, or where you are ready to scale.",
      linkLabel: "Work with us",
      href: "/contact",
    },
    {
      id: "impact-heritage",
      kind: "statement",
      size: "medium",
      theme: "light",
      heading: "Building digital products since 2018.",
      description:
        "Steady craft, clear communication, and systems your team can keep improving.",
    },
    {
      id: "impact-reach",
      kind: "statement",
      size: "medium",
      theme: "muted",
      heading: "Designed for teams that operate across markets.",
      description:
        "We partner remotely with businesses that need reliable delivery without inventing a local office claim.",
    },
    {
      id: "impact-satisfaction",
      kind: "metric",
      size: "compact",
      theme: "dark",
      metric: "98% client satisfaction",
      description: "measured across active client partnerships",
    },
    {
      id: "impact-team",
      kind: "statement",
      size: "medium",
      theme: "dark",
      heading: "A multidisciplinary team blending branding, design, and technology.",
      description:
        "Strategy, experience, and engineering stay connected so the work ships as one system.",
    },
  ],
};
