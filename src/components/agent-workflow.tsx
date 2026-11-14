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
  { label: "Eval", icon: CheckCircle2 },
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
    <div className="glass-card rounded-2xl px-3.5 py-3">
      <div className="mb-2.5 flex items-center gap-1.5">
        <Workflow className="size-3.5 text-primary" />
        <p className="text-xs font-semibold tracking-tight">Multi-agent RAG workflow</p>
        <span className="ml-auto rounded-full border border-border/70 px-1.5 py-px text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
          Simulated demo
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* pipeline */}
        <ol className="flex flex-1 items-center">
          {STEPS.map((s, i) => {
            const current = i === active;
            const on = i <= active;
            return (
              <li key={s.label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className={`flex size-7 items-center justify-center rounded-lg border transition-all duration-500 ${
                      current
                        ? "scale-110 border-transparent bg-gradient-to-br from-primary to-cyan-500 text-white shadow-md shadow-primary/40"
                        : on
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-background/60 text-muted-foreground"
                    }`}
                  >
                    <s.icon className="size-3.5" />
                  </span>
                  <span className="whitespace-nowrap text-[9px] text-muted-foreground">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <span className="relative mx-1 mb-3 h-px flex-1 overflow-hidden bg-border">
                    <span
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-cyan-500 transition-all duration-700"
                      style={{ width: i < active ? "100%" : "0%" }}
                    />
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        {/* metrics */}
        <dl className="hidden w-28 shrink-0 space-y-1 border-l border-border/70 pl-3 text-[10px] sm:block">
          {[
            ["Latency", run.latency ? `${run.latency} ms` : "—", ""],
            ["Tokens", run.tokens ? run.tokens.toLocaleString() : "—", ""],
            ["Eval", run.score ? run.score.toFixed(2) : "…", "text-emerald-600 dark:text-emerald-400"],
          ].map(([k, v, cls]) => (
            <div key={k} className="flex justify-between text-muted-foreground">
              <dt>{k}</dt>
              <dd className={`font-semibold tabular-nums text-foreground ${cls}`}>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
