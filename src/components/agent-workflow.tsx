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

  return (
    <div className="glass-card rounded-2xl px-4 py-3">
      <div className="mb-3 flex items-center gap-2">
        <Workflow className="size-4 text-primary" />
        <p className="text-sm font-semibold tracking-tight">Interactive Multi-Agent Workflow Visualizer</p>
        <span className="ml-auto rounded-full border border-border/70 px-1.5 py-px text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
          Simulated
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* pipeline */}
        <ol className="flex flex-1 items-center">
          {STEPS.map((s, i) => {
            const current = i === active;
            const on = i <= active;
            return (
              <li key={s.label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <span
                    className={`flex size-8 items-center justify-center rounded-lg border transition-all duration-500 ${
                      current
                        ? "scale-110 border-transparent bg-gradient-to-br from-primary to-cyan-500 text-white shadow-md shadow-primary/40"
                        : on
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-background/60 text-muted-foreground"
                    }`}
                  >
                    <s.icon className="size-4" />
                  </span>
                  <span className="whitespace-nowrap text-[10px] text-muted-foreground">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <span className="relative mx-1.5 mb-4 h-px flex-1 overflow-hidden bg-border">
                    <span
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-cyan-500 transition-all duration-700"
                      style={{ width: i < active ? "100%" : "0%" }}
                    />
                    {/* arrow head */}
                    <span className="absolute -right-px -top-[3px] size-0 border-y-[3.5px] border-l-[5px] border-y-transparent border-l-border" />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* metrics */}
        <dl className="hidden w-36 shrink-0 space-y-1.5 border-l border-border/70 pl-4 text-[11px] sm:block">
          <div>
            <div className="flex justify-between text-muted-foreground">
              <dt>Latency (ms)</dt>
              <dd className="font-semibold tabular-nums text-foreground">{run.latency || "—"}</dd>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-500 transition-all duration-700"
                style={{ width: run.latency ? `${Math.min(100, (run.latency / 400) * 100)}%` : "0%" }}
              />
            </div>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>Token usage</dt>
            <dd className="font-semibold tabular-nums text-foreground">{run.tokens ? run.tokens.toLocaleString() : "—"}</dd>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <dt>Eval score</dt>
            <dd className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
              {run.score ? `${Math.round(run.score * 100)}%` : "…"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
