export type AppErrorCode =
  | "VALIDATION"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PAYLOAD_TOO_LARGE"
  | "RATE_LIMIT"
  | "UNAVAILABLE"
  | "INTERNAL";

const STATUS_BY_CODE: Record<AppErrorCode, number> = {
  VALIDATION: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  RATE_LIMIT: 429,
  UNAVAILABLE: 503,
  INTERNAL: 500,
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly details: unknown;
  readonly status: number;

  constructor(code: AppErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.details = details ?? null;
    this.status = STATUS_BY_CODE[code];
  }
}

export function toErrorBody(err: unknown): {
  status: number;
  body: { error: AppErrorCode; message: string; details?: unknown };
} {
  if (err instanceof AppError) {
    return {
      status: err.status,
      body: {
        error: err.code,
        message: err.message,
        ...(err.details !== null ? { details: err.details } : {}),
      },
    };
  }
  const bodyParserType =
    err && typeof err === "object" && "type" in err ? String(err.type) : "";
  if (bodyParserType === "entity.parse.failed") {
    return { status: 400, body: { error: "VALIDATION", message: "Malformed JSON body" } };
  }
  if (bodyParserType === "entity.too.large") {
    return {
      status: 413,
      body: { error: "PAYLOAD_TOO_LARGE", message: "Request body is too large" },
    };
  }
  if (err instanceof Error) {
    if (err.message === "UNAUTHORIZED") {
      return {
        status: 401,
        body: { error: "UNAUTHORIZED", message: "Authentication required" },
      };
    }
    if (err.message === "FORBIDDEN") {
      return {
        status: 403,
        body: { error: "FORBIDDEN", message: "Insufficient permission" },
      };
    }
  }
  console.error(err);
  return {
    status: 500,
    body: { error: "INTERNAL", message: "Unexpected server error" },
  };
}
