import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

const sendCallbackRequestEmailMock = vi.fn().mockResolvedValue(undefined);
const sendCallbackRequestTelegramMock = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/email", () => ({
  sendCallbackRequestEmail: sendCallbackRequestEmailMock,
}));
vi.mock("@/lib/telegram", () => ({
  sendCallbackRequestTelegram: sendCallbackRequestTelegramMock,
}));

function makeRequest(body: unknown, opts: { cookie?: string } = {}) {
  const headers = new Headers({ "content-type": "application/json" });
  if (opts.cookie) headers.set("cookie", `bloom_session=${opts.cookie}`);
  return new NextRequest("http://localhost/api/handoff", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  sendCallbackRequestEmailMock.mockClear();
  sendCallbackRequestTelegramMock.mockClear();
});

describe("POST /api/handoff", () => {
  it("sends both notifications for a valid callback request", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      makeRequest({ name: "Sam Rivera", phone: "07999 111222" }, { cookie: crypto.randomUUID() }),
    );
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.ok).toBe(true);
    expect(sendCallbackRequestEmailMock).toHaveBeenCalledWith({
      name: "Sam Rivera",
      phone: "07999 111222",
    });
    expect(sendCallbackRequestTelegramMock).toHaveBeenCalledWith({
      name: "Sam Rivera",
      phone: "07999 111222",
    });
  });

  it("returns 400 and fires no notifications when name or phone is missing", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest({ name: "Sam Rivera" }, { cookie: crypto.randomUUID() }));

    expect(res.status).toBe(400);
    expect(sendCallbackRequestEmailMock).not.toHaveBeenCalled();
    expect(sendCallbackRequestTelegramMock).not.toHaveBeenCalled();
  });

  it("returns 429 with a friendly message once a session exceeds the rate limit", async () => {
    const cookie = crypto.randomUUID();
    let lastRes;
    for (let i = 0; i < 9; i++) {
      lastRes = await (
        await import("./route")
      ).POST(makeRequest({ name: "Sam Rivera", phone: "07999 111222" }, { cookie }));
    }

    expect(lastRes!.status).toBe(429);
    const json = await lastRes!.json();
    expect(json.message).not.toMatch(/error|exception/i);
    expect(json.message.length).toBeGreaterThan(0);
  });
});
