"use client";

import { useEffect, useState } from "react";
import { EyeOff, Gauge, Loader2, Play, Swords, Timer, Trophy } from "lucide-react";
import { ARENA_MODELS, MODEL_PRICES } from "@/lib/model-prices";

interface Result {
  text?: string;
  error?: string;
  ms?: number;
  inputTokens?: number;
  outputTokens?: number;
  tokensPerSec?: number | null;
}

const EXAMPLES = [
  "Explain RAG to a beginner in 3 short bullet points.",
  "Write a Python function that removes duplicate emails from a list, keeping order.",
  "A train leaves at 9:40 and arrives at 13:15. How long is the trip? Show your steps.",
  "Give me 3 risks of letting an AI agent send emails on my behalf.",
];

const VOTES_KEY = "aeh-arena-votes";
type Votes = Record<string, number>;

function costPer1k(modelId: string, r: Result) {
  const p = MODEL_PRICES.find((x) => x.id === ARENA_MODELS.find((m) => m.id === modelId)?.priceId);
  if (!p || !r.inputTokens) return null;
  return ((r.inputTokens * p.input + (r.outputTokens ?? 0) * p.output) / 1_000_000) * 1000;
}

export function ModelArena() {
  const [prompt, setPrompt] = useState(EXAMPLES[0]);
  const [models, setModels] = useState<[string, string]>([ARENA_MODELS[0].id, ARENA_MODELS[1].id]);
  const [results, setResults] = useState<[Result | null, Result | null]>([null, null]);
  const [running, setRunning] = useState(false);
  const [blind, setBlind] = useState(true);
  const [voted, setVoted] = useState<null | 0 | 1 | "tie">(null);
  const [votes, setVotes] = useState<Votes>({});

  useEffect(() => {
    try {
      setVotes(JSON.parse(localStorage.getItem(VOTES_KEY) ?? "{}"));
    } catch {}
  }, []);

  const label = (id: string) => ARENA_MODELS.find((m) => m.id === id)?.label ?? id;

  async function run() {
    if (!prompt.trim() || running) return;
    setRunning(true);
    setVoted(null);
    setResults([null, null]);
    const call = (model: string): Promise<Result> =>
      fetch("/api/arena", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, model }) })
        .then(async (r) => ((await r.json().catch(() => ({}))) as Result) ?? {})
        .catch(() => ({ error: "Network error." }));
    // Both models run at the same time, so the comparison is fair
    const [a, b] = await Promise.all([call(models[0]), call(models[1])]);
    setResults([a, b]);
    setRunning(false);
  }

  function vote(v: 0 | 1 | "tie") {
    setVoted(v);
    if (v === "tie") return;
    const next = { ...votes, [models[v]]: (votes[models[v]] ?? 0) + 1 };
    setVotes(next);
    try {
      localStorage.setItem(VOTES_KEY, JSON.stringify(next));
    } catch {}
  }

  const hidden = blind && voted === null;
  const done = results[0] && results[1] && !results[0].error && !results[1].error;
  const fastest = done ? (results[0]!.ms! <= results[1]!.ms! ? 0 : 1) : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="arena-prompt">
        Your prompt
      </label>
      <textarea
        id="arena-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value.slice(0, 1000))}
        rows={3}
        className="mt-1 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary/50"
      />
      <div className="mt-2 flex flex-wrap gap-1.5">
        {EXAMPLES.map((e) => (
          <button key={e} onClick={() => setPrompt(e)} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground">
            {e.length > 42 ? e.slice(0, 40) + "…" : e}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        {([0, 1] as const).map((i) => (
          <label key={i} className="text-xs font-medium text-muted-foreground">
            Model {i === 0 ? "A" : "B"}
            <select
              value={models[i]}
              onChange={(e) => setModels((m) => (i === 0 ? [e.target.value, m[1]] : [m[0], e.target.value]))}
              className="mt-1 block rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {ARENA_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </label>
        ))}
        <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm">
          <input type="checkbox" checked={blind} onChange={() => setBlind((b) => !b)} className="size-4 accent-[var(--primary)]" />
          <EyeOff className="size-4 text-muted-foreground" /> Blind test (hide names until you vote)
        </label>
        <button
          onClick={run}
          disabled={running || !prompt.trim()}
          className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
        >
          {running ? <Loader2 className="size-4 animate-spin" /> : <Play className="size-4" />} Run both
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {([0, 1] as const).map((i) => {
          const r = results[i];
          const cost = r && !r.error ? costPer1k(models[i], r) : null;
          return (
            <div key={i} className={`flex min-h-48 flex-col rounded-xl border p-4 ${voted === i ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-border"}`}>
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">{i === 0 ? "A" : "B"}</span>
                {hidden ? "Hidden model" : label(models[i])}
                {fastest === i && <span className="ml-auto rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] text-amber-700 dark:text-amber-400">Faster</span>}
              </p>
              {running && !r ? (
                <Loader2 className="m-auto size-6 animate-spin text-muted-foreground" />
              ) : r?.error ? (
                <p className="text-sm text-rose-600">{r.error}</p>
              ) : r ? (
                <>
                  <p className="flex-1 whitespace-pre-wrap text-sm leading-relaxed">{r.text}</p>
                  <dl className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs">
                    <div>
                      <dt className="inline-flex items-center gap-1 text-muted-foreground"><Timer className="size-3" /> Latency</dt>
                      <dd className="font-semibold tabular-nums">{r.ms?.toLocaleString()} ms</dd>
                    </div>
                    <div>
                      <dt className="inline-flex items-center gap-1 text-muted-foreground"><Gauge className="size-3" /> Speed</dt>
                      <dd className="font-semibold tabular-nums">{r.tokensPerSec ? `${r.tokensPerSec} tok/s` : "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Cost / 1K runs</dt>
                      <dd className="font-semibold tabular-nums">{cost !== null ? `$${cost.toFixed(cost < 1 ? 3 : 2)}` : "—"}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p className="m-auto text-sm text-muted-foreground">Press “Run both” to see a live answer.</p>
              )}
            </div>
          );
        })}
      </div>

      {done && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {voted === null ? (
            <>
              <span className="text-sm font-medium">Which answer is better?</span>
              <button onClick={() => vote(0)} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent">A is better</button>
              <button onClick={() => vote("tie")} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent">Tie</button>
              <button onClick={() => vote(1)} className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent">B is better</button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {voted === "tie" ? "A tie" : `You picked ${label(models[voted])}`} — A was {label(models[0])}, B was {label(models[1])}.
            </p>
          )}
        </div>
      )}

      {Object.keys(votes).length > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          <Trophy className="size-3.5 text-amber-500" /> Your wins so far:
          {ARENA_MODELS.map((m) => (
            <span key={m.id}>
              {m.label} <b className="text-foreground">{votes[m.id] ?? 0}</b>
            </span>
          ))}
          <span className="ml-auto">(saved in your browser only)</span>
        </p>
      )}

      <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
        <Swords className="mt-0.5 size-3.5 shrink-0" />
        Real calls to open-weight models served by Groq. Latency is measured on our server per request (it includes network
        time); speed is output tokens ÷ generation time reported by Groq; cost uses Groq&apos;s listed prices. One run is
        a sample, not a benchmark — try several prompts.
      </p>
    </div>
  );
}
