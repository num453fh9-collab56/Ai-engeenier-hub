import { NextRequest, NextResponse } from "next/server";
import { checkChatLimits, clientIp } from "@/lib/rate-limit";
import { ARENA_MODELS } from "@/lib/model-prices";

// Live model arena: runs ONE prompt on ONE allow-listed Groq model and returns
// the answer plus real measurements (wall-clock latency, tokens, tokens/second).
const MAX_PROMPT_CHARS = 1000;

export async function POST(request: NextRequest) {
  const limited = checkChatLimits(clientIp(request)); // shares the chat budget, so the arena can't be abused
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: 429, headers: { "Retry-After": String(limited.retryAfterSec) } });
  }

  const body = await request.json().catch(() => null);
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const model = ARENA_MODELS.find((m) => m.id === body?.model)?.id;
  if (!prompt || prompt.length > MAX_PROMPT_CHARS) {
    return NextResponse.json({ error: `Prompt must be 1–${MAX_PROMPT_CHARS} characters.` }, { status: 400 });
  }
  if (!model) return NextResponse.json({ error: "Unknown model." }, { status: 400 });

  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ error: "The arena is offline (no API key configured)." }, { status: 503 });

  const started = Date.now();
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        ...(model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
        messages: [
          { role: "system", content: "Answer clearly and concisely (under 200 words)." },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
        max_tokens: 700,
      }),
      signal: AbortSignal.timeout(25_000),
    });
    const ms = Date.now() - started;
    if (!res.ok) {
      console.error("Arena Groq error:", res.status, await res.text());
      return NextResponse.json({ error: "The model provider returned an error. Try again in a moment." }, { status: 502 });
    }
    const data = await res.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "";
    const text = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trim(); // hide any visible reasoning block
    const u = data.usage ?? {};
    const completionTime = typeof u.completion_time === "number" ? u.completion_time : null; // seconds, reported by Groq
    return NextResponse.json({
      text,
      ms,
      inputTokens: u.prompt_tokens ?? 0,
      outputTokens: u.completion_tokens ?? 0,
      tokensPerSec: completionTime && u.completion_tokens ? Math.round(u.completion_tokens / completionTime) : null,
    });
  } catch {
    return NextResponse.json({ error: "The request timed out. Try a shorter prompt." }, { status: 504 });
  }
}
