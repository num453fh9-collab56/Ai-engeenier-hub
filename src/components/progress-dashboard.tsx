"use client";

import Link from "next/link";
import { Award, CheckCircle2, Circle, Flame, Target } from "lucide-react";
import { streak, useProgress } from "@/lib/progress";
import type { TrackInfo } from "@/lib/tracks";

function last28(days: string[]) {
  const set = new Set(days);
  const out: { day: string; active: boolean }[] = [];
  const d = new Date();
  d.setDate(d.getDate() - 27);
  for (let i = 0; i < 28; i++) {
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    out.push({ day: k, active: set.has(k) });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function ProgressDashboard({ tracks }: { tracks: TrackInfo[] }) {
  const progress = useProgress();
  const total = tracks.reduce((n, t) => n + t.lessons.length, 0);
  const done = tracks.reduce((n, t) => n + t.lessons.filter((l) => progress.completed[l.id]).length, 0);
  const s = streak(progress.days);
  const nextLesson = tracks.flatMap((t) => t.lessons).find((l) => !progress.completed[l.id]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Target, value: `${done}/${total}`, label: "Lessons done" },
          { icon: Flame, value: s, label: "Day streak" },
          { icon: Award, value: tracks.filter((t) => t.lessons.every((l) => progress.completed[l.id])).length, label: "Certificates" },
        ].map((x) => (
          <div key={x.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <x.icon className="size-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{x.value}</p>
            <p className="text-xs text-muted-foreground">{x.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Last 4 weeks</p>
        <div className="grid grid-cols-[repeat(14,minmax(0,1fr))] gap-1.5">
          {last28(progress.days).map((d) => (
            <div
              key={d.day}
              title={d.day}
              className={`aspect-square rounded-sm ${d.active ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
        {nextLesson && (
          <Link
            href={nextLesson.href}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {done ? "Continue" : "Start"}: {nextLesson.title} →
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {tracks.map((t) => {
          const n = t.lessons.filter((l) => progress.completed[l.id]).length;
          const complete = n === t.lessons.length;
          return (
            <div key={t.category} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <h2 className="font-semibold">{t.label}</h2>
                <span className="text-xs text-muted-foreground">
                  {n}/{t.lessons.length}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all"
                  style={{ width: `${(n / t.lessons.length) * 100}%` }}
                />
              </div>
              <ul className="space-y-1">
                {t.lessons.map((l) => (
                  <li key={l.id}>
                    <Link href={l.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                      {progress.completed[l.id] ? (
                        <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="size-4 shrink-0" />
                      )}
                      <span className="truncate">{l.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              {complete && (
                <Link
                  href={`/certificate/${t.category}`}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                >
                  <Award className="size-4" /> Get certificate
                </Link>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Progress is saved in this browser only — no account needed.
      </p>
    </div>
  );
}
