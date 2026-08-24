import ImageSlot from "@/components/ImageSlot";
import type { Service } from "@/types/salon";

export interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-bg-surface-alt)]">
      <div className="relative h-[86px] bg-[var(--color-bg-image-placeholder-alt)]">
        <ImageSlot
          src={service.image.src}
          alt={service.image.alt}
          credit={service.image.credit}
          creditHref={service.image.creditHref}
          shape="rect"
        />
      </div>
      <div className="px-[14px] pt-[12px] pb-[14px]">
        <div className="mb-[4px] text-[14px] font-semibold">{service.name}</div>
        <div className="font-[family-name:var(--font-display)] text-[15px] leading-none font-semibold text-[var(--accent)]">
          {service.price}
        </div>
        <div className="mt-[3px] text-[12px] leading-none text-[var(--color-text-muted)]">
          {service.duration}
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;
