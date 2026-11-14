import crypto from "crypto";

// Signed unsubscribe tokens: the link contains the learner id plus an HMAC,
// so nobody can unsubscribe someone else by guessing ids.
function secret(): string | null {
  const s = process.env.ENGAGEMENT_SECRET;
  if (s) return s;
  // A known fallback is only OK on a developer's machine. In production a missing
  // secret means "refuse": otherwise anyone could forge links with the public default.
  return process.env.NODE_ENV === "production" ? null : "dev-only-secret";
}

export function signId(id: string): string {
  const key = secret();
  if (!key) throw new Error("ENGAGEMENT_SECRET is not set");
  return crypto.createHmac("sha256", key).update(id).digest("hex").slice(0, 32);
}

export function verifyId(id: string, token: string): boolean {
  if (!secret() || !id) return false;
  const expected = Buffer.from(signId(id));
  const given = Buffer.from(token || "");
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}
