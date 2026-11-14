"use client";

import { useState } from "react";
import Link from "next/link";
import { BookmarkPlus, Check, Wand2 } from "lucide-react";
import { aiTools } from "@/lib/ai-tools";
import { TOOL_PRICING } from "@/lib/ai-tools-pricing";
import { toggleInStack, useMyStack } from "@/lib/my-stack";
import { ToolLogo } from "@/components/tool-logo";

type Goal = "chatbot" | "rag" | "agent" | "finetune";
type Budget = "free" | "paid";
type Hosting = "cloud" | "local";
interface Pick {
  layer: string;
  slug: string;
  why: string;
}

const GOALS: [Goal, string][] = [
  ["chatbot", "A chat assistant"],
  ["rag", "Q&A over my documents"],
  ["agent", "An agent that uses tools"],
  ["finetune", "Fine-tune my own model"],
];

// Simple, explainable rules — every pick links to the tool's page so you can check it.
function recommend(goal: Goal, budget: Budget, hosting: Hosting): Pick[] {
  const picks: Pick[] = [];
  const local = hosting === "local";

  if (goal !== "finetune") {
    if (local) picks.push({ layer: "Model", slug: "ollama", why: "Runs open models on your own machine for free — switch to vLLM when you serve real traffic." });
    else if (budget === "free") picks.push({ layer: "Model", slug: "groq", why: "Free plan with no credit card and very fast responses — enough to build and demo." });
    else picks.push({ layer: "Model", slug: "openai-api", why: "Broad, well-documented model lineup; Claude API is the main alternative." });
  }

  if (goal === "chatbot") picks.push({ layer: "Framework", slug: "ai-sdk", why: "Streaming chat UI in Next.js / React with any model provider." });
  if (goal === "rag") picks.push({ layer: "Framework", slug: "llamaindex", why: "Built for document ingestion, chunking and retrieval." });
  if (goal === "agent") picks.push({ layer: "Framework", slug: "langchain", why: "Tool calling plus a huge set of ready-made integrations." });

  if (goal === "rag" || goal === "agent") {
    if (local) picks.push({ layer: "Vector DB", slug: "qdrant", why: "Open source and easy to self-host, with strong filtering." });
    else picks.push({ layer: "Vector DB", slug: "pinecone", why: "Zero-ops; the free Starter plan (2 GB) covers a first project." });
  }

  if (goal === "finetune") {
    picks.push({ layer: "Training", slug: "unsloth", why: "Fast LoRA / QLoRA fine-tuning on a single (even free Colab) GPU." });
    picks.push({ layer: "Adapters", slug: "peft", why: "The standard library for LoRA adapters on Hugging Face models." });
    picks.push({ layer: "Experiment tracking", slug: "wandb", why: "Compare training runs; the free plan covers personal projects." });
    picks.push({ layer: "Serving", slug: local ? "ollama" : "vllm", why: local ? "Run your fine-tuned model locally." : "High-throughput serving of your fine-tuned model." });
  }

  if (goal === "rag") picks.push({ layer: "Evaluation", slug: "ragas", why: "Measures retrieval and answer quality so you know changes help." });
  if (goal !== "finetune") {
    if (budget === "paid" && !local) picks.push({ layer: "Observability", slug: "langsmith", why: "Trace every step of chains and agents; free Developer tier to start." });
    else picks.push({ layer: "Observability", slug: "langfuse", why: "Open source tracing and cost tracking — self-host free or use the free cloud tier." });
  }
  if (goal === "chatbot" || goal === "agent")
    picks.push({ layer: "Safety", slug: "guardrails-ai", why: "Validate outputs and filter PII before they reach users." });

  return picks;
}

function Choice<T extends string>({ value, current, onPick, children }: { value: T; current: T; onPick: (v: T) => void; children: React.ReactNode }) {
  const on = value === current;
  return (
    <button
      onClick={() => onPick(value)}
      aria-pressed={on}
      className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
        on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

export function StackBuilder() {
  const [goal, setGoal] = useState<Goal>("rag");
  const [budget, setBudget] = useState<Budget>("free");
  const [hosting, setHosting] = useState<Hosting>("cloud");
  const stack = useMyStack();
  const picks = recommend(goal, budget, hosting);
  const allSaved = picks.every((p) => stack.includes(p.slug));

  return (
    <section className="glass-card mb-8 rounded-2xl p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Wand2 className="size-5" />
        </span>
        <div>
          <h2 className="font-bold">Stack Builder</h2>
          <p className="text-sm text-muted-foreground">Answer 3 questions — get a starter stack with the reason for every pick.</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">1. What are you building?</p>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(([v, label]) => (
              <Choice key={v} value={v} current={goal} onPick={setGoal}>{label}</Choice>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">2. Budget</p>
            <div className="flex gap-2">
              <Choice value="free" current={budget} onPick={setBudget}>Free only</Choice>
              <Choice value="paid" current={budget} onPick={setBudget}>Can pay a little</Choice>
            </div>
          </div>
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">3. Where will it run?</p>
            <div className="flex gap-2">
              <Choice value="cloud" current={hosting} onPick={setHosting}>Cloud APIs</Choice>
              <Choice value="local" current={hosting} onPick={setHosting}>My own machine / servers</Choice>
            </div>
          </div>
        </div>
      </div>

      <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {picks.map((p) => {
          const tool = aiTools.find((t) => t.slug === p.slug)!;
          return (
            <li key={p.layer}>
              <Link
                href={`/directory/${p.slug}`}
                className="flex h-full gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40"
              >
                <ToolLogo slug={p.slug} name={tool.name} size={40} />
                <span className="min-w-0 text-sm">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-primary">{p.layer}</span>
                  <span className="block font-semibold">{tool.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{p.why}</span>
                  {budget === "free" && TOOL_PRICING[p.slug]?.free.startsWith("No free") && (
                    <span className="mt-1 block text-xs text-amber-600">Note: no free tier</span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">A sensible starting point, not the only right answer — check each tool&apos;s page for alternatives.</p>
        <button
          onClick={() => picks.forEach((p) => !stack.includes(p.slug) && toggleInStack(p.slug))}
          disabled={allSaved}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {allSaved ? <Check className="size-4" /> : <BookmarkPlus className="size-4" />}
          {allSaved ? "All in My stack" : "Save this stack"}
        </button>
      </div>
    </section>
  );
}
