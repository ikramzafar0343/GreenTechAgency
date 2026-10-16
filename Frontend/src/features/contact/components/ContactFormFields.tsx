"use client";

import styles from "@/features/contact/styles/contactPage.module.css";

type FieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  type?: string;
  autoComplete?: string;
  required?: boolean;
};

export function ContactTextField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  required,
}: FieldProps) {
  const filled = value.trim().length > 0;
  return (
    <div className={`${styles.field} ${filled ? styles.fieldFilled : ""}`}>
      <input
        id={id}
        name={name}
        type={type}
        className={styles.input}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
      />
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {error ? (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type AreaProps = Omit<FieldProps, "type" | "autoComplete">;

export function ContactTextArea({
  id,
  name,
  label,
  value,
  onChange,
  error,
  required,
}: AreaProps) {
  const filled = value.trim().length > 0;
  return (
    <div className={`${styles.field} ${filled ? styles.fieldFilled : ""}`}>
      <textarea
        id={id}
        name={name}
        className={styles.textarea}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
      />
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {error ? (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactHoneypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={styles.honeypot} aria-hidden="true" hidden>
      <label htmlFor="contact-website">Website</label>
      <input
        id="contact-website"
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
