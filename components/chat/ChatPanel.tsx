"use client";

import { useEffect, useRef, useState } from "react";
import salon from "@/config/salon.json";
import { getFaqs, getWelcomeMessage, type Faq } from "@/lib/faqs";
import { googleCalendarUrl } from "@/lib/calendarLink";
import ChatThread from "@/components/chat/ChatThread";
import MessageBubble from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import QuickReplyChips from "@/components/chat/QuickReplyChips";
import BookingConfirmationCard from "@/components/chat/BookingConfirmationCard";
import HandoffPrompt from "@/components/chat/HandoffPrompt";
import HandoffForm from "@/components/chat/HandoffForm";
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
const CAPTURE_BOOKING_MESSAGE =
  "Thanks! I've sent your request through — the salon will text or call to confirm the time shortly.";
const HANDOFF_FALLBACK_MESSAGE =
  "That's something to check with a stylist in person — let me connect you with one.";
const HANDOFF_SUBMIT_ERROR = "Something went wrong sending that — please try again.";

function seedMessages(): DisplayMessage[] {
  return [{ id: "welcome", role: "bot", text: getWelcomeMessage(salon) }];
}

function calendarUrlFor(booking: BookingInfo): string {
  const service = salon.services.find(
    (s) => s.name.toLowerCase() === booking.service.toLowerCase(),
  );
  return googleCalendarUrl({
    title: `${booking.service} at ${salon.salonName} (requested)`,
    time: booking.preferredTime,
    duration: service?.duration ?? "",
    location: `${salon.addressLine1}, ${salon.area} ${salon.postcode}`,
    details: "Requested via the website. The salon will confirm this time by text or call.",
  });
}

function appendBotMessage(text: string) {
  return (prev: DisplayMessage[]): DisplayMessage[] => [
    ...prev,
    { id: crypto.randomUUID(), role: "bot", text },
  ];
}

export interface ChatPanelProps {
  onClose?: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>(seedMessages);
  const [showChips, setShowChips] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [handoffOpen, setHandoffOpen] = useState(false);
  const [handoffSubmitted, setHandoffSubmitted] = useState(false);
  const [handoffSubmitting, setHandoffSubmitting] = useState(false);
  const [handoffError, setHandoffError] = useState<string | null>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  function askFaq(faq: Faq) {
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: faq.question },
      { id: crypto.randomUUID(), role: "bot", text: faq.answer },
    ]);
  }

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  async function sendMessage(text: string) {
    if (isSending) return;

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
        setMessages(appendBotMessage(data.message ?? FRIENDLY_ERROR_FALLBACK));
        return;
      }

      if (data.toolCall?.name === "capture_booking") {
        const captured = data.toolCall.booking;
        if (captured?.service && captured?.preferredTime) {
          // Never trust the model's own prose to describe the outcome here —
          // always use our own fixed, accurate wording (see systemPrompt.ts
          // and BookingConfirmationCard for the full rationale).
          setMessages(appendBotMessage(CAPTURE_BOOKING_MESSAGE));
          setBooking({ service: captured.service, preferredTime: captured.preferredTime });
        } else if (data.content) {
          setMessages(appendBotMessage(data.content));
        }
      } else if (data.toolCall?.name === "request_handoff") {
        setMessages(appendBotMessage(data.content || HANDOFF_FALLBACK_MESSAGE));
        setHandoffOpen(true);
      } else if (data.content) {
        setMessages(appendBotMessage(data.content));
      }
    } catch {
      setMessages(appendBotMessage(FRIENDLY_ERROR_FALLBACK));
    } finally {
      setIsSending(false);
    }
  }

  async function submitHandoff(name: string, phone: string) {
    setHandoffSubmitting(true);
    setHandoffError(null);
    try {
      const res = await fetch("/api/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setHandoffError(data?.message ?? HANDOFF_SUBMIT_ERROR);
        return;
      }
      setHandoffSubmitted(true);
    } catch {
      setHandoffError(HANDOFF_SUBMIT_ERROR);
    } finally {
      setHandoffSubmitting(false);
    }
  }

  return (
    <>
      <ChatThread salonName={salon.salonName} scrollAnchorRef={threadEndRef} onClose={onClose}>
        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role}>
            {m.text}
          </MessageBubble>
        ))}

        {isSending ? <TypingIndicator /> : null}

        {showChips ? (
          <QuickReplyChips
            chips={[
              ...getFaqs(salon).map((faq) => ({
                label: faq.question,
                onClick: () => askFaq(faq),
              })),
              {
                label: "Book an appointment",
                onClick: () => sendMessage("I'd like to book an appointment."),
              },
            ]}
          />
        ) : null}

        {booking ? (
          <BookingConfirmationCard
            serviceName={booking.service}
            stylist={salon.chat.stylist}
            time={booking.preferredTime}
            calendarUrl={calendarUrlFor(booking)}
            addressLine1={salon.addressLine1}
            area={salon.area}
          />
        ) : null}

        <HandoffPrompt onOpen={() => setHandoffOpen(true)} />
        {handoffOpen ? (
          <HandoffForm
            submitted={handoffSubmitted}
            submitting={handoffSubmitting}
            error={handoffError}
            onSubmit={submitHandoff}
          />
        ) : null}
      </ChatThread>

      <MessageInputBar
        placeholder={`Message ${salon.salonName}…`}
        disabled={isSending}
        onSend={sendMessage}
      />
    </>
  );
}
