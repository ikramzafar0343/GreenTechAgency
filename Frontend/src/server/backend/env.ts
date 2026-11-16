import "server-only";

/** Backend base URL. Required in production; localhost is a development-only default. */
export function getBackendUrl(): string {
  const configured = process.env.BACKEND_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:4000";
  }
  throw new Error("BACKEND_URL is not configured");
}
