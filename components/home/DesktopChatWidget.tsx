import ChatPanel from "@/components/chat/ChatPanel";

export interface DesktopChatWidgetProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Fixed bottom-right chat panel shown at `lg:` and up. Stays mounted while
 * closed so the conversation survives closing and reopening.
 */
export function DesktopChatWidget({ open, onClose }: DesktopChatWidgetProps) {
  return (
    <div
      className={`fixed right-[20px] bottom-[96px] z-30 hidden h-[600px] max-h-[calc(100vh-120px)] w-[400px] flex-col overflow-hidden rounded-[var(--radius-panel)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card-elevation)] ${open ? "lg:flex" : ""}`}
      style={open ? { animation: "slide-up 0.25s ease-out" } : undefined}
    >
      <ChatPanel onClose={onClose} />
    </div>
  );
}

export default DesktopChatWidget;
