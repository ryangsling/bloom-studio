"use client";

import { useState } from "react";
import Button from "@/components/Button";

export interface HandoffSectionProps {
  open: boolean;
  onOpen: () => void;
  submitted: boolean;
  onSubmit: (name: string, phone: string) => void;
}

export function HandoffSection({ open, onOpen, submitted, onSubmit }: HandoffSectionProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <>
      <div className="flex justify-center pt-[4px]">
        <button
          onClick={onOpen}
          className="cursor-pointer border-none bg-transparent p-[4px] text-[12.5px] font-medium text-[var(--color-text-secondary)] underline"
        >
          Connect me to a real person
        </button>
      </div>

      {open ? (
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border-input)] bg-[var(--color-bg-surface)] p-[16px]">
          {submitted ? (
            <p className="m-0 text-[13px] leading-[1.5] text-[var(--color-text-secondary)]">
              Thanks — a stylist will text you back shortly.
            </p>
          ) : (
            <>
              <div className="mb-[4px] text-[14px] font-semibold">
                We&rsquo;ll get a stylist to reply
              </div>
              <p className="m-0 mb-[12px] text-[12.5px] leading-[1.5] text-[var(--color-text-secondary)]">
                Leave your details and we&rsquo;ll text you back, usually within the hour during
                opening times.
              </p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mb-[8px] w-full rounded-[8px] border border-[var(--color-border-input)] bg-[var(--color-bg-page)] px-[12px] py-[10px] text-[13.5px]"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone number"
                className="mb-[10px] w-full rounded-[8px] border border-[var(--color-border-input)] bg-[var(--color-bg-page)] px-[12px] py-[10px] text-[13.5px]"
              />
              <Button
                variant="primary"
                className="w-full py-[11px] text-[13.5px]"
                onClick={() => onSubmit(name, phone)}
                disabled={!name.trim() || !phone.trim()}
              >
                Request a callback
              </Button>
            </>
          )}
        </div>
      ) : null}
    </>
  );
}

export default HandoffSection;
