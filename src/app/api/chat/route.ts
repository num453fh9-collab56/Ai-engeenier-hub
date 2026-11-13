import { NextRequest, NextResponse } from "next/server";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_MESSAGES = 10; // conversation turns kept
const MAX_MESSAGE_CHARS = 2_000; // per message
const MAX_CONTEXT_CHARS = 6_000; // lesson / RAG reference text

// Model is configurable so a retired model can be swapped without code changes.
// (Groq retired llama-3.3-70b-versatile; check https://console.groq.com/docs/models)
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

const SYSTEM_PROMPT =
  "You are an elite Principal AI Engineer. Provide concise, production-grade advice on RAG, AI Agents, Fine-Tuning, and MLOps. Keep responses under 200 words and focus on actionable insights.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages: rawMessages, context } = body as {
      messages?: unknown;
      context?: unknown;
    };

    if (!Array.isArray(rawMessages)) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    // Security: never trust the client's message list. Only "user" and
    // "assistant" roles are allowed (a client-sent "system" message could
    // override our instructions), and every message is length-capped so
    // nobody can burn through our API quota with huge payloads.
    const messages = rawMessages
      .filter(
        (m): m is ChatMessage =>
          typeof m === "object" &&
          m !== null &&
          ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
          typeof (m as ChatMessage).content === "string" &&
          (m as ChatMessage).content.trim().length > 0
      )
      .slice(-MAX_MESSAGES)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

    if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
      return NextResponse.json(
        { error: "The last message must be a non-empty user message." },
        { status: 400 }
      );
    }

    const reference = typeof context === "string" ? context.trim().slice(0, MAX_CONTEXT_CHARS) : "";

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      return NextResponse.json(
        { error: "Groq API Key is not configured." },
        { status: 503 }
      );
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          // gpt-oss models "think" first; keep that short so the answer fits in max_tokens
          ...(GROQ_MODEL.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
          messages: [
            {
              role: "system",
              content: reference
                ? `${SYSTEM_PROMPT}

Use the following reference material to answer. If it doesn't cover the question, say so briefly and answer from general knowledge.

---
${reference}
---`
                : SYSTEM_PROMPT,
            },
            ...messages,
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
        signal: AbortSignal.timeout(25_000), // don't hang forever if the provider stalls
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return NextResponse.json(
        { error: "Failed to get response from AI." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ message: reply });
  } catch {
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
