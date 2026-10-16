import "server-only";

export type BackendListResponse<T> = { items: T[] };

export type BackendServiceListItem = {
  id: string;
  slug: string;
  title: string;
  label: string;
  summary: string;
  shortDescription: string;
  iconName: string | null;
  cardImagePath: string | null;
  cardImageAlt: string;
  featured: boolean;
  sortOrder: number;
  href: string;
};

export type BackendServicePairImage = {
  path: string | null;
  alt: string;
  width?: number | null;
  height?: number | null;
  tileTitle?: string;
  tileCaption?: string;
};

export type BackendServicePhotoPair = {
  left: BackendServicePairImage;
  right: BackendServicePairImage;
};

export type BackendServiceDetail = BackendServiceListItem & {
  heroHeadline: string;
  heroIntro: string;
  storyLabel: string;
  storyParagraphs: string[];
  storyCtaLabel: string;
  storyCtaHref: string;
  leadImagePath: string | null;
  leadImageAlt: string;
  deliveryRailImagePath?: string | null;
  deliveryRailImageAlt?: string;
  deliveryRailTileTitle?: string;
  deliveryRailTileCaption?: string;
  pairA?: BackendServicePhotoPair | null;
  pairB?: BackendServicePhotoPair | null;
  principles: Array<{ id: string; title: string; body: string }>;
  relatedHeading: string;
  relatedIntro: string;
  relatedSlugs: string[];
  ctaLabel: string | null;
  ctaHref: string | null;
};

export type BackendSubserviceListItem = {
  id: string;
  slug: string;
  serviceSlug: string;
  title: string;
  summary: string;
  cardImagePath: string | null;
  cardImageAlt: string;
  href: string;
};

export type BackendSubserviceDetail = BackendSubserviceListItem & {
  detailedContent: unknown;
  ctaLabel: string | null;
  ctaHref: string | null;
};

export type BackendBlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverUrl: string | null;
  coverAlt: string;
  railLabel: string | null;
  category: string;
  seoTitle?: string;
  seoDescription?: string;
  focalX: number;
  focalY: number;
  readTimeMinutes: number | null;
  publishedAt: string | null;
  href: string;
  homepageOrder: number;
  featured: boolean;
};

export type BackendBlogDetail = BackendBlogListItem & {
  body: unknown;
};

export type BackendPortfolioListItem = {
  id: string;
  title: string;
  slug: string;
  clientName: string | null;
  summary: string;
  description: string;
  category: string;
  coverUrl: string | null;
  featured: boolean;
  sortOrder: number;
};

export type BackendPortfolioDetail = BackendPortfolioListItem & {
  coverAlt: string;
  projectUrl: string | null;
  relatedServiceSlug: string | null;
  gallery: Array<{ path: string; alt: string }>;
  caseStudy: unknown;
  seoTitle: string;
  seoDescription: string;
};

export type BackendPublishedSection = {
  key: string;
  visible: boolean;
  eyebrow: string | null;
  heading: string;
  introduction: string;
  ctaLabel: string | null;
  ctaHref: string | null;
  featuredIds: string[];
  maxItems: number;
  items: readonly [];
};

export type BackendRedirect = {
  fromPath: string;
  toPath: string;
  httpStatus: number;
};

export type BackendFaqListItem = {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
};

export type BackendTestimonialListItem = {
  id: string;
  companyName: string;
  companyLogoUrl: string | null;
  location: string | null;
  reviewerName: string;
  reviewerRole: string | null;
  reviewerPhotoUrl: string | null;
  quote: string;
  emphasisText: string | null;
  rating: number | null;
  ratingScale: number;
  sourceUrl: string | null;
  displayOrder: number;
  featured: boolean;
};

export type BackendStatMetric = {
  id: string;
  metricType: "COUNT" | "YEAR";
  preset: "WORD_EMPHASIS" | "STANDARD_NUMBER" | "OVERSIZED_NUMBER" | "YEAR";
  value: number;
  prefix: string | null;
  suffix: string | null;
  label: string;
  emphasisWord: string | null;
  displayOrder: number;
};

export type BackendStatsPayload = {
  heading: string;
  metrics: BackendStatMetric[];
};
