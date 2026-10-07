import { describe, expect, it } from "vitest";
import salon from "@/config/salon.json";
import { getFaqs, getWelcomeMessage } from "@/lib/faqs";

describe("getFaqs", () => {
  it("builds answers from the salon config", () => {
    const faqs = getFaqs(salon);
    const text = faqs.map((f) => f.answer).join(" ");
    expect(text).toContain(salon.services[0].name);
    expect(text).toContain(salon.services[0].price);
    expect(text).toContain(salon.hours[1].time);
    expect(text).toContain(salon.postcode);
    expect(text).toContain(salon.chat.nextAvailable);
  });

  it("follows a swapped service name", () => {
    const swapped = { ...salon, services: [{ ...salon.services[0], name: "Skin Fade" }] };
    expect(getFaqs(swapped)[1].answer).toContain("Skin Fade");
    expect(getFaqs(swapped)[1].answer).not.toContain(salon.services[0].name);
  });

  it("welcomes with the salon name", () => {
    expect(getWelcomeMessage(salon)).toContain(salon.salonName);
  });
});
