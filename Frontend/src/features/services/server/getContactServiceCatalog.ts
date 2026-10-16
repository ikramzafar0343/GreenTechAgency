import "server-only";

import { fetchPublishedServices } from "@/features/services/server/fetchPublishedServices";
import { BackendHttpError } from "@/server/backend/client";

export type ContactServiceChip = {
  id: string;
  label: string;
};

export async function getContactServiceCatalog(): Promise<ContactServiceChip[]> {
  const rows = await fetchPublishedServices();
  return rows.map((row) => ({
    id: row.id,
    label: row.title,
  }));
}

export async function loadPublishedServiceIdSet(): Promise<Set<string>> {
  try {
    const rows = await fetchPublishedServices();
    return new Set(rows.map((row) => row.id));
  } catch (err) {
    if (err instanceof BackendHttpError) {
      throw err;
    }
    throw err;
  }
}
