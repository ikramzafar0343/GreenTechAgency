import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "@/shared/ui/creamCtaButton.module.css";

type SharedProps = {
  children: ReactNode;
  className?: string;
};

type CreamCtaLinkProps = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, "className" | "children"> & {
    as?: "link";
  };

type CreamCtaNativeButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    as: "button";
  };

export type CreamCtaButtonProps = CreamCtaLinkProps | CreamCtaNativeButtonProps;

function cx(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function CreamCtaButton(props: CreamCtaButtonProps) {
  if (props.as === "button") {
    const { as, children, className, type = "button", ...rest } = props;
    if (as !== "button") {
      throw new Error("Invalid CreamCtaButton variant.");
    }
    return (
      <button
        type={type}
        className={cx(styles.button, "typeButton", className)}
        {...rest}
      >
        {children}
      </button>
    );
  }

  const { as = "link", children, className, ...rest } = props;
  if (as !== "link" && as !== undefined) {
    throw new Error("Invalid CreamCtaButton variant.");
  }
  return (
    <Link className={cx(styles.button, "typeButton", className)} {...rest}>
      {children}
    </Link>
  );
}
