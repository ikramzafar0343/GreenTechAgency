import "server-only";

type Identifiable = { id: string };

export function applySectionSelection<T extends Identifiable>(
  items: readonly T[],
  featuredIds: readonly string[],
  maxItems: number,
): T[] {
  const cap = Math.max(1, Math.min(maxItems, 24));
  if (featuredIds.length === 0) {
    return [...items].slice(0, cap);
  }
  const byId = new Map(items.map((item) => [item.id, item]));
  const picked: T[] = [];
  for (const id of featuredIds) {
    const row = byId.get(id);
    if (row) {
      picked.push(row);
    }
    if (picked.length >= cap) {
      return picked;
    }
  }
  for (const item of items) {
    if (picked.some((row) => row.id === item.id)) {
      continue;
    }
    picked.push(item);
    if (picked.length >= cap) {
      break;
    }
  }
  return picked;
}
