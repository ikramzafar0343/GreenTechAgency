import { and, count, desc, eq } from "drizzle-orm";
import { getDb } from "../../db/client.js";
import { enquiry } from "../../db/schema/siteContent.js";
import { writeAudit } from "../../content/audit.js";
import { AppError } from "../../http/errors.js";
import type { ListQuery } from "../../http/pagination.js";
import { parseEnquiryStatus } from "./docs.js";

function adminDto(row: typeof enquiry.$inferSelect) {
  return {
    id: row.id,
    kind: row.kind,
    status: row.status,
    name: row.name,
    email: row.email,
    company: row.company,
    phone: row.phone,
    service: row.service,
    message: row.message,
    meta: row.meta,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function listEnquiriesAdmin(query: ListQuery) {
  const db = getDb();
  const filters = [];
  if (query.status) filters.push(eq(enquiry.status, query.status));
  const where = filters.length ? and(...filters) : undefined;
  const [totalRow] = await db
    .select({ value: count() })
    .from(enquiry)
    .where(where);
  const rows = await db
    .select()
    .from(enquiry)
    .where(where)
    .orderBy(desc(enquiry.createdAt))
    .limit(query.limit)
    .offset(query.offset);
  return {
    items: rows.map(adminDto),
    total: totalRow?.value ?? 0,
    limit: query.limit,
    offset: query.offset,
  };
}

export async function updateEnquiryStatusAdmin(
  actorId: string,
  id: string,
  body: Record<string, unknown>,
) {
  const status = parseEnquiryStatus(body.status);
  const db = getDb();
  const rows = await db.select().from(enquiry).where(eq(enquiry.id, id)).limit(1);
  const row = rows[0];
  if (!row) throw new AppError("NOT_FOUND", "Enquiry not found");
  await db.update(enquiry).set({ status }).where(eq(enquiry.id, id));
  await writeAudit({
    actorId,
    action: "update_status",
    entityType: "enquiry",
    entityId: id,
    result: "ok",
  });
  const updated = await db
    .select()
    .from(enquiry)
    .where(eq(enquiry.id, id))
    .limit(1);
  return adminDto(updated[0]!);
}
