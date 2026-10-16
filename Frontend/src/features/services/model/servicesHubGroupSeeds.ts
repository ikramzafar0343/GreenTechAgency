export type ServiceEntrySeed = {
  slug: string;
  description: string;
  specialtySlugs: readonly string[];
  plainSpecialties?: readonly string[];
};

export type ServiceGroupSeed = {
  id: string;
  eyebrow: string;
  title: string;
  outlineLabel: string;
  seeds: readonly ServiceEntrySeed[];
};

/**
 * Five showcase groups from existing catalog services.
 * Counts follow real inventory; IT Services includes staffing plus
 * related delivery slides so the group carousel has controls.
 */
export const SERVICE_GROUP_SEEDS: readonly ServiceGroupSeed[] = [
  {
    id: "development",
    eyebrow: "Development",
    title: "Development Services",
    outlineLabel: "Development",
    seeds: [
      {
        slug: "web-development",
        description:
          "We plan and ship high-performance websites that load quickly, scale with demand, and support conversion-focused journeys from first visit to enquiry.",
        specialtySlugs: [
          "ui-ux-design",
          "ecommerce-development",
          "search-engine-optimization",
        ],
        plainSpecialties: ["Performance", "CMS integrations", "Accessibility"],
      },
      {
        slug: "mobile-app-development",
        description:
          "Native and cross-platform mobile products that keep customers engaged with clear navigation, reliable performance, and experiences tuned for every device.",
        specialtySlugs: ["ui-ux-design", "artificial-intelligence"],
        plainSpecialties: [
          "iOS & Android",
          "API integration",
          "App store release",
        ],
      },
      {
        slug: "ecommerce-development",
        description:
          "Online stores shaped for discovery, trust, and checkout clarity—so catalogues, merchandising, and retention workflows support measurable sales growth.",
        specialtySlugs: [
          "web-development",
          "ui-ux-design",
          "digital-marketing",
        ],
        plainSpecialties: ["Catalog UX", "Payments", "Analytics"],
      },
      {
        slug: "ui-ux-design",
        description:
          "Research-led interfaces and journeys that make complex products feel simple, with hierarchy, usability, and brand consistency across every screen.",
        specialtySlugs: [
          "web-development",
          "mobile-app-development",
          "digital-branding-creatives",
        ],
        plainSpecialties: ["User research", "Design systems", "Prototyping"],
      },
    ],
  },
  {
    id: "enterprise",
    eyebrow: "IT Services",
    title: "IT Services and Solutions",
    outlineLabel: "IT Services",
    seeds: [
      {
        slug: "it-resource-outsourcing",
        description:
          "Extend your team with dedicated engineering and digital specialists who plug into your delivery rhythm without the overhead of a full permanent hire.",
        specialtySlugs: [
          "web-development",
          "mobile-app-development",
          "artificial-intelligence",
        ],
        plainSpecialties: ["Dedicated squads", "Flexible retainers"],
      },
      {
        slug: "web-development",
        description:
          "Custom platforms and internal systems engineered for reliability, security, and the operational workflows your teams depend on every day.",
        specialtySlugs: [
          "ui-ux-design",
          "ecommerce-development",
          "search-engine-optimization",
        ],
        plainSpecialties: ["Integrations", "Cloud-ready", "Support SLAs"],
      },
      {
        slug: "mobile-app-development",
        description:
          "Enterprise-ready mobile apps that keep field teams, customers, and operations connected—with stable releases and clear ownership after launch.",
        specialtySlugs: ["ui-ux-design", "artificial-intelligence"],
        plainSpecialties: [
          "Device coverage",
          "Secure auth",
          "Release management",
        ],
      },
      {
        slug: "artificial-intelligence",
        description:
          "Practical AI for IT and operations—automating routine work, improving decision support, and fitting cleanly into the tools you already run.",
        specialtySlugs: [
          "web-development",
          "mobile-app-development",
          "generative-engine-optimization",
        ],
        plainSpecialties: ["Process automation", "Assistants", "Reporting"],
      },
    ],
  },
  {
    id: "creative",
    eyebrow: "Advertising",
    title: "Advertising and Creative",
    outlineLabel: "Advertising & Creative",
    seeds: [
      {
        slug: "digital-branding-creatives",
        description:
          "Brand systems and creative assets that make your business unmistakable across sites, campaigns, and product touchpoints—with clarity and consistency.",
        specialtySlugs: [
          "copywriting",
          "video-animation-2d-3d",
          "ui-ux-design",
        ],
        plainSpecialties: ["Visual identity", "Brand guidelines"],
      },
      {
        slug: "video-animation-2d-3d",
        description:
          "Motion design and animation that explain products, elevate campaigns, and help audiences understand value faster through intentional storytelling.",
        specialtySlugs: [
          "digital-branding-creatives",
          "social-media-marketing",
          "content-marketing",
        ],
        plainSpecialties: ["2D motion", "3D animation", "Explainer films"],
      },
    ],
  },
  {
    id: "emerging",
    eyebrow: "Emerging Tech",
    title: "Emerging Tech",
    outlineLabel: "Emerging Tech",
    seeds: [
      {
        slug: "artificial-intelligence",
        description:
          "Practical AI systems that automate workflows, surface insights, and improve customer experiences—grounded in your data, tools, and business process.",
        specialtySlugs: [
          "generative-engine-optimization",
          "web-development",
          "mobile-app-development",
        ],
        plainSpecialties: ["Automation", "Assistants", "Analytics"],
      },
      {
        slug: "augmented-reality",
        description:
          "AR experiences that help customers explore products in real context—bridging digital product stories with physical spaces and purchase confidence.",
        specialtySlugs: [
          "virtual-reality",
          "ui-ux-design",
          "ecommerce-development",
        ],
        plainSpecialties: ["Product preview", "Web AR"],
      },
      {
        slug: "virtual-reality",
        description:
          "Immersive VR environments for training, storytelling, and engagement—built for clarity, comfort, and outcomes your teams can measure.",
        specialtySlugs: ["augmented-reality", "video-animation-2d-3d"],
        plainSpecialties: ["Training sims", "Brand experiences"],
      },
    ],
  },
  {
    id: "marketing",
    eyebrow: "Digital Marketing",
    title: "Digital Marketing",
    outlineLabel: "Digital Marketing",
    seeds: [
      {
        slug: "social-media-marketing",
        description:
          "Channel strategy and creative that turns attention into community growth—with publishing rhythms, engagement plans, and content that supports demand.",
        specialtySlugs: [
          "content-marketing",
          "digital-marketing",
          "video-animation-2d-3d",
        ],
        plainSpecialties: ["Content calendars", "Community"],
      },
      {
        slug: "digital-marketing",
        description:
          "Paid and organic programs that grow visibility and qualified demand across the channels your buyers already use—measured against clear commercial goals.",
        specialtySlugs: [
          "search-engine-optimization",
          "social-media-marketing",
          "content-marketing",
        ],
        plainSpecialties: ["Campaigns", "Funnel tracking"],
      },
      {
        slug: "search-engine-optimization",
        description:
          "Technical and content SEO that improves rankings and organic acquisition—with structured priorities for crawl health, intent coverage, and conversion paths.",
        specialtySlugs: [
          "generative-engine-optimization",
          "content-marketing",
          "web-development",
        ],
        plainSpecialties: ["Technical SEO", "Content SEO"],
      },
      {
        slug: "generative-engine-optimization",
        description:
          "Optimization for generative engines so your brand surfaces in AI answers—with entity clarity, authoritative content, and discovery-ready structure.",
        specialtySlugs: [
          "search-engine-optimization",
          "content-marketing",
          "artificial-intelligence",
        ],
        plainSpecialties: ["Entity clarity", "Answer readiness"],
      },
      {
        slug: "content-marketing",
        description:
          "Strategic content systems that attract, educate, and convert buyers—aligned to search intent, sales conversations, and long-term brand authority.",
        specialtySlugs: [
          "copywriting",
          "search-engine-optimization",
          "social-media-marketing",
        ],
        plainSpecialties: ["Editorial systems", "Thought leadership"],
      },
      {
        slug: "copywriting",
        description:
          "Persuasive messaging for websites, campaigns, and product storytelling—written to clarify offers, reduce friction, and support conversion outcomes.",
        specialtySlugs: [
          "content-marketing",
          "digital-branding-creatives",
          "ui-ux-design",
        ],
        plainSpecialties: ["Web copy", "Campaign messaging"],
      },
    ],
  },
];
