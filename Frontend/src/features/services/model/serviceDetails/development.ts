import { buildServiceDetail } from "@/features/services/model/buildServiceDetail";
import type { ServiceDetailContent } from "@/features/services/model/serviceDetailTypes";

export const DEVELOPMENT_SERVICE_DETAILS: readonly ServiceDetailContent[] = [
  buildServiceDetail({
    slug: "web-development",
    mediaSet: "dev",
    heroHeadline: "Websites that feel clear, fast, and ready to grow.",
    heroIntro:
      "We plan and ship high-performance websites that load quickly, scale with demand, and support conversion-focused journeys from first visit to enquiry.",
    storyLabel: "About Web Development",
    storyParagraphs: [
      "We plan and ship high-performance websites that load quickly, scale with demand, and support conversion-focused journeys from first visit to enquiry.",
      "Structure, content, and technical foundations are shaped around your audience and business goals—so the site stays useful after launch, not only on day one.",
      "From marketing sites to product experiences, we focus on performance, accessibility, and maintainable builds your team can grow with.",
    ],
    principles: [
      { title: "Start with the outcome", body: "Clarify who the site is for, what action matters, and how success will be measured before visual or technical choices." },
      { title: "Make structure do the work", body: "Information architecture and page hierarchy guide visitors without forcing them to hunt for answers." },
      { title: "Build for performance", body: "Speed, accessibility, and maintainability are treated as product requirements, not late-stage polish." },
      { title: "Integrate with purpose", body: "CMS, analytics, and tools connect to real workflows so content and measurement stay practical." },
      { title: "Ship in useful slices", body: "Iterative releases keep stakeholders aligned and reduce risk before a full launch." },
      { title: "Leave room to improve", body: "Handoff includes what to watch, what to refine, and how the site can grow with the business." },
    ],
    relatedSlugs: ["ui-ux-design", "ecommerce-development", "search-engine-optimization"],
    relatedHeading: "Services that strengthen the same journey.",
    relatedIntro: "Web delivery often pairs with design, commerce, and search when the business needs a fuller digital foundation.",
  }),
  buildServiceDetail({
    slug: "mobile-app-development",
    mediaSet: "dev",
    heroHeadline: "Mobile products people can rely on every day.",
    heroIntro:
      "Native and cross-platform apps shaped for clear navigation, reliable performance, and experiences tuned for every device.",
    storyLabel: "About Mobile App Development",
    storyParagraphs: [
      "Native and cross-platform mobile products that keep customers engaged with clear navigation, reliable performance, and experiences tuned for every device.",
      "We align product scope with your business model—so releases ship useful capabilities instead of unfinished feature lists.",
      "From first prototype to store-ready release, we keep UX, APIs, and delivery cadence connected.",
    ],
    principles: [
      { title: "Define the useful release", body: "Prioritize outcomes, platforms, and the smallest product slice that still earns trust." },
      { title: "Design the real tasks", body: "Flows follow how people complete work on a phone—not desktop layouts squeezed down." },
      { title: "Engineer for reliability", body: "Stability, performance, and API contracts are part of everyday delivery quality." },
      { title: "Integrate thoughtfully", body: "Notifications, analytics, and backend systems support the product story without clutter." },
      { title: "Test on real devices", body: "QA and reviews catch friction before customers meet it in the store." },
      { title: "Plan the next iteration", body: "Release includes what to measure and how the roadmap can expand cleanly." },
    ],
    relatedSlugs: ["ui-ux-design", "web-development", "artificial-intelligence"],
    relatedHeading: "Related skills behind stronger apps.",
    relatedIntro: "Mobile work often pairs with product design, web platforms, and practical AI features.",
  }),
  buildServiceDetail({
    slug: "ecommerce-development",
    mediaSet: "dev",
    heroHeadline: "Stores built for discovery, trust, and checkout clarity.",
    heroIntro:
      "Ecommerce experiences designed so catalogues, merchandising, and retention workflows support measurable sales growth.",
    storyLabel: "About Ecommerce Development",
    storyParagraphs: [
      "Online stores shaped for discovery, trust, and checkout clarity—so catalogues, merchandising, and retention workflows support measurable sales growth.",
      "We connect product data, payments, and content so shoppers move from browse to purchase with fewer friction points.",
      "After launch, the foundation stays ready for campaigns, SEO, and ongoing merchandising changes.",
    ],
    principles: [
      { title: "Map the buying path", body: "Catalogue, product, and checkout steps are designed around how shoppers actually decide." },
      { title: "Earn trust early", body: "Clarity, proof, and performance reduce hesitation before payment." },
      { title: "Wire operations correctly", body: "Payments, inventory, and content tools match how your team runs the store." },
      { title: "Measure what sells", body: "Analytics hooks make campaigns and merchandising decisions evidence-based." },
      { title: "Keep pages fast", body: "Product and collection performance stay part of the commercial experience." },
      { title: "Support ongoing growth", body: "The storefront is built for content, SEO, and retention work after day one." },
    ],
    relatedSlugs: ["web-development", "ui-ux-design", "digital-marketing"],
    relatedHeading: "Commerce sits with design and demand.",
    relatedIntro: "Strong stores usually need web foundations, UX clarity, and marketing that feeds qualified traffic.",
  }),
  buildServiceDetail({
    slug: "ui-ux-design",
    mediaSet: "dev",
    heroHeadline: "Interfaces that make complex products feel simple.",
    heroIntro:
      "Research-led journeys and systems that keep hierarchy, usability, and brand consistency across every screen.",
    storyLabel: "About UI/UX Design",
    storyParagraphs: [
      "Research-led interfaces and journeys that make complex products feel simple, with hierarchy, usability, and brand consistency across every screen.",
      "We design for real tasks—not decoration—so teams can ship screens that reduce friction and support conversion.",
      "Design systems and prototypes keep engineering and stakeholders aligned before expensive build cycles.",
    ],
    principles: [
      { title: "Understand the job", body: "Research and journey mapping ground every screen in a real user task." },
      { title: "Reduce friction", body: "Flows remove dead ends and make the next step obvious." },
      { title: "Prototype before build", body: "Interactive exploration catches issues cheaper than late engineering rework." },
      { title: "Systemize the UI", body: "Components and patterns keep product and marketing surfaces consistent." },
      { title: "Design with delivery", body: "Specs and states are ready for engineering, not just presentation decks." },
      { title: "Support the launch", body: "We stay close during implementation so intent survives trade-offs." },
    ],
    relatedSlugs: ["web-development", "mobile-app-development", "digital-branding-creatives"],
    relatedHeading: "Design that connects product and brand.",
    relatedIntro: "UI/UX often pairs with web, mobile, and branding when experience and identity need to move together.",
  }),
];
