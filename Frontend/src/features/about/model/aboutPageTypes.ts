export type AboutSeo = {
  title: string;
  description: string;
  canonicalPath: string;
};

export type AboutHeroContent = {
  headlineLines: readonly string[];
  supportingLines: readonly string[];
  footLeft: string;
  footCenter: string;
  footRight: string;
};

export type AboutGroupPortraitContent = {
  src: string | null;
  alt: string;
  focalPoint: string;
  assetStatus: "missing" | "ready";
};

export type AboutManifestoContent = {
  headline: string;
  sideHeading: string;
  sideParagraph: string;
};

export type AboutTeamMember = {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
  alt: string;
  sortOrder: number;
};

export type AboutServiceFact = {
  label: string;
  value: string;
};

export type AboutServiceRow = {
  id: string;
  label: string;
  index: number;
  description: string;
  href: string;
  iconName: "design" | "code" | "growth" | "brand" | "tech";
  facts: readonly AboutServiceFact[];
  capabilities: readonly string[];
};

export type AboutAwardPreview = {
  src: string;
  width: number;
  height: number;
};

export type AboutAwardRow = {
  id: string;
  organizationName: string;
  description: string;
  awardCount: number | null;
  evidenceHref: string | null;
  previewImage: AboutAwardPreview | null;
  sortOrder: number;
  published: boolean;
};

export type AboutAchievementsContent = {
  enabled: boolean;
  heading: string;
  stripExplore: string;
  stripIndex: string;
  stripLabel: string;
  actualCount: number;
  suffix: string;
  rows: readonly AboutAwardRow[];
  allAwardsLabel: string;
  allAwardsHref: string | null;
};

export type AboutClientItem = {
  id: string;
  name: string;
  caseStudyHref?: string;
  sortOrder: number;
  isPublished: boolean;
  logoSrc: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
};

export type AboutClientsSectionContent = {
  items: readonly AboutClientItem[];
  descriptor: string;
  quote: string | null;
  quoteAuthor: string | null;
};

export type AboutContactContent = {
  headline: string;
  supportingText: string;
  ctaHref: string;
  ctaLabel: string;
};

export type AboutPageContent = {
  seo: AboutSeo;
  hero: AboutHeroContent;
  groupPortrait: AboutGroupPortraitContent;
  manifesto: AboutManifestoContent;
  team: readonly AboutTeamMember[];
  services: readonly AboutServiceRow[];
  achievements: AboutAchievementsContent;
  clients: AboutClientsSectionContent;
  contact: AboutContactContent;
  assetNotes: readonly string[];
};
