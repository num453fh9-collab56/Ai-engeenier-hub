import { getLearningPath } from "@/lib/learning-path";
import { getTracks } from "@/lib/tracks";
import { SITE_URL } from "@/lib/site";
import type { Decision, Learner, NudgeFacts, NudgeType } from "./types";

// The agent's "brain": plain, testable rules that decide WHO gets an email,
// WHEN, and WHAT it is about. The AI only writes the words afterwards —
// it never decides who to email or invents facts.

const DAY = 24 * 60 * 60 * 1000;
export const RULES = {
  minDaysBetweenEmails: 3, // ≈ 2 emails a week at most
  skipIfActiveWithinHours: 20, // they're already learning — don't interrupt
  maxEmailsWithoutVisit: 4, // "sunset": stop if 4 emails in a row brought no visit
  comebackAfterDays: 7,
};

const daysBetween = (a: Date, b: Date) => Math.floor((a.getTime() - b.getTime()) / DAY);

function nextLessonFor(completed: Set<string>) {
  for (const phase of getLearningPath()) {
    for (const item of phase.items) {
      if (item.live && item.id && !completed.has(item.id)) {
        return { title: item.title, url: `${SITE_URL}${item.href}`, minutes: item.readTime?.replace(" read", "") ?? "" };
      }
    }
  }
  return undefined;
}

/** Certificate track the learner is closest to finishing. Uses the SAME tracks
 *  as /certificate/[track], so "finish this to earn your certificate" is always true. */
function closestTrack(completed: Set<string>) {
  const readTimes = new Map(
    getLearningPath().flatMap((p) => p.items).filter((i) => i.id).map((i) => [i.id!, i.readTime])
  );
  let best: { name: string; done: number; total: number; remaining: { title: string; href: string; readTime?: string }[] } | undefined;
  for (const t of getTracks()) {
    const done = t.lessons.filter((l) => completed.has(l.id)).length;
    const remaining = t.lessons
      .filter((l) => !completed.has(l.id))
      .map((l) => ({ title: l.title, href: l.href, readTime: readTimes.get(l.id) }));
    if (done === 0 || remaining.length === 0) continue;
    if (!best || remaining.length < best.remaining.length) best = { name: t.label, done, total: t.lessons.length, remaining };
  }
  return best;
}

export function decide(learner: Learner, now = new Date(), event?: "signup"): Decision {
  const base = { learnerId: learner.id };
  if (learner.emailOptOut) return { ...base, send: false, reason: "unsubscribed" };

  const completed = new Set(learner.completed);
  const totalLessons = getLearningPath().reduce((n, p) => n + p.liveCount, 0);
  const lastActive = new Date(learner.lastActiveAt);
  const daysInactive = daysBetween(now, lastActive);
  const facts: Omit<NudgeFacts, "type"> = {
    firstName: learner.name.split(" ")[0] || "there",
    lessonsCompleted: completed.size,
    totalLessons,
    streakDays: learner.streakDays,
    daysInactive,
    nextLesson: nextLessonFor(completed),
  };

  // 1) Welcome — sent once, right after signup (event-driven, not by the schedule)
  if (event === "signup") {
    if (learner.sends.some((s) => s.type === "welcome")) return { ...base, send: false, reason: "welcome already sent" };
    return { ...base, send: true, reason: "new signup", facts: { ...facts, type: "welcome" } };
  }

  // 2) Frequency cap — at most one email every few days
  const lastSend = learner.sends.at(-1);
  if (lastSend && daysBetween(now, new Date(lastSend.at)) < RULES.minDaysBetweenEmails)
    return { ...base, send: false, reason: "emailed recently" };

  // 3) Don't interrupt people who are already active
  if (now.getTime() - lastActive.getTime() < RULES.skipIfActiveWithinHours * 60 * 60 * 1000)
    return { ...base, send: false, reason: "active in the last day" };

  // 4) Sunset — stop if several emails in a row didn't bring them back
  const sendsSinceVisit = learner.sends.filter((s) => new Date(s.at) > lastActive).length;
  if (sendsSinceVisit >= RULES.maxEmailsWithoutVisit)
    return { ...base, send: false, reason: `paused: ${sendsSinceVisit} emails without a visit` };

  if (!facts.nextLesson && completed.size >= totalLessons)
    return { ...base, send: false, reason: "finished every live lesson" };

  // 5) Pick the most motivating, TRUE message for this person
  let type: NudgeType = "next_step";
  let track: NudgeFacts["track"];
  let nextLesson = facts.nextLesson;

  const near = closestTrack(completed);
  if (daysInactive >= RULES.comebackAfterDays) {
    type = "comeback";
  } else if (near && near.remaining.length === 1) {
    type = "near_certificate";
    track = { name: near.name, done: near.done, total: near.total };
    const r = near.remaining[0];
    nextLesson = { title: r.title, url: `${SITE_URL}${r.href}`, minutes: r.readTime?.replace(" read", "") ?? "" };
  } else if (learner.streakDays >= 2 && daysInactive >= 1) {
    type = "streak_risk";
  }

  return { ...base, send: true, reason: type, facts: { ...facts, type, track, nextLesson } };
}
