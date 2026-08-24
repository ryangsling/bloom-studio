import Button from "@/components/Button";

export interface BookingConfirmationCardProps {
  serviceName: string;
  stylist: string;
  time: string;
  addressLine1: string;
  area: string;
}

export function BookingConfirmationCard({
  serviceName,
  stylist,
  time,
  addressLine1,
  area,
}: BookingConfirmationCardProps) {
  return (
    <div className="mt-[2px] rounded-[var(--radius-card)] bg-[var(--color-bg-surface-alt)] p-[16px]">
      <div className="mb-[8px] text-[11px] font-semibold tracking-[0.08em] text-[var(--color-text-muted)] uppercase">
        Request received
      </div>
      <div className="mb-[4px] font-[family-name:var(--font-display)] text-[17px] leading-[1.3] font-medium italic">
        {serviceName} with {stylist}
      </div>
      <div className="text-[13px] leading-[1.6] text-[var(--color-text-secondary)]">
        {time} · {addressLine1}, {area}
      </div>
      <div className="mt-[6px] text-[12px] leading-[1.5] text-[var(--color-text-muted)]">
        We&rsquo;ll text or call to confirm this time shortly.
      </div>
      <Button variant="primary" className="mt-[10px] w-full py-[11px] text-[13.5px]">
        Add to calendar
      </Button>
    </div>
  );
}

export default BookingConfirmationCard;
