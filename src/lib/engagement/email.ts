import { SITE_URL } from "@/lib/site";
import { signId } from "./token";
import type { EmailContent, Learner, NudgeFacts } from "./types";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function unsubscribeUrl(learner: Learner) {
  return `${SITE_URL}/unsubscribe?u=${encodeURIComponent(learner.id)}&t=${signId(learner.id)}`;
}

/** Adds campaign tags so we can measure which emails bring people back. */
function tracked(url: string, type: string) {
  const u = new URL(url);
  u.searchParams.set("utm_source", "email");
  u.searchParams.set("utm_campaign", type);
  return u.toString();
}

export function renderEmail(learner: Learner, facts: NudgeFacts, c: EmailContent) {
  const cta = tracked(facts.nextLesson?.url ?? `${SITE_URL}/roadmap`, facts.type);
  const unsub = unsubscribeUrl(learner);
  const progress = facts.totalLessons ? Math.round((facts.lessonsCompleted / facts.totalLessons) * 100) : 0;

  const html = `<!doctype html><html><body style="margin:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
<span style="display:none;max-height:0;overflow:hidden">${esc(c.preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:linear-gradient(135deg,#3b82f6,#7c3aed);background-color:#3b82f6;padding:20px 28px;color:#fff;font-size:18px;font-weight:bold">{ &#10022; } AI Engineering Hub</td></tr>
<tr><td style="padding:28px">
${c.paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.6">${esc(p)}</p>`).join("")}
${facts.type !== "welcome" ? `<p style="margin:18px 0 6px;font-size:12px;color:#64748b">Your progress: ${facts.lessonsCompleted}/${facts.totalLessons} lessons</p>
<div style="background:#e2e8f0;border-radius:8px;height:8px"><div style="background:#3b82f6;width:${progress}%;height:8px;border-radius:8px"></div></div>` : ""}
<p style="margin:26px 0 0"><a href="${esc(cta)}" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:bold;display:inline-block">${esc(c.ctaText)} &rarr;</a></p>
</td></tr>
<tr><td style="padding:18px 28px;background:#f8fafc;font-size:12px;color:#64748b;line-height:1.5">
You're receiving this because you created an account on AI Engineering Hub. We send at most two emails a week.<br>
<a href="${esc(unsub)}" style="color:#64748b">Unsubscribe</a> &middot; <a href="${esc(SITE_URL)}" style="color:#64748b">Visit the site</a>
</td></tr></table></td></tr></table></body></html>`;

  const text = `${c.paragraphs.join("\n\n")}\n\n${c.ctaText}: ${cta}\n\n---\nUnsubscribe: ${unsub}`;
  return { subject: c.subject, html, text, unsub };
}

/** Sends through Resend's REST API. Without a verified domain, Resend only
 *  delivers to your own account email — perfect for testing. */
export async function sendEmail(to: string, msg: { subject: string; html: string; text: string; unsub: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set");
  const from = process.env.EMAIL_FROM || "AI Engineering Hub <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from,
      to: [to],
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      // lets Gmail/Outlook show a native "Unsubscribe" button
      headers: { "List-Unsubscribe": `<${msg.unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as { id: string };
}
