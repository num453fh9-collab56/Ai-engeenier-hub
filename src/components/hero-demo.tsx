"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, Check, Code2, Copy, Loader2, MessageSquare } from "lucide-react";
import { MubeenAvatar } from "@/components/mubeen-avatar";

const suggestions = [
  "What is RAG, in 3 lines?",
  "When should I fine-tune vs prompt?",
  "How do AI agents use tools?",
];

const fallback: Record<string, string> = {
  [suggestions[0]]:
    "RAG = Retrieval-Augmented Generation.\n1. Embed your docs into a vector DB.\n2. At query time, retrieve the most relevant chunks.\n3. Feed them to the LLM as context so answers stay grounded and current.",
  [suggestions[1]]:
    "Start with prompting + RAG — it's cheap and fast to iterate. Fine-tune only when you need a consistent style/format, lower latency with a smaller model, or behaviour prompts can't reliably produce.",
  [suggestions[2]]:
    "The model is given tool schemas. It decides to call one, your code executes it, and the result is fed back. This loop (reason → act → observe) repeats until the task is done — the ReAct pattern.",
};

// Simplified code that matches each topic, shown in the "Code" tab
const SNIPPETS = {
  rag: {
    lesson: "/docs/02-rag/vector-dbs",
    code: `# RAG: retrieve first, then generate
hits = vector_db.query(embed(question), top_k=3)
context = "\\n\\n".join(h.text for h in hits)

answer = llm(
    f"Answer only from this context:\\n{context}\\n\\nQ: {question}"
)`,
  },
  finetune: {
    lesson: "/docs/04-finetuning/fine-tuning",
    code: `# Fine-tune a small model with LoRA (TRL + PEFT)
from peft import LoraConfig
from trl import SFTTrainer

trainer = SFTTrainer(
    model="Qwen/Qwen3-0.6B",
    train_dataset=dataset,
    peft_config=LoraConfig(r=16, target_modules="all-linear"),
)
trainer.train()`,
  },
  agent: {
    lesson: "/docs/03-agents/react-pattern",
    code: `# The agent loop: reason -> act -> observe
for step in range(max_steps):
    reply = llm(history, tools=TOOLS)
    if not reply.tool_calls:
        break                       # final answer
    for call in reply.tool_calls:   # run the tool...
        history.append(run_tool(call))  # ...and observe`,
  },
};
type SnippetKey = keyof typeof SNIPPETS;
const pickSnippet = (q: string | null): SnippetKey => {
  const t = (q ?? "").toLowerCase();
  if (/fine|lora|train/.test(t)) return "finetune";
  if (/agent|tool/.test(t)) return "agent";
  return "rag";
};

export function HeroDemo({ embedded = false }: { embedded?: boolean }) {
  const [input, setInput] = useState("");
  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [shown, setShown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"answer" | "code">("answer");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Typewriter effect for the answer
  useEffect(() => {
    if (timer.current) clearInterval(timer.current);
    if (!answer) return;
    timer.current = setInterval(() => {
      setShown((n) => {
        if (n >= answer.length) {
          if (timer.current) clearInterval(timer.current);
          return n;
        }
        return n + 3;
      });
    }, 16);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [answer]);

  async function ask(q: string) {
    const text = q.trim();
    if (!text || loading) return;
    setQuestion(text);
    setTab("answer");
    setAnswer("");
    setShown(0);
    setInput("");
    setLoading(true);
    let reply = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: text }] }),
      });
      if (res.ok) reply = (await res.json()).message ?? "";
      else if (res.status === 429) reply = (await res.json()).error ?? ""; // rate-limit message from Mubeen
    } catch {}
    if (!reply)
      reply =
        fallback[text] ??
        "The live model is offline right now — but this exact topic is covered step-by-step in the lessons. Hit “Start Learning” to dive in.";
    setLoading(false);
    setAnswer(reply);
  }

  if (embedded) return <EmbeddedDemo {...{ input, setInput, question, answer, shown, loading, tab, setTab, ask }} />;

  return (
    <div className={embedded ? "relative w-full" : "relative w-full max-w-md mx-auto animate-fade-up [animation-delay:200ms]"}>
      {!embedded && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary/60 via-cyan-400/30 to-transparent blur-sm opacity-70" />
      )}
      <div className={embedded ? "relative bg-card overflow-hidden" : "relative rounded-2xl border border-border/60 bg-card/90 backdrop-blur-xl shadow-2xl overflow-hidden"}>
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-400/80" />
          <span className="size-2.5 rounded-full bg-amber-400/80" />
          <span className="size-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-xs text-muted-foreground font-mono">
            mubeen · your AI mentor
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            live
          </span>
        </div>

        <div role="tablist" className="flex gap-1 border-b border-border/60 bg-muted/40 px-2 pt-1.5">
          {([
            ["answer", "Mubeen's answer", MessageSquare],
            ["code", "Code", Code2],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center gap-1.5 rounded-t-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                tab === key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" /> {label}
            </button>
          ))}
        </div>

        {tab === "code" ? (
          <div className={`${embedded ? "h-40 sm:h-44" : "h-64"} overflow-y-auto bg-[#0b1020] p-4`}>
            <pre className="whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed text-sky-100">
              {SNIPPETS[pickSnippet(question)].code}
            </pre>
            <Link href={SNIPPETS[pickSnippet(question)].lesson} className="mt-3 inline-block text-xs font-medium text-violet-300 hover:underline">
              Learn this step by step in the lesson &rarr;
            </Link>
          </div>
        ) : (
        <div className={`${embedded ? "h-40 sm:h-44" : "h-64"} overflow-y-auto p-4 text-sm space-y-3`}>
          {!question && (
            <div className="text-muted-foreground">
              <p className="mb-2 text-xs">
                Hi, I&apos;m Mubeen 👋 Ask me anything about LLMs, RAG or agents — try one:
              </p>
              <div className="flex flex-col gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="text-left rounded-lg border border-border/60 bg-background/60 px-3 py-1.5 text-xs hover:border-primary/40 hover:bg-primary/5 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {question && (
            <>
              <div className="ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-primary px-3 py-2 text-primary-foreground">
                {question}
              </div>
              <div className="flex gap-2">
                <MubeenAvatar size={22} className="mt-0.5 shrink-0" />
                <div className="whitespace-pre-wrap leading-relaxed">
                  {loading ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      {answer.slice(0, shown)}
                      {shown < answer.length && (
                        <span className="inline-block w-1.5 h-4 align-middle bg-primary animate-pulse ml-0.5" />
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
          className="flex items-center gap-2 border-t border-border/60 p-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about LLMs, RAG, agents…"
            maxLength={300}
            className="flex-1 bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Ask"
            className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
          >
            <ArrowUp className="size-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

/** Homepage version: a browser-style window — questions on the left, Mubeen's response / code on the right. */
function EmbeddedDemo({
  input, setInput, question, answer, shown, loading, tab, setTab, ask,
}: {
  input: string;
  setInput: (v: string) => void;
  question: string | null;
  answer: string;
  shown: number;
  loading: boolean;
  tab: "answer" | "code";
  setTab: (t: "answer" | "code") => void;
  ask: (q: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const snippet = SNIPPETS[pickSnippet(question)];

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl shadow-primary/20">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-amber-400/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">mubeen · your AI mentor</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" /> live
        </span>
      </div>

      <div className="grid sm:grid-cols-[1fr_1.15fr]">
        {/* left: greeting, suggestions, input */}
        <div className="flex flex-col gap-2 p-3">
          <p className="text-sm">
            Hi, I&apos;m Mubeen 👋 <span className="text-muted-foreground">Ask me anything about LLMs.</span>
          </p>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className={`rounded-lg border px-3 py-1.5 text-left text-xs transition-colors ${
                question === s
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/70 bg-background/60 hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              {s}
            </button>
          ))}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="mt-auto flex items-center gap-1.5 rounded-lg border border-border/70 bg-background/60 p-1"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Or type your own…"
              maxLength={300}
              className="min-w-0 flex-1 bg-transparent px-2 py-1 text-xs outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="Ask"
              className="inline-flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <ArrowUp className="size-3.5" />
            </button>
          </form>
        </div>

        {/* right: response / code preview */}
        <div className="m-2 ml-0 flex flex-col overflow-hidden rounded-xl border border-border/70 bg-muted/40 max-sm:ml-2">
          <div role="tablist" className="flex gap-1 border-b border-border/60 px-1.5 pt-1.5">
            {([
              ["answer", "Mubeen's Response", MessageSquare],
              ["code", "Code Preview", Code2],
            ] as const).map(([key, label, Icon]) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={`inline-flex items-center gap-1.5 rounded-t-md border-b-2 px-2.5 py-1.5 text-[11px] font-medium transition-colors ${
                  tab === key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" /> {label}
              </button>
            ))}
          </div>

          {tab === "code" ? (
            <div className="relative h-44 overflow-y-auto bg-[#0b1020] p-3">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(snippet.code).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  });
                }}
                aria-label="Copy code"
                className="absolute right-2 top-2 rounded-md p-1 text-sky-200/70 hover:bg-white/10 hover:text-white"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              </button>
              <pre className="whitespace-pre-wrap pr-6 font-mono text-[11px] leading-relaxed text-sky-100">{snippet.code}</pre>
              <Link href={snippet.lesson} className="mt-2 inline-block text-[11px] font-medium text-sky-300 hover:underline">
                Learn this in the lesson &rarr;
              </Link>
            </div>
          ) : (
            <div className="h-44 space-y-2 overflow-y-auto p-3 text-xs">
              {!question ? (
                <p className="text-muted-foreground">Pick a question on the left — Mubeen answers here, live.</p>
              ) : (
                <>
                  <p className="font-medium text-primary">{question}</p>
                  <div className="flex gap-2">
                    <MubeenAvatar size={20} className="mt-0.5 shrink-0" />
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {loading ? (
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          {answer.slice(0, shown)}
                          {shown < answer.length && <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-primary align-middle" />}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
