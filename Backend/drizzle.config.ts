import { defineConfig } from "drizzle-kit";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();

const directUrl = process.env.DATABASE_URL_DIRECT?.trim();

if (!directUrl) {
  console.warn(
    "DATABASE_URL_DIRECT is not set. Migrations will fail until it is provided.",
  );
}

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./database/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: directUrl ?? "postgresql://invalid:invalid@127.0.0.1:5432/invalid",
  },
  strict: true,
  verbose: true,
});
