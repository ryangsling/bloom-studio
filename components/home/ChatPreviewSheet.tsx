import { getScriptedMessages } from "@/lib/scriptedConversation";
import { initialsOf } from "@/lib/initials";
import type { Salon } from "@/types/salon";

export interface ChatPreviewSheetProps {
  salon: Salon;
  open: boolean;
  onClose: () => void;
}

export function ChatPreviewSheet({ salon, open, onClose }: ChatPreviewSheetProps) {
  if (!open) return null;

  const messages = getScriptedMessages(salon.services[0]);

  return (
    <>
      <div
        className="fixed inset-0 z-[45] bg-[var(--color-overlay-scrim)] lg:hidden"
        onClick={onClose}
      />
      <div
        className="fixed inset-x-0 bottom-0 z-[46] flex h-[78vh] flex-col lg:hidden rounded-t-[var(--radius-panel)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-chat-panel)]"
        style={{ animation: "slide-up 0.25s ease-out" }}
      >
        <div className="flex items-center gap-[10px] border-b border-[var(--color-border-hairline)] px-[20px] py-[16px]">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[var(--accent)] text-[13px] font-semibold text-[var(--color-accent-on-color)]">
            {initialsOf(salon.salonName)}
          </div>
          <div className="flex-1">
            <div className="text-[14px] leading-[1.2] font-semibold">
              {salon.salonName} Assistant
            </div>
            <div className="text-[11.5px] leading-[1.2] text-[var(--color-status-online)]">
              ● Online now
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close chat preview"
            className="-m-[8px] cursor-pointer border-none bg-transparent p-[8px] text-[20px] text-[var(--color-text-secondary)]"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-[10px] overflow-y-auto px-[18px] pt-[18px] pb-[10px]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-[14px] px-[14px] py-[11px] text-[13.5px] leading-[1.5] ${
                  msg.role === "user"
                    ? "bg-[var(--accent)] text-[var(--color-accent-on-color)]"
                    : "border border-[var(--color-border-input-focus-ring)] bg-[var(--color-bg-surface)]"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--color-border-hairline)] p-[14px]">
          <a
            href="/chat"
            className="block rounded-[var(--radius-md)] bg-[var(--accent)] py-[13px] text-center text-[14px] font-semibold text-[var(--color-accent-on-color)] no-underline"
          >
            Continue in full chat →
          </a>
        </div>
      </div>
    </>
  );
}

export default ChatPreviewSheet;
