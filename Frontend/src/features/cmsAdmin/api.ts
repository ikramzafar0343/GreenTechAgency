import { toStoredMediaPath } from "@/lib/cmsMedia";

export type CmsAdminFetchOptions = {
  readonly method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  readonly body?: unknown;
};

export class CmsAdminError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "CmsAdminError";
    this.status = status;
    this.code = code;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      message?: string;
      error?: string;
    };
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  } catch {
    /* ignore */
  }
  return `Request failed (${response.status})`;
}

export async function cmsAdminFetch<T>(
  path: string,
  options: CmsAdminFetchOptions = {},
): Promise<T> {
  const method = options.method ?? "GET";
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const normalized = path.startsWith("/") ? path : `/${path}`;
  const init: RequestInit = {
    method,
    credentials: "include",
    headers,
  };
  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }
  const response = await fetch(`/api/backend${normalized}`, init);

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new CmsAdminError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  if (!text.trim()) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
}

export type CmsMediaUploadResult = {
  readonly url: string;
  readonly objectKey?: string;
  readonly id?: string;
};

/** Multipart upload via same-origin Backend proxy (session cookies + CSRF Origin). */
export async function cmsAdminUploadMedia(
  formData: FormData,
): Promise<CmsMediaUploadResult> {
  const response = await fetch("/api/backend/api/admin/media/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new CmsAdminError(message, response.status);
  }

  const data = (await response.json()) as {
    url?: string;
    objectKey?: string;
    id?: string;
  };
  const raw =
    (typeof data.url === "string" && data.url.trim()) ||
    (typeof data.objectKey === "string" && data.objectKey.trim()
      ? data.objectKey.startsWith("/")
        ? data.objectKey
        : `/media/${data.objectKey.replace(/^\/+/, "")}`
      : "");
  const url = toStoredMediaPath(raw);
  if (!url) {
    throw new CmsAdminError("Upload succeeded but no media URL was returned", 500);
  }
  return {
    url,
    objectKey: data.objectKey,
    id: data.id,
  };
}
