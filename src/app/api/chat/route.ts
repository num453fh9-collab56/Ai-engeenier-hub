import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT =
  "You are an elite Principal AI Engineer. Provide concise, production-grade advice on RAG, AI Agents, Fine-Tuning, and MLOps. Keep responses under 200 words and focus on actionable insights.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, context } = body as {
      messages: { role: "user" | "assistant"; content: string }[];
      context?: string;
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

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
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                typeof context === "string" && context.trim()
                  ? `${SYSTEM_PROMPT}

Use the following reference material to answer. If it doesn't cover the question, say so briefly and answer from general knowledge.

---
${context.slice(0, 6000)}
---`
                  : SYSTEM_PROMPT,
            },
            ...messages.slice(-10),
          ],
          temperature: 0.7,
          max_tokens: 512,
        }),
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
