import type { PublicStatMetric } from "@/features/stats/model/types";

export function formatMetricValue(metric: PublicStatMetric): string {
  const formatted =
    metric.metricType === "YEAR"
      ? String(metric.value)
      : new Intl.NumberFormat("en-US").format(metric.value);

  return `${metric.prefix ?? ""}${formatted}${metric.suffix ?? ""}`;
}

export function splitCountDisplay(metric: PublicStatMetric): {
  main: string;
  suffix: string;
} {
  if (metric.metricType === "YEAR" || !metric.suffix) {
    return { main: formatMetricValue(metric), suffix: "" };
  }

  const main = `${metric.prefix ?? ""}${new Intl.NumberFormat("en-US").format(metric.value)}`;
  return { main, suffix: metric.suffix };
}
