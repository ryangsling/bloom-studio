import type { ReactNode } from "react";

export interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
}

/** DESIGN.md type_scale.h2_section: italic 500 22px/1 Newsreader. */
export function SectionHeading({ children, className = "" }: SectionHeadingProps) {
  return (
    <h2
      className={`font-[family-name:var(--font-display)] text-[22px] leading-none font-medium italic text-[var(--color-text-primary)] ${className}`}
    >
      {children}
    </h2>
  );
}

export default SectionHeading;
