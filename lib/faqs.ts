import type { Salon } from "@/types/salon";

export interface Faq {
  question: string;
  answer: string;
}

/**
 * The common questions shown as chips on a fresh chat. Answers are built only
 * from the salon config, so a re-skinned salon never shows another salon's data.
 */
export function getFaqs(salon: Salon): Faq[] {
  const services = salon.services.map((s) => `${s.name} ${s.price} (${s.duration})`).join(", ");
  const hours = salon.hours.map((h) => `${h.day}: ${h.time}`).join("\n");

  return [
    { question: "What are your opening hours?", answer: hours },
    {
      question: "What services and prices do you offer?",
      answer: `${services}.`,
    },
    {
      question: "Where are you based?",
      answer: `${salon.addressLine1}, ${salon.area} ${salon.postcode}. You can also call us on ${salon.phone}.`,
    },
    {
      question: "When is your next appointment?",
      answer: `Our next available slot is ${salon.chat.nextAvailable}. Tap "Book an appointment" and I'll take your details.`,
    },
    {
      question: "How does booking work?",
      answer:
        "Tell me the service and time you'd like, plus your name and phone number. The salon will text or call to confirm. Booking direct means no marketplace commission or third-party fees.",
    },
  ];
}

export function getWelcomeMessage(salon: Salon): string {
  return `Hi! I'm the ${salon.salonName} assistant. Ask me anything, or pick a common question below.`;
}
