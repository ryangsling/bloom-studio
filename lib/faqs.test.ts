import { describe, expect, it } from "vitest";
import salon from "@/config/salon.json";
import { getFaqs, getWelcomeMessage } from "@/lib/faqs";

function answerTo(faqs: ReturnType<typeof getFaqs>, topic: string): string {
  return faqs.find((f) => f.question.includes(topic))!.answer;
}

describe("getFaqs", () => {
  it("builds answers from the salon config", () => {
    const faqs = getFaqs(salon);
    expect(answerTo(faqs, "services")).toContain(
      `${salon.services[0].name} ${salon.services[0].price}`,
    );
    expect(answerTo(faqs, "hours")).toContain(salon.hours[1].time);
    expect(answerTo(faqs, "based")).toContain(salon.postcode);
    expect(answerTo(faqs, "next appointment")).toContain(salon.chat.nextAvailable);
  });

  it("follows a swapped service name", () => {
    const swapped = { ...salon, services: [{ ...salon.services[0], name: "Skin Fade" }] };
    const answer = answerTo(getFaqs(swapped), "services");
    expect(answer).toContain("Skin Fade");
    expect(answer).not.toContain(salon.services[0].name);
  });

  it("welcomes with the salon name", () => {
    expect(getWelcomeMessage(salon)).toContain(salon.salonName);
  });
});
