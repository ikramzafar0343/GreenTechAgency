import { buildServiceDetail } from "@/features/services/model/buildServiceDetail";
import type { ServiceDetailContent } from "@/features/services/model/serviceDetailTypes";

export const EMERGING_SERVICE_DETAILS: readonly ServiceDetailContent[] = [
  buildServiceDetail({
    slug: "artificial-intelligence",
    mediaSet: "emerging",
    heroHeadline: "Practical AI for real workflows and decisions.",
    heroIntro:
      "Automation, assistants, and insights grounded in your data, tools, and business process—not speculative demos.",
    storyLabel: "About Artificial Intelligence",
    storyParagraphs: [
      "Practical AI systems that automate workflows, surface insights, and improve customer experiences—grounded in your data, tools, and business process.",
      "We prioritize use cases with clear owners and measurable outcomes—not speculative demos that never leave a slide deck.",
      "Implementation stays responsible: privacy, evaluation, and maintainability are part of the delivery plan.",
    ],
    principles: [
      { title: "Pick useful use cases", body: "Work starts where automation or insight has a clear owner and outcome." },
      { title: "Respect the data reality", body: "Readiness, privacy, and quality constraints shape the approach." },
      { title: "Prototype for quality", body: "Early tests prove usefulness before full production investment." },
      { title: "Integrate into existing tools", body: "AI lands where people already work—not in isolated experiments." },
      { title: "Design the human handoff", body: "Accountability and review paths stay visible." },
      { title: "Operate after launch", body: "Monitoring covers quality, cost, and feedback loops." },
    ],
    relatedSlugs: ["generative-engine-optimization", "web-development", "mobile-app-development"],
    relatedHeading: "AI that connects discovery and product.",
    relatedIntro: "Practical AI often pairs with GEO, web platforms, and mobile experiences.",
  }),
  buildServiceDetail({
    slug: "augmented-reality",
    mediaSet: "emerging",
    heroHeadline: "AR that helps customers explore with confidence.",
    heroIntro:
      "Product and space experiences designed for real devices, clarity, and purchase confidence.",
    storyLabel: "About Augmented Reality",
    storyParagraphs: [
      "AR experiences that help customers explore products in real context—bridging digital product stories with physical spaces and purchase confidence.",
      "We design for clarity and performance on real devices, not only for polished demo reels.",
      "Web AR and app-based options are chosen based on audience reach and maintenance reality.",
    ],
    principles: [
      { title: "Frame a commercial use case", body: "Who needs to see what in space—and why it matters." },
      { title: "Prototype on target devices", body: "Interaction and assets are tested where customers will use them." },
      { title: "Prefer sustainable delivery", body: "Web AR or apps are chosen for reach and maintenance reality." },
      { title: "Keep experiences clear", body: "Guidance and UI reduce confusion in physical space." },
      { title: "Plan content updates", body: "Product and campaign assets can change without a rebuild every time." },
      { title: "Support the launch", body: "Teams get practical guidance for performance and customer help." },
    ],
    relatedSlugs: ["virtual-reality", "ui-ux-design", "ecommerce-development"],
    relatedHeading: "AR sits with VR, UX, and commerce.",
    relatedIntro: "Spatial experiences often need immersion partners, interface design, and storefront integration.",
  }),
  buildServiceDetail({
    slug: "virtual-reality",
    mediaSet: "emerging",
    heroHeadline: "Immersive environments with measurable purpose.",
    heroIntro:
      "VR for training, storytelling, and engagement—built for comfort, clarity, and outcomes you can review.",
    storyLabel: "About Virtual Reality",
    storyParagraphs: [
      "Immersive VR environments for training, storytelling, and engagement—built for clarity, comfort, and outcomes your teams can measure.",
      "We design sessions people can complete—comfortable pacing, clear goals, and useful feedback.",
      "Hardware choices and content pipelines stay realistic for your rollout plan.",
    ],
    principles: [
      { title: "Define the outcome first", body: "Learning or engagement goals guide scene design." },
      { title: "Storyboard before production", body: "Interactions and comfort constraints are agreed early." },
      { title: "Respect session comfort", body: "Duration and motion are designed for real people." },
      { title: "Build for the hardware plan", body: "Delivery matches devices and rollout reality." },
      { title: "Test iteratively", body: "Device reviews catch friction before facilitators meet users." },
      { title: "Hand off for operations", body: "Teams get training and a content update path." },
    ],
    relatedSlugs: ["augmented-reality", "video-animation-2d-3d", "ui-ux-design"],
    relatedHeading: "VR pairs with AR, motion, and UX.",
    relatedIntro: "Immersive work often needs spatial partners, animation craft, and interaction design.",
  }),
];
