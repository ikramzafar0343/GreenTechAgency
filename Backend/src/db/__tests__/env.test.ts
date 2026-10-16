import { describe, expect, it } from "vitest";
import {
  APP_POOL_SETTINGS,
  getBackendEnv,
  hasDatabaseEnv,
} from "../../config/env.js";

describe("getBackendEnv", () => {
  it("requires DATABASE_URL, DATABASE_URL_DIRECT, BETTER_AUTH_SECRET, BETTER_AUTH_URL", () => {
    expect(() => getBackendEnv({})).toThrow(/DATABASE_URL/);
    expect(() =>
      getBackendEnv({
        DATABASE_URL: "postgresql://app@localhost/app",
      }),
    ).toThrow(/DATABASE_URL_DIRECT/);
  });

  it("returns trimmed values when complete", () => {
    const env = getBackendEnv({
      PORT: "4000",
      FRONTEND_ORIGIN: " http://localhost:3000 ",
      DATABASE_URL: "  postgresql://pool/app  ",
      DATABASE_URL_DIRECT: " postgresql://direct/app ",
      BETTER_AUTH_SECRET: " secret-value-at-least-32-chars!! ",
      BETTER_AUTH_URL: " http://localhost:3000 ",
    });
    expect(env.port).toBe(4000);
    expect(env.frontendOrigins).toEqual(["http://localhost:3000"]);
    expect(env.databaseUrl).toBe("postgresql://pool/app");
    expect(env.databaseUrlDirect).toBe("postgresql://direct/app");
    expect(env.betterAuthSecret).toBe("secret-value-at-least-32-chars!!");
    expect(env.betterAuthUrl).toBe("http://localhost:3000");
  });

  it("reports hasDatabaseEnv accurately", () => {
    expect(hasDatabaseEnv({})).toBe(false);
    expect(
      hasDatabaseEnv({
        DATABASE_URL: "postgresql://pool/app",
        DATABASE_URL_DIRECT: "postgresql://direct/app",
        BETTER_AUTH_SECRET: "secret-value-at-least-32-chars!!",
        BETTER_AUTH_URL: "http://localhost:3000",
      }),
    ).toBe(true);
  });

  it("records stack pool starting settings", () => {
    expect(APP_POOL_SETTINGS).toEqual({
      max: 5,
      min: 0,
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
    });
  });
});
