import type { ReactNode } from "react";

export interface MessageBubbleProps {
  role: "user" | "bot";
  children: ReactNode;
}

export function MessageBubble({ role, children }: MessageBubbleProps) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] whitespace-pre-line rounded-[15px] px-[15px] py-[12px] text-[14px] leading-[1.55] ${
          role === "user"
            ? "bg-[var(--accent)] text-[var(--color-accent-on-color)]"
            : "border border-[var(--color-border-input-focus-ring)] bg-[var(--color-bg-surface)]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default MessageBubble;
