import type { AboutPageContent } from "@/features/about/model/aboutPageTypes";
import { UPPER_LOGOS } from "@/features/brands/model/brandLogos";
import { getServiceHref } from "@/features/services/model/serviceItems";
import { STATS_CONTENT } from "@/features/stats/model/statsContent";

const projectStat = STATS_CONTENT.metrics.find((m) => m.id === "stat-projects");

const clientNames = Array.from(
  new Map(UPPER_LOGOS.map((logo) => [logo.name, logo])).values(),
)
  .filter((logo) => !/^logo-/i.test(logo.name) && logo.name !== "Retail")
  .slice(0, 12);

export const ABOUT_PAGE_CONTENT: AboutPageContent = {
  seo: {
    title: "About | GreenTech Agency",
    description:
      "How GreenTech Agency plans, designs, and ships digital products with clear collaboration and measurable outcomes.",
    canonicalPath: "/about",
  },
  hero: {
    headlineLines: [
      "Creativity and code through design",
      "Designing better digital experiences",
      "Connecting people with useful solutions",
    ],
    supportingLines: [
      "See real case studies and measurable results",
      "Step into a clearer path for digital growth",
    ],
    footLeft: "Digital Agency",
    footCenter: "Scroll to explore",
    footRight: "About GreenTech",
  },
  groupPortrait: {
    src: null,
    alt: "GreenTech Agency team working together",
    focalPoint: "50% 42%",
    assetStatus: "missing",
  },
  manifesto: {
    headline:
      "As a focused team, we offer a more collaborative and direct partnership, perfectly scaled to integrate and problem-solve alongside you—a true extension of your brand team.",
    sideHeading: "How it all began...",
    sideParagraph:
      "Clients work with the people building the product. We keep scope honest, decisions visible, and delivery paced around commercial priorities—not vanity milestones.",
  },
  team: [],
  services: [
    {
      id: "web-design",
      label: "Web Design",
      index: 1,
      description:
        "Interfaces and journeys shaped for clarity, trust, and conversion—so visitors understand value quickly and know what to do next.",
      href: getServiceHref("ui-ux-design"),
      iconName: "design",
      facts: [
        { label: "Deliverables", value: "Flows, UI systems, prototypes" },
        { label: "Typical scope", value: "Product UX & website redesign" },
        { label: "Next step", value: "Discovery workshop" },
      ],
      capabilities: [
        "Flows",
        "UI systems",
        "Prototypes",
        "Product UX",
        "Website redesign",
        "Discovery workshop",
      ],
    },
    {
      id: "development",
      label: "Development",
      index: 2,
      description:
        "Websites and applications built for performance, accessibility, and maintainable growth after launch.",
      href: getServiceHref("web-development"),
      iconName: "code",
      facts: [
        { label: "Deliverables", value: "Frontends, apps, integrations" },
        { label: "Typical scope", value: "MVP to production systems" },
        { label: "Next step", value: "Technical scoping" },
      ],
      capabilities: [
        "Frontends",
        "Apps",
        "Integrations",
        "MVP builds",
        "Production systems",
        "Technical scoping",
      ],
    },
    {
      id: "marketing",
      label: "Marketing",
      index: 3,
      description:
        "Search, content, and demand programs measured against commercial goals—not vanity traffic alone.",
      href: getServiceHref("digital-marketing"),
      iconName: "growth",
      facts: [
        { label: "Deliverables", value: "SEO, campaigns, content systems" },
        { label: "Typical scope", value: "Quarterly growth programs" },
        { label: "Next step", value: "Channel audit" },
      ],
      capabilities: [
        "SEO",
        "Campaigns",
        "Content systems",
        "Growth programs",
        "Demand gen",
        "Channel audit",
      ],
    },
    {
      id: "branding",
      label: "Branding",
      index: 4,
      description:
        "Brand systems and creative assets that stay unmistakable across product, campaigns, and content.",
      href: getServiceHref("digital-branding-creatives"),
      iconName: "brand",
      facts: [
        { label: "Deliverables", value: "Identity, guidelines, creatives" },
        { label: "Typical scope", value: "Brand refresh or launch kit" },
        { label: "Next step", value: "Creative brief" },
      ],
      capabilities: [
        "Identity",
        "Guidelines",
        "Creatives",
        "Brand refresh",
        "Launch kits",
        "Creative brief",
      ],
    },
    {
      id: "emerging",
      label: "Emerging Tech",
      index: 5,
      description:
        "Practical AI, AR, and immersive work grounded in real workflows—not speculative demos.",
      href: getServiceHref("artificial-intelligence"),
      iconName: "tech",
      facts: [
        { label: "Deliverables", value: "AI, AR, VR experiences" },
        { label: "Typical scope", value: "Pilot to production" },
        { label: "Next step", value: "Use-case review" },
      ],
      capabilities: [
        "AI systems",
        "AR experiences",
        "VR experiences",
        "Pilot programs",
        "Production rollout",
        "Use-case review",
      ],
    },
  ],
  achievements: {
    enabled: true,
    heading: "Projects delivered",
    stripExplore: "Explore",
    stripIndex: "02",
    stripLabel: "Recognition",
    actualCount: projectStat?.value ?? 120,
    suffix: projectStat?.suffix ?? "+",
    allAwardsLabel: "See selected work",
    allAwardsHref: "/#our-work",
    rows: [
      {
        id: "a1",
        organizationName: "Development",
        description: "Product websites & platforms",
        awardCount: null,
        evidenceHref: "/#our-work",
        previewImage: {
          src: "/images/about/photoFan/aboutDeveloperCollaboration06.jpg",
          width: 800,
          height: 1120,
        },
        sortOrder: 1,
        published: true,
      },
      {
        id: "a2",
        organizationName: "Design",
        description: "Design systems & UX programs",
        awardCount: null,
        evidenceHref: "/#our-work",
        previewImage: {
          src: "/images/about/photoFan/aboutDesignReview05.jpg",
          width: 800,
          height: 1120,
        },
        sortOrder: 2,
        published: true,
      },
      {
        id: "a3",
        organizationName: "Growth",
        description: "Search & demand initiatives",
        awardCount: null,
        evidenceHref: "/#our-work",
        previewImage: {
          src: "/images/about/photoFan/aboutCreativeWorkshop02.jpg",
          width: 800,
          height: 1120,
        },
        sortOrder: 3,
        published: true,
      },
      {
        id: "a4",
        organizationName: "Creative",
        description: "Brand & creative systems",
        awardCount: null,
        evidenceHref: "/#our-work",
        previewImage: {
          src: "/images/about/photoFan/aboutStudioTeam03.jpg",
          width: 800,
          height: 1120,
        },
        sortOrder: 4,
        published: true,
      },
      {
        id: "a5",
        organizationName: "Emerging",
        description: "AI and immersive pilots",
        awardCount: null,
        evidenceHref: "/#our-work",
        previewImage: {
          src: "/images/about/photoFan/aboutWorkspaceMeeting04.jpg",
          width: 800,
          height: 1120,
        },
        sortOrder: 5,
        published: true,
      },
      {
        id: "a6",
        organizationName: "Partnership",
        description: "Ongoing retainers & squads",
        awardCount: null,
        evidenceHref: "/#our-work",
        previewImage: {
          src: "/images/about/photoFan/aboutTeamCollaboration01.jpg",
          width: 800,
          height: 1120,
        },
        sortOrder: 6,
        published: true,
      },
    ],
  },
  clients: {
    descriptor:
      "Selected collaborations across product websites, brand systems, and growth programs with teams that value clear delivery.",
    quote: null,
    quoteAuthor: null,
    items: clientNames.map((logo, index) => ({
      id: `client-${index + 1}`,
      name: logo.name,
      sortOrder: index + 1,
      isPublished: true,
      logoSrc: logo.src,
      logoAlt: `${logo.name} logo`,
      logoWidth: logo.width,
      logoHeight: logo.height,
    })),
  },
  contact: {
    headline: "Let's Talk.",
    supportingText:
      "Share what you are planning. We will help turn the next step into a practical plan.",
    ctaHref: "/contact",
    ctaLabel: "Start a conversation",
  },
  assetNotes: [
    "Group portrait: missing approved team photograph (public/about/group-portrait).",
    "Employee carousel: using previewOnly sample portraits until real published staff records exist.",
    "Recognition section: MOZ awards layout with verified Projects delivered metric; no invented award-body credentials. Row previews use approved about editorial photos.",
    "Clients showcase: brand-family logos from storefront assets; factual descriptor only (no invented testimonials).",
  ],
};
