import { buildServiceDetail } from "@/features/services/model/buildServiceDetail";
import type { ServiceDetailContent } from "@/features/services/model/serviceDetailTypes";

export const IT_RESOURCE_SERVICE_DETAILS: readonly ServiceDetailContent[] = [
  buildServiceDetail({
    slug: "it-resource-outsourcing",
    mediaSet: "dev",
    heroHeadline: "Specialists who extend your team without the overhead.",
    heroIntro:
      "Dedicated engineering and digital talent that plugs into your delivery rhythm when capacity needs to scale.",
    storyLabel: "About IT Resource Outsourcing",
    storyParagraphs: [
      "Extend your team with dedicated engineering and digital specialists who plug into your delivery rhythm without the overhead of a full permanent hire.",
      "We match skills to your roadmap—development, design, or AI support—so capacity scales with real project demand.",
      "Clear communication, scoped ownership, and predictable cadence keep outsourced work accountable.",
    ],
    principles: [
      { title: "Scope the need honestly", body: "Roles, seniority, and hours are defined against outcomes—not vague headcount requests." },
      { title: "Match real skills", body: "Specialists fit your stack, rituals, and definition of done." },
      { title: "Embed into the team", body: "People work in your tools and backlog with clear ownership." },
      { title: "Keep cadence visible", body: "Progress, blockers, and priorities stay shared—not hidden offshore." },
      { title: "Adjust as priorities shift", body: "Capacity can expand or focus when the roadmap changes." },
      { title: "Protect quality bars", body: "Outsourced delivery still meets the same review and release standards." },
    ],
    relatedSlugs: ["web-development", "mobile-app-development", "artificial-intelligence"],
    relatedHeading: "Talent that supports active delivery.",
    relatedIntro: "Outsourcing often pairs with web, mobile, and AI work already on your roadmap.",
  }),
];
