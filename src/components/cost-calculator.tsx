"use client";

import { useState } from "react";

type Option = { name: string; inPrice: number; outPrice: number };

// Prices are entered by the user from each provider's pricing page —
// we deliberately ship no prices, because they change often.
export function CostCalculator() {
  const [opts, setOpts] = useState<Option[]>([
    { name: "Model A", inPrice: 0, outPrice: 0 },
    { name: "Model B", inPrice: 0, outPrice: 0 },
  ]);
  const [inTok, setInTok] = useState(1500);
  const [outTok, setOutTok] = useState(400);
  const [perDay, setPerDay] = useState(1000);

  const cost = (o: Option) => (inTok * o.inPrice + outTok * o.outPrice) / 1_000_000;
  const fmt = (n: number) => (n === 0 ? "$0" : n < 0.01 ? `$${n.toFixed(5)}` : `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
  const update = (i: number, patch: Partial<Option>) => setOpts((all) => all.map((o, j) => (j === i ? { ...o, ...patch } : o)));
  const num = (v: string) => Math.max(0, Number(v) || 0);

  const field = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50";

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="text-xs font-medium text-muted-foreground">
          Input tokens per request
          <input type="number" min={0} value={inTok} onChange={(e) => setInTok(num(e.target.value))} className={`mt-1 ${field}`} />
        </label>
        <label className="text-xs font-medium text-muted-foreground">
          Output tokens per request
          <input type="number" min={0} value={outTok} onChange={(e) => setOutTok(num(e.target.value))} className={`mt-1 ${field}`} />
        </label>
        <label className="text-xs font-medium text-muted-foreground">
          Requests per day
          <input type="number" min={0} value={perDay} onChange={(e) => setPerDay(num(e.target.value))} className={`mt-1 ${field}`} />
        </label>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {opts.map((o, i) => (
          <div key={i} className="rounded-xl border border-border p-4">
            <input value={o.name} onChange={(e) => update(i, { name: e.target.value })} aria-label="Model name" className={`mb-3 font-semibold ${field}`} />
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-muted-foreground">
                $ per 1M input tokens
                <input type="number" min={0} step="0.01" value={o.inPrice} onChange={(e) => update(i, { inPrice: num(e.target.value) })} className={`mt-1 ${field}`} />
              </label>
              <label className="text-xs text-muted-foreground">
                $ per 1M output tokens
                <input type="number" min={0} step="0.01" value={o.outPrice} onChange={(e) => update(i, { outPrice: num(e.target.value) })} className={`mt-1 ${field}`} />
              </label>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["per request", cost(o)],
                ["per day", cost(o) * perDay],
                ["per month", cost(o) * perDay * 30],
              ].map(([label, v]) => (
                <div key={label as string} className="rounded-lg bg-muted px-2 py-2">
                  <dt className="text-[11px] text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-bold">{fmt(v as number)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Enter current prices from each provider&apos;s official pricing page. Prices change often, so we don&apos;t
        pre-fill them. Cached or batched requests are often cheaper — check each provider&apos;s pricing page.
      </p>
    </div>
  );
}
