import "server-only";

import { BackendHttpError, backendPublicGet } from "@/server/backend/client";
import type { BackendRedirect } from "@/server/backend/dtos";

export async function resolvePublicRedirect(
  path: string,
): Promise<BackendRedirect | null> {
  const query = encodeURIComponent(path);
  try {
    return await backendPublicGet<BackendRedirect>(
      `/api/redirects?path=${query}`,
    );
  } catch (err) {
    if (err instanceof BackendHttpError && err.status === 404) {
      return null;
    }
    throw err;
  }
}
