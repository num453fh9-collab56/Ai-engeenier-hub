"use client";

import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { streak, useProgress } from "@/lib/progress";

/** Real numbers only: what THIS learner has done (saved in their browser). */
export function HeroProgressCard({ lessonCount }: { lessonCount: number }) {
  const p = useProgress();
  const done = Object.keys(p.completed).length;
  const days = streak(p.days);

  return (
    <Link href="/progress" className="glass-card flex flex-col gap-2 rounded-xl px-3 py-2.5 transition-transform hover:-translate-y-0.5">
      <span className="flex items-center gap-2">
        <span className="text-xs font-semibold">Your progress</span>
        <span className="ml-auto rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-2 py-px text-[9px] font-bold uppercase tracking-wider text-amber-950">
          You
        </span>
      </span>
      <span className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
          <BarChart3 className="size-4" />
        </span>
        <span className="text-[11px] leading-tight">
          <span className="block text-base font-bold tabular-nums">
            {done}/{lessonCount}
          </span>
          <span className="text-muted-foreground">lessons done</span>
        </span>
        <span className="text-[11px] leading-tight">
          <span className="block text-base font-bold tabular-nums">{days}</span>
          <span className="text-muted-foreground">day streak</span>
        </span>
      </span>
    </Link>
  );
}
