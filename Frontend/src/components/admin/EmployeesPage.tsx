"use client";

import Image from "next/image";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormModal, adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { ConfirmDeleteModal } from "@/components/admin/ConfirmDeleteModal";
import { employeeKindLabel } from "@/constants/sales";
import { cmsMediaSrc } from "@/lib/cmsMedia";
import { useEmployeesPage, cardClass } from "./EmployeesPageModel";
import { EmployeesPageSection1 } from "./EmployeesPageSections";

export function EmployeesPage() {
  const model = useEmployeesPage();
  const { state, deleteOpen, setDeleteOpen, passwordOpen, setPasswordOpen, setDeleteId, setPasswordEmployeeId, password, setPassword, confirmPassword, setConfirmPassword, passwordError, setPasswordError, deleteError, setDeleteError, showSetPassword, setShowSetPassword, passwordPending, deletePending, EditIcon, TrashIcon, KeyIcon, EyeIcon, EyeOffIcon, passwordTarget, openAdd, openEdit, openPassword, savePassword, confirmDelete, deleteTarget } = model;
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Employees"
        lede="Internal staff directory for client assignments."
        actionLabel="Add employee"
        onAction={openAdd}
      />

      <div className={cardClass}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left">
            <thead>
              <tr className="border-b border-black/8 bg-cream/60">
                <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                  Email
                </th>
                <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                  Role
                </th>
                <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                  Department
                </th>
                <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                  Kind
                </th>
                <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-[0.72rem] font-extrabold tracking-[0.14em] text-black/40 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/8">
              {state.employees.map((item) => (
                <tr key={item.id} className="hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-full border border-black/8">
                          <Image
                            src={cmsMediaSrc(item.image)}
                            alt={item.name}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : null}
                      <span className="text-[0.9rem] font-semibold text-[#0d120b]">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[0.84rem] font-medium text-black/50">
                    {item.email}
                  </td>
                  <td className="px-4 py-3 text-[0.84rem] font-medium text-black/50">
                    {item.role}
                  </td>
                  <td className="px-4 py-3 text-[0.84rem] font-medium text-black/50">
                    {item.department}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${
                        item.kind === "sales"
                          ? "bg-[rgba(249,161,55,0.18)] text-[#e8891a]"
                          : "bg-brand/12 text-brand"
                      }`}
                    >
                      {employeeKindLabel[item.kind]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[0.72rem] font-bold ${
                        item.active
                          ? "bg-brand/16 text-brand"
                          : "bg-black/8 text-black/45"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Set password"
                        onClick={() => openPassword(item)}
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-black/10 bg-white"
                      >
                        <KeyIcon className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Edit"
                        onClick={() => openEdit(item)}
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-black/10 bg-white"
                      >
                        <EditIcon className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete"
                        onClick={() => {
                          setDeleteId(item.id);
                          setDeleteError(null);
                          setDeleteOpen(true);
                        }}
                        className="inline-flex size-8 items-center justify-center rounded-lg border border-black/10 bg-white"
                      >
                        <TrashIcon className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EmployeesPageSection1 model={model} />

      <AdminFormModal
        open={passwordOpen}
        title={`Set password${passwordTarget ? ` — ${passwordTarget.name}` : ""}`}
        onClose={() => {
          if (passwordPending) {
            return;
          }
          setPasswordOpen(false);
          setPasswordEmployeeId(null);
          setPasswordError(null);
        }}
        onSubmit={savePassword}
        submitLabel={passwordPending ? "Saving…" : "Save password"}
      >
        <div>
          <label className="block">
            <span className={adminLabelClass}>New password</span>
            <div className="relative">
              <input
                type={showSetPassword ? "text" : "password"}
                autoComplete="new-password"
                className={`${adminFieldClass} pr-12`}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                aria-label={
                  showSetPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowSetPassword((value) => !value)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/45"
              >
                {showSetPassword ? (
                  <EyeOffIcon className="size-5" />
                ) : (
                  <EyeIcon className="size-5" />
                )}
              </button>
            </div>
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Confirm password</span>
            <div className="relative">
              <input
                type={showSetPassword ? "text" : "password"}
                autoComplete="new-password"
                className={`${adminFieldClass} pr-12`}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
              <button
                type="button"
                aria-label={
                  showSetPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowSetPassword((value) => !value)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/45"
              >
                {showSetPassword ? (
                  <EyeOffIcon className="size-5" />
                ) : (
                  <EyeIcon className="size-5" />
                )}
              </button>
            </div>
          </label>
        </div>
        {passwordError ? (
          <p className="text-[0.84rem] font-semibold text-[#e8891a]">
            {passwordError}
          </p>
        ) : null}
      </AdminFormModal>

      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete employee"
        lede={
          deleteError ??
          `Remove "${deleteTarget?.name ?? "this employee"}" from the directory?`
        }
        onClose={() => {
          if (deletePending) {
            return;
          }
          setDeleteOpen(false);
          setDeleteId(null);
          setDeleteError(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
