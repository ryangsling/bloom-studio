import { describe, it, expect, beforeEach, vi } from "vitest";
import { callOpenRouter } from "./openrouter";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status });
}

const okBody = {
  choices: [{ message: { content: "hello", tool_calls: [] } }],
};

beforeEach(() => {
  vi.stubEnv("OPENROUTER_API_KEY", "test-key");
  vi.stubEnv("OPENROUTER_MODEL_PRIMARY", "primary/model");
  vi.stubEnv("OPENROUTER_MODEL_FALLBACK", "fallback/model");
  vi.unstubAllGlobals();
});

describe("callOpenRouter", () => {
  it("returns the primary model's response when it succeeds", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(okBody));
    vi.stubGlobal("fetch", fetchMock);

    const result = await callOpenRouter([{ role: "user", content: "hi" }]);

    expect(result.content).toBe("hello");
    expect(result.model).toBe("primary/model");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to the next model when the primary is rate-limited", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "rate limited" }, 429))
      .mockResolvedValueOnce(jsonResponse(okBody));
    vi.stubGlobal("fetch", fetchMock);

    const result = await callOpenRouter([{ role: "user", content: "hi" }]);

    expect(result.model).toBe("fallback/model");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("falls back when the primary model is removed (404)", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({ error: "model not found" }, 404))
      .mockResolvedValueOnce(jsonResponse(okBody));
    vi.stubGlobal("fetch", fetchMock);

    const result = await callOpenRouter([{ role: "user", content: "hi" }]);

    expect(result.model).toBe("fallback/model");
  });

  it("throws once every model in the chain has failed", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ error: "down" }, 503));
    vi.stubGlobal("fetch", fetchMock);

    await expect(callOpenRouter([{ role: "user", content: "hi" }])).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
