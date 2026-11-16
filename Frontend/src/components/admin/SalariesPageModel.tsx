"use client";

import { useEffect, useState, useTransition } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import type { AdminSalarySlip } from "@/lib/data/admin";
import { getAdminSiteContactAction } from "@/lib/submitAdminSiteContact";
import { archiveSalarySlipAction, createSalarySlipAction, getSalarySlipAction, updateSalarySlipAction } from "@/lib/submitOps";
import { type SalaryForm, todayIso, currentSalaryMonth, emptyForm } from "./SalariesPageModelPart";
export { cardClass, todayIso, currentSalaryMonth, emptyForm } from "./SalariesPageModelPart";
export type { SalaryForm } from "./SalariesPageModelPart";

export const statusClass: Record<AdminSalarySlip["status"], string> = {
  draft: "bg-black/8 text-black/50",
  issued: "bg-brand/16 text-brand",
};

export const statusLabel: Record<AdminSalarySlip["status"], string> = {
  draft: "Draft",
  issued: "Issued",
};

export function moneySum(values: readonly string[]): number {
  return values.reduce((sum, value) => {
    const n = Number(value.replace(/[^\d.]/g, ""));
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
}

/** All state and handlers of <SalariesPage>; the component and its sections only render. */
export function useSalariesPage() {
  const { state, ensureDomain, setSalarySlips } = useAdmin();
  const [pending, startTransition] = useTransition();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editVersion, setEditVersion] = useState<number | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<SalaryForm>(emptyForm);

  useEffect(() => {
    void ensureDomain("ops");
  }, [ensureDomain]);

  useEffect(() => {
    if (!formOpen || editingId !== null) {
      return;
    }
    void getAdminSiteContactAction().then((result) => {
      if (!result.ok) {
        return;
      }
      setForm((current) => ({
        ...current,
        fromEmail:
          current.fromEmail.length > 0 ? current.fromEmail : result.data.email,
        fromPhone:
          current.fromPhone.length > 0 ? current.fromPhone : result.data.phone,
      }));
    });
  }, [formOpen, editingId]);

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setEditVersion(null);
  };

  const openCreate = () => {
    setError(null);
    setEditingId(null);
    setEditVersion(null);
    setForm({
      ...emptyForm,
      slipDate: todayIso(),
      salaryMonth: currentSalaryMonth(),
    });
    setFormOpen(true);
  };

  const openEdit = (slip: AdminSalarySlip) => {
    if (pending) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await getSalarySlipAction(slip.id);
      if (!result.ok || !("data" in result)) {
        setError("Could not load salary slip for editing.");
        return;
      }
      const detail = result.data;
      setEditingId(detail.id);
      setEditVersion(detail.version);
      setForm({
        employeeId: detail.employeeId ?? "",
        employeeName: detail.employeeName,
        designation: detail.designation,
        slipDate: detail.slipDate,
        salaryMonth: detail.salaryMonth,
        basicSalary: detail.basicSalary,
        punctuality: detail.punctuality,
        medicalAllowance: detail.medicalAllowance,
        incentives: detail.incentives,
        bonus: detail.bonus,
        advance: detail.advance,
        incomeTax: detail.incomeTax,
        whTax: detail.whTax,
        fuelAdvances: detail.fuelAdvances,
        unpaidDays: detail.unpaidDays,
        currency: detail.currency,
        status: detail.statusCode,
        fromCompany: detail.fromCompany,
        fromEmail: detail.fromEmail,
        fromPhone: detail.fromPhone,
      });
      setFormOpen(true);
    });
  };

  const totalEarnings = moneySum([
    form.basicSalary,
    form.punctuality,
    form.medicalAllowance,
    form.incentives,
    form.bonus,
  ]);
  const totalDeduction = moneySum([
    form.advance,
    form.incomeTax,
    form.whTax,
    form.fuelAdvances,
    form.unpaidDays,
  ]);
  const netSalary = totalEarnings - totalDeduction;

  const saveForm = () => {
    if (pending) {
      return;
    }
    if (
      form.employeeName.trim().length === 0 ||
      form.salaryMonth.trim().length === 0
    ) {
      setError("Enter an employee name and salary month.");
      return;
    }
    if (netSalary < 0) {
      setError("Net salary cannot be negative.");
      return;
    }

    startTransition(async () => {
      setError(null);

      if (editingId !== null) {
        if (editVersion === null) {
          setError("Could not save salary slip.");
          return;
        }
        const existing = state.salarySlips.find((item) => item.id === editingId);
        const result = await updateSalarySlipAction({
          id: editingId,
          version: editVersion,
          employeeName: form.employeeName.trim(),
          designation: form.designation,
          slipDate: form.slipDate,
          salaryMonth: form.salaryMonth.trim(),
          basicSalary: form.basicSalary,
          punctuality: form.punctuality,
          medicalAllowance: form.medicalAllowance,
          incentives: form.incentives,
          bonus: form.bonus,
          advance: form.advance,
          incomeTax: form.incomeTax,
          whTax: form.whTax,
          fuelAdvances: form.fuelAdvances,
          unpaidDays: form.unpaidDays,
          currency: form.currency.trim().toUpperCase() || "PKR",
          statusCode: form.status,
          fromCompany: form.fromCompany,
          fromEmail: form.fromEmail,
          fromPhone: form.fromPhone,
        });
        if (!result.ok || !("data" in result)) {
          setError(
            result.ok
              ? "Could not save salary slip."
              : result.reason === "conflict"
                ? "This slip was updated elsewhere. Close, reopen Edit, and try again."
                : result.reason === "validation"
                  ? "Check the name and amounts, then try again."
                  : "Could not save salary slip.",
          );
          return;
        }
        setSalarySlips(
          existing === undefined
            ? [result.data, ...state.salarySlips]
            : state.salarySlips.map((item) =>
                item.id === editingId ? result.data : item,
              ),
        );
        closeForm();
        return;
      }

      const result = await createSalarySlipAction({
        employeeId: form.employeeId.length > 0 ? form.employeeId : null,
        employeeName: form.employeeName.trim(),
        designation: form.designation,
        slipDate: form.slipDate,
        salaryMonth: form.salaryMonth.trim(),
        basicSalary: form.basicSalary,
        punctuality: form.punctuality,
        medicalAllowance: form.medicalAllowance,
        incentives: form.incentives,
        bonus: form.bonus,
        advance: form.advance,
        incomeTax: form.incomeTax,
        whTax: form.whTax,
        fuelAdvances: form.fuelAdvances,
        unpaidDays: form.unpaidDays,
        currency: form.currency.trim().toUpperCase() || "PKR",
        statusCode: form.status,
        fromCompany: form.fromCompany,
        fromEmail: form.fromEmail,
        fromPhone: form.fromPhone,
      });
      if (!result.ok || !("data" in result)) {
        setError(
          result.ok
            ? "Could not create salary slip."
            : result.reason === "conflict"
              ? "A slip already exists for this employee and month."
              : result.reason === "validation"
                ? "Check the name and amounts, then try again."
                : "Could not create salary slip.",
        );
        return;
      }
      setSalarySlips([result.data, ...state.salarySlips]);
      closeForm();
    });
  };

  const confirmDelete = () => {
    if (!deleteId || pending) {
      return;
    }
    const existing = state.salarySlips.find((item) => item.id === deleteId);
    if (!existing) {
      return;
    }
    startTransition(async () => {
      setError(null);
      const result = await archiveSalarySlipAction({
        id: existing.id,
        version: existing.version,
      });
      if (!result.ok) {
        setError(
          result.reason === "conflict"
            ? "This slip was updated elsewhere. Refresh and try again."
            : "Could not delete salary slip.",
        );
        return;
      }
      setSalarySlips(state.salarySlips.filter((item) => item.id !== deleteId));
      setDeleteOpen(false);
      setDeleteId(null);
    });
  };

  const deleteTarget = state.salarySlips.find((item) => item.id === deleteId);
  const activeEmployees = state.employees.filter((item) => item.active);
  return { state, pending, formOpen, editingId, deleteOpen, setDeleteOpen, setDeleteId, error, form, setForm, closeForm, openCreate, openEdit, totalEarnings, totalDeduction, netSalary, saveForm, confirmDelete, deleteTarget, activeEmployees };
}

export type SalariesPageModel = ReturnType<typeof useSalariesPage>;
