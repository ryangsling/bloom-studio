import { describe, it, expect, beforeEach, vi } from "vitest";

const sendMock = vi.fn().mockResolvedValue({ data: { id: "email_123" }, error: null });

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const booking = {
  name: "Chloe",
  phone: "07000 000000",
  service: "Balayage",
  preferredTime: "Thu 2:00pm",
};

beforeEach(() => {
  sendMock.mockClear();
  vi.stubEnv("RESEND_API_KEY", "test-key");
  vi.stubEnv("OWNER_EMAIL", "owner@example.com");
  vi.stubEnv("EMAIL_FROM", "onboarding@resend.dev");
});

describe("sendBookingEmail", () => {
  it("sends an email to the owner with the booking details", async () => {
    const { sendBookingEmail } = await import("./email");
    await sendBookingEmail(booking);

    expect(sendMock).toHaveBeenCalledTimes(1);
    const payload = sendMock.mock.calls[0][0];
    expect(payload.to).toBe("owner@example.com");
    expect(payload.from).toBe("onboarding@resend.dev");
    expect(payload.text).toContain("Chloe");
    expect(payload.text).toContain("Balayage");
  });

  it("does nothing when RESEND_API_KEY is not configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const { sendBookingEmail } = await import("./email");
    await sendBookingEmail(booking);

    expect(sendMock).not.toHaveBeenCalled();
  });
});
