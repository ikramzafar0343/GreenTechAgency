import { resolveRedirect } from "../../content/redirects.js";

export async function getRedirect(fromPath: string) {
  const row = await resolveRedirect(fromPath);
  if (!row) {
    return null;
  }
  return {
    fromPath: row.fromPath,
    toPath: row.toPath,
    httpStatus: row.httpStatus,
  };
}
