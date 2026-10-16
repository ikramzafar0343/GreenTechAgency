import { randomUUID } from "node:crypto";
import { getDb } from "../db/client.js";
import { adminAuditLog } from "../db/schema/audit.js";

export async function writeAudit(input: {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  result: "ok" | "error";
}): Promise<void> {
  const db = getDb();
  await db.insert(adminAuditLog).values({
    id: randomUUID(),
    actorId: input.actorId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    result: input.result,
  });
}
