"use client";

import styles from "@/features/portfolio/styles/portfolioPage.module.css";

type SubfilterOption<T extends string> = {
  id: T;
  label: string;
};

type PortfolioSubfilterCapsuleProps<T extends string> = {
  label: string;
  options: readonly SubfilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function PortfolioSubfilterCapsule<T extends string>({
  label,
  options,
  value,
  onChange,
}: PortfolioSubfilterCapsuleProps<T>) {
  return (
    <div
      className={styles.subfilters}
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const pressed = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            className={`${styles.subfilter} typeButton`}
            aria-pressed={pressed}
            onClick={() => onChange(option.id)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
