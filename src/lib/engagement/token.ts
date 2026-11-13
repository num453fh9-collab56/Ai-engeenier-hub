import crypto from "crypto";

// Signed unsubscribe tokens: the link contains the learner id plus an HMAC,
// so nobody can unsubscribe someone else by guessing ids.
const SECRET = process.env.ENGAGEMENT_SECRET || "dev-only-secret-change-me";

export function signId(id: string): string {
  return crypto.createHmac("sha256", SECRET).update(id).digest("hex").slice(0, 32);
}

export function verifyId(id: string, token: string): boolean {
  const expected = Buffer.from(signId(id));
  const given = Buffer.from(token || "");
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}
