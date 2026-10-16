import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { admin } from "better-auth/plugins";
import { defaultRoles, userAc } from "better-auth/plugins/admin/access";
import { getBackendEnv } from "../config/env.js";
import { getDb } from "../db/client.js";
import * as schema from "../db/schema/index.js";

function createAuth() {
  const env = getBackendEnv();
  return betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: "pg",
      schema,
    }),
    secret: env.betterAuthSecret,
    baseURL: env.betterAuthUrl,
    trustedOrigins: [...env.frontendOrigins],
    user: {
      additionalFields: {
        employeeKind: {
          type: "string",
          required: false,
          input: false,
        },
      },
    },
    emailAndPassword: {
      enabled: true,
      disableSignUp: true,
      minPasswordLength: 8,
    },
    session: {
      expiresIn: 60 * 60 * 8,
      updateAge: 60 * 60,
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    advanced: {
      useSecureCookies: process.env.NODE_ENV === "production",
      database: {
        joins: true,
      },
    },
    plugins: [
      admin({
        roles: {
          ...defaultRoles,
          employee: userAc,
        },
      }),
    ],
  });
}

type GlobalAuth = {
  betterAuthInstance?: ReturnType<typeof createAuth>;
};

const globalForAuth = globalThis as typeof globalThis & GlobalAuth;

/** Better Auth instance with Drizzle adapter and HttpOnly session cookies. */
export function getAuth(): ReturnType<typeof createAuth> {
  if (globalForAuth.betterAuthInstance) {
    return globalForAuth.betterAuthInstance;
  }
  const instance = createAuth();
  globalForAuth.betterAuthInstance = instance;
  return instance;
}

export type AuthSession = Awaited<
  ReturnType<ReturnType<typeof getAuth>["api"]["getSession"]>
>;
