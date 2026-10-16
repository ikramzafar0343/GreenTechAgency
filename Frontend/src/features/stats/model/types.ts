export type MetricType = "COUNT" | "YEAR";

export type MetricPreset =
  | "WORD_EMPHASIS"
  | "STANDARD_NUMBER"
  | "OVERSIZED_NUMBER"
  | "YEAR";

export type PublicStatMetric = {
  id: string;
  metricType: MetricType;
  preset: MetricPreset;
  value: number;
  prefix: string | null;
  suffix: string | null;
  label: string;
  emphasisWord: string | null;
  displayOrder: number;
};

export type PublicStatsSection = {
  heading: string;
  entryAnimationEnabled: boolean;
  countUpEnabled: boolean;
  homepageOrder: number;
  metrics: PublicStatMetric[];
};
