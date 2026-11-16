import { config as loadEnv } from "dotenv";
import { createApp } from "./http/app.js";
import { getBackendEnv } from "./config/env.js";
import { closeAppPool } from "./db/pool.js";

loadEnv({ path: ".env.local" });
loadEnv();

const env = getBackendEnv();
const app = createApp();

// Bind to loopback by default: only Nginx on the same VPS should reach the API.
// Set HOST=0.0.0.0 explicitly if a different topology is ever required.
const host = process.env.HOST?.trim() || "127.0.0.1";

const server = app.listen(env.port, host, () => {
  console.log(`GreenTech backend listening on http://${host}:${env.port}`);
});

server.requestTimeout = 30_000;
server.headersTimeout = 15_000;
server.keepAliveTimeout = 5_000;

const SHUTDOWN_DEADLINE_MS = 10_000;
let shuttingDown = false;

function shutdown(signal: string, exitCode = 0): void {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log(`Received ${signal}; shutting down`);
  const forceExit = setTimeout(() => {
    console.error("Shutdown deadline reached; forcing exit");
    process.exit(1);
  }, SHUTDOWN_DEADLINE_MS);
  forceExit.unref();
  server.close(() => {
    closeAppPool()
      .catch((error: unknown) => {
        console.error("Failed to close database pool", error);
      })
      .finally(() => {
        process.exit(exitCode);
      });
  });
}

process.on("SIGINT", () => {
  shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  shutdown("SIGTERM");
});
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection", reason);
  shutdown("unhandledRejection", 1);
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception", error);
  shutdown("uncaughtException", 1);
});
