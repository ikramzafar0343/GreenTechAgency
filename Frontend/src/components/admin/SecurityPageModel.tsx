"use client";

import { useEffect, useState, useTransition } from "react";
import { adminIcons } from "@/components/admin/AdminIcons";
import { useAdmin } from "@/components/admin/AdminProvider";
import { changeAdminPasswordAction, getAdminMeAction, updateAdminAccountAction, updateAdminMeImageAction } from "@/lib/submitAdminSecurity";

export const cardClass =
  "rounded-2xl border border-black/8 bg-white p-5 shadow-[0_8px_24px_rgba(47,58,40,0.04)] md:p-6";

/** All state and handlers of <SecurityPage>; the component and its sections only render. */
export function useSecurityPage() {
  const { setIdentity } = useAdmin();
  const [userId, setUserId] = useState("");
  const [version, setVersion] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("Admin");
  const [imagePath, setImagePath] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved">("idle");
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const EyeIcon = adminIcons.eye;
  const EyeOffIcon = adminIcons.eyeOff;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const result = await getAdminMeAction();
      if (cancelled) {
        return;
      }
      if (!result.ok || !("profile" in result)) {
        setLoadError("Could not load admin account.");
        setLoading(false);
        return;
      }
      setUserId(result.profile.id);
      setVersion(result.profile.version);
      setName(result.profile.name);
      setEmail(result.profile.email);
      setTitle(result.profile.title ?? "");
      setImagePath(result.profile.imagePath);
      setRole(
        result.profile.role.length > 0
          ? `${result.profile.role[0]?.toUpperCase() ?? ""}${result.profile.role.slice(1)}`
          : "Admin",
      );
      setIdentity({
        name: result.profile.name,
        email: result.profile.email,
        image: result.profile.imagePath,
      });
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [setIdentity]);

  const saveAccount = () => {
    if (pending || userId.length === 0) {
      return;
    }
    if (name.trim().length === 0 || email.trim().length === 0) {
      setSaveError("Name and email are required.");
      setSaveStatus("idle");
      return;
    }

    startTransition(async () => {
      setSaveError(null);
      setSaveStatus("idle");
      const result = await updateAdminAccountAction({
        userId,
        version,
        name,
        email,
        title,
      });
      if (!result.ok || !("account" in result)) {
        setSaveError(
          result.ok
            ? "Could not save account. Try again."
            : result.reason === "conflict"
              ? "Account was updated elsewhere. Refresh and try again."
              : result.reason === "validation"
                ? "Check the fields and try again."
                : "Could not save account. Try again.",
        );
        return;
      }
      setVersion(result.account.version);
      setName(result.account.name);
      setEmail(result.account.email);
      setTitle(result.account.title ?? "");
      setImagePath(result.account.imagePath);
      setIdentity({
        name: result.account.name,
        email: result.account.email,
        image: result.account.imagePath,
      });
      setSaveStatus("saved");
    });
  };

  const onImageChange = (nextImagePath: string) => {
    if (pending || name.trim().length === 0) {
      return;
    }
    startTransition(async () => {
      setImageError(null);
      const result = await updateAdminMeImageAction({
        version,
        name,
        title,
        imagePath: nextImagePath,
      });
      if (!result.ok || !("account" in result)) {
        setImageError(
          result.ok
            ? "Could not save profile picture."
            : result.reason === "conflict"
              ? "Account was updated elsewhere. Refresh and try again."
              : "Could not save profile picture.",
        );
        return;
      }
      setVersion(result.account.version);
      setImagePath(result.account.imagePath);
      setIdentity({
        name: result.account.name,
        email: result.account.email,
        image: result.account.imagePath,
      });
    });
  };

  const savePassword = async () => {
    if (
      passwordStatus === "loading" ||
      !currentPassword ||
      !password ||
      password !== confirm ||
      password.length < 8
    ) {
      setPasswordStatus("error");
      return;
    }

    setPasswordStatus("loading");
    const result = await changeAdminPasswordAction({
      currentPassword,
      newPassword: password,
    });

    if (!result.ok) {
      setPasswordStatus("error");
      return;
    }

    setModalOpen(false);
    setCurrentPassword("");
    setPassword("");
    setConfirm("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setPasswordStatus("idle");
  };
  return { name, setName, email, setEmail, title, setTitle, role, imagePath, loadError, saveError, imageError, saveStatus, pending, loading, modalOpen, setModalOpen, currentPassword, setCurrentPassword, password, setPassword, confirm, setConfirm, passwordStatus, setPasswordStatus, showCurrentPassword, setShowCurrentPassword, showNewPassword, setShowNewPassword, EyeIcon, EyeOffIcon, saveAccount, onImageChange, savePassword };
}

export type SecurityPageModel = ReturnType<typeof useSecurityPage>;
