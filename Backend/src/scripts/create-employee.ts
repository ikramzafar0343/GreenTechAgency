import { config as loadEnv } from "dotenv";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getBackendEnv } from "../config/env.js";
import { getDb } from "../db/client.js";
import { account, user } from "../db/schema/index.js";
import { opsEmployee } from "../db/schema/ops.js";
import { closeAppPool } from "../db/pool.js";

loadEnv({ path: ".env.local" });
loadEnv();

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }
  return process.argv[index + 1];
}

const EMPLOYEE_KINDS = new Set(["sales", "delivery"]);

async function main() {
  getBackendEnv();

  const email = argValue("--email")?.trim().toLowerCase();
  const name = argValue("--name")?.trim();
  const password = argValue("--password")?.trim();
  const kind = argValue("--kind")?.trim().toLowerCase();
  const department =
    argValue("--department")?.trim() ??
    (kind === "sales" ? "Sales" : "Delivery");
  const jobRole =
    argValue("--role")?.trim() ?? (kind === "sales" ? "Sales" : "Delivery");

  if (!email || !name || !password || !kind) {
    console.error(
      "Usage: npm run auth:create-employee -- --email user@example.com --name \"Alex Rivera\" --password '…' --kind sales|delivery",
    );
    process.exit(1);
  }

  if (!EMPLOYEE_KINDS.has(kind)) {
    console.error("--kind must be sales or delivery.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const db = getDb();
  const existing = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (existing[0]) {
    console.error(`User already exists for email: ${email}`);
    process.exit(1);
  }

  const userId = randomUUID();
  const now = new Date();
  const passwordHash = await hashPassword(password);

  await db.transaction(async (tx) => {
    await tx.insert(user).values({
      id: userId,
      name,
      email,
      emailVerified: true,
      role: "employee",
      employeeKind: kind,
      banned: false,
      createdAt: now,
      updatedAt: now,
    });
    await tx.insert(account).values({
      id: randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
      createdAt: now,
      updatedAt: now,
    });
    await tx.insert(opsEmployee).values({
      id: userId,
      status: "active",
      version: 1,
      payload: {
        name,
        email,
        role: jobRole,
        department,
        kind,
        image: "",
        active: true,
        teamMemberId: null,
      },
      createdAt: now,
      updatedAt: now,
    });
  });

  console.log(`Created employee ${email} (${userId}, kind=${kind})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeAppPool();
  });
