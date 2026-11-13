// Shared types for the email engagement agent.

export interface Learner {
  id: string;
  email: string;
  name: string;
  createdAt: string; // ISO date the account was created
  lastActiveAt: string; // ISO date of the last visit / lesson activity
  completed: string[]; // lesson ids like "02-rag/vector-dbs"
  streakDays: number; // current daily learning streak
  emailOptOut: boolean; // true after unsubscribing — never email again
  sends: { at: string; type: NudgeType }[]; // history of emails we sent
}

export type NudgeType =
  | "welcome" // right after signup
  | "near_certificate" // one lesson away from finishing a track
  | "streak_risk" // has a streak and hasn't learned today
  | "comeback" // inactive for a week or more
  | "next_step"; // default: suggest the next lesson

/** Everything the writer may say — the AI is only allowed to use these facts. */
export interface NudgeFacts {
  type: NudgeType;
  firstName: string;
  lessonsCompleted: number;
  totalLessons: number;
  streakDays: number;
  daysInactive: number;
  nextLesson?: { title: string; url: string; minutes: string };
  track?: { name: string; done: number; total: number };
}

export interface Decision {
  learnerId: string;
  send: boolean;
  reason: string; // why we did or didn't send — logged for transparency
  facts?: NudgeFacts;
}

export interface EmailContent {
  subject: string;
  preheader: string;
  paragraphs: string[];
  ctaText: string;
}
