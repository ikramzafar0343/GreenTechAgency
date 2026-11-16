import { AppError } from "../../http/errors.js";

/**
 * Bounds for Ops JSONB payloads. Ops records are flexible documents, so instead of
 * accepting any request body we cap shape and size and refuse credential/role keys.
 */
const MAX_KEYS = 80;
const MAX_DEPTH = 4;
const MAX_STRING = 20_000;
const MAX_ARRAY = 500;
const MAX_BYTES = 64 * 1024;
const KEY_PATTERN = /^[A-Za-z][A-Za-z0-9_]{0,63}$/;

/** Never writable through generic Ops CRUD (auth lives in Better Auth tables). */
const FORBIDDEN_KEYS = new Set([
  "password",
  "passwordHash",
  "token",
  "sessionToken",
  "authRole",
  "isAdmin",
  "__proto__",
  "constructor",
  "prototype",
]);

function checkValue(value: unknown, path: string, depth: number): void {
  if (value === null || typeof value === "boolean") return;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new AppError("VALIDATION", `${path} must be a finite number`);
    }
    return;
  }
  if (typeof value === "string") {
    if (value.length > MAX_STRING) {
      throw new AppError("VALIDATION", `${path} is too long`);
    }
    return;
  }
  if (depth >= MAX_DEPTH) {
    throw new AppError("VALIDATION", `${path} is nested too deeply`);
  }
  if (Array.isArray(value)) {
    if (value.length > MAX_ARRAY) {
      throw new AppError("VALIDATION", `${path} has too many items`);
    }
    value.forEach((item, index) => checkValue(item, `${path}[${index}]`, depth + 1));
    return;
  }
  if (typeof value === "object") {
    checkObject(value as Record<string, unknown>, path, depth + 1);
    return;
  }
  throw new AppError("VALIDATION", `${path} has an unsupported type`);
}

function checkObject(obj: Record<string, unknown>, path: string, depth: number): void {
  const keys = Object.keys(obj);
  if (keys.length > MAX_KEYS) {
    throw new AppError("VALIDATION", `${path || "payload"} has too many fields`);
  }
  for (const key of keys) {
    if (!KEY_PATTERN.test(key) || FORBIDDEN_KEYS.has(key)) {
      throw new AppError("VALIDATION", `Field "${key}" is not allowed`);
    }
    checkValue(obj[key], path ? `${path}.${key}` : key, depth);
  }
}

export function assertSafeOpsPayload(payload: Record<string, unknown>): void {
  if (Buffer.byteLength(JSON.stringify(payload), "utf8") > MAX_BYTES) {
    throw new AppError("PAYLOAD_TOO_LARGE", "Record is too large");
  }
  checkObject(payload, "", 0);
}
