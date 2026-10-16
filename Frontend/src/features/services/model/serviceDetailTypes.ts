export type ServiceDetailBlock = {
  id: string;
  title: string;
  body: string;
};

export type ServiceDetailImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  tileTitle: string;
  tileCaption: string;
};

export type ServiceDetailPhotoPair = {
  left: ServiceDetailImage;
  right: ServiceDetailImage;
};

export type ServiceDetailContent = {
  slug: string;
  heroHeadline: string;
  heroIntro: string;
  storyLabel: string;
  storyParagraphs: readonly string[];
  storyCtaLabel: string;
  leadImage: ServiceDetailImage;
  pairA: ServiceDetailPhotoPair;
  pairB: ServiceDetailPhotoPair;
  principles: readonly ServiceDetailBlock[];
  relatedHeading: string;
  relatedIntro: string;
  relatedSlugs: readonly string[];
  ctaHref: "/contact";
};

export type ServiceDetailLink = {
  slug: string;
  title: string;
  href: string;
  summary: string;
};

export type PublicServiceDetail = {
  id: string;
  slug: string;
  title: string;
  label: string;
  summary: string;
  heroHeadline: string;
  heroIntro: string;
  storyLabel: string;
  storyParagraphs: readonly string[];
  storyCtaLabel: string;
  storyCtaHref: "/contact";
  leadImage: ServiceDetailImage;
  /** Impact marquee “Delivery” rail photo for this service page. */
  deliveryRail: ServiceDetailImage;
  pairA: ServiceDetailPhotoPair;
  pairB: ServiceDetailPhotoPair;
  principles: readonly ServiceDetailBlock[];
  relatedHeading: string;
  relatedIntro: string;
  related: readonly ServiceDetailLink[];
};
