import { buildServiceDetail } from "@/features/services/model/buildServiceDetail";
import type { ServiceDetailContent } from "@/features/services/model/serviceDetailTypes";

export const MARKETING_CONTENT_SERVICE_DETAILS: readonly ServiceDetailContent[] = [
  buildServiceDetail({
    slug: "generative-engine-optimization",
    mediaSet: "marketing",
    heroHeadline: "Make your brand clearer in AI answers.",
    heroIntro:
      "GEO work that strengthens entity clarity, authoritative content, and discovery-ready structure—without inventing claims.",
    storyLabel: "About Generative Engine Optimization",
    storyParagraphs: [
      "Optimization for generative engines so your brand surfaces in AI answers—with entity clarity, authoritative content, and discovery-ready structure.",
      "GEO builds on solid SEO foundations: clear topics, trustworthy sources, and content machines can cite accurately.",
      "We help you prepare pages and knowledge assets for AI discovery without inventing unverified claims.",
    ],
    principles: [
      { title: "Map the entities", body: "Brand, services, and proof points are named consistently across the site." },
      { title: "Strengthen citeable facts", body: "Content is structured so accurate answers can be extracted." },
      { title: "Build on SEO foundations", body: "GEO extends technical and content health—not a shortcut around them." },
      { title: "Avoid invented claims", body: "Only verified facts enter answer-ready surfaces." },
      { title: "Align with content systems", body: "Editorial calendars reinforce the topics engines should associate with you." },
      { title: "Validate and refine", body: "Discovery signals guide the next content priorities." },
    ],
    relatedSlugs: ["search-engine-optimization", "content-marketing", "artificial-intelligence"],
    relatedHeading: "GEO sits with SEO, content, and AI.",
    relatedIntro: "Answer readiness is strongest when organic search, editorial systems, and practical AI are aligned.",
  }),
  buildServiceDetail({
    slug: "content-marketing",
    mediaSet: "marketing",
    heroHeadline: "Editorial systems that earn attention over time.",
    heroIntro:
      "Content planned for search intent, sales conversations, and lasting authority—not one-off posts.",
    storyLabel: "About Content Marketing",
    storyParagraphs: [
      "Strategic content systems that attract, educate, and convert buyers—aligned to search intent, sales conversations, and long-term brand authority.",
      "We build topics and formats your team can sustain—not one-off posts that disappear after publish day.",
      "Distribution across SEO, social, and sales enablement keeps each asset working harder.",
    ],
    principles: [
      { title: "Choose topics with intent", body: "Themes map to audience needs and commercial conversations." },
      { title: "Build a sustainable system", body: "Calendars, briefs, and owners match real capacity." },
      { title: "Write for usefulness", body: "Depth and clarity beat empty thought-leadership filler." },
      { title: "Design for distribution", body: "Assets are planned for SEO, social, and sales reuse." },
      { title: "Compound authority", body: "Related pieces reinforce the same category story." },
      { title: "Measure what matters", body: "Reviews track engagement quality and pipeline support." },
    ],
    relatedSlugs: ["copywriting", "search-engine-optimization", "social-media-marketing"],
    relatedHeading: "Content needs craft and distribution.",
    relatedIntro: "Editorial systems pair naturally with copywriting, SEO, and social channels.",
  }),
  buildServiceDetail({
    slug: "copywriting",
    mediaSet: "marketing",
    heroHeadline: "Words that clarify offers and reduce friction.",
    heroIntro:
      "Persuasive messaging for websites, campaigns, and product storytelling—written for real decisions.",
    storyLabel: "About Copywriting",
    storyParagraphs: [
      "Persuasive messaging for websites, campaigns, and product storytelling—written to clarify offers, reduce friction, and support conversion outcomes.",
      "We write for real decisions: what to say, where to say it, and how to make the next step obvious.",
      "Tone stays on-brand while remaining direct enough for busy buyers.",
    ],
    principles: [
      { title: "Brief for decisions", body: "Audience, offer, and objections are clear before drafting." },
      { title: "Lead with clarity", body: "Value is stated without jargon or empty claims." },
      { title: "Match the interface", body: "Hierarchy and length fit how the page or campaign is scanned." },
      { title: "Support the next step", body: "CTAs and microcopy remove hesitation." },
      { title: "Keep voice consistent", body: "Messaging frameworks help teams reuse the same language." },
      { title: "Hand off cleanly", body: "Final copy includes notes for design and implementation." },
    ],
    relatedSlugs: ["content-marketing", "digital-branding-creatives", "ui-ux-design"],
    relatedHeading: "Copy connects brand, content, and UX.",
    relatedIntro: "Strong messaging often sits beside editorial systems, visual identity, and interface design.",
  }),
];
