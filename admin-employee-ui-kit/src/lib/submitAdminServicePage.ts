"use server";
export {
  listAdminServicePagesAction,
  getAdminServicePageBySlugAction,
  updateAdminServicePageAction,
  archiveAdminServicePageAction,
  restoreAdminServicePageAction,
  createAdminServicePageChildAction,
  updateAdminServicePageChildAction,
  archiveAdminServicePageChildAction,
  restoreAdminServicePageChildAction,
  reorderAdminServicePageChildrenAction,
  type AdminServicePageActionResult,
} from "@/lib/portal/actions";
