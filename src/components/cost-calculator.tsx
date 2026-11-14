"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { MODEL_PRICES, PRICES_CHECKED, type ModelPrice } from "@/lib/model-prices";

const PRESETS: [string, number, number][] = [
  ["Support chatbot", 1500, 300],
  ["RAG over documents", 4000, 400],
  ["Coding assistant", 8000, 1200],
  ["Summarize long reports", 20000, 800],
];

const fmt = (n: number) =>
  n === 0 ? "$0" : n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toLocaleString(undefined, { maximumFractionDigits: n < 100 ? 2 : 0 })}`;

/** Monthly cost of a workload on up to 3 models, using prices from each provider's pricing page. */
export function CostCalculator() {
  const [picked, setPicked] = useState<string[]>(["claude-haiku-5-5", "gpt-6.1-terra", "groq-gpt-oss-120b"]);
  const [inTok, setInTok] = useState(1500);
  const [outTok, setOutTok] = useState(300);
  const [perDay, setPerDay] = useState(1000);
  const [cachedPct, setCachedPct] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const num = (v: string) => Math.max(0, Number(v) || 0);
  const perRequest = (m: ModelPrice) => {
    const cached = m.cachedInput !== undefined ? (inTok * cachedPct) / 100 : 0; // only models with a cached price benefit
    return ((inTok - cached) * m.input + cached * (m.cachedInput ?? m.input) + outTok * m.output) / 1_000_000;
  };
  const rows = picked
    .map((id) => MODEL_PRICES.find((m) => m.id === id)!)
    .filter(Boolean)
    .map((m) => ({ m, monthly: perRequest(m) * perDay * 30 }));
  const max = Math.max(...rows.map((r) => r.monthly), 0.000001);
  const cheapest = rows.reduce((a, b) => (b.monthly < a.monthly ? b : a), rows[0]);

  const field = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50";

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start from a typical workload</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map(([name, i, o]) => (
          <button
            key={name}
            onClick={() => {
              setInTok(i);
              setOutTok(o);
            }}
            className={`rounded-full border px-3 py-1 text-xs ${inTok === i && outTok === o ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40"}`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {(
          [
            ["Input tokens / request", inTok, setInTok],
            ["Output tokens / request", outTok, setOutTok],
            ["Requests / day", perDay, setPerDay],
          ] as const
        ).map(([label, v, set]) => (
          <label key={label} className="text-xs font-medium text-muted-foreground">
            {label}
            <input type="number" min={0} value={v} onChange={(e) => set(num(e.target.value))} className={`mt-1 ${field}`} />
          </label>
        ))}
        <label className="text-xs font-medium text-muted-foreground">
          Cached input: {cachedPct}%
          <input type="range" min={0} max={90} step={10} value={cachedPct} onChange={(e) => setCachedPct(Number(e.target.value))} className="mt-3 w-full accent-[var(--primary)]" />
        </label>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <select
            key={i}
            value={picked[i]}
            onChange={(e) => setPicked((p) => p.map((x, j) => (j === i ? e.target.value : x)))}
            aria-label={`Model ${i + 1}`}
            className={field}
          >
            {(["OpenAI", "Anthropic", "Google", "Groq"] as const).map((prov) => (
              <optgroup key={prov} label={prov}>
                {MODEL_PRICES.filter((m) => m.provider === prov).map((m) => (
                  <option key={m.id} value={m.id}>{m.model}</option>
                ))}
              </optgroup>
            ))}
          </select>
        ))}
      </div>

      <ul className="mt-5 space-y-3">
        {rows.map(({ m, monthly }) => (
          <li key={m.id}>
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm">
              <span className="font-semibold">
                {m.model} <span className="text-xs font-normal text-muted-foreground">· {m.provider}</span>
                {cheapest?.m.id === m.id && rows.length > 1 && (
                  <span className="ml-2 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">Cheapest</span>
                )}
              </span>
              <span className="tabular-nums">
                <b>{fmt(monthly)}</b>
                <span className="text-muted-foreground"> / month · {fmt(perRequest(m))} per request</span>
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-500 transition-all" style={{ width: `${Math.max(1, (monthly / max) * 100)}%` }} />
            </div>
            {m.note && <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">{m.note}</p>}
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs text-muted-foreground">
        Prices: standard tier, USD per 1M tokens, from each provider&apos;s official pricing page on {PRICES_CHECKED}. 30-day
        month. Cached-input discounts apply only to models that list a cached price. Batch APIs, long-context surcharges
        and taxes are not included.{" "}
        <button onClick={() => setShowAll((v) => !v)} className="font-medium text-primary hover:underline">
          {showAll ? "Hide" : "Show"} all prices
        </button>
      </p>

      {showAll && (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2 pr-3">Model</th>
                <th className="py-2 pr-3">Tier</th>
                <th className="py-2 pr-3 text-right">Input</th>
                <th className="py-2 pr-3 text-right">Cached</th>
                <th className="py-2 pr-3 text-right">Output</th>
                <th className="py-2">Source</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_PRICES.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="py-2 pr-3 font-medium">
                    {m.model} <span className="text-xs text-muted-foreground">· {m.provider}</span>
                  </td>
                  <td className="py-2 pr-3 text-muted-foreground">{m.tier}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">${m.input}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">{m.cachedInput !== undefined ? `$${m.cachedInput}` : "—"}</td>
                  <td className="py-2 pr-3 text-right tabular-nums">${m.output}</td>
                  <td className="py-2">
                    <a href={m.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                      Pricing <ExternalLink className="size-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
