"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Search, Sparkles } from "lucide-react";

export interface Chunk {
  id: string;
  title: string;
  heading: string;
  href: string;
  text: string;
}

const STOP = new Set(
  "a an the and or of to in on for is are was be it this that with as by at from how what why when do does i you we can".split(" ")
);
const terms = (s: string) =>
  s.toLowerCase().match(/[\p{L}\p{N}]+/gu)?.filter((w) => w.length > 1 && !STOP.has(w)) ?? [];

// Classic BM25 lexical retrieval
function buildIndex(chunks: Chunk[]) {
  const docs = chunks.map((c) => terms(`${c.title} ${c.heading} ${c.text}`));
  const df = new Map<string, number>();
  for (const d of docs) for (const t of new Set(d)) df.set(t, (df.get(t) ?? 0) + 1);
  const avg = docs.reduce((s, d) => s + d.length, 0) / (docs.length || 1);
  const N = docs.length;
  return (query: string, k = 3) => {
    const q = terms(query);
    return docs
      .map((d, i) => {
        let score = 0;
        for (const t of q) {
          const f = d.filter((x) => x === t).length;
          if (!f) continue;
          const n = df.get(t) ?? 0;
          const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
          score += (idf * f * 2.2) / (f + 1.2 * (0.25 + 0.75 * (d.length / avg)));
        }
        return { chunk: chunks[i], score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  };
}

const examples = ["What is HNSW indexing?", "How does the ReAct loop work?", "When should I use LoRA?"];

export function RagPlayground({ chunks }: { chunks: Chunk[] }) {
  const search = useMemo(() => buildIndex(chunks), [chunks]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ReturnType<typeof search>>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [asked, setAsked] = useState(false);
  const requestId = useRef(0); // only the latest search may update the answer

  async function run(q: string) {
    if (!q.trim()) return;
    const id = ++requestId.current;
    setQuery(q);
    setAsked(true);
    const hits = search(q);
    setResults(hits);
    setAnswer("");
    setLoading(false);
    if (!hits.length) return;
    setLoading(true);
    let reply = "";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: q }],
          context: hits
            .map((h, i) => `[${i + 1}] ${h.chunk.title} — ${h.chunk.heading}\n${h.chunk.text}`)
            .join("\n\n"),
        }),
      });
      if (res.ok) reply = (await res.json()).message ?? "";
      else if (res.status === 429) reply = (await res.json()).error ?? ""; // rate-limit message from Mubeen
    } catch {}
    if (id !== requestId.current) return; // a newer search started — drop this stale answer
    setLoading(false);
    setAnswer(
      reply ||
        "The generator model is offline right now, so this demo stops after retrieval. The sources above are exactly what would be sent to the LLM as context."
    );
  }

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(query);
        }}
        className="flex gap-2"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Ask about the ${chunks.length} indexed lesson chunks…`}
          className="flex-1 min-w-0 rounded-lg border border-border bg-background p-2.5 text-sm outline-none focus:border-primary/50"
        />
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
          <Search className="size-4" />
          <span className="hidden sm:inline">Retrieve</span>
        </button>
      </form>
      <div className="flex flex-wrap gap-2">
        {examples.map((e) => (
          <button
            key={e}
            onClick={() => run(e)}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground"
          >
            {e}
          </button>
        ))}
      </div>

      {asked && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              1 · Retrieved (BM25 top-3)
            </p>
            {results.length === 0 && (
              <p className="text-sm text-muted-foreground">No matching chunks — try other keywords.</p>
            )}
            {results.map((r, i) => (
              <Link
                key={r.chunk.id}
                href={r.chunk.href}
                className="block rounded-lg border border-border bg-card p-3 hover:border-primary/40"
              >
                <div className="flex justify-between gap-2 text-xs">
                  <span className="font-medium text-primary">
                    [{i + 1}] {r.chunk.title}
                  </span>
                  <span className="font-mono text-muted-foreground">{r.score.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{r.chunk.heading}</p>
                <p className="mt-1.5 text-sm line-clamp-3">{r.chunk.text}</p>
              </Link>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              2 · Generated answer
            </p>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm whitespace-pre-wrap min-h-24">
              {loading ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : answer ? (
                <>
                  <Sparkles className="inline size-3.5 text-primary mr-1" />
                  {answer}
                </>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
