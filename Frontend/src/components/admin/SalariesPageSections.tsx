"use client";

import { AdminFormModal, adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { type SalariesPageModel } from "./SalariesPageModel";

export function SalariesPageSection1({ model }: { model: SalariesPageModel }) {
  const { formOpen, editingId, closeForm, saveForm, error, form, activeEmployees, setForm, totalEarnings, totalDeduction, netSalary } = model;
  return (
    <AdminFormModal
        open={formOpen}
        title={editingId ? "Edit salary slip" : "Create salary slip"}
        onClose={closeForm}
        onSubmit={saveForm}
        submitLabel={editingId ? "Save changes" : "Create slip"}
        error={error}
      >
        <div className="space-y-4">
          <label className="block">
            <span className={adminLabelClass}>Employee</span>
            <input
              className={adminFieldClass}
              list="salary-slip-employees"
              value={form.employeeName}
              placeholder="Type any name"
              autoComplete="off"
              onChange={(event) => {
                const name = event.target.value;
                const matched = activeEmployees.find(
                  (item) =>
                    item.name.toLowerCase() === name.trim().toLowerCase(),
                );
                setForm((current) => ({
                  ...current,
                  employeeName: name,
                  employeeId: matched?.id ?? "",
                  designation: matched?.role ?? current.designation,
                }));
              }}
            />
            <datalist id="salary-slip-employees">
              {activeEmployees.map((employee) => (
                <option key={employee.id} value={employee.name} />
              ))}
            </datalist>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={adminLabelClass}>Designation</span>
              <input
                className={adminFieldClass}
                value={form.designation}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    designation: event.target.value,
                  }))
                }
              />
            </label>
            <label className="block">
              <span className={adminLabelClass}>Salary month</span>
              <input
                className={adminFieldClass}
                value={form.salaryMonth}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    salaryMonth: event.target.value,
                  }))
                }
              />
            </label>
            <label className="block">
              <span className={adminLabelClass}>Date</span>
              <input
                type="date"
                className={adminFieldClass}
                value={form.slipDate}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slipDate: event.target.value,
                  }))
                }
              />
            </label>
            <label className="block">
              <span className={adminLabelClass}>Currency</span>
              <input
                className={adminFieldClass}
                value={form.currency}
                maxLength={3}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    currency: event.target.value.toUpperCase(),
                  }))
                }
              />
            </label>
            <label className="block">
              <span className={adminLabelClass}>Status</span>
              <select
                className={adminFieldClass}
                value={form.status}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    status: event.target.value as "draft" | "issued",
                  }))
                }
              >
                <option value="draft">Draft</option>
                <option value="issued">Issued</option>
              </select>
            </label>
          </div>

          <p className="text-[0.84rem] font-bold text-[#0d120b]">Earnings</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["basicSalary", "Basic salary"],
                ["punctuality", "Punctuality"],
                ["medicalAllowance", "Medical allowance"],
                ["incentives", "Incentives"],
                ["bonus", "Bonus"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className={adminLabelClass}>{label}</span>
                <input
                  className={adminFieldClass}
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <p className="text-[0.84rem] font-bold text-[#0d120b]">Deductions</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {(
              [
                ["advance", "Advance"],
                ["incomeTax", "Income tax"],
                ["whTax", "W.H. tax"],
                ["fuelAdvances", "Fuel advances"],
                ["unpaidDays", "UnPaid Days"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className={adminLabelClass}>{label}</span>
                <input
                  className={adminFieldClass}
                  value={form[key]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                />
              </label>
            ))}
          </div>

          <div className="rounded-xl border border-black/8 bg-brand/8 px-4 py-3 text-[0.88rem] font-semibold">
            <p>Total earnings: {totalEarnings.toFixed(2)}</p>
            <p>Total deduction: {totalDeduction.toFixed(2)}</p>
            <p className="mt-1 text-[1rem] font-extrabold">
              Net salary: {netSalary.toFixed(2)}
            </p>
          </div>
        </div>
      </AdminFormModal>
  );
}
