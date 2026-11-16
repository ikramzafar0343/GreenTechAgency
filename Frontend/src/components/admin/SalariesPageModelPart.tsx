"use client";

import { site } from "@/constants/site";

export const cardClass =
  "overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_24px_rgba(47,58,40,0.04)]";

export type SalaryForm = {
  employeeId: string;
  employeeName: string;
  designation: string;
  slipDate: string;
  salaryMonth: string;
  basicSalary: string;
  punctuality: string;
  medicalAllowance: string;
  incentives: string;
  bonus: string;
  advance: string;
  incomeTax: string;
  whTax: string;
  fuelAdvances: string;
  unpaidDays: string;
  currency: string;
  status: "draft" | "issued";
  fromCompany: string;
  fromEmail: string;
  fromPhone: string;
};

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function currentSalaryMonth(): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date());
}

export const emptyForm: SalaryForm = {
  employeeId: "",
  employeeName: "",
  designation: "",
  slipDate: todayIso(),
  salaryMonth: currentSalaryMonth(),
  basicSalary: "0",
  punctuality: "0",
  medicalAllowance: "0",
  incentives: "0",
  bonus: "0",
  advance: "0",
  incomeTax: "0",
  whTax: "0",
  fuelAdvances: "0",
  unpaidDays: "0",
  currency: "PKR",
  status: "draft",
  fromCompany: site.legalName,
  fromEmail: "",
  fromPhone: "",
};
