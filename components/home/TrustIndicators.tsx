import type { Salon } from "@/types/salon";

export interface TrustIndicatorsProps {
  salon: Salon;
}

export function TrustIndicators({ salon }: TrustIndicatorsProps) {
  return (
    <div className="flex flex-wrap gap-x-[18px] gap-y-[10px] px-[22px] pt-[14px] pb-[6px] text-[13px] font-medium text-[var(--color-text-secondary)]">
      <div>
        <span className="text-[var(--accent)]">★</span> {salon.rating}
      </div>
      <div>{salon.established}</div>
      <div>As seen on Instagram</div>
    </div>
  );
}

export default TrustIndicators;
