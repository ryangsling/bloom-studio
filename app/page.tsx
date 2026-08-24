import Image from "next/image";
import salon from "@/config/salon.json";

// Scaffolding checkpoint for Part 2 (project setup + config data model).
// The real homepage (header, hero, services grid, reviews, etc. per
// design/DESIGN.md) is built in Part 4 — this page only proves the config,
// theme tokens, fonts, and the Unsplash remote image pipeline are wired up.
export default function Home() {
  return (
    <main className="mx-auto flex max-w-[430px] flex-col gap-[16px] p-[22px]">
      <h1 className="font-[family-name:var(--font-display)] text-[32px] italic font-medium leading-[1.15] text-[var(--color-text-primary)]">
        {salon.salonName}
      </h1>
      <p className="text-[15px] leading-[1.6] text-[var(--color-text-secondary)]">
        {salon.area} &middot; {salon.established} &middot; {salon.rating}
      </p>
      <div className="relative h-[220px] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-bg-image-placeholder)]">
        <Image
          src={salon.heroImage.src}
          alt={salon.heroImage.alt}
          fill
          className="object-cover"
          priority
        />
      </div>
      <p className="text-[12px] text-[var(--color-text-faint)]">
        {salon.heroImage.credit}
      </p>
      <p className="text-[13px] text-[var(--color-text-muted)]">
        Part 2 scaffolding complete — {salon.services.length} services loaded
        from config/salon.json. Homepage build is Part 4.
      </p>
    </main>
  );
}
