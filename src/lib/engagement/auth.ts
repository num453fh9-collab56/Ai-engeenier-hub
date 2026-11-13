// Only our own scheduler/server may trigger the agent.
// On Vercel, cron requests carry "Authorization: Bearer <CRON_SECRET>".
export function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production"; // allowed locally only
  return request.headers.get("authorization") === `Bearer ${secret}`;
}
