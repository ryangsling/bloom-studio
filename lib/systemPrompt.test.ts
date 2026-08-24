import { describe, it, expect } from "vitest";
import { buildSystemPrompt } from "./systemPrompt";
import type { Salon, ImageAsset } from "@/types/salon";

const BLANK_IMAGE: ImageAsset = { src: "", alt: "", credit: "", creditHref: "" };

function makeSalon(overrides: Partial<Salon> = {}): Salon {
  return {
    salonName: "Test Salon",
    area: "Testville",
    accent: "#000000",
    established: "Est. 2020",
    rating: "5.0",
    phone: "000",
    addressLine1: "1 Test St",
    postcode: "T1 1TT",
    heroImage: BLANK_IMAGE,
    services: [{ name: "Balayage", price: "£150", duration: "2hr", image: BLANK_IMAGE }],
    reviews: [],
    hours: [{ day: "Monday", time: "9-5" }],
    chat: { stylist: "Test", slot1: "", slot2: "", nextAvailable: "" },
    ...overrides,
  };
}

describe("buildSystemPrompt", () => {
  it("includes the salon's service names and prices", () => {
    const prompt = buildSystemPrompt(makeSalon());
    expect(prompt).toContain("Balayage");
    expect(prompt).toContain("£150");
  });

  it("reflects a different service when the config's first service changes", () => {
    const salon = makeSalon({
      services: [{ name: "Buzz Cut", price: "£20", duration: "20min", image: BLANK_IMAGE }],
    });
    const prompt = buildSystemPrompt(salon);
    expect(prompt).toContain("Buzz Cut");
    expect(prompt).not.toContain("Balayage");
  });

  it("instructs the model to hand off allergy and patch-test questions", () => {
    const prompt = buildSystemPrompt(makeSalon());
    expect(prompt.toLowerCase()).toContain("patch test");
    expect(prompt).toContain("request_handoff");
  });

  it("instructs the model never to claim a booking without the tool call", () => {
    const prompt = buildSystemPrompt(makeSalon());
    expect(prompt).toContain("capture_booking");
    expect(prompt.toLowerCase()).toContain("never");
  });
});
