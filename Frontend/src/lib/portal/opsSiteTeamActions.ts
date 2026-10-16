"use server";

import { getBackendEmployeeMe } from "@/server/backend/employeeSession";
import {
  BackendHttpError,
  backendAdminMutate,
  backendFetch,
} from "@/server/backend/client";
import {
  cast,
  fail,
  resolveOpsVersion,
  tryNamed,
  tryOk,
  type Fail,
} from "./opsActionHelpers";
import { opsArchive, opsCreate, opsGet, opsUpdate } from "./opsMutations";
import type {
  AdminEmployee,
  AdminSiteGalleryImage,
  AdminSitePrinciple,
  AdminTeamMember,
  Actor,
  FailReason,
} from "./types";

function failFromError(err: unknown): Fail {
  if (err instanceof BackendHttpError) {
    const map: Record<string, FailReason> = {
      UNAUTHORIZED: "unauthorized",
      FORBIDDEN: "unauthorized",
      CONFLICT: "conflict",
      VALIDATION: "validation",
      NOT_FOUND: "validation",
    };
    return fail(map[err.code] ?? "server", err.message);
  }
  return fail("server");
}

async function teamPayload(input: Record<string, unknown>) {
  return {
    name: String(input.name ?? ""),
    role: String(input.role ?? ""),
    bio: String(input.bio ?? ""),
    image: String(input.image ?? ""),
    active: input.active !== false,
    employeeId: input.employeeId ?? null,
    sortOrder: Number(input.sortOrder ?? 0),
    socials: input.socials ?? [],
    publishedAt: input.publishedAt ?? new Date().toISOString(),
  };
}

export async function createAdminTeamMemberAction(input: Record<string, unknown>) {
  return tryNamed("member", async () =>
    cast<AdminTeamMember>(await opsCreate("team", await teamPayload(input))),
  );
}

export async function updateAdminTeamMemberAction(
  input: Record<string, unknown> & { id: string; version: number },
) {
  const { id, version, ...rest } = input;
  return tryNamed("member", async () =>
    cast<AdminTeamMember>(
      await opsUpdate("team", id, version, await teamPayload(rest)),
    ),
  );
}

export async function archiveAdminTeamMemberAction(input: {
  readonly id: string;
  readonly version: number;
}) {
  return tryOk(async () => {
    await opsArchive("team", input.id, input.version);
  });
}

export async function createAdminEmployeeAction(input: Record<string, unknown>) {
  try {
    const password = String(input.password ?? "");
    if (password.length < 8 || password.length > 200) {
      return fail("validation", "Password must be 8–200 characters.");
    }
    const row = await backendAdminMutate<Record<string, unknown>>(
      "/api/admin/ops/employees",
      "POST",
      {
        payload: {
          name: String(input.name ?? ""),
          email: String(input.email ?? ""),
          password,
          role: String(input.role ?? ""),
          department: String(input.department ?? ""),
          kind: input.kind ?? "delivery",
          image: String(input.image ?? ""),
          active: true,
          teamMemberId: null,
        },
      },
    );
    return {
      ok: true as const,
      employee: cast<AdminEmployee>({
        ...row,
        active: row.status !== "archived",
      }),
    };
  } catch (err) {
    return failFromError(err);
  }
}

export async function updateAdminEmployeeAction(
  input: Record<string, unknown> & {
    id?: string;
    employeeId?: string;
    version?: number;
  },
) {
  const id = String(input.id ?? input.employeeId ?? "").trim();
  if (!id) {
    return fail("validation", "Employee id is required.");
  }
  try {
    const version = await resolveOpsVersion("employees", id, input.version);
    const { id: _id, employeeId: _employeeId, version: _version, ...payload } =
      input;
    return {
      ok: true as const,
      employee: cast<AdminEmployee>(
        await opsUpdate("employees", id, version, payload),
      ),
    };
  } catch (err) {
    return failFromError(err);
  }
}

export async function archiveAdminEmployeeAction(input: {
  readonly id?: string;
  readonly employeeId?: string;
  readonly version?: number;
}) {
  const id = String(input.id ?? input.employeeId ?? "").trim();
  if (!id) {
    return fail("validation", "Employee id is required.");
  }
  try {
    const version = await resolveOpsVersion("employees", id, input.version);
    await opsArchive("employees", id, version);
    return { ok: true as const };
  } catch (err) {
    return failFromError(err);
  }
}

export async function createAdminSiteGalleryImageAction(
  input: Omit<AdminSiteGalleryImage, "id"> & { id?: string },
) {
  return tryNamed("galleryImage", async () =>
    cast<AdminSiteGalleryImage>(await opsCreate("site-gallery", { ...input })),
  );
}

export async function updateAdminSiteGalleryImageAction(input: AdminSiteGalleryImage) {
  return tryNamed("galleryImage", async () =>
    cast<AdminSiteGalleryImage>(
      await opsUpdate("site-gallery", input.id, input.version, { ...input }),
    ),
  );
}

export async function archiveAdminSiteGalleryImageAction(input: {
  readonly id: string;
  readonly version?: number;
}) {
  return tryOk(async () => {
    const version = await resolveOpsVersion("site-gallery", input.id, input.version);
    await opsArchive("site-gallery", input.id, version);
  });
}

export async function createAdminSitePrincipleAction(input: Record<string, unknown>) {
  return tryNamed("principle", async () =>
    cast<AdminSitePrinciple>(await opsCreate("site-principles", input)),
  );
}

export async function updateAdminSitePrincipleAction(
  input: Record<string, unknown> & { id: string; version: number },
) {
  const { id, version, ...payload } = input;
  return tryNamed("principle", async () =>
    cast<AdminSitePrinciple>(
      await opsUpdate("site-principles", id, version, payload),
    ),
  );
}

export async function archiveAdminSitePrincipleAction(input: {
  readonly id: string;
  readonly version?: number;
}) {
  return tryOk(async () => {
    const version = await resolveOpsVersion(
      "site-principles",
      input.id,
      input.version,
    );
    await opsArchive("site-principles", input.id, version);
  });
}

export async function loadEmployeeSelf(
  _actor: Actor,
  employeeId: string,
): Promise<AdminEmployee> {
  try {
    const row = await backendFetch<Record<string, unknown>>(
      "/api/employee/profile",
      { withSession: true, cache: "no-store" },
    );
    return cast<AdminEmployee>(row);
  } catch {
    return cast<AdminEmployee>(await opsGet("employees", employeeId));
  }
}

export async function updateEmployeeSelfImageAction(input: {
  imagePath: string;
  version?: number;
}) {
  const me = await getBackendEmployeeMe();
  if (!me) {
    return fail("unauthorized");
  }
  const version = await resolveOpsVersion("employees", me.id, input.version);
  return tryNamed("employee", async () =>
    cast<AdminEmployee>(
      await opsUpdate("employees", me.id, version, { image: input.imagePath }),
    ),
  );
}

export async function reorderAdminTeamMemberAction(_input: unknown) {
  return { ok: true as const };
}

export async function setAdminEmployeePasswordAction(input: {
  readonly employeeId: string;
  readonly password: string;
}) {
  const employeeId = String(input.employeeId ?? "").trim();
  const password = String(input.password ?? "");
  if (!employeeId) {
    return fail("validation", "Employee id is required.");
  }
  if (password.length < 8 || password.length > 200) {
    return fail("validation", "Password must be 8–200 characters.");
  }
  try {
    await backendAdminMutate(`/api/admin/ops/employees/${employeeId}/password`, "POST", {
      password,
    });
    return { ok: true as const };
  } catch (err) {
    return failFromError(err);
  }
}

export async function reorderAdminSiteGalleryImagesAction(_items: unknown) {
  return { ok: true as const };
}

export async function reorderAdminSitePrinciplesAction(_input: unknown) {
  return { ok: true as const };
}

export async function reorderAdminSiteTestimonialsAction(_input: unknown) {
  return { ok: true as const };
}
