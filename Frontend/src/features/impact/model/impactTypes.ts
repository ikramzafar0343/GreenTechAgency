/** Approved storefront impact cards only — no Brandium reference metrics. */

export type ImpactCardSize = "tall" | "medium" | "compact";
export type ImpactCardTheme = "dark" | "light" | "muted" | "mint";

export type ImpactMedia = {
  src: string;
  alt: string;
  objectPosition?: string;
  tileTitle?: string;
  tileCaption?: string;
};

type ImpactCardBase = {
  id: string;
  size: ImpactCardSize;
  theme?: ImpactCardTheme;
};

export type ImpactImageCard = ImpactCardBase & {
  kind: "image";
  image: ImpactMedia;
  caption?: string;
  href?: string;
};

export type ImpactMetricCard = ImpactCardBase & {
  kind: "metric";
  metric: string;
  description: string;
};

export type ImpactStatementCard = ImpactCardBase & {
  kind: "statement";
  heading: string;
  description?: string;
};

export type ImpactCtaCard = ImpactCardBase & {
  kind: "cta";
  heading: string;
  description?: string;
  linkLabel: string;
  href: string;
};

export type ImpactCardData =
  | ImpactImageCard
  | ImpactMetricCard
  | ImpactStatementCard
  | ImpactCtaCard;

export type ImpactMadeVisibleContent = {
  id: string;
  eyebrow: string;
  heading: string;
  description: string;
  cards: readonly ImpactCardData[];
};
