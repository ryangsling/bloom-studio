import ImageSlot from "@/components/ImageSlot";
import Button from "@/components/Button";
import type { Salon } from "@/types/salon";

export interface HeroProps {
  salon: Salon;
  onOpenChat: () => void;
}

export function Hero({ salon, onOpenChat }: HeroProps) {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-[48px] lg:px-[22px] lg:py-[32px]">
      <div className="relative h-[340px] bg-[var(--color-bg-image-placeholder)] lg:order-2 lg:h-[480px] lg:overflow-hidden lg:rounded-[var(--radius-panel)]">
        <ImageSlot
          src={salon.heroImage.src}
          alt={salon.heroImage.alt}
          credit={salon.heroImage.credit}
          creditHref={salon.heroImage.creditHref}
          shape="rect"
          priority
        />
      </div>

      <div className="px-[22px] pt-[28px] pb-[8px] lg:p-0">
        <h1 className="m-0 mb-[12px] font-[family-name:var(--font-display)] text-[32px] leading-[1.15] font-medium italic lg:text-[44px]">
          {salon.salonName} — {salon.area}&rsquo;s hair &amp; beauty studio
        </h1>
        <p className="m-0 mb-[22px] text-[15px] leading-[1.6] text-[var(--color-text-secondary)]">
          Colour, cut &amp; finish, nails and brows in the heart of {salon.area}. Book any time,
          day or night.
        </p>
        <div className="flex flex-wrap gap-[10px]">
          <Button variant="primary" className="min-w-[140px] flex-1">
            Book now
          </Button>
          <Button
            variant="secondary"
            onClick={onOpenChat}
            className="flex min-w-[170px] flex-1 items-center justify-center gap-[8px]"
          >
            <span className="flex gap-[3px]">
              <span className="block h-[5px] w-[5px] rounded-full bg-[var(--color-secondary-button-text)]" />
              <span className="block h-[5px] w-[5px] rounded-full bg-[var(--color-secondary-button-text)]" />
              <span className="block h-[5px] w-[5px] rounded-full bg-[var(--color-secondary-button-text)]" />
            </span>
            Ask our salon assistant
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
