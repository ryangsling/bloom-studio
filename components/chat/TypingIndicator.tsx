export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex gap-[4px] rounded-[15px] border border-[var(--color-border-input-focus-ring)] bg-[var(--color-bg-surface)] px-[15px] py-[12px]">
        <span
          className="block h-[6px] w-[6px] rounded-full bg-[var(--color-text-placeholder)]"
          style={{ animation: "typing-dot 1.2s infinite" }}
        />
        <span
          className="block h-[6px] w-[6px] rounded-full bg-[var(--color-text-placeholder)]"
          style={{ animation: "typing-dot 1.2s infinite 0.15s" }}
        />
        <span
          className="block h-[6px] w-[6px] rounded-full bg-[var(--color-text-placeholder)]"
          style={{ animation: "typing-dot 1.2s infinite 0.3s" }}
        />
      </div>
    </div>
  );
}

export default TypingIndicator;
