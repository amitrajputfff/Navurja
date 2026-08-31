import "server-only";

/**
 * Fixed-window rate limit, in-memory. Fine for a single Vercel region at
 * pilot volume; resets on cold start. Swap for Upstash/Redis before this
 * runs across multiple regions or the traffic actually matters.
 */
const hits = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(key, { count: 1, windowStart: now });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}
