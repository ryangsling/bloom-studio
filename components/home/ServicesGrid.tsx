import SectionHeading from "@/components/SectionHeading";
import ServiceCard from "@/components/home/ServiceCard";
import type { Salon } from "@/types/salon";

export interface ServicesGridProps {
  salon: Salon;
}

export function ServicesGrid({ salon }: ServicesGridProps) {
  return (
    <div id="services" className="px-[22px] pt-[26px] pb-[6px]">
      <div className="mb-[14px]">
        <SectionHeading>Popular services</SectionHeading>
      </div>
      <div className="grid grid-cols-2 gap-[12px]">
        {salon.services.map((service) => (
          <ServiceCard key={service.name} service={service} />
        ))}
      </div>
    </div>
  );
}

export default ServicesGrid;
