"use client";

import { adminFieldClass, adminLabelClass } from "@/components/admin/AdminFormModal";
import { useCarrierSalesSheetFields, type CarrierSalesSheetFieldsProps, setField } from "./CarrierSalesSheetFieldsModel";
import { CarrierSalesSheetFieldsSection1, CarrierSalesSheetFieldsSection2 } from "./CarrierSalesSheetFieldsSections";

export function CarrierSalesSheetFields({
  value,
  onChange,
  salesAgentLocked = false,
  taxIdEditMode = false,
  carrierId,
}: CarrierSalesSheetFieldsProps) {
  const model = useCarrierSalesSheetFields({ value, onChange, salesAgentLocked, taxIdEditMode, carrierId });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-center text-[1.15rem] font-extrabold tracking-[0.12em] text-[#0d120b] uppercase">
          Carrier sales sheet
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block">
            <span className={adminLabelClass}>US DOT *</span>
            <input
            className={adminFieldClass}
            value={value.usDot}
            onChange={(event) =>
              onChange(setField(value, "usDot", event.target.value))
            }
          />
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>MC *</span>
            <input
            className={adminFieldClass}
            value={value.mc}
            onChange={(event) =>
              onChange(setField(value, "mc", event.target.value))
            }
          />
          </label>
        </div>
      </div>

      <div>
        <label className="block">
          <span className={adminLabelClass}>Legal name *</span>
          <input
          className={adminFieldClass}
          value={value.legalName}
          onChange={(event) =>
            onChange(setField(value, "legalName", event.target.value))
          }
        />
        </label>
      </div>

      <CarrierSalesSheetFieldsSection1 model={model} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block">
            <span className={adminLabelClass}>Name</span>
            <input
            className={adminFieldClass}
            value={value.contactName}
            onChange={(event) =>
              onChange(setField(value, "contactName", event.target.value))
            }
          />
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Phone</span>
            <input
            className={adminFieldClass}
            value={value.contactPhone}
            onChange={(event) =>
              onChange(setField(value, "contactPhone", event.target.value))
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
            value={value.contactEmail}
            onChange={(event) =>
              onChange(setField(value, "contactEmail", event.target.value))
            }
          />
          </label>
        </div>
        <div>
          <label className="block">
            <span className={adminLabelClass}>Truck</span>
            <input
            className={adminFieldClass}
            value={value.truck}
            onChange={(event) =>
              onChange(setField(value, "truck", event.target.value))
            }
          />
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="block">
            <span className={adminLabelClass}>Trailer</span>
            <input
            className={adminFieldClass}
            value={value.trailer}
            onChange={(event) =>
              onChange(setField(value, "trailer", event.target.value))
            }
          />
          </label>
        </div>
      </div>

      <CarrierSalesSheetFieldsSection2 model={model} />

      <div className="space-y-4">
        <h3 className="text-[0.84rem] font-extrabold tracking-[0.14em] text-[#0d120b] uppercase">
          Factoring company details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block">
              <span className={adminLabelClass}>Name</span>
              <input
              className={adminFieldClass}
              value={value.factoringName}
              onChange={(event) =>
                onChange(setField(value, "factoringName", event.target.value))
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>Phone</span>
              <input
              className={adminFieldClass}
              value={value.factoringPhone}
              onChange={(event) =>
                onChange(setField(value, "factoringPhone", event.target.value))
              }
            />
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="block">
              <span className={adminLabelClass}>Street address</span>
              <input
              className={adminFieldClass}
              value={value.factoringStreet}
              onChange={(event) =>
                onChange(setField(value, "factoringStreet", event.target.value))
              }
            />
            </label>
          </div>
          <div>
            <label className="block">
              <span className={adminLabelClass}>City, state, zip</span>
              <input
              className={adminFieldClass}
              value={value.factoringCityStateZip}
              onChange={(event) =>
                onChange(
                  setField(value, "factoringCityStateZip", event.target.value),
                )
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
              value={value.factoringEmail}
              onChange={(event) =>
                onChange(setField(value, "factoringEmail", event.target.value))
              }
            />
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="block">
          <span className={adminLabelClass}>Approved by</span>
          <input
          className={adminFieldClass}
          value={value.approvedBy}
          onChange={(event) =>
            onChange(setField(value, "approvedBy", event.target.value))
          }
        />
        </label>
      </div>
    </div>
  );
}
