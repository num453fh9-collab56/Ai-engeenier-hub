import { decide } from "./planner";
import { writeEmail } from "./writer";
import { renderEmail, sendEmail } from "./email";
import { getLearner, listLearners, recordSend } from "./store";
import type { Learner } from "./types";

export interface RunResult {
  learnerId: string;
  action: "sent" | "skipped" | "preview" | "error";
  reason: string;
  subject?: string;
  source?: "ai" | "template";
  html?: string;
}

async function processOne(learner: Learner, dryRun: boolean, event?: "signup"): Promise<RunResult> {
  const d = decide(learner, new Date(), event);
  if (!d.send || !d.facts) return { learnerId: learner.id, action: "skipped", reason: d.reason };

  const { content, source } = await writeEmail(d.facts);
  const msg = renderEmail(learner, d.facts, content);
  if (dryRun) return { learnerId: learner.id, action: "preview", reason: d.reason, subject: msg.subject, source, html: msg.html };

  try {
    await sendEmail(learner.email, msg);
    recordSend(learner.id, d.facts.type);
    return { learnerId: learner.id, action: "sent", reason: d.reason, subject: msg.subject, source };
  } catch (e) {
    return { learnerId: learner.id, action: "error", reason: e instanceof Error ? e.message : String(e) };
  }
}

/** Scheduled run (twice a week): decide, write and send for every learner. */
export async function runEngagement({ dryRun = true } = {}): Promise<RunResult[]> {
  const results: RunResult[] = [];
  for (const learner of listLearners()) {
    results.push(await processOne(learner, dryRun));
    if (!dryRun) await new Promise((r) => setTimeout(r, 600)); // stay under the email API's rate limit
  }
  return results;
}

/** Event run: call right after someone signs up. */
export async function sendWelcome(learnerId: string, { dryRun = false } = {}): Promise<RunResult> {
  const learner = getLearner(learnerId);
  if (!learner) return { learnerId, action: "error", reason: "learner not found" };
  return processOne(learner, dryRun, "signup");
}
