import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "border border-transparent bg-[var(--accent)] text-[var(--color-accent-on-color)]",
  secondary:
    "border border-[var(--color-secondary-button-border)] bg-[var(--color-secondary-button-bg)] text-[var(--color-secondary-button-text)]",
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`cursor-pointer rounded-[var(--radius-md)] px-[22px] py-[15px] font-[family-name:var(--font-body)] text-[15px] font-semibold ${VARIANT_CLASS[variant]} ${className}`}
      {...props}
    />
  );
}

export default Button;
