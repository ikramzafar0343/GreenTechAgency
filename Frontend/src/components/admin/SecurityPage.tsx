"use client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminFormModal, adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { AdminImageField } from "@/components/admin/AdminImageField";
import { useSecurityPage, cardClass } from "./SecurityPageModel";

export function SecurityPage() {

  const { name, setName, email, setEmail, title, setTitle, role, imagePath, loadError, saveError, imageError, saveStatus, pending, loading, modalOpen, setModalOpen, currentPassword, setCurrentPassword, password, setPassword, confirm, setConfirm, passwordStatus, setPasswordStatus, showCurrentPassword, setShowCurrentPassword, showNewPassword, setShowNewPassword, EyeIcon, EyeOffIcon, saveAccount, onImageChange, savePassword } = useSecurityPage();
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Security"
        lede="Admin account credentials and access."
      />

      <section className={cardClass}>
        <h2 className="text-[1.05rem] font-extrabold tracking-[-0.02em] text-[#0d120b]">
          Admin account
        </h2>
        {loading ? (
          <p className="mt-4 text-[0.88rem] font-medium text-black/45">
            Loading…
          </p>
        ) : loadError ? (
          <p className="mt-4 text-[0.88rem] font-semibold text-[#e8891a]">
            {loadError}
          </p>
        ) : (
          <form
            className="mt-4 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              saveAccount();
            }}
          >
            <div>
              {imageError ? (
                <p className="mb-3 text-[0.84rem] font-semibold text-red-700">
                  {imageError}
                </p>
              ) : null}
              <AdminImageField
                label="Profile picture"
                value={imagePath}
                onChange={onImageChange}
              />
            </div>
            <div>
              <label className="block">
                <span className={adminLabelClass}>Name</span>
                <input
                  className={adminFieldClass}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            </div>
            <div>
              <label className="block">
                <span className={adminLabelClass}>Email</span>
                <input
                  type="email"
                  className={adminFieldClass}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
            </div>
            <div>
              <label className="block">
                <span className={adminLabelClass}>Role name</span>
                <input
                  className={adminFieldClass}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
            </div>
            <div className="flex justify-between gap-4 rounded-xl border border-black/8 bg-cream/60 px-4 py-3">
              <span className="text-[0.84rem] font-medium text-black/45">
                Access role
              </span>
              <span className="text-[0.88rem] font-semibold text-[#0d120b]">
                {role}
              </span>
            </div>
            {saveError ? (
              <p className="text-[0.84rem] font-semibold text-[#e8891a]">
                {saveError}
              </p>
            ) : null}
            {saveStatus === "saved" ? (
              <p className="text-[0.84rem] font-semibold text-brand">
                Account updated.
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="submit"
                disabled={pending}
                className="rounded-xl bg-brand px-4 py-2.5 text-[0.88rem] font-bold text-cream disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasswordStatus("idle");
                  setShowCurrentPassword(false);
                  setShowNewPassword(false);
                  setModalOpen(true);
                }}
                className="rounded-xl border border-black/12 bg-white px-4 py-2.5 text-[0.88rem] font-semibold text-[#0d120b]"
              >
                Change password
              </button>
            </div>
          </form>
        )}
      </section>

      <AdminFormModal
        open={modalOpen}
        title="Change password"
        onClose={() => {
          if (passwordStatus === "loading") {
            return;
          }
          setModalOpen(false);
          setPasswordStatus("idle");
        }}
        onSubmit={() => {
          void savePassword();
        }}
        submitLabel={
          passwordStatus === "loading" ? "Updating…" : "Update password"
        }
      >
        {passwordStatus === "error" ? (
          <p
            role="status"
            className="rounded-xl border border-[#e8891a]/30 bg-[rgba(249,161,55,0.12)] px-4 py-3 text-[0.88rem] font-semibold text-brand-deep"
          >
            Could not update password. Check your current password and try
            again.
          </p>
        ) : null}
        <div>
          <label className="block">
            <span className={adminLabelClass}>Current password</span>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`${adminFieldClass} pr-12`}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
              />
              <button
                type="button"
                aria-label={
                  showCurrentPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowCurrentPassword((value) => !value)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/45"
              >
                {showCurrentPassword ? (
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
            <span className={adminLabelClass}>New password</span>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                className={`${adminFieldClass} pr-12`}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                onClick={() => setShowNewPassword((value) => !value)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/45"
              >
                {showNewPassword ? (
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
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                className={`${adminFieldClass} pr-12`}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
              />
              <button
                type="button"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                onClick={() => setShowNewPassword((value) => !value)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/45"
              >
                {showNewPassword ? (
                  <EyeOffIcon className="size-5" />
                ) : (
                  <EyeIcon className="size-5" />
                )}
              </button>
            </div>
          </label>
        </div>
      </AdminFormModal>
    </div>
  );
}
