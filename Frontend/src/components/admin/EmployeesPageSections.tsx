"use client";

import { AdminImageField } from "@/components/admin/AdminImageField";
import { AdminFormModal, adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { type EmployeesPageModel } from "./EmployeesPageModel";

export function EmployeesPageSection1({ model }: { model: EmployeesPageModel }) {
  const { modalOpen, editingId, pending, setModalOpen, save, form, setForm, showCreatePassword, setShowCreatePassword, EyeOffIcon, EyeIcon, formError } = model;
  return (
    <AdminFormModal
        open={modalOpen}
        title={editingId ? "Edit employee" : "Add employee"}
        onClose={() => {
          if (pending) {
            return;
          }
          setModalOpen(false);
        }}
        onSubmit={save}
        submitLabel={
          pending ? "Saving…" : editingId ? "Save" : "Create employee"
        }
      >
        <div>
          <label className="block">
            <span className={adminLabelClass}>Name</span>
            <input
              className={adminFieldClass}
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({ ...current, name: event.target.value }))
              }
            />
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Email</span>
            <input
              type="email"
              className={adminFieldClass}
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
            />
          </label>
        </div>
        {!editingId ? (
          <>
            <div>
              <label className="block">
                <span className={adminLabelClass}>Password</span>
                <div className="relative">
                  <input
                    type={showCreatePassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`${adminFieldClass} pr-12`}
                    value={form.password}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    aria-label={
                      showCreatePassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowCreatePassword((value) => !value)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-black/45"
                  >
                    {showCreatePassword ? (
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
                    type={showCreatePassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`${adminFieldClass} pr-12`}
                    value={form.confirmPassword}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    aria-label={
                      showCreatePassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowCreatePassword((value) => !value)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-black/45"
                  >
                    {showCreatePassword ? (
                      <EyeOffIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
              </label>
            </div>
          </>
        ) : null}
        <div>
          <label className="block">
            <span className={adminLabelClass}>Role</span>
            <input
              className={adminFieldClass}
              value={form.role}
              onChange={(event) =>
                setForm((current) => ({ ...current, role: event.target.value }))
              }
            />
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Department</span>
            <input
              className={adminFieldClass}
              value={form.department}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  department: event.target.value,
                }))
              }
            />
          </label>
        </div>
        <AdminImageField
          label="Image"
          value={form.image}
          onChange={(image) => setForm((current) => ({ ...current, image }))}
        />
        <label className="inline-flex items-center gap-2 text-[0.88rem] font-semibold">
          <input
            type="checkbox"
            checked={form.kind === "sales"}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                kind: event.target.checked ? "sales" : "delivery",
              }))
            }
          />
          Sales
        </label>
        <label className="inline-flex items-center gap-2 text-[0.88rem] font-semibold">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                active: event.target.checked,
              }))
            }
          />
          Active
        </label>
        {formError ? (
          <p className="text-[0.84rem] font-semibold text-[#e8891a]">
            {formError}
          </p>
        ) : null}
      </AdminFormModal>
  );
}
