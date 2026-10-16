export const HERO_CONTENT = {
  headline: "Digital Solutions That Drive Business Growth",
  paragraphs: [
    {
      id: "services",
      before: "We build high-performance ",
      emphasis:
        "websites, software, mobile apps, SEO, digital marketing, and AI solutions",
      after:
        " designed to increase visibility, generate leads, and grow your business.",
    },
  ],
  primaryCta: {
    label: "Start Your Project",
    href: "/contact",
  },
  secondaryCta: {
    label: "Explore Our Services",
    eventName: "greentech:open-services",
  },
  media: {
    videoSrc: "/hero/hero-background.mp4",
    posterSrc: "/hero/hero-poster.jpg",
  },
} as const;

export const OPEN_SERVICES_EVENT = HERO_CONTENT.secondaryCta.eventName;
