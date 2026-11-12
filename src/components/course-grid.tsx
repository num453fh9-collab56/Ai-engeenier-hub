"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Clock, Code2, Hammer, ListChecks, Search } from "lucide-react";
import { useProgress } from "@/lib/progress";
import type { LessonCardInfo } from "@/lib/lesson-cards";

const LEVELS = ["beginner", "intermediate", "advanced"] as const;
const LEVEL_STYLE: Record<string, string> = {
  beginner: "bg-emerald-500/90 text-white",
  intermediate: "bg-amber-500/90 text-white",
  advanced: "bg-rose-500/90 text-white",
};

export function CourseGrid({ lessons }: { lessons: LessonCardInfo[] }) {
  const [track, setTrack] = useState("All");
  const [level, setLevel] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const progress = useProgress();

  const tracks = useMemo(() => ["All", ...Array.from(new Set(lessons.map((l) => l.track)))], [lessons]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return lessons.filter(
      (l) =>
        (track === "All" || l.track === track) &&
        (!level || l.difficulty === level) &&
        (!s || [l.title, l.description, l.project ?? "", ...l.tags].join(" ").toLowerCase().includes(s))
    );
  }, [lessons, track, level, q]);

  const done = lessons.filter((l) => progress.completed[l.id]).length;

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">Explore Courses</h2>
            <p className="text-sm text-muted-foreground">
              {lessons.length} in-depth lessons · each with code, a mini project and a quiz
              {done > 0 && <span className="text-primary"> · {done} completed</span>}
            </p>
          </div>
          <label className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search lessons or projects…"
              className="w-full rounded-full border border-border bg-background py-2 pl-9 pr-4 text-sm outline-none focus:border-primary/50"
            />
          </label>
        </div>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          {tracks.map((t) => (
            <button
              key={t}
              onClick={() => setTrack(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                track === t ? "bg-primary text-primary-foreground shadow-md shadow-primary/25" : "bg-muted hover:bg-accent"
              }`}
            >
              {t}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
          {LEVELS.map((lv) => (
            <button
              key={lv}
              onClick={() => setLevel(level === lv ? null : lv)}
              className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                level === lv ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {lv}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <CourseCard key={l.id} lesson={l} completed={Boolean(progress.completed[l.id])} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No lessons match. Try another track, level or search term.
          </div>
        )}
      </div>
    </section>
  );
}

function CourseCard({ lesson: l, completed }: { lesson: LessonCardInfo; completed: boolean }) {
  return (
    <Link
      href={l.href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
    >
      {/* Cover */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {l.photo && (
          <Image
            src={l.photo.src}
            alt={l.photo.alt}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-slate-900 backdrop-blur">
            {l.track}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${LEVEL_STYLE[l.difficulty] ?? "bg-muted"}`}>
            {l.difficulty}
          </span>
        </div>
        {completed && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
            <CheckCircle2 className="size-3.5" /> Completed
          </span>
        )}
        <h3 className="absolute inset-x-4 bottom-3 text-lg font-bold leading-snug text-white drop-shadow line-clamp-2">
          {l.title}
        </h3>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{l.description}</p>

        {l.project && (
          <div className="flex items-start gap-2 rounded-xl bg-primary/5 px-3 py-2 ring-1 ring-primary/15">
            <Hammer className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-xs leading-snug">
              <span className="font-semibold text-primary">You&apos;ll build: </span>
              {l.project}
            </p>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1" title="Reading time">
              <Clock className="size-3.5" /> {l.readTime.replace(" read", "")}
            </span>
            <span className="inline-flex items-center gap-1" title="Code examples">
              <Code2 className="size-3.5" /> {l.codeExamples}
            </span>
            {l.quizQuestions > 0 && (
              <span className="inline-flex items-center gap-1" title="Quiz questions">
                <ListChecks className="size-3.5" /> {l.quizQuestions}
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            {completed ? "Review" : "Start"}
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
