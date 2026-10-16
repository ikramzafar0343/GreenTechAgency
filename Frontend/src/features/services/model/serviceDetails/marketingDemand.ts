import { buildServiceDetail } from "@/features/services/model/buildServiceDetail";
import type { ServiceDetailContent } from "@/features/services/model/serviceDetailTypes";

export const MARKETING_DEMAND_SERVICE_DETAILS: readonly ServiceDetailContent[] = [
  buildServiceDetail({
    slug: "digital-marketing",
    mediaSet: "marketing",
    heroHeadline: "Demand programs measured against commercial goals.",
    heroIntro:
      "Paid and organic work across the channels your buyers already use—planned around offers, audiences, and clear outcomes.",
    storyLabel: "About Digital Marketing",
    storyParagraphs: [
      "Paid and organic programs that grow visibility and qualified demand across the channels your buyers already use—measured against clear commercial goals.",
      "Campaigns are planned around offers, audiences, and landing experiences—not vanity metrics alone.",
      "We connect creative, tracking, and iteration so spend stays accountable to pipeline outcomes.",
    ],
    principles: [
      { title: "Define qualified success", body: "Targets and audience definitions come before channel tactics." },
      { title: "Choose channels with intent", body: "Mix paid and organic where buyers already look—not everywhere at once." },
      { title: "Align landing experiences", body: "Creative and offers meet pages that can convert." },
      { title: "Track the funnel", body: "Attribution shows what deserves more budget and what should stop." },
      { title: "Iterate on evidence", body: "Creative, offers, and targeting improve on a steady review cadence." },
      { title: "Report for decisions", body: "Updates focus on commercial impact, not activity noise." },
    ],
    relatedSlugs: ["search-engine-optimization", "social-media-marketing", "content-marketing"],
    relatedHeading: "Channels that reinforce each other.",
    relatedIntro: "Digital marketing is strongest when SEO, social, and content share the same demand story.",
  }),
  buildServiceDetail({
    slug: "social-media-marketing",
    mediaSet: "marketing",
    heroHeadline: "Social systems that turn attention into community.",
    heroIntro:
      "Channel strategy, creative, and publishing rhythms that support demand—not isolated posts.",
    storyLabel: "About Social Media Marketing",
    storyParagraphs: [
      "Channel strategy and creative that turns attention into community growth—with publishing rhythms, engagement plans, and content that supports demand.",
      "We treat social as a system: audience, message, format, and follow-up—not isolated posts.",
      "Reporting stays tied to reach quality, engagement usefulness, and contribution to pipeline where relevant.",
    ],
    principles: [
      { title: "Position with purpose", body: "Voice and audience roles are clear before the calendar fills." },
      { title: "Plan sustainable rhythms", body: "Formats and owners match what the team can actually ship." },
      { title: "Create for the channel", body: "Creative respects how people consume each platform." },
      { title: "Engage with usefulness", body: "Community work answers questions and builds trust." },
      { title: "Connect to demand", body: "Social supports campaigns, SEO topics, and sales conversations." },
      { title: "Learn every cycle", body: "Reviews refine what earns attention and what to stop." },
    ],
    relatedSlugs: ["content-marketing", "digital-marketing", "video-animation-2d-3d"],
    relatedHeading: "Social works best with content and motion.",
    relatedIntro: "Strong social programs borrow from editorial systems, paid amplification, and animation.",
  }),
  buildServiceDetail({
    slug: "search-engine-optimization",
    mediaSet: "marketing",
    heroHeadline: "Search work with clear technical and content priorities.",
    heroIntro:
      "SEO that improves organic acquisition through crawl health, intent coverage, and conversion-minded pages.",
    storyLabel: "About Search Engine Optimization",
    storyParagraphs: [
      "Technical and content SEO that improves rankings and organic acquisition—with structured priorities for crawl health, intent coverage, and conversion paths.",
      "We start with diagnosis: what blocks visibility, which queries matter, and which pages should own them.",
      "Recommendations stay practical—so engineering, content, and marketing can act in sequence.",
    ],
    principles: [
      { title: "Diagnose before prescribing", body: "Technical and content gaps are sequenced by impact." },
      { title: "Cover real intent", body: "Pages map to the questions buyers actually search." },
      { title: "Fix foundations first", body: "Crawl, indexation, and structure unlock later content work." },
      { title: "Write for people and engines", body: "Clarity and usefulness beat keyword stuffing." },
      { title: "Connect to conversion", body: "Ranking work points toward pages that can win the next step." },
      { title: "Measure quality traffic", body: "Reporting watches rankings alongside useful acquisition." },
    ],
    relatedSlugs: ["generative-engine-optimization", "content-marketing", "web-development"],
    relatedHeading: "SEO connects content, GEO, and the site itself.",
    relatedIntro: "Organic growth usually needs editorial systems, AI-answer readiness, and a sound website.",
  }),
];
