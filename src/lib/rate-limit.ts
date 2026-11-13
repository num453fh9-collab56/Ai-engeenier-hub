// Simple fixed-window rate limiter kept in server memory.
//
// Good basic protection against one person spamming the AI (and burning the
// API budget). Limitation: each server instance has its own memory, so on a
// platform with several instances the real limit can be a bit higher.
// For stronger, shared limits later: Vercel Firewall rate-limit rules or a
// Redis store — only this file needs to change.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export interface LimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSec: number;
}

export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): LimitResult {
  let b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + windowMs };
    buckets.set(key, b);
  }
  b.count += 1;

  // keep memory bounded: drop expired buckets when the map gets large
  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }

  return {
    ok: b.count <= limit,
    remaining: Math.max(0, limit - b.count),
    retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
  };
}

/** Best-effort client IP (Vercel and most proxies set these headers). */
export function clientIp(request: Request): string {
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

/** Limits for the AI chat, overridable from the environment. */
export const CHAT_LIMITS = {
  perIpShort: num(process.env.CHAT_LIMIT_PER_10MIN, 20), // per visitor, per 10 minutes
  perIpDaily: num(process.env.CHAT_LIMIT_PER_DAY, 100), // per visitor, per day
  globalDaily: num(process.env.CHAT_LIMIT_GLOBAL_PER_DAY, 2000), // whole site, per day
};

const MIN = 60_000;
const DAY = 24 * 60 * MIN;

/** Applies all chat limits. Returns null if allowed, or a 429 payload. */
export function checkChatLimits(ip: string): { error: string; retryAfterSec: number } | null {
  const short = rateLimit(`ip10:${ip}`, CHAT_LIMITS.perIpShort, 10 * MIN);
  if (!short.ok) {
    const mins = Math.ceil(short.retryAfterSec / 60);
    return {
      error: `Mubeen needs a short break — you've asked a lot of questions quickly. Please try again in about ${mins} minute${mins === 1 ? "" : "s"}.`,
      retryAfterSec: short.retryAfterSec,
    };
  }
  const daily = rateLimit(`ipday:${ip}`, CHAT_LIMITS.perIpDaily, DAY);
  if (!daily.ok) {
    return { error: "You've reached today's question limit with Mubeen. Come back tomorrow — your lessons are still open!", retryAfterSec: daily.retryAfterSec };
  }
  const global = rateLimit("global:day", CHAT_LIMITS.globalDaily, DAY);
  if (!global.ok) {
    return { error: "Mubeen is very busy today and has paused for a while. Please try again later.", retryAfterSec: global.retryAfterSec };
  }
  return null;
}
