export interface StarRatingProps {
  count?: number;
  label?: string;
  className?: string;
}

/** Fixed accent-colored star row used on review cards. */
export function StarRating({ count = 5, label, className = "" }: StarRatingProps) {
  return (
    <div
      role="img"
      aria-label={label ?? `${count} out of 5 stars`}
      className={`text-[13px] tracking-[2px] text-[var(--accent)] ${className}`}
    >
      {"★".repeat(count)}
    </div>
  );
}

export default StarRating;
