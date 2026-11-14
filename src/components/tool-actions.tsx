"use client";

import { Bookmark, BookmarkCheck, MessageCircle } from "lucide-react";
import { askMubeen, toggleInStack, useMyStack } from "@/lib/my-stack";

/** "Save to My stack" + "Ask Mubeen about this tool" buttons. */
export function ToolActions({ slug, name, compact = false }: { slug: string; name: string; compact?: boolean }) {
  const saved = useMyStack().includes(slug);
  const base = "inline-flex items-center gap-1.5 rounded-lg text-sm font-medium transition-colors";
  return (
    <>
      <button
        onClick={() => toggleInStack(slug)}
        aria-pressed={saved}
        className={`${base} px-3 py-1.5 ${saved ? "bg-amber-500/15 text-amber-700 dark:text-amber-400" : "border border-border hover:bg-accent"}`}
      >
        {saved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
        {compact ? (saved ? "Saved" : "Save") : saved ? "In My stack" : "Save to My stack"}
      </button>
      <button
        onClick={() => askMubeen(`When should I use ${name}, and what are good alternatives for a beginner AI engineer?`)}
        className={`${base} border border-border px-3 py-1.5 hover:bg-accent`}
      >
        <MessageCircle className="size-4" /> {compact ? "Ask Mubeen" : `Ask Mubeen about ${name}`}
      </button>
    </>
  );
}
