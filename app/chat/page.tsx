import ChatPanel from "@/components/chat/ChatPanel";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-[16px] py-[56px]">
      <div className="flex h-[820px] w-[430px] max-w-full flex-col overflow-hidden rounded-[var(--radius-panel)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card-elevation)]">
        <ChatPanel />
      </div>
    </div>
  );
}
