/** Real, approved CMS data only. Do not use Brandium reference metrics in production. */
export type ImpactCardSize = "tall" | "medium" | "compact";
export type ImpactCardTheme = "dark" | "light" | "muted";

export interface ImpactMedia {
  src: string;
  alt: string;
  /** e.g. "65% 30%"; pass only validated values from the current media CMS. */
  objectPosition?: string;
}

interface ImpactCardBase {
  id: string;
  size: ImpactCardSize;
  theme?: ImpactCardTheme;
}

export interface ImpactImageCard extends ImpactCardBase {
  kind: "image";
  image: ImpactMedia;
  caption?: string;
  href?: string;
}

export interface ImpactMetricCard extends ImpactCardBase {
  kind: "metric";
  metric: string;
  description: string;
}

export interface ImpactStatementCard extends ImpactCardBase {
  kind: "statement";
  heading: string;
  description?: string;
}

export interface ImpactCtaCard extends ImpactCardBase {
  kind: "cta";
  heading: string;
  description?: string;
  linkLabel: string;
  href: string;
}

export type ImpactCardData =
  | ImpactImageCard
  | ImpactMetricCard
  | ImpactStatementCard
  | ImpactCtaCard;

export interface ImpactMadeVisibleProps {
  id?: string;
  eyebrow: string;
  heading: string;
  description: string;
  /** Already published, verified, and correctly ordered by server/CMS layer. */
  cards: readonly ImpactCardData[];
  className?: string;
}
