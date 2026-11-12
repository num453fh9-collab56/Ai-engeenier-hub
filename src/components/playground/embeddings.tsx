"use client";

import { useMemo, useState } from "react";

const DIM = 512;

// Toy embedding: hashed word + character-trigram features, L2-normalised.
function embed(text: string): Float32Array {
  const v = new Float32Array(DIM);
  const clean = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ");
  const add = (f: string, w: number) => {
    let h = 2166136261;
    for (let i = 0; i < f.length; i++) h = Math.imul(h ^ f.charCodeAt(i), 16777619);
    v[(h >>> 0) % DIM] += w;
  };
  for (const word of clean.split(/\s+/).filter(Boolean)) {
    add("w:" + word, 2);
    const padded = ` ${word} `;
    for (let i = 0; i < padded.length - 2; i++) add(padded.slice(i, i + 3), 1);
  }
  let norm = 0;
  for (const x of v) norm += x * x;
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < DIM; i++) v[i] /= norm;
  return v;
}

const cosine = (a: Float32Array, b: Float32Array) => {
  let s = 0;
  for (let i = 0; i < DIM; i++) s += a[i] * b[i];
  return s;
};

export function EmbeddingsPlayground() {
  const [query, setQuery] = useState("How do I store vectors for search?");
  const [docs, setDocs] = useState(
    [
      "Vector databases store embeddings for similarity search.",
      "Pinecone and Qdrant are popular vector stores.",
      "Fine-tuning adapts a model's weights to your data.",
      "The cat sat on the warm windowsill.",
    ].join("\n")
  );

  const results = useMemo(() => {
    const q = embed(query);
    return docs
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => ({ text: d, score: cosine(q, embed(d)) }))
      .sort((a, b) => b.score - a.score);
  }, [query, docs]);

  return (
    <div className="space-y-4">
      <label className="block text-xs font-medium text-muted-foreground">
        Query
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </label>
      <label className="block text-xs font-medium text-muted-foreground">
        Documents (one per line)
        <textarea
          value={docs}
          onChange={(e) => setDocs(e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-lg border border-border bg-background p-2.5 text-sm text-foreground outline-none focus:border-primary/50"
        />
      </label>
      <div className="space-y-2">
        {results.map((r) => (
          <div key={r.text} className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0">{r.text}</span>
              <span className="font-mono text-xs text-primary shrink-0">
                {r.score.toFixed(3)}
              </span>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-500"
                style={{ width: `${Math.max(0, r.score) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Each text becomes a {DIM}-dimensional vector and is ranked by cosine
        similarity. These toy vectors (hashed words + character trigrams) only
        capture surface overlap — real embedding models also capture meaning,
        so &ldquo;car&rdquo; and &ldquo;automobile&rdquo; land close together.
      </p>
    </div>
  );
}
