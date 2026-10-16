import "server-only";

export function getBackendUrl(): string {
  const configured = process.env.BACKEND_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  return "http://localhost:4000";
}
