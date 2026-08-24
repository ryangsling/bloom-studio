"use client";

import { useState, type FormEvent } from "react";

export interface MessageInputBarProps {
  placeholder: string;
  disabled: boolean;
  onSend: (text: string) => void;
}

export function MessageInputBar({ placeholder, disabled, onSend }: MessageInputBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-shrink-0 items-center gap-[10px] border-t border-[var(--color-border-hairline)] px-[16px] py-[14px]"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 rounded-[var(--radius-pill)] bg-[var(--color-bg-surface-alt)] px-[16px] py-[12px] text-[13.5px] outline-none"
      />
      <button
        type="submit"
        disabled={disabled}
        aria-label="Send message"
        className="flex h-[38px] w-[38px] flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-[var(--accent)] text-[15px] text-[var(--color-accent-on-color)] disabled:opacity-50"
      >
        ↑
      </button>
    </form>
  );
}

export default MessageInputBar;
