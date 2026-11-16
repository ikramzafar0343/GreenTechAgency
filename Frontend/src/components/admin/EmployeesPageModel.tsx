"use client";

import { useState, useTransition } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { adminIcons } from "@/components/admin/AdminIcons";
import type { AdminEmployee, EmployeeKind } from "@/lib/data/admin";
import { archiveAdminEmployeeAction, createAdminEmployeeAction, setAdminEmployeePasswordAction, updateAdminEmployeeAction } from "@/lib/submitAdminEmployees";

export const cardClass =
  "overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_24px_rgba(47,58,40,0.04)]";

export type EmployeeForm = {
  name: string;
  email: string;
  role: string;
  department: string;
  kind: EmployeeKind;
  image: string;
  active: boolean;
  password: string;
  confirmPassword: string;
};

export const emptyForm: EmployeeForm = {
  name: "",
  email: "",
  role: "",
  department: "",
  kind: "delivery",
  image: "",
  active: true,
  password: "",
  confirmPassword: "",
};

/** All state and handlers of <EmployeesPage>; the component and its sections only render. */
export function useEmployeesPage() {
  const { state, setEmployees } = useAdmin();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [passwordEmployeeId, setPasswordEmployeeId] = useState<string | null>(
    null,
  );
  const [form, setForm] = useState<EmployeeForm>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [pending, startTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  const EditIcon = adminIcons.edit;
  const TrashIcon = adminIcons.trash;
  const KeyIcon = adminIcons.key;
  const EyeIcon = adminIcons.eye;
  const EyeOffIcon = adminIcons.eyeOff;

  const passwordTarget = state.employees.find(
    (item) => item.id === passwordEmployeeId,
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setShowCreatePassword(false);
    setModalOpen(true);
  };

  const openEdit = (item: AdminEmployee) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      email: item.email,
      role: item.role,
      department: item.department,
      kind: item.kind,
      image: item.image,
      active: item.active,
      password: "",
      confirmPassword: "",
    });
    setFormError(null);
    setModalOpen(true);
  };

  const openPassword = (item: AdminEmployee) => {
    setPasswordEmployeeId(item.id);
    setPassword("");
    setConfirmPassword("");
    setPasswordError(null);
    setShowSetPassword(false);
    setPasswordOpen(true);
  };

  const save = () => {
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email) {
      setFormError("Name and email are required.");
      return;
    }

    if (!editingId) {
      if (form.password.length < 8 || form.password.length > 200) {
        setFormError("Password must be 8–200 characters.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setFormError("Passwords do not match.");
        return;
      }

      startTransition(async () => {
        setFormError(null);
        const result = await createAdminEmployeeAction({
          name,
          email,
          password: form.password,
          role: form.role.trim(),
          department: form.department.trim(),
          kind: form.kind,
          image: form.image,
          active: form.active,
        });
        if (!result.ok) {
          setFormError(
            result.reason === "conflict"
              ? "That email is already in use."
              : result.reason === "validation"
                ? "Check the fields and try again."
                : result.reason === "unauthorized"
                  ? "You are not allowed to add employees."
                  : "Could not create employee. Try again.",
          );
          return;
        }
        if (!("employee" in result)) {
          setFormError("Could not create employee. Try again.");
          return;
        }
        setEmployees([...state.employees, result.employee]);
        setModalOpen(false);
      });
      return;
    }

    startTransition(async () => {
      setFormError(null);
      const result = await updateAdminEmployeeAction({
        employeeId: editingId,
        name,
        email,
        role: form.role.trim(),
        department: form.department.trim(),
        kind: form.kind,
        image: form.image,
        active: form.active,
      });
      if (!result.ok) {
        setFormError(
          result.reason === "conflict"
            ? "This employee was updated elsewhere. Refresh and try again."
            : result.reason === "validation"
              ? "Check the fields and try again."
              : result.reason === "unauthorized"
                ? "You are not allowed to edit employees."
                : "Could not update employee. Try again.",
        );
        return;
      }
      if (!("employee" in result)) {
        setFormError("Could not update employee. Try again.");
        return;
      }
      setEmployees(
        state.employees.map((item) =>
          item.id === editingId ? result.employee : item,
        ),
      );
      setModalOpen(false);
    });
  };

  const savePassword = () => {
    if (!passwordEmployeeId) {
      return;
    }
    if (password.length < 8 || password.length > 200) {
      setPasswordError("Password must be 8–200 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    startPasswordTransition(async () => {
      setPasswordError(null);
      const result = await setAdminEmployeePasswordAction({
        employeeId: passwordEmployeeId,
        password,
      });
      if (!result.ok) {
        setPasswordError(
          result.reason === "validation"
            ? "Password must be 8–200 characters."
            : result.reason === "conflict"
              ? "Could not update password. Try again."
              : result.reason === "unauthorized"
                ? "You are not allowed to set this password."
                : "Could not update password. Try again.",
        );
        return;
      }
      setPasswordOpen(false);
      setPasswordEmployeeId(null);
      setPassword("");
      setConfirmPassword("");
    });
  };

  const confirmDelete = () => {
    if (!deleteId || deletePending) {
      return;
    }

    startDeleteTransition(async () => {
      setDeleteError(null);
      const result = await archiveAdminEmployeeAction({
        employeeId: deleteId,
      });
      if (!result.ok) {
        setDeleteError(
          result.reason === "conflict"
            ? "This employee was updated elsewhere. Refresh and try again."
            : result.reason === "unauthorized"
              ? "You are not allowed to delete employees."
              : "Could not delete employee. Try again.",
        );
        return;
      }
      setEmployees(state.employees.filter((item) => item.id !== deleteId));
      setDeleteOpen(false);
      setDeleteId(null);
    });
  };

  const deleteTarget = state.employees.find((item) => item.id === deleteId);
  return { state, modalOpen, setModalOpen, deleteOpen, setDeleteOpen, passwordOpen, setPasswordOpen, editingId, setDeleteId, setPasswordEmployeeId, form, setForm, formError, password, setPassword, confirmPassword, setConfirmPassword, passwordError, setPasswordError, deleteError, setDeleteError, showCreatePassword, setShowCreatePassword, showSetPassword, setShowSetPassword, pending, passwordPending, deletePending, EditIcon, TrashIcon, KeyIcon, EyeIcon, EyeOffIcon, passwordTarget, openAdd, openEdit, openPassword, save, savePassword, confirmDelete, deleteTarget };
}

export type EmployeesPageModel = ReturnType<typeof useEmployeesPage>;
