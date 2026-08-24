"use client";

import { useState } from "react";
import Image from "next/image";

export type ImageSlotShape = "rect" | "rounded" | "circle" | "pill";
export type ImageSlotFit = "cover" | "contain";

export interface ImageSlotProps {
  src: string;
  alt: string;
  /** Attribution text, e.g. "Photo by Jane Doe on Unsplash". */
  credit?: string;
  creditHref?: string;
  shape?: ImageSlotShape;
  fit?: ImageSlotFit;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

const SHAPE_CLASS: Record<ImageSlotShape, string> = {
  rect: "rounded-none",
  rounded: "rounded-[var(--radius-card)]",
  circle: "rounded-full",
  pill: "rounded-[var(--radius-pill)]",
};

function isUnsplashHost(url: string) {
  try {
    return /(^|\.)unsplash\.com$/.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Droppable-image-region pattern from bloom-boilerplate/image-slot.js,
 * rebuilt for production: a real, lazy-loaded next/image instead of a
 * static placeholder. Fills its container (position:relative + a sized
 * wrapper is the caller's job — see next/image's `fill` prop).
 */
export function ImageSlot({
  src,
  alt,
  credit,
  creditHref,
  shape = "rounded",
  fit = "cover",
  sizes = "(max-width: 430px) 100vw, 430px",
  priority = false,
  className = "",
}: ImageSlotProps) {
  const [loaded, setLoaded] = useState(false);

  // Unsplash's license requires visible attribution wherever a photo
  // renders. Rather than risk shipping an uncredited Unsplash photo, an
  // Unsplash src with no credit shows a placeholder instead.
  const blocked = !credit && isUnsplashHost(src);

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-[var(--color-bg-image-placeholder)] ${SHAPE_CLASS[shape]} ${className}`}
    >
      {blocked ? (
        <div className="flex h-full w-full items-center justify-center p-[12px] text-center text-[12px] text-[var(--color-text-faint)]">
          Photo needs attribution
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          onLoad={() => setLoaded(true)}
          className={`${fit === "contain" ? "object-contain" : "object-cover"} transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      {credit && !blocked ? (
        <span className="absolute bottom-[6px] left-[6px] max-w-[calc(100%-12px)] truncate rounded-[6px] bg-[var(--color-overlay-scrim)] px-[7px] py-[3px] text-[10px] text-[var(--color-accent-on-color)]">
          {creditHref ? (
            <a
              href={creditHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              {credit}
            </a>
          ) : (
            credit
          )}
        </span>
      ) : null}
    </div>
  );
}

export default ImageSlot;
