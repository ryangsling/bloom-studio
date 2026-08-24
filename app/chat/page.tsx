"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import salon from "@/config/salon.json";
import { initialsOf } from "@/lib/initials";
import { getScriptedMessages } from "@/lib/scriptedConversation";
import MessageBubble from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import QuickReplyChips from "@/components/chat/QuickReplyChips";
import BookingConfirmationCard from "@/components/chat/BookingConfirmationCard";
import HandoffSection from "@/components/chat/HandoffSection";
import MessageInputBar from "@/components/chat/MessageInputBar";

interface DisplayMessage {
  id: string;
  role: "user" | "bot";
  text: string;
}

interface BookingInfo {
  service: string;
  preferredTime: string;
}

const FRIENDLY_ERROR_FALLBACK =
  "We're getting lots of interest right now — please try again shortly.";

function seedMessages(): DisplayMessage[] {
  const scripted = getScriptedMessages(salon.services[0]).map((m, i) => ({
    id: `seed-${i}`,
    role: m.role === "user" ? ("user" as const) : ("bot" as const),
    text: m.text,
  }));

  const availabilityOffer: DisplayMessage = {
    id: "seed-availability",
    role: "bot",
    text: `Let me check the diary… good news — I have ${salon.chat.slot1} and ${salon.chat.slot2} free this week. Which works better?`,
  };

  return [...scripted, availabilityOffer];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>(seedMessages);
  const [showChips, setShowChips] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [handoffSubmitted, setHandoffSubmitted] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  async function sendMessage(text: string) {
    setShowChips(false);
    const userMessage: DisplayMessage = { id: crypto.randomUUID(), role: "user", text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "bot", text: data.message ?? FRIENDLY_ERROR_FALLBACK },
        ]);
        return;
      }

      const fallbackHandoffMessage =
        "That's something to check with a stylist in person — let me connect you with one.";
      const botText =
        data.content ||
        (data.toolCall?.name === "request_handoff" ? fallbackHandoffMessage : null);

      if (botText) {
        setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "bot", text: botText }]);
      }

      if (data.toolCall?.name === "capture_booking") {
        setBooking({
          service: data.toolCall.booking.service,
          preferredTime: data.toolCall.booking.preferredTime,
        });
      } else if (data.toolCall?.name === "request_handoff") {
        setHandoffOpen(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "bot", text: FRIENDLY_ERROR_FALLBACK },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-[16px] py-[56px]">
      <div className="flex h-[820px] w-[430px] max-w-full flex-col overflow-hidden rounded-[var(--radius-panel)] bg-[var(--color-bg-surface)] shadow-[var(--shadow-card-elevation)]">
        <div className="flex flex-shrink-0 items-center gap-[12px] border-b border-[var(--color-border-hairline)] px-[20px] py-[18px]">
          <Link href="/" aria-label="Back to homepage" className="p-[4px] text-[20px] no-underline">
            ←
          </Link>
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[var(--accent)] text-[14px] font-semibold text-[var(--color-accent-on-color)]">
            {initialsOf(salon.salonName)}
          </div>
          <div className="flex-1">
            <div className="text-[15px] leading-[1.2] font-semibold">
              {salon.salonName} Assistant
            </div>
            <div className="text-[12px] leading-[1.2] text-[var(--color-status-online)]">
              ● Online now
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-[12px] overflow-y-auto px-[18px] pt-[18px] pb-[12px]">
          {messages.map((m) => (
            <MessageBubble key={m.id} role={m.role}>
              {m.text}
            </MessageBubble>
          ))}

          {isSending ? <TypingIndicator /> : null}

          {showChips ? (
            <QuickReplyChips
              chips={[
                {
                  label: salon.chat.slot1,
                  onClick: () => sendMessage(`${salon.chat.slot1}, please`),
                },
                {
                  label: salon.chat.slot2,
                  onClick: () => sendMessage(`${salon.chat.slot2}, please`),
                },
                {
                  label: "See more times",
                  onClick: () => sendMessage("Can I see some other times?"),
                },
              ]}
            />
          ) : null}

          {booking ? (
            <BookingConfirmationCard
              serviceName={booking.service}
              stylist={salon.chat.stylist}
              time={booking.preferredTime}
              addressLine1={salon.addressLine1}
              area={salon.area}
            />
          ) : null}

          <HandoffSection
            open={handoffOpen}
            onOpen={() => setHandoffOpen(true)}
            submitted={handoffSubmitted}
            onSubmit={() => setHandoffSubmitted(true)}
          />

          <div ref={threadEndRef} />
        </div>

        <MessageInputBar
          placeholder={`Message ${salon.salonName}…`}
          disabled={isSending}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
}
