import StarRating from "@/components/StarRating";
import type { Review } from "@/types/salon";

export interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="w-[240px] flex-shrink-0 lg:w-auto rounded-[var(--radius-card)] border border-[var(--color-border-hairline)] bg-[var(--color-bg-surface)] p-[16px] [scroll-snap-align:start]">
      <div className="mb-[8px]">
        <StarRating />
      </div>
      <p className="m-0 mb-[10px] font-[family-name:var(--font-display)] text-[14px] leading-[1.5] italic">
        &ldquo;{review.quote}&rdquo;
      </p>
      <div className="text-[12px] leading-none font-semibold text-[var(--color-text-secondary)]">
        {review.name} · {review.service}
      </div>
    </div>
  );
}

export default ReviewCard;
