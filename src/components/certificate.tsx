"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Lock, Printer } from "lucide-react";
import { useProgress } from "@/lib/progress";
import type { TrackInfo } from "@/lib/tracks";

export function Certificate({ track }: { track: TrackInfo }) {
  const progress = useProgress();
  const [name, setName] = useState("");
  const remaining = track.lessons.filter((l) => !progress.completed[l.id]);

  if (remaining.length) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 text-center">
        <Lock className="size-8 mx-auto mb-3 text-muted-foreground" />
        <h1 className="text-xl font-semibold mb-2">Certificate locked</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Complete {remaining.length} more lesson{remaining.length > 1 ? "s" : ""} in {track.label} to unlock it.
        </p>
        <ul className="text-sm space-y-1 mb-4">
          {remaining.map((l) => (
            <li key={l.id}>
              <Link href={l.href} className="text-primary hover:underline">
                {l.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const finished = track.lessons
    .map((l) => progress.completed[l.id])
    .sort()
    .at(-1);
  const date = new Date(finished ?? Date.now()).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      <div className="print:hidden mb-6 flex flex-col sm:flex-row gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          placeholder="Your full name"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
        />
        <button
          onClick={() => window.print()}
          disabled={!name.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
        >
          <Printer className="size-4" /> Save as PDF
        </button>
      </div>

      <div className="certificate relative aspect-[1.414] w-full overflow-hidden rounded-xl border-4 border-double border-primary/60 bg-white text-zinc-900 p-[6%] flex flex-col items-center justify-center text-center">
        <div className="absolute inset-3 rounded-lg border border-primary/30 pointer-events-none" />
        <Award className="size-[8%] min-w-8 text-primary mb-[2%]" />
        <p className="uppercase tracking-[0.3em] text-[clamp(8px,1.6vw,14px)] text-zinc-500">
          Certificate of Completion
        </p>
        <p className="mt-[3%] text-[clamp(10px,1.8vw,16px)] text-zinc-500">This certifies that</p>
        <p className="mt-[1.5%] font-serif text-[clamp(20px,5vw,48px)] font-semibold border-b border-zinc-300 px-[6%] min-w-[50%]">
          {name.trim() || "Your Name"}
        </p>
        <p className="mt-[3%] text-[clamp(10px,1.8vw,16px)] text-zinc-600 max-w-[80%]">
          has completed all {track.lessons.length} lessons of the
        </p>
        <p className="mt-[1%] text-[clamp(14px,3vw,28px)] font-bold text-primary">{track.label} Track</p>
        <p className="mt-[1%] text-[clamp(9px,1.5vw,14px)] text-zinc-500">at AI Engineering Hub</p>
        <div className="mt-[5%] flex w-[70%] justify-between text-[clamp(8px,1.3vw,12px)] text-zinc-500">
          <span>{date}</span>
          <span>aiengineeringhub.com</span>
        </div>
      </div>
      <p className="print:hidden mt-3 text-xs text-muted-foreground text-center">
        Tip: in the print dialog choose &ldquo;Save as PDF&rdquo; and landscape orientation.
      </p>
    </div>
  );
}
