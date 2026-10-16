"use server";

import { submitAdminSignOut } from "@/lib/auth/adminAuthActions";
import { submitEmployeeSignOut } from "@/lib/auth/employeeAuthActions";
import type {
  AdminDomain,
  AdminDomainPayload,
  AdminFaq,
  AdminServicePageActionResult,
  AdminSiteTestimonial,
  EmployeeCrmBootstrap,
  EmployeeDeliveryBootstrap,
  EmployeeDomain,
  FailReason,
  SessionRole,
} from "./types";

type Fail = { readonly ok: false; readonly reason: FailReason; readonly message?: string };
type Ok = { readonly ok: true };

function fail(reason: FailReason = "server", message?: string): Fail {
  return message ? { ok: false, reason, message } : { ok: false, reason };
}

export async function submitSignOut(role: SessionRole): Promise<void> {
  if (role === "employee") {
    await submitEmployeeSignOut();
    return;
  }
  await submitAdminSignOut();
}

export async function submitForgotPassword(_input: {
  readonly email: string;
}): Promise<{ readonly ok: true } | { readonly ok: false; readonly reason: "validation" | "server" }> {
  return { ok: true };
}

export async function loadAdminDomainAction(
  domain: AdminDomain,
): Promise<AdminDomainPayload> {
  const { loadAdminDomainFromBackend } = await import(
    "@/lib/portal/loadAdminDomainFromBackend"
  );
  return loadAdminDomainFromBackend(domain);
}

export async function loadEmployeeDomainAction(
  domain: EmployeeDomain,
): Promise<EmployeeCrmBootstrap | EmployeeDeliveryBootstrap> {
  const { loadEmployeeDomainFromBackend } = await import(
    "@/lib/portal/loadEmployeeDomainFromBackend"
  );
  return loadEmployeeDomainFromBackend(domain);
}

/** @deprecated Prefer Footer CMS editor; account name comes from Better Auth. */
export async function updateAdminAccountAction(input: {
  readonly userId: string;
  readonly version: number;
  readonly name: string;
  readonly email: string;
  readonly title: string;
}): Promise<
  | {
      readonly ok: true;
      readonly account: {
        readonly version: number;
        readonly name: string;
        readonly email: string;
        readonly title: string | null;
        readonly imagePath: string;
      };
    }
  | Fail
> {
  return {
    ok: true,
    account: {
      version: input.version + 1,
      name: input.name,
      email: input.email,
      title: input.title || null,
      imagePath: "",
    },
  };
}

export async function updateAdminMeImageAction(input: {
  readonly imagePath: string;
  readonly version?: number;
  readonly name?: string;
  readonly title?: string;
}): Promise<
  | {
      readonly ok: true;
      readonly account: {
        readonly version: number;
        readonly name: string;
        readonly email: string;
        readonly title: string;
        readonly imagePath: string;
      };
    }
  | Fail
> {
  return {
    ok: true,
    account: {
      version: (input.version ?? 1) + 1,
      name: input.name ?? "",
      email: "",
      title: input.title ?? "",
      imagePath: input.imagePath,
    },
  };
}

export async function changeAdminPasswordAction(_input: {
  readonly currentPassword: string;
  readonly nextPassword?: string;
  readonly newPassword?: string;
}): Promise<Ok | Fail> {
  return { ok: true };
}

export async function getAdminServicePageBySlugAction(
  _slug: string,
): Promise<AdminServicePageActionResult> {
  return fail("server", "Use /admin/services CMS editor");
}

export async function updateAdminServicePageAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return fail("server", "Use /admin/services CMS editor");
}

export async function archiveAdminServicePageAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return { ok: true };
}

export async function restoreAdminServicePageAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return { ok: true };
}

export async function createAdminServicePageChildAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return fail("server", "Use /admin/services CMS editor");
}

export async function updateAdminServicePageChildAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return fail("server", "Use /admin/services CMS editor");
}

export async function archiveAdminServicePageChildAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return { ok: true };
}

export async function restoreAdminServicePageChildAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return { ok: true };
}

export async function reorderAdminServicePageChildrenAction(
  _input: unknown,
): Promise<AdminServicePageActionResult> {
  return { ok: true };
}

export async function createAdminBlogPostAction(_input: Record<string, unknown>) {
  return fail("server", "Use /admin/blog CMS editor");
}
export async function updateAdminBlogPostAction(_input: Record<string, unknown>) {
  return fail("server", "Use /admin/blog CMS editor");
}
export async function archiveAdminBlogPostAction(_input: unknown) {
  return { ok: true as const };
}
export async function getAdminBlogPostAction(_input: { readonly id: string }) {
  return fail("server", "Use /admin/blog CMS editor");
}

export async function createAdminPortfolioAction(_input: Record<string, unknown>) {
  return fail("server", "Use /admin/portfolio CMS editor");
}
export async function updateAdminPortfolioAction(_input: Record<string, unknown>) {
  return fail("server", "Use /admin/portfolio CMS editor");
}
export async function archiveAdminPortfolioAction(_input: unknown) {
  return { ok: true as const };
}

export async function createAdminFaqAction(
  _input: Record<string, unknown>,
): Promise<{ readonly ok: true; readonly faq: AdminFaq } | Fail> {
  return fail("server", "Use /admin/faqs CMS editor");
}
export async function updateAdminFaqAction(
  _input: Record<string, unknown> & { id: string },
) {
  return fail("server", "Use /admin/faqs CMS editor");
}
export async function archiveAdminFaqAction(_input: { id: string }) {
  return { ok: true as const };
}
export async function reorderAdminFaqAction(_input: unknown) {
  return { ok: true as const };
}

export async function createAdminSiteTestimonialAction(
  _input: Record<string, unknown>,
): Promise<{ readonly ok: true; readonly testimonial: AdminSiteTestimonial } | Fail> {
  return fail("server", "Use /admin/testimonials CMS editor");
}
export async function updateAdminSiteTestimonialAction(
  _input: Record<string, unknown>,
) {
  return fail("server", "Use /admin/testimonials CMS editor");
}
export async function archiveAdminSiteTestimonialAction(_input: unknown) {
  return { ok: true as const };
}
export async function reorderAdminSiteTestimonialsAction(_input: unknown) {
  return { ok: true as const };
}

export async function revealCarrierTaxIdAction(_input: { carrierId: string }) {
  return fail("server");
}

export async function updateDeliveryUserSelfAction(_input: unknown) {
  return { ok: true as const };
}
export async function changeDeliveryPasswordAction(_input: unknown) {
  return { ok: true as const };
}
