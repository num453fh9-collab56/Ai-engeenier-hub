"use client";

import { useMemo, useState } from "react";

// GPT-style pre-tokenization, then long words are split into ~4-char
// sub-word pieces to mimic how BPE breaks rare words apart.
const PRE = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}{1,3}| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
const COMMON = new Set(
  "the of and to in is it that for on with as was are be this by an at or from not but have you we they can will all one has more if about which their so what when there use your model data".split(
    " "
  )
);

function tokenize(text: string): string[] {
  const out: string[] = [];
  for (const piece of text.match(PRE) ?? []) {
    const word = piece.trim().toLowerCase();
    if (piece.length <= 5 || COMMON.has(word)) {
      out.push(piece);
      continue;
    }
    // first chunk keeps the leading space, like real BPE tokens
    let i = 0;
    while (i < piece.length) {
      const size = i === 0 ? 5 : 4;
      out.push(piece.slice(i, i + size));
      i += size;
    }
  }
  return out;
}

const COLORS = [
  "bg-sky-500/20",
  "bg-emerald-500/20",
  "bg-amber-500/25",
  "bg-rose-500/20",
  "bg-violet-500/20",
];

export function TokenizerPlayground() {
  const [text, setText] = useState(
    "Tokenization splits text into pieces. Uncommon words like 'retrieval-augmented' get chopped into several tokens!"
  );
  const tokens = useMemo(() => tokenize(text), [text]);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        className="w-full rounded-lg border border-border bg-background p-3 text-sm outline-none focus:border-primary/50"
        placeholder="Type or paste any text…"
      />
      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          ["Tokens", tokens.length],
          ["Characters", text.length],
          ["Chars / token", tokens.length ? (text.length / tokens.length).toFixed(1) : "—"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-border bg-card p-3">
            <p className="text-xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-border bg-card p-3 font-mono text-sm leading-7 break-words">
        {tokens.map((t, i) => (
          <span
            key={i}
            className={`${COLORS[i % COLORS.length]} rounded-sm px-px whitespace-pre-wrap`}
            title={`token ${i + 1}: ${JSON.stringify(t)}`}
          >
            {t}
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {words} words → {tokens.length} tokens. This is an educational
        approximation of BPE; real tokenizers (tiktoken, SentencePiece) use a
        learned vocabulary of ~50k–200k merges, but the rule of thumb holds:
        ~4 characters ≈ 1 token in English, and rare words cost more.
      </p>
    </div>
  );
}
