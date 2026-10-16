import { AppError } from "./errors.js";

export const MAX_LIST_LIMIT = 50;
export const DEFAULT_LIST_LIMIT = 20;

export type ListQuery = {
  readonly limit: number;
  readonly offset: number;
  readonly q: string | null;
  readonly status: string | null;
};

export function parseListQuery(
  query: Record<string, unknown>,
  allowedStatuses: readonly string[],
): ListQuery {
  const limitRaw = Number(query.limit ?? DEFAULT_LIST_LIMIT);
  const offsetRaw = Number(query.offset ?? 0);
  if (
    !Number.isInteger(limitRaw) ||
    limitRaw < 1 ||
    limitRaw > MAX_LIST_LIMIT
  ) {
    throw new AppError(
      "VALIDATION",
      `limit must be an integer from 1 to ${MAX_LIST_LIMIT}`,
    );
  }
  if (!Number.isInteger(offsetRaw) || offsetRaw < 0) {
    throw new AppError("VALIDATION", "offset must be a non-negative integer");
  }
  const q =
    typeof query.q === "string" && query.q.trim()
      ? query.q.trim().slice(0, 200)
      : null;
  const status =
    typeof query.status === "string" && query.status.trim()
      ? query.status.trim()
      : null;
  if (status && !allowedStatuses.includes(status)) {
    throw new AppError("VALIDATION", `Invalid status filter: ${status}`);
  }
  return { limit: limitRaw, offset: offsetRaw, q, status };
}
