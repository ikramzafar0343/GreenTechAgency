"use client";

import { useActionState, useId } from "react";
import { submitEnquiry } from "@/features/contact/actions/submitEnquiry";
import {
  SERVICE_OPTIONS,
  type EnquirySubmitResult,
} from "@/features/contact/model/enquiryFields";
import styles from "@/features/contact/styles/contactForm.module.css";

const initialState: EnquirySubmitResult | null = null;

async function runSubmit(
  _previous: EnquirySubmitResult | null,
  formData: FormData,
): Promise<EnquirySubmitResult> {
  return submitEnquiry(formData);
}

export function ContactEnquiryForm() {
  const formId = useId();
  const [state, formAction, isPending] = useActionState(runSubmit, initialState);

  if (state?.status === "success") {
    return (
      <div className={styles.success} role="status" aria-live="polite">
        <p className={styles.successMark} aria-hidden="true">
          ✓
        </p>
        <p className={`${styles.successTitle} typeHeading`}>
          Thanks — message received.
        </p>
        <p className={`${styles.successCopy} typeBody`}>
          A GreenTech teammate will review your project details and follow up
          shortly.
        </p>
      </div>
    );
  }

  const fieldErrors = state?.status === "error" ? state.fieldErrors : undefined;
  const formMessage =
    state?.status === "error" || state?.status === "unavailable"
      ? state.message
      : undefined;

  return (
    <form className={styles.form} action={formAction} noValidate>
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor={`${formId}-name`} className="typeMeta">
            Name
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
            aria-invalid={fieldErrors?.name ? true : undefined}
            aria-describedby={
              fieldErrors?.name ? `${formId}-name-error` : undefined
            }
          />
          {fieldErrors?.name ? (
            <p id={`${formId}-name-error`} className={styles.fieldError}>
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-email`} className="typeMeta">
            Email
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            aria-invalid={fieldErrors?.email ? true : undefined}
            aria-describedby={
              fieldErrors?.email ? `${formId}-email-error` : undefined
            }
          />
          {fieldErrors?.email ? (
            <p id={`${formId}-email-error`} className={styles.fieldError}>
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-company`} className="typeMeta">
            Company
          </label>
          <input
            id={`${formId}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Company name"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor={`${formId}-phone`} className="typeMeta">
            Phone
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="Optional"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-service`} className="typeMeta">
          Service interest
        </label>
        <select id={`${formId}-service`} name="service" defaultValue="">
          {SERVICE_OPTIONS.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor={`${formId}-message`} className="typeMeta">
          Project details
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          placeholder="Goals, current site or product links, timeline, and anything else we should know…"
          required
          aria-invalid={fieldErrors?.message ? true : undefined}
          aria-describedby={
            fieldErrors?.message ? `${formId}-message-error` : undefined
          }
        />
        {fieldErrors?.message ? (
          <p id={`${formId}-message-error`} className={styles.fieldError}>
            {fieldErrors.message}
          </p>
        ) : null}
      </div>

      {formMessage ? (
        <p className={styles.formError} role="alert">
          {formMessage}
        </p>
      ) : null}

      <div className={styles.submitRow}>
        <button
          type="submit"
          className={`${styles.submit} typeButton`}
          disabled={isPending}
        >
          <span>{isPending ? "Sending…" : "Start Your Project"}</span>
          <span className={styles.submitArrow} aria-hidden="true">
            →
          </span>
        </button>
        <p className={`${styles.submitNote} typeMeta`}>
          No obligation. We reply on business days.
        </p>
      </div>
    </form>
  );
}
