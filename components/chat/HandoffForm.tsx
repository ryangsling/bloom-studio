"use client";

import { useState } from "react";
import Button from "@/components/Button";
import Input from "@/components/Input";

export interface HandoffFormProps {
  submitted: boolean;
  submitting: boolean;
  error: string | null;
  onSubmit: (name: string, phone: string) => void;
}

export function HandoffForm({ submitted, submitting, error, onSubmit }: HandoffFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-border-input)] bg-[var(--color-bg-surface)] p-[16px]">
        <p className="m-0 text-[13px] leading-[1.5] text-[var(--color-text-secondary)]">
          Thanks — a stylist will text you back shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-[var(--color-border-input)] bg-[var(--color-bg-surface)] p-[16px]">
      <div className="mb-[4px] text-[14px] font-semibold">We&rsquo;ll get a stylist to reply</div>
      <p className="m-0 mb-[12px] text-[12.5px] leading-[1.5] text-[var(--color-text-secondary)]">
        Leave your details and we&rsquo;ll text you back, usually within the hour during opening
        times.
      </p>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        disabled={submitting}
        className="mb-[8px]"
      />
      <Input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Phone number"
        disabled={submitting}
        className="mb-[10px]"
      />
      {error ? (
        <p className="m-0 mb-[8px] text-[12px] text-[var(--color-accent-default)]">{error}</p>
      ) : null}
      <Button
        variant="primary"
        className="w-full py-[11px] text-[13.5px]"
        onClick={() => onSubmit(name, phone)}
        disabled={!name.trim() || !phone.trim() || submitting}
      >
        {submitting ? "Sending…" : "Request a callback"}
      </Button>
    </div>
  );
}

export default HandoffForm;
