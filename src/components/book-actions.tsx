"use client";

import { FileDown, Printer } from "lucide-react";

export function BookActions({ track }: { track: string }) {
  return (
    <div className="print:hidden flex flex-wrap justify-center gap-3">
      <button
        onClick={() => window.print()}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        <Printer className="size-4" /> Save as PDF
      </button>
      <a
        href={`/api/download?track=${encodeURIComponent(track)}`}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
      >
        <FileDown className="size-4" /> Download Markdown
      </a>
    </div>
  );
}
