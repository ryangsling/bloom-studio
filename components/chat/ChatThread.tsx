import type { ReactNode, RefObject } from "react";
import Link from "next/link";
import { initialsOf } from "@/lib/initials";

export interface ChatThreadProps {
  salonName: string;
  children: ReactNode;
  scrollAnchorRef: RefObject<HTMLDivElement | null>;
}

export function ChatThread({ salonName, children, scrollAnchorRef }: ChatThreadProps) {
  return (
    <>
      <div className="flex flex-shrink-0 items-center gap-[12px] border-b border-[var(--color-border-hairline)] px-[20px] py-[18px]">
        <Link href="/" aria-label="Back to homepage" className="p-[4px] text-[20px] no-underline">
          ←
        </Link>
        <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[var(--accent)] text-[14px] font-semibold text-[var(--color-accent-on-color)]">
          {initialsOf(salonName)}
        </div>
        <div className="flex-1">
          <div className="text-[15px] leading-[1.2] font-semibold">{salonName} Assistant</div>
          <div className="text-[12px] leading-[1.2] text-[var(--color-status-online)]">
            ● Online now
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[12px] overflow-y-auto px-[18px] pt-[18px] pb-[12px]">
        {children}
        <div ref={scrollAnchorRef} />
      </div>
    </>
  );
}

export default ChatThread;
