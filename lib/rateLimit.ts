const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX_REQUESTS = 8;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory, single-instance counter — resets on cold start and isn't
// shared across concurrent serverless instances. Acceptable for demo-scale
// traffic; see AGENTS.md Limitations for the documented tradeoff.
const hits = new Map<string, RateLimitEntry>();

export function checkRateLimit(key: string): { limited: boolean } {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false };
  }

  entry.count += 1;
  return { limited: entry.count > RATE_LIMIT_MAX_REQUESTS };
}
