import type { InputHTMLAttributes } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      className={`w-full rounded-[8px] border border-[var(--color-border-input)] bg-[var(--color-bg-page)] px-[12px] py-[10px] text-[13.5px] outline-none ${className}`}
      {...props}
    />
  );
}

export default Input;
