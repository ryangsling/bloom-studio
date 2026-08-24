import { describe, it, expect, beforeEach, vi } from "vitest";
import { sendBookingTelegram } from "./telegram";

const booking = {
  name: "Chloe",
  phone: "07000 000000",
  service: "Balayage",
  preferredTime: "Thu 2:00pm",
};

beforeEach(() => {
  vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-token");
  vi.stubEnv("TELEGRAM_CHAT_ID", "12345");
  vi.unstubAllGlobals();
});

describe("sendBookingTelegram", () => {
  it("posts the booking details to the Telegram Bot API", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await sendBookingTelegram(booking);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.telegram.org/bottest-token/sendMessage");
    const body = JSON.parse(options.body);
    expect(body.chat_id).toBe("12345");
    expect(body.text).toContain("Chloe");
    expect(body.text).toContain("Balayage");
  });

  it("does nothing when Telegram is not configured", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await sendBookingTelegram(booking);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("sendCallbackRequestTelegram", () => {
  const callback = { name: "Sam Rivera", phone: "07999 111222" };

  it("posts the callback request details to the Telegram Bot API", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const { sendCallbackRequestTelegram } = await import("./telegram");
    await sendCallbackRequestTelegram(callback);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.telegram.org/bottest-token/sendMessage");
    const body = JSON.parse(options.body);
    expect(body.chat_id).toBe("12345");
    expect(body.text).toContain("Sam Rivera");
    expect(body.text).toContain("07999 111222");
  });

  it("does nothing when Telegram is not configured", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { sendCallbackRequestTelegram } = await import("./telegram");
    await sendCallbackRequestTelegram(callback);

    expect(fetchMock).not.toHaveBeenCalled();
  });
});
