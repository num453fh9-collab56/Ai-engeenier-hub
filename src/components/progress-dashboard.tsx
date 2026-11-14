"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Award, BookOpenCheck, Bookmark, CheckCircle2, Circle, Download, Flame, GraduationCap, ListChecks,
  Lock, Medal, Rocket, Sparkles, Star, Target, Upload, Wrench,
} from "lucide-react";
import { streak, useProgress } from "@/lib/progress";
import { useMyStack } from "@/lib/my-stack";
import { aiTools } from "@/lib/ai-tools";
import type { TrackInfo } from "@/lib/tracks";
import { ToolLogo } from "@/components/tool-logo";
import { capstones, taskCount } from "@/lib/capstones";
import { safeUrl, useCapstones } from "@/lib/capstone-progress";

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** 12 weeks of activity, one column per week (Mon→Sun), like GitHub's contribution chart. */
function heatmap(days: string[]) {
  const set = new Set(days);
  const start = new Date();
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7) - 7 * 11); // Monday, 11 weeks ago
  return Array.from({ length: 84 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return { day: ymd(d), active: set.has(ymd(d)), future: d > new Date() };
  });
}

function startOfWeek() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

// Everything the site keeps in this browser, so learners can back it up or move it
const BACKUP_KEYS = ["aeh:progress", "aeh-my-stack", "aeh-arena-votes", "aeh-glossary-urdu", "aeh-weekly-goal", "aeh-capstones"];

function readQuizScores(): Record<string, number> {
  const out: Record<string, number> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (k.startsWith("quiz:")) out[k.slice(5)] = Number(localStorage.getItem(k)) || 0;
    }
  } catch {}
  return out;
}

export function ProgressDashboard({ tracks, quizSizes }: { tracks: TrackInfo[]; quizSizes: Record<string, number> }) {
  const progress = useProgress();
  const stack = useMyStack();
  const caps = useCapstones();
  const [quiz, setQuiz] = useState<Record<string, number>>({});
  const [goal, setGoal] = useState(3);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuiz(readQuizScores());
    try {
      const g = Number(localStorage.getItem("aeh-weekly-goal"));
      if (g >= 1 && g <= 14) setGoal(g);
    } catch {}
  }, []);

  const lessons = tracks.flatMap((t) => t.lessons);
  const total = lessons.length;
  const done = lessons.filter((l) => progress.completed[l.id]).length;
  const s = streak(progress.days);
  const certs = tracks.filter((t) => t.lessons.length && t.lessons.every((l) => progress.completed[l.id])).length;
  const nextLesson = lessons.find((l) => !progress.completed[l.id]);

  const weekStart = startOfWeek();
  const thisWeek = Object.values(progress.completed).filter((iso) => new Date(iso) >= weekStart).length;
  const goalPct = Math.min(1, thisWeek / goal);

  const quizIds = Object.keys(quizSizes);
  const taken = quizIds.filter((id) => quiz[id] !== undefined);
  const perfect = taken.filter((id) => quiz[id] >= quizSizes[id]).length;
  const avg = taken.length ? Math.round((taken.reduce((n, id) => n + quiz[id] / quizSizes[id], 0) / taken.length) * 100) : 0;

  // Badges are earned only from real activity in this browser
  const badges = [
    { icon: Rocket, name: "First step", how: "Complete your first lesson", got: done >= 1 },
    { icon: Flame, name: "On fire", how: "Learn 3 days in a row", got: s >= 3 },
    { icon: Medal, name: "Week warrior", how: "Learn 7 days in a row", got: s >= 7 },
    { icon: Star, name: "Quiz ace", how: "Get a perfect quiz score", got: perfect >= 1 },
    { icon: ListChecks, name: "Quiz master", how: "Take 5 lesson quizzes", got: taken.length >= 5 },
    { icon: Wrench, name: "Tool collector", how: "Save 3 tools to My stack", got: stack.length >= 3 },
    { icon: Target, name: "Halfway there", how: "Finish half of all lessons", got: total > 0 && done >= total / 2 },
    { icon: Award, name: "Track finisher", how: "Complete a whole track", got: certs >= 1 },
    { icon: GraduationCap, name: "Graduate", how: "Complete every lesson", got: total > 0 && done === total },
  ];
  const earned = badges.filter((b) => b.got).length;

  function changeGoal(g: number) {
    setGoal(g);
    try {
      localStorage.setItem("aeh-weekly-goal", String(g));
    } catch {}
  }

  function exportBackup() {
    const data: Record<string, string> = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)!;
        if (BACKUP_KEYS.includes(k) || k.startsWith("quiz:")) data[k] = localStorage.getItem(k)!;
      }
    } catch {}
    const blob = new Blob([JSON.stringify({ app: "ai-engineering-hub", version: 1, exported: new Date().toISOString(), data }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `aeh-progress-${ymd(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg("Backup downloaded. Keep the file safe — you can restore it on any browser.");
  }

  async function importBackup(file: File) {
    try {
      const parsed = JSON.parse(await file.text());
      if (parsed?.app !== "ai-engineering-hub" || typeof parsed.data !== "object") throw new Error();
      let n = 0;
      for (const [k, v] of Object.entries(parsed.data as Record<string, unknown>)) {
        // only restore our own keys, and only string values
        if ((BACKUP_KEYS.includes(k) || /^quiz:[\w/-]+$/.test(k)) && typeof v === "string" && v.length < 200_000) {
          localStorage.setItem(k, v);
          n++;
        }
      }
      setMsg(`Restored ${n} items. Reloading…`);
      setTimeout(() => window.location.reload(), 800);
    } catch {
      setMsg("That file isn't an AI Engineering Hub backup.");
    }
  }

  const ring = 2 * Math.PI * 34;

  return (
    <div className="space-y-8">
      {/* Headline stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { icon: BookOpenCheck, value: `${done}/${total}`, label: "Lessons done" },
          { icon: Flame, value: s, label: "Day streak" },
          { icon: ListChecks, value: taken.length ? `${avg}%` : "—", label: "Avg quiz score" },
          { icon: Award, value: certs, label: "Certificates" },
        ].map((x) => (
          <div key={x.label} className="glass-card rounded-xl p-4 text-center">
            <x.icon className="mx-auto mb-1 size-5 text-primary" />
            <p className="text-2xl font-bold tabular-nums">{x.value}</p>
            <p className="text-xs text-muted-foreground">{x.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly goal + next lesson */}
      <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          <svg viewBox="0 0 80 80" className="size-20 -rotate-90" aria-hidden>
            <circle cx="40" cy="40" r="34" fill="none" strokeWidth="8" className="stroke-muted" />
            <circle
              cx="40" cy="40" r="34" fill="none" strokeWidth="8" strokeLinecap="round"
              className="stroke-primary transition-all duration-700"
              strokeDasharray={ring} strokeDashoffset={ring * (1 - goalPct)}
            />
          </svg>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">This week</p>
            <p className="text-xl font-bold tabular-nums">
              {thisWeek}/{goal} lessons
            </p>
            <label className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              Weekly goal
              <select value={goal} onChange={(e) => changeGoal(Number(e.target.value))} className="rounded border border-border bg-background px-1 py-0.5 text-foreground">
                {[1, 2, 3, 4, 5, 7, 10].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </label>
            {thisWeek >= goal && <p className="mt-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">Goal reached 🎉</p>}
          </div>
        </div>
        <div className="flex flex-col justify-center rounded-xl border border-primary/30 bg-primary/5 p-4">
          {nextLesson ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Up next</p>
              <p className="mt-1 font-semibold">{nextLesson.title}</p>
              <Link href={nextLesson.href} className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                {done ? "Continue learning" : "Start learning"} →
              </Link>
            </>
          ) : (
            <p className="font-semibold">You&apos;ve finished every lesson — amazing! 🎓</p>
          )}
        </div>
      </div>

      {/* Activity heatmap */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last 12 weeks</p>
          <p className="text-xs text-muted-foreground">{progress.days.length} active days in total</p>
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-1">
          {heatmap(progress.days).map((d) => (
            <div
              key={d.day}
              title={d.day}
              className={`aspect-square rounded-[3px] ${d.future ? "bg-transparent" : d.active ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </div>

      {/* Badges */}
      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-bold">Badges</h2>
          <span className="text-sm text-muted-foreground">
            {earned}/{badges.length} earned
          </span>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {badges.map((b) => (
            <li
              key={b.name}
              className={`flex items-center gap-3 rounded-xl border p-3 ${b.got ? "border-amber-400/50 bg-amber-400/10" : "border-border bg-card opacity-70"}`}
            >
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${b.got ? "bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950" : "bg-muted text-muted-foreground"}`}>
                {b.got ? <b.icon className="size-5" /> : <Lock className="size-4" />}
              </span>
              <span className="min-w-0 text-sm">
                <span className="block font-semibold">{b.name}</span>
                <span className="block text-xs text-muted-foreground">{b.how}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tracks + quiz scores */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold">Tracks</h2>
        {tracks.map((t) => {
          const n = t.lessons.filter((l) => progress.completed[l.id]).length;
          const complete = n === t.lessons.length && n > 0;
          return (
            <div key={t.category} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <h3 className="font-semibold">{t.label}</h3>
                <span className="text-xs text-muted-foreground">
                  {n}/{t.lessons.length}
                </span>
              </div>
              <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all" style={{ width: `${t.lessons.length ? (n / t.lessons.length) * 100 : 0}%` }} />
              </div>
              <ul className="space-y-1">
                {t.lessons.map((l) => {
                  const size = quizSizes[l.id];
                  const score = quiz[l.id];
                  return (
                    <li key={l.id}>
                      <Link href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        {progress.completed[l.id] ? <CheckCircle2 className="size-4 shrink-0 text-emerald-500" /> : <Circle className="size-4 shrink-0" />}
                        <span className="truncate">{l.title}</span>
                        {size ? (
                          <span
                            className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[11px] tabular-nums ${
                              score === undefined ? "bg-muted" : score >= size ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                            }`}
                          >
                            {score === undefined ? "quiz —" : `quiz ${score}/${size}`}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              {complete && (
                <Link href={`/certificate/${t.category}`} className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
                  <Award className="size-4" /> Get certificate
                </Link>
              )}
            </div>
          );
        })}
      </section>

      {/* Capstones / portfolio */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold">
            <Rocket className="size-4 text-primary" /> Capstone projects
          </h2>
          <Link href="/capstones" className="text-sm text-primary hover:underline">
            All projects →
          </Link>
        </div>
        <ul className="space-y-3">
          {capstones.map((c) => {
            const st = caps[c.slug];
            const n = st?.done.length ?? 0;
            const total = taskCount(c);
            const repo = safeUrl(st?.repo);
            const demo = safeUrl(st?.demo);
            return (
              <li key={c.slug}>
                <div className="mb-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <Link href={`/capstones/${c.slug}`} className="font-medium hover:text-primary">{c.title}</Link>
                  <span className="text-xs text-muted-foreground tabular-nums">{n}/{total} tasks</span>
                  {repo && <a href={repo} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Repo ↗</a>}
                  {demo && <a href={demo} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Demo ↗</a>}
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full ${n === total ? "bg-emerald-500" : "bg-primary"}`} style={{ width: `${(n / total) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* My stack */}
      <section className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold">
            <Bookmark className="size-4 text-primary" /> My stack
          </h2>
          <Link href="/directory" className="text-sm text-primary hover:underline">
            Browse tools →
          </Link>
        </div>
        {stack.length ? (
          <ul className="flex flex-wrap gap-2">
            {stack.map((slug) => {
              const t = aiTools.find((x) => x.slug === slug);
              return t ? (
                <li key={slug}>
                  <Link href={`/directory/${slug}`} className="inline-flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 text-sm hover:border-primary/40">
                    <ToolLogo slug={slug} name={t.name} size={24} /> {t.name}
                  </Link>
                </li>
              ) : null;
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Save tools from the directory (or the Stack Builder) and they&apos;ll appear here.</p>
        )}
      </section>

      {/* Backup */}
      <section className="rounded-xl border border-dashed border-border p-4">
        <h2 className="flex items-center gap-2 font-bold">
          <Sparkles className="size-4 text-primary" /> Keep your progress safe
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Progress lives in this browser only (no account needed). Download a backup to restore it on another device or
          after clearing your browser.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={exportBackup} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
            <Download className="size-4" /> Download backup
          </button>
          <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent">
            <Upload className="size-4" /> Restore from file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importBackup(f);
              e.target.value = "";
            }}
          />
        </div>
        {msg && <p className="mt-2 text-sm text-primary" role="status">{msg}</p>}
      </section>
    </div>
  );
}
