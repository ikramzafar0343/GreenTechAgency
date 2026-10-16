export type HeroParagraph = {
  id: string;
  before: string;
  emphasis: string;
  after: string;
};

export type HeroContent = {
  headline: string;
  paragraphs: readonly HeroParagraph[];
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    eventName: string;
  };
  media: {
    videoSrc: string;
    posterSrc: string;
  };
};
