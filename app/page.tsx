"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import salon from "@/config/salon.json";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import TrustLine from "@/components/home/TrustLine";
import TrustIndicators from "@/components/home/TrustIndicators";
import ServicesGrid from "@/components/home/ServicesGrid";
import AvailabilityStrip from "@/components/home/AvailabilityStrip";
import ReviewsCarousel from "@/components/home/ReviewsCarousel";
import FindUs from "@/components/home/FindUs";
import ChatFAB from "@/components/home/ChatFAB";
import DesktopChatWidget from "@/components/home/DesktopChatWidget";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);

  const router = useRouter();

  /** Desktop (lg, 1024px) uses the floating widget; below that, the full chat page. */
  function openChat(toggle = false) {
    if (window.matchMedia("(min-width: 1024px)").matches)
      setWidgetOpen((v) => (toggle ? !v : true));
    else router.push("/chat");
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-[64px] px-[16px] py-[56px] lg:gap-0 lg:bg-[var(--color-bg-surface)] lg:p-0">
      <div className="relative w-[430px] max-w-full overflow-hidden rounded-[var(--radius-panel)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card-elevation)] lg:w-[1200px] lg:overflow-visible lg:rounded-none lg:bg-transparent lg:shadow-none">
        <Header
          salon={salon}
          menuOpen={menuOpen}
          onToggleMenu={() => setMenuOpen((v) => !v)}
          onBookNow={() => openChat()}
        />
        <Hero salon={salon} onOpenChat={() => openChat()} />
        <TrustLine />
        <TrustIndicators salon={salon} />
        <ServicesGrid salon={salon} />
        <AvailabilityStrip salon={salon} />
        <ReviewsCarousel salon={salon} />
        <FindUs salon={salon} />
        <footer className="border-t border-[var(--color-border-hairline)] px-[22px] py-[22px] text-[12px] text-[var(--color-text-faint)]">
          {salon.salonName} · {salon.area}
        </footer>

        <ChatFAB onClick={() => openChat(true)} />
        <DesktopChatWidget open={widgetOpen} onClose={() => setWidgetOpen(false)} />
      </div>
    </div>
  );
}
