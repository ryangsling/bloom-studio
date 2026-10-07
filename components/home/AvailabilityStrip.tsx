import PulsingDot from "@/components/PulsingDot";
import type { Salon } from "@/types/salon";

export interface AvailabilityStripProps {
  salon: Salon;
  onBook: () => void;
}

export function AvailabilityStrip({ salon, onBook }: AvailabilityStripProps) {
  return (
    <div className="mx-[22px] my-[26px] flex items-center gap-[12px] rounded-[var(--radius-md)] bg-[var(--color-bg-surface-alt)] p-[16px]">
      <PulsingDot durationMs={2000} />
      <div className="flex-1 text-[13.5px] font-medium">
        Next available: <strong>{salon.chat.nextAvailable}</strong>
      </div>
      <a
        href="/chat"
        onClick={(e) => {
          e.preventDefault();
          onBook();
        }}
        className="font-semibold text-[13px] text-[var(--accent)] no-underline whitespace-nowrap"
      >
        Book →
      </a>
    </div>
  );
}

export default AvailabilityStrip;
