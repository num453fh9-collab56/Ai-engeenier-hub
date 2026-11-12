"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronDown, Clock, PlayCircle, Sparkles } from "lucide-react";
import { useProgress } from "@/lib/progress";
import type { PathPhase } from "@/lib/learning-path";

const LEVEL: Record<string, string> = {
  beginner: "text-emerald-700 bg-emerald-500/10 dark:text-emerald-400",
  intermediate: "text-amber-700 bg-amber-500/10 dark:text-amber-400",
  advanced: "text-rose-700 bg-rose-500/10 dark:text-rose-400",
};

export function CurriculumRoadmap({
  phases,
  allOpen = false,
  showHeader = true,
}: {
  phases: PathPhase[];
  allOpen?: boolean;
  showHeader?: boolean;
}) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(allOpen ? phases.map((p) => p.id) : [phases[0]?.id]));
  const progress = useProgress();

  const live = phases.reduce((n, p) => n + p.liveCount, 0);
  const planned = phases.reduce((n, p) => n + p.items.length - p.liveCount, 0);
  const done = phases.flatMap((p) => p.items).filter((i) => i.id && progress.completed[i.id]).length;
  const next = phases.flatMap((p) => p.items).find((i) => i.live && i.id && !progress.completed[i.id]);

  const toggle = (id: string) =>
    setOpen((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <section className={showHeader ? "px-4 py-20 bg-muted/30" : ""}>
      <div className="mx-auto max-w-4xl">
        {showHeader && (
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">The AI Engineer Path</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {phases.length} phases from your first API call to production agents.{" "}
              <span className="font-medium text-foreground">{live} lessons live</span>, {planned} more planned — each
              marked honestly below.
            </p>
          </div>
        )}

        {/* Summary + continue */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-primary/20 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
              <span>Your progress</span>
              <span>
                {done}/{live} live lessons completed
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all"
                style={{ width: `${live ? (done / live) * 100 : 0}%` }}
              />
            </div>
          </div>
          {next?.href && (
            <Link
              href={next.href}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <PlayCircle className="size-4" /> {done ? "Continue" : "Start"}: {next.title.split(":")[0]}
            </Link>
          )}
        </div>

        <ol className="relative space-y-3">
          {phases.map((p, idx) => {
            const isOpen = open.has(p.id);
            const total = p.items.length;
            const phaseDone = p.items.filter((i) => i.id && progress.completed[i.id]).length;
            return (
              <li key={p.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                <button
                  onClick={() => toggle(p.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-accent/30 sm:px-5"
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                      p.liveCount ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{p.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">{p.goal}</span>
                  </span>
                  <span className="hidden shrink-0 text-right sm:block">
                    <span className="block text-xs font-medium">
                      {p.liveCount}/{total} live
                    </span>
                    <span className="mt-1 block h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-primary" style={{ width: `${(p.liveCount / total) * 100}%` }} />
                    </span>
                  </span>
                  <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && (
                  <div className="border-t border-border/40 px-4 py-3 sm:px-5">
                    <p className="mb-2 text-xs text-muted-foreground sm:hidden">
                      {p.liveCount}/{total} live{phaseDone ? ` · ${phaseDone} completed` : ""}
                    </p>
                    <ul className="space-y-1.5">
                      {p.items.map((it) =>
                        it.live && it.href ? (
                          <li key={it.title}>
                            <Link
                              href={it.href}
                              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-primary/5"
                            >
                              {it.id && progress.completed[it.id] ? (
                                <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                              ) : (
                                <PlayCircle className="size-4 shrink-0 text-primary" />
                              )}
                              <span className="min-w-0 flex-1 text-sm font-medium group-hover:text-primary">{it.title}</span>
                              <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize sm:inline ${LEVEL[it.difficulty ?? ""] ?? "bg-muted"}`}>
                                {it.difficulty}
                              </span>
                              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="size-3" />
                                {it.readTime?.replace(" read", "")}
                              </span>
                              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          </li>
                        ) : (
                          <li key={it.title} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-muted-foreground">
                            <Sparkles className="size-4 shrink-0 opacity-60" />
                            <span className="min-w-0 flex-1 text-sm">{it.title}</span>
                            <span className="shrink-0 rounded-full border border-dashed border-border px-2 py-0.5 text-[10px] font-medium">
                              Coming soon
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ol>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Focused on applied AI engineering. Deeper ML theory (maths, computer vision, reinforcement learning) may be
          added later as optional tracks.
        </p>
      </div>
    </section>
  );
}
