"use client";

import { useState } from "react";
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
import ChatPreviewSheet from "@/components/home/ChatPreviewSheet";
import DesktopChatWidget from "@/components/home/DesktopChatWidget";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);

  function toggleChat(open?: boolean) {
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const setOpen = isDesktop ? setWidgetOpen : setChatOpen;
    setOpen((v) => open ?? !v);
  }

  return (
    <div className="flex min-h-screen flex-col items-center gap-[64px] px-[16px] py-[56px] lg:gap-0 lg:bg-[var(--color-bg-surface)] lg:p-0">
      <div className="relative w-[430px] max-w-full overflow-hidden rounded-[var(--radius-panel)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card-elevation)] lg:w-[1200px] lg:overflow-visible lg:rounded-none lg:bg-transparent lg:shadow-none">
        <Header salon={salon} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} />
        <Hero salon={salon} onOpenChat={() => toggleChat(true)} />
        <TrustLine />
        <TrustIndicators salon={salon} />
        <ServicesGrid salon={salon} />
        <AvailabilityStrip salon={salon} />
        <ReviewsCarousel salon={salon} />
        <FindUs salon={salon} />
        <footer className="border-t border-[var(--color-border-hairline)] px-[22px] py-[22px] text-[12px] text-[var(--color-text-faint)]">
          {salon.salonName} · {salon.area}
        </footer>

        <ChatFAB onClick={() => toggleChat()} />
        <DesktopChatWidget open={widgetOpen} onClose={() => setWidgetOpen(false)} />
        <ChatPreviewSheet salon={salon} open={chatOpen} onClose={() => setChatOpen(false)} />
      </div>
    </div>
  );
}
