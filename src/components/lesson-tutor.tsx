"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import { MubeenAvatar } from "@/components/mubeen-avatar";

type Msg = { role: "user" | "assistant"; content: string };

export function LessonTutor({ title, context }: { title: string; context: string }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, loading]);

  const starters = [
    "Explain this lesson like I'm new to AI",
    "What are the 3 most important takeaways?",
    "Give me a practice exercise",
  ];

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    let reply = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next,
          context: `You are tutoring a student on the lesson "${title}". Lesson text:\n${context}`,
        }),
      });
      if (res.ok) reply = (await res.json()).message ?? "";
      else if (res.status === 429) reply = (await res.json()).error ?? ""; // rate-limit message from Mubeen
    } catch {}
    setMsgs([
      ...next,
      {
        role: "assistant",
        content:
          reply ||
          "The tutor is offline right now (the AI service didn't respond). Please try again in a moment.",
      },
    ]);
    setLoading(false);
  }

  return (
    <div className="not-prose my-8">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="group flex w-full items-center gap-3 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 to-cyan-400/5 p-4 text-left transition-colors hover:border-primary/60"
        >
          <MubeenAvatar size={44} className="shrink-0" />
          <span>
            <span className="block text-sm font-semibold">Stuck? Ask Mubeen</span>
            <span className="block text-xs text-muted-foreground">
              Your AI mentor has read this lesson and will explain any part of it.
            </span>
          </span>
        </button>
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
            <MubeenAvatar size={22} />
            <span className="text-sm font-medium truncate">Mubeen · {title}</span>
            <button onClick={() => setOpen(false)} aria-label="Close tutor" className="ml-auto text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto p-4 space-y-3 text-sm">
            {msgs.length === 0 && (
              <div className="flex flex-col gap-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border border-border px-3 py-2 text-left text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {msgs.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground"
                    : "max-w-[95%] whitespace-pre-wrap leading-relaxed"
                }
              >
                {m.content}
              </div>
            ))}
            {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
            <div ref={end} />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-border p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Ask Mubeen about this lesson…"
              className="flex-1 min-w-0 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              disabled={!input.trim() || loading}
              aria-label="Send"
              className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
