import { AppError } from "../../http/errors.js";

export const EMPLOYEE_KINDS = new Set(["sales", "delivery"]);

export type EmployeePayload = {
  name: string;
  email: string;
  role: string;
  department: string;
  kind: string;
  image: string;
  active: boolean;
  teamMemberId: string | null;
};

export function normalizeBody(body: Record<string, unknown>): Record<string, unknown> {
  const nested = body.payload;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return {
      ...(nested as Record<string, unknown>),
      ...(body.id !== undefined ? { id: body.id } : {}),
    };
  }
  return body;
}

export function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === "string" ? value.trim() : "";
}

export function parseEmployeeFields(source: Record<string, unknown>): EmployeePayload {
  const name = readString(source, "name");
  const email = readString(source, "email").toLowerCase();
  const kind = readString(source, "kind").toLowerCase() || "delivery";
  const role =
    readString(source, "role") || (kind === "sales" ? "Sales" : "Delivery");
  const department =
    readString(source, "department") ||
    (kind === "sales" ? "Sales" : "Delivery");
  const image = readString(source, "image");
  const teamMemberRaw = source.teamMemberId;
  const teamMemberId =
    teamMemberRaw === null || teamMemberRaw === undefined
      ? null
      : String(teamMemberRaw).trim() || null;

  if (!name || !email.includes("@")) {
    throw new AppError("VALIDATION", "Name and email are required");
  }
  if (!EMPLOYEE_KINDS.has(kind)) {
    throw new AppError("VALIDATION", "kind must be sales or delivery");
  }

  return {
    name,
    email,
    role,
    department,
    kind,
    image,
    active: source.active !== false,
    teamMemberId,
  };
}
