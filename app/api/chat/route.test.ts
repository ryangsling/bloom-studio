import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

const callOpenRouterMock = vi.fn();
const sendBookingEmailMock = vi.fn().mockResolvedValue(undefined);
const sendBookingTelegramMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/openrouter", () => ({
  callOpenRouter: callOpenRouterMock,
}));
vi.mock("@/lib/email", () => ({
  sendBookingEmail: sendBookingEmailMock,
}));
vi.mock("@/lib/telegram", () => ({
  sendBookingTelegram: sendBookingTelegramMock,
}));

function makeRequest(body: unknown, opts: { cookie?: string; ip?: string } = {}) {
  const headers = new Headers({ "content-type": "application/json" });
  if (opts.cookie) headers.set("cookie", `bloom_session=${opts.cookie}`);
  if (opts.ip) headers.set("x-forwarded-for", opts.ip);
  return new NextRequest("http://localhost/api/chat", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  callOpenRouterMock.mockReset();
  sendBookingEmailMock.mockClear();
  sendBookingTelegramMock.mockClear();
});

describe("POST /api/chat", () => {
  it("captures a booking and fires both notifications on a capture_booking tool call", async () => {
    callOpenRouterMock.mockResolvedValue({
      content: null,
      model: "test/model",
      toolCalls: [
        {
          id: "call_1",
          type: "function",
          function: {
            name: "capture_booking",
            arguments: JSON.stringify({
              name: "Chloe",
              phone: "07000 000000",
              service: "Balayage",
              preferred_time: "Thu 2:00pm",
            }),
          },
        },
      ],
    });

    const { POST } = await import("./route");
    const res = await POST(
      makeRequest({ messages: [{ role: "user", content: "Thu 2pm please" }] }, { cookie: crypto.randomUUID() }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.toolCall.name).toBe("capture_booking");
    expect(json.toolCall.booking).toEqual({
      name: "Chloe",
      phone: "07000 000000",
      service: "Balayage",
      preferredTime: "Thu 2:00pm",
    });
    expect(sendBookingEmailMock).toHaveBeenCalledTimes(1);
    expect(sendBookingTelegramMock).toHaveBeenCalledTimes(1);
  });

  it("does not fire notifications or render a booking when capture_booking args are missing fields", async () => {
    callOpenRouterMock.mockResolvedValue({
      content: null,
      model: "test/model",
      toolCalls: [
        {
          id: "call_bad",
          type: "function",
          function: {
            name: "capture_booking",
            arguments: JSON.stringify({
              name: "Chloe",
              phone: "07000 000000",
              // service and preferred_time missing — malformed tool call
            }),
          },
        },
      ],
    });

    const { POST } = await import("./route");
    const res = await POST(
      makeRequest({ messages: [{ role: "user", content: "book it" }] }, { cookie: crypto.randomUUID() }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.toolCall).toBeNull();
    expect(typeof json.content).toBe("string");
    expect(sendBookingEmailMock).not.toHaveBeenCalled();
    expect(sendBookingTelegramMock).not.toHaveBeenCalled();
  });

  it("returns a hand-off flag without firing notifications on a request_handoff tool call", async () => {
    callOpenRouterMock.mockResolvedValue({
      content: "Let me get a stylist to help with that.",
      model: "test/model",
      toolCalls: [
        {
          id: "call_2",
          type: "function",
          function: {
            name: "request_handoff",
            arguments: JSON.stringify({ reason: "asked about allergic reaction safety" }),
          },
        },
      ],
    });

    const { POST } = await import("./route");
    const res = await POST(
      makeRequest(
        { messages: [{ role: "user", content: "will this cause an allergic reaction?" }] },
        { cookie: crypto.randomUUID() },
      ),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.toolCall.name).toBe("request_handoff");
    expect(json.toolCall.reason).toBe("asked about allergic reaction safety");
    expect(sendBookingEmailMock).not.toHaveBeenCalled();
    expect(sendBookingTelegramMock).not.toHaveBeenCalled();
  });

  it("returns 429 with a friendly message once a session exceeds the rate limit", async () => {
    callOpenRouterMock.mockResolvedValue({ content: "hi", model: "test/model", toolCalls: [] });
    const cookie = crypto.randomUUID();

    let lastRes;
    for (let i = 0; i < 9; i++) {
      lastRes = await (
        await import("./route")
      ).POST(makeRequest({ messages: [{ role: "user", content: "hi" }] }, { cookie }));
    }

    expect(lastRes!.status).toBe(429);
    const json = await lastRes!.json();
    expect(json.message).not.toMatch(/error|exception/i);
    expect(json.message.length).toBeGreaterThan(0);
  });
});
