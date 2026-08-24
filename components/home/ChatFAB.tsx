export interface ChatFABProps {
  onClick: () => void;
}

export function ChatFAB({ onClick }: ChatFABProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Open chat with our salon assistant"
      className="fixed right-[20px] bottom-[22px] z-30 flex h-[58px] w-[58px] cursor-pointer items-center justify-center rounded-full border-none bg-[var(--accent)] shadow-[var(--shadow-chat-fab)]"
    >
      <span
        className="absolute inset-0 rounded-full border-2 border-[var(--accent)]"
        style={{ animation: "pulse-ring 2.4s ease-out infinite" }}
      />
      <span className="relative flex gap-[4px]">
        <span className="block h-[6px] w-[6px] rounded-full bg-[var(--color-accent-on-color)]" />
        <span className="block h-[6px] w-[6px] rounded-full bg-[var(--color-accent-on-color)]" />
        <span className="block h-[6px] w-[6px] rounded-full bg-[var(--color-accent-on-color)]" />
      </span>
    </button>
  );
}

export default ChatFAB;
