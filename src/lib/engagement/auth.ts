import crypto from "crypto";

// Only our own scheduler/server may trigger the agent.
// On Vercel, cron requests carry "Authorization: Bearer <CRON_SECRET>".
export function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production"; // allowed locally only
  // Constant-time compare: a plain === can leak, byte by byte, how much of a guess was right
  const expected = Buffer.from(`Bearer ${secret}`);
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}
