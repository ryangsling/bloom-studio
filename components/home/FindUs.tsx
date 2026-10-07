import SectionHeading from "@/components/SectionHeading";
import type { Salon } from "@/types/salon";

export interface FindUsProps {
  salon: Salon;
}

export function FindUs({ salon }: FindUsProps) {
  return (
    <div
      id="find-us"
      className="px-[22px] pt-[28px] pb-[24px] lg:grid lg:grid-cols-2 lg:gap-x-[48px]"
    >
      <div className="mb-[14px] lg:col-span-2">
        <SectionHeading>Find us</SectionHeading>
      </div>
      <div
        className="mb-[14px] flex h-[140px] lg:mb-0 lg:h-full lg:min-h-[260px] items-center justify-center rounded-[var(--radius-md)] text-[11px] text-[var(--color-text-placeholder)]"
        style={{
          background:
            "repeating-linear-gradient(45deg, var(--color-bg-image-placeholder), var(--color-bg-image-placeholder) 10px, var(--color-bg-surface-alt) 10px, var(--color-bg-surface-alt) 20px)",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        [ map ]
      </div>
      <div>
        <div className="mb-[14px] text-[14px] leading-[1.5] font-medium">
          {salon.addressLine1}
          <br />
          {salon.area} {salon.postcode}
        </div>
        <div className="flex flex-col gap-[6px] text-[13px] leading-[1.6] text-[var(--color-text-secondary)]">
          {salon.hours.map((row) => (
            <div
              key={row.day}
              className="flex justify-between border-b border-[var(--color-border-hairline-light)] py-[4px]"
            >
              <span>{row.day}</span>
              <span>{row.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FindUs;
