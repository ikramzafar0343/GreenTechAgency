import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { contentRedirect } from "../db/schema/redirects.js";
import { AppError } from "../http/errors.js";

export async function reserveRedirect(
  fromPath: string,
  toPath: string,
): Promise<void> {
  if (fromPath === toPath) {
    return;
  }
  if (!fromPath.startsWith("/") || !toPath.startsWith("/")) {
    throw new AppError("VALIDATION", "Redirect paths must be absolute site paths");
  }
  if (fromPath.includes("//") || toPath.includes("//")) {
    throw new AppError("VALIDATION", "Redirect paths must not contain //");
  }
  const db = getDb();
  const existing = await db
    .select()
    .from(contentRedirect)
    .where(eq(contentRedirect.fromPath, fromPath))
    .limit(1);
  if (existing[0] && existing[0].toPath !== toPath) {
    // Update destination for same historical path
    await db
      .update(contentRedirect)
      .set({ toPath, httpStatus: 301 })
      .where(eq(contentRedirect.id, existing[0].id));
    return;
  }
  if (!existing[0]) {
    // Prevent creating a fromPath that is already a toPath target of a loop
    const reverse = await db
      .select()
      .from(contentRedirect)
      .where(eq(contentRedirect.toPath, fromPath))
      .limit(1);
    if (reverse[0]?.fromPath === toPath) {
      throw new AppError("VALIDATION", "Redirect would create a loop");
    }
    await db.insert(contentRedirect).values({
      id: randomUUID(),
      fromPath,
      toPath,
      httpStatus: 301,
    });
  }
}

export async function resolveRedirect(fromPath: string) {
  const db = getDb();
  const rows = await db
    .select()
    .from(contentRedirect)
    .where(eq(contentRedirect.fromPath, fromPath))
    .limit(1);
  return rows[0] ?? null;
}
