import { config as loadEnv } from "dotenv";
import { createApp } from "./http/app.js";
import { getBackendEnv } from "./config/env.js";
import { closeAppPool } from "./db/pool.js";

loadEnv({ path: ".env.local" });
loadEnv();

const env = getBackendEnv();
const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`GreenTech backend listening on http://localhost:${env.port}`);
});

async function shutdown(signal: string) {
  console.log(`Received ${signal}; shutting down`);
  server.close(async () => {
    await closeAppPool();
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
