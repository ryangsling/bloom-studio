import SectionHeading from "@/components/SectionHeading";
import ReviewCard from "@/components/home/ReviewCard";
import type { Salon } from "@/types/salon";

export interface ReviewsCarouselProps {
  salon: Salon;
}

export function ReviewsCarousel({ salon }: ReviewsCarouselProps) {
  return (
    <div id="reviews" className="py-[8px] pb-[6px] pl-[22px] lg:px-[22px]">
      <div className="mb-[14px]">
        <SectionHeading>What clients say</SectionHeading>
      </div>
      <div className="flex gap-[14px] overflow-x-auto pr-[22px] pb-[6px] [scroll-snap-type:x_mandatory] lg:[scroll-snap-type:none] lg:grid lg:grid-cols-3 lg:gap-[16px] lg:overflow-visible lg:p-0">
        {salon.reviews.map((review) => (
          <ReviewCard key={review.name} review={review} />
        ))}
      </div>
    </div>
  );
}

export default ReviewsCarousel;
