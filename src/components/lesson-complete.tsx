"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Flame } from "lucide-react";
import { recordActivity, setCompleted, streak, useProgress } from "@/lib/progress";

export function LessonComplete({ id, nextHref, nextTitle }: { id: string; nextHref?: string; nextTitle?: string }) {
  const progress = useProgress();
  const done = Boolean(progress.completed[id]);
  const s = streak(progress.days);

  // Visiting a lesson counts as activity for the streak
  useEffect(() => {
    recordActivity();
  }, []);

  return (
    <div className="not-prose mt-10 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-border bg-card/50 p-4">
      <button
        onClick={() => setCompleted(id, !done)}
        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
          done
            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {done ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
        {done ? "Completed" : "Mark as complete"}
      </button>
      {s > 0 && (
        <span className="inline-flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
          <Flame className="size-4" /> {s}-day streak
        </span>
      )}
      <div className="sm:ml-auto flex items-center gap-3 text-sm">
        <Link href="/progress" className="text-muted-foreground hover:text-foreground">
          My progress
        </Link>
        {nextHref && (
          <Link href={nextHref} className="font-medium text-primary hover:underline truncate max-w-56">
            Next: {nextTitle} →
          </Link>
        )}
      </div>
    </div>
  );
}
