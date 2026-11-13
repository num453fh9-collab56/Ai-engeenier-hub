import type { EmailContent, NudgeFacts } from "./types";
import { MUBEEN_PERSONA } from "@/lib/mubeen";

// The agent's "pen": turns verified facts into a short, friendly email.
// Provider-agnostic — any OpenAI-compatible API works. Today: Groq (free).
// Later (paid): set LLM_BASE_URL / LLM_API_KEY / LLM_MODEL in the environment.
const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://api.groq.com/openai/v1";
const LLM_API_KEY = process.env.LLM_API_KEY || process.env.GROQ_API_KEY || "";
const LLM_MODEL = process.env.LLM_MODEL || process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const STYLE = `${MUBEEN_PERSONA}

Right now you are writing a short personal email to a learner, as Mubeen (first person: "I").
The email is automatically signed "— Mubeen", so do not add your own sign-off.
Rules:
- Use ONLY the facts provided. Never invent numbers, deadlines, prizes or features.
- Friendly, encouraging, specific. 60-110 words in total. Plain language.
- No fake urgency, no guilt-tripping, no ALL CAPS, at most one emoji in the subject.
- Address the learner by first name. Make the single next action obvious.
Return ONLY JSON: {"subject": string (max 60 chars), "preheader": string (max 90 chars),
"paragraphs": string[] (2-3 short paragraphs), "ctaText": string (max 30 chars)}`;

// Plain-English description of each email type, so the AI never mixes them up
// (e.g. writing "welcome back" to someone who just signed up).
const SITUATION: Record<NudgeFacts["type"], string> = {
  welcome: "This person JUST created an account for the first time. Welcome them as a brand-new learner (never say 'welcome back') and point them to their first lesson.",
  near_certificate: "They are exactly one lesson away from completing a track. Encourage them to finish it and earn the track certificate.",
  streak_risk: "They have an active daily learning streak but haven't learned today. Encourage a short session to keep the streak.",
  comeback: "They haven't visited for a while. Warmly remind them their progress is saved and suggest the next lesson. No guilt.",
  next_step: "They are an active learner. Recommend their next lesson and briefly say what they'll gain.",
};

function looksValid(x: unknown): x is EmailContent {
  const e = x as EmailContent;
  return (
    !!e &&
    typeof e.subject === "string" && e.subject.length > 0 && e.subject.length <= 80 &&
    typeof e.preheader === "string" &&
    Array.isArray(e.paragraphs) && e.paragraphs.length > 0 && e.paragraphs.every((p) => typeof p === "string") &&
    typeof e.ctaText === "string" && e.ctaText.length > 0
  );
}

export async function writeEmail(facts: NudgeFacts): Promise<{ content: EmailContent; source: "ai" | "template" }> {
  if (LLM_API_KEY) {
    try {
      const res = await fetch(`${LLM_BASE_URL}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${LLM_API_KEY}` },
        body: JSON.stringify({
          model: LLM_MODEL,
          ...(LLM_MODEL.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
          response_format: { type: "json_object" },
          temperature: 0.7,
          max_tokens: 900,
          messages: [
            { role: "system", content: STYLE },
            { role: "user", content: `Situation: ${SITUATION[facts.type]}\n\nFacts:\n${JSON.stringify(facts, null, 2)}` },
          ],
        }),
        signal: AbortSignal.timeout(25_000),
      });
      if (res.ok) {
        const data = await res.json();
        const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "null");
        if (looksValid(parsed)) return { content: parsed, source: "ai" };
      } else {
        console.error("Engagement writer LLM error:", res.status, (await res.text()).slice(0, 200));
      }
    } catch (e) {
      console.error("Engagement writer failed, using template:", e);
    }
  }
  return { content: templateEmail(facts), source: "template" };
}

/** Safe fallback copy — used when the AI is unavailable or returns bad output. */
export function templateEmail(f: NudgeFacts): EmailContent {
  const next = f.nextLesson ? `"${f.nextLesson.title}"${f.nextLesson.minutes ? ` (${f.nextLesson.minutes})` : ""}` : "your next lesson";
  switch (f.type) {
    case "welcome":
      return {
        subject: `Welcome to AI Engineering Hub, ${f.firstName}! 🚀`,
        preheader: "Your path from first API call to production agents starts here.",
        paragraphs: [
          `Hi ${f.firstName}, welcome aboard! You now have free access to ${f.totalLessons} hands-on lessons, quizzes, an AI tutor and certificates.`,
          `The best place to start is ${next}. Each lesson ends with a mini project you can add to your portfolio.`,
        ],
        ctaText: "Start lesson 1",
      };
    case "near_certificate":
      return {
        subject: `${f.firstName}, one lesson to your certificate 🏆`,
        preheader: `You've finished ${f.track?.done} of ${f.track?.total} lessons in ${f.track?.name}.`,
        paragraphs: [
          `You've completed ${f.track?.done} of ${f.track?.total} lessons in ${f.track?.name}. Just one to go: ${next}.`,
          `Finish it and pass the quiz to unlock your ${f.track?.name} certificate.`,
        ],
        ctaText: "Finish the track",
      };
    case "streak_risk":
      return {
        subject: `Keep your ${f.streakDays}-day streak going 🔥`,
        preheader: "A few minutes today keeps your momentum.",
        paragraphs: [
          `Hi ${f.firstName}, you've learned ${f.streakDays} days in a row — that's how real skills are built.`,
          `Keep it alive with a few minutes on ${next}.`,
        ],
        ctaText: "Continue learning",
      };
    case "comeback":
      return {
        subject: `${f.firstName}, your AI journey is waiting`,
        preheader: `You've already completed ${f.lessonsCompleted} lesson${f.lessonsCompleted === 1 ? "" : "s"}.`,
        paragraphs: [
          `It's been ${f.daysInactive} days since your last visit. You've already completed ${f.lessonsCompleted} of ${f.totalLessons} lessons — that progress is saved.`,
          `Pick up where you left off with ${next}.`,
        ],
        ctaText: "Pick up where I left off",
      };
    default:
      return {
        subject: `Your next step: ${f.nextLesson?.title ?? "a new lesson"}`.slice(0, 80),
        preheader: `${f.lessonsCompleted} of ${f.totalLessons} lessons done — keep going.`,
        paragraphs: [
          `Hi ${f.firstName}, you've completed ${f.lessonsCompleted} of ${f.totalLessons} lessons so far.`,
          `Your recommended next lesson is ${next}.`,
        ],
        ctaText: "Open the lesson",
      };
  }
}
