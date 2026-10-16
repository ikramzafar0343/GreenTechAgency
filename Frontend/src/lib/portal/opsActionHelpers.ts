import type { FailReason } from "./types";
import type { OpsResource } from "./opsMutations";
import { opsGet } from "./opsMutations";

export type Fail = {
  readonly ok: false;
  readonly reason: FailReason;
  readonly message?: string;
};
export type Ok = { readonly ok: true };
export type OkData<T> = { readonly ok: true; readonly data: T };

export function fail(reason: FailReason = "server", message?: string): Fail {
  return message ? { ok: false, reason, message } : { ok: false, reason };
}

export function cast<T>(row: Record<string, unknown>): T {
  return row as T;
}

export async function tryData<T>(run: () => Promise<T>): Promise<OkData<T> | Fail> {
  try {
    return { ok: true, data: await run() };
  } catch {
    return fail("server");
  }
}

export async function tryOk(run: () => Promise<unknown>): Promise<Ok | Fail> {
  try {
    await run();
    return { ok: true };
  } catch {
    return fail("server");
  }
}

export async function tryNamed<K extends string, T>(
  key: K,
  run: () => Promise<T>,
): Promise<({ readonly ok: true } & Record<K, T>) | Fail> {
  try {
    const value = await run();
    return { ok: true, [key]: value } as { readonly ok: true } & Record<K, T>;
  } catch {
    return fail("server");
  }
}

export async function resolveOpsVersion(
  resource: OpsResource,
  id: string,
  version?: number,
): Promise<number> {
  if (typeof version === "number") {
    return version;
  }
  const row = await opsGet(resource, id);
  return Number(row.version);
}
