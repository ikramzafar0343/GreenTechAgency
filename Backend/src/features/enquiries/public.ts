import { randomUUID } from "node:crypto";
import { getDb } from "../../db/client.js";
import { enquiry } from "../../db/schema/siteContent.js";
import { parseEnquiryCreateBody } from "./docs.js";

export async function submitEnquiry(body: Record<string, unknown>) {
  const website =
    typeof body.website === "string" ? body.website.trim() : "";
  if (website) {
    return { ok: true as const, saved: false };
  }
  const input = parseEnquiryCreateBody(body);
  const db = getDb();
  const id = randomUUID();
  await db.insert(enquiry).values({
    id,
    kind: input.kind,
    status: "new",
    name: input.name,
    email: input.email,
    company: input.company,
    phone: input.phone,
    service: input.service,
    message: input.message,
    meta: null,
  });
  return { ok: true as const, saved: true, id };
}
