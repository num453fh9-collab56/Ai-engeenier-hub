"use client";

import { useEffect, useState } from "react";
import { Bot, CheckCircle2, Database, Search, Sparkles, Workflow } from "lucide-react";

// Animated illustration of a RAG + multi-agent pipeline. The metrics are a
// SIMULATED demo run (clearly labelled) — not real measurements.
const STEPS = [
  { label: "Query", icon: Search },
  { label: "Vector DB", icon: Database },
  { label: "RAG Agent", icon: Bot },
  { label: "LLM Agent", icon: Sparkles },
  { label: "Evaluation", icon: CheckCircle2 },
];

const STEP_MS = 900;

function newRun() {
  return {
    latency: 220 + Math.floor(Math.random() * 120), // ms
    tokens: 3600 + Math.floor(Math.random() * 1200),
    score: 0.86 + Math.random() * 0.12, // eval score 0–1
  };
}

export function AgentWorkflow() {
  const [active, setActive] = useState(0);
  const [run, setRun] = useState({ latency: 0, tokens: 0, score: 0 });

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let step = 0;
    let current = newRun();
    const id = setInterval(() => {
      step = (step + 1) % (STEPS.length + 1); // one extra beat to "rest" at the end
      if (step === 0) current = newRun();
      setActive(step);
      setRun(step >= STEPS.length - 1 ? current : { ...current, score: 0 });
    }, reduce ? 2500 : STEP_MS);
    return () => clearInterval(id);
  }, []);

  const progress = Math.min(1, active / (STEPS.length - 1));

  return (
    <div className="rounded-2xl border border-white/60 bg-background/80 p-4 shadow-xl shadow-primary/10 ring-1 ring-border backdrop-blur-md dark:border-white/10">
      <div className="mb-3 flex items-center gap-2">
        <Workflow className="size-4 text-primary" />
        <p className="text-sm font-semibold">Multi-agent RAG workflow</p>
        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          Demo run · simulated
        </span>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* pipeline */}
        <ol className="flex flex-1 items-center justify-between gap-1">
          {STEPS.map((s, i) => {
            const on = i <= active && active < STEPS.length + 1;
            const current = i === active;
            return (
              <li key={s.label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`flex size-9 items-center justify-center rounded-xl border transition-all duration-500 ${
                      current
                        ? "scale-110 border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                        : on
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    <s.icon className="size-4" />
                  </span>
                  <span className="whitespace-nowrap text-[10px] text-muted-foreground">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <span className="relative mx-1 mb-4 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-700"
                      style={{ width: i < active ? "100%" : "0%" }}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* metrics */}
        <dl className="grid w-full grid-cols-3 gap-2 text-[11px] sm:w-40 sm:grid-cols-1">
          <div>
            <dt className="flex justify-between text-muted-foreground">
              Latency <span className="font-semibold text-foreground">{run.latency ? `${run.latency} ms` : "—"}</span>
            </dt>
            <dd className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <span className="block h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${progress * 100}%` }} />
            </dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            Tokens <span className="font-semibold text-foreground">{run.tokens ? run.tokens.toLocaleString() : "—"}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            Eval score <span className="font-semibold text-emerald-600 dark:text-emerald-400">{run.score ? run.score.toFixed(2) : "…"}</span>
          </div>
        </dl>
      </div>
    </div>
  );
}
