import { buildServiceDetail } from "@/features/services/model/buildServiceDetail";
import type { ServiceDetailContent } from "@/features/services/model/serviceDetailTypes";

export const CREATIVE_SERVICE_DETAILS: readonly ServiceDetailContent[] = [
  buildServiceDetail({
    slug: "digital-branding-creatives",
    mediaSet: "creative",
    heroHeadline: "Brand systems that stay unmistakable.",
    heroIntro:
      "Identity and creative assets built for clarity and consistency across sites, campaigns, and product touchpoints.",
    storyLabel: "About Digital Branding & Creatives",
    storyParagraphs: [
      "Brand systems and creative assets that make your business unmistakable across sites, campaigns, and product touchpoints—with clarity and consistency.",
      "We build identities teams can apply—guidelines, components, and examples that reduce guesswork.",
      "Creative work stays connected to the products and campaigns it must support.",
    ],
    principles: [
      { title: "Ground in positioning", body: "Audiences and competitive context shape visual direction." },
      { title: "Explore with intent", body: "Directions are validated before the system locks." },
      { title: "Systemize the identity", body: "Type, color, and usage rules become practical guidelines." },
      { title: "Design for application", body: "Assets work across web, social, and product surfaces." },
      { title: "Support campaigns", body: "Creative kits stay ready for real marketing moments." },
      { title: "Keep teams aligned", body: "Examples reduce guesswork when new work appears." },
    ],
    relatedSlugs: ["copywriting", "video-animation-2d-3d", "ui-ux-design"],
    relatedHeading: "Brand connects words, motion, and interfaces.",
    relatedIntro: "Identity systems often pair with messaging, animation, and product UI.",
  }),
  buildServiceDetail({
    slug: "video-animation-2d-3d",
    mediaSet: "creative",
    heroHeadline: "Motion that explains value faster.",
    heroIntro:
      "2D and 3D animation for explainers, campaigns, and product stories—planned before production begins.",
    storyLabel: "About 2D/3D Video Animation",
    storyParagraphs: [
      "Motion design and animation that explain products, elevate campaigns, and help audiences understand value faster through intentional storytelling.",
      "We match format to job: explainers, social loops, product demos, or brand films—with scripts and boards before production.",
      "Delivery includes versions sized for the channels you actually use.",
    ],
    principles: [
      { title: "Brief the job", body: "Message, audience, length, and channels are clear first." },
      { title: "Storyboard early", body: "Narrative and visual approach are approved before production." },
      { title: "Animate with intention", body: "Motion supports understanding—not decoration alone." },
      { title: "Review in milestones", body: "Feedback lands while changes are still affordable." },
      { title: "Deliver for channels", body: "Exports match social, web, and campaign needs." },
      { title: "Leave reusable systems", body: "Styles and templates can extend to future work." },
    ],
    relatedSlugs: ["digital-branding-creatives", "social-media-marketing", "content-marketing"],
    relatedHeading: "Motion supports brand and demand channels.",
    relatedIntro: "Animation often pairs with identity systems, social distribution, and editorial content.",
  }),
];
