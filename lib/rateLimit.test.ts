import { describe, it, expect } from "vitest";
import { checkRateLimit, RATE_LIMIT_MAX_REQUESTS } from "./rateLimit";

describe("checkRateLimit", () => {
  it("allows requests up to the limit within the window", () => {
    const key = `key-${crypto.randomUUID()}`;
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      expect(checkRateLimit(key).limited).toBe(false);
    }
  });

  it("blocks the request after the limit is exceeded within the window", () => {
    const key = `key-${crypto.randomUUID()}`;
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      checkRateLimit(key);
    }
    expect(checkRateLimit(key).limited).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const keyA = `key-${crypto.randomUUID()}`;
    const keyB = `key-${crypto.randomUUID()}`;
    for (let i = 0; i < RATE_LIMIT_MAX_REQUESTS; i++) {
      checkRateLimit(keyA);
    }
    expect(checkRateLimit(keyA).limited).toBe(true);
    expect(checkRateLimit(keyB).limited).toBe(false);
  });
});
