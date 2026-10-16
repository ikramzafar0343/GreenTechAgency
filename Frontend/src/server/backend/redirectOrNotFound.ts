import "server-only";

import { notFound, permanentRedirect, redirect } from "next/navigation";
import { resolvePublicRedirect } from "@/server/backend/resolvePublicRedirect";

export async function redirectOrNotFound(sitePath: string): Promise<never> {
  const row = await resolvePublicRedirect(sitePath);
  if (row) {
    if (row.httpStatus === 301 || row.httpStatus === 308) {
      permanentRedirect(row.toPath);
    }
    redirect(row.toPath);
  }
  notFound();
}
