"use client";

import { useEffect, useState } from "react";
import { Check, CheckCircle2, Circle, Copy, ExternalLink, GitBranch, Globe, MessageCircle, PartyPopper } from "lucide-react";
import { taskCount, type Capstone } from "@/lib/capstones";
import { safeUrl, setLink, toggleTask, useCapstones } from "@/lib/capstone-progress";
import { askMubeen } from "@/lib/my-stack";

/** Small progress pill for capstone cards. */
export function CapstoneProgressPill({ capstone }: { capstone: Capstone }) {
  const state = useCapstones()[capstone.slug];
  const done = state?.done.length ?? 0;
  const total = taskCount(capstone);
  if (!done) return <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">Not started</span>;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${done === total ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-primary/10 text-primary"}`}>
      {done === total ? "Completed" : `${done}/${total} tasks`}
    </span>
  );
}

function readme(c: Capstone, repo?: string, demo?: string) {
  return `# ${c.title}

${c.tagline}

## The problem
${c.brief}

## What it does
${c.youBuild.map((f) => `- ${f}`).join("\n")}

## Architecture
<!-- Add a diagram: ingestion → retrieval → LLM → UI -->

## Results
<!-- Paste your evaluation numbers here, e.g. "21/25 test questions correct, p95 latency 1.8 s, $0.002 per answer" -->
${c.rubric.map((r) => `- [ ] ${r}`).join("\n")}

## Run it
\`\`\`bash
# 1. install
# 2. set API keys in .env
# 3. ingest / start
\`\`\`

${demo ? `**Live demo:** ${demo}\n` : ""}${repo ? `**Code:** ${repo}\n` : ""}
Built as a capstone project on AI Engineering Hub.
`;
}

export function CapstoneTracker({ capstone: c }: { capstone: Capstone }) {
  const state = useCapstones()[c.slug] ?? { done: [] };
  const total = taskCount(c);
  const done = state.done.length;
  const [repo, setRepo] = useState(state.repo ?? "");
  const [demo, setDemo] = useState(state.demo ?? "");
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");

  // Saved links load after the first render (browser storage), so sync them into the inputs
  useEffect(() => {
    setRepo(state.repo ?? "");
    setDemo(state.demo ?? "");
  }, [state.repo, state.demo]);

  function saveLinks() {
    if ((repo && !safeUrl(repo)) || (demo && !safeUrl(demo))) {
      setErr("Please paste full links starting with https://");
      return;
    }
    setErr("");
    setLink(c.slug, "repo", repo);
    setLink(c.slug, "demo", demo);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">Your progress</span>
          <span className="tabular-nums text-muted-foreground">
            {done}/{total} tasks
          </span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-500 transition-all" style={{ width: `${(done / total) * 100}%` }} />
        </div>
        {done === total && (
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            <PartyPopper className="size-4" /> All milestones done — add your links below and put it in your portfolio!
          </p>
        )}
      </div>

      <ol className="space-y-4">
        {c.milestones.map((m, mi) => (
          <li key={m.title} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="mb-3 font-semibold">{m.title}</h3>
            <ul className="space-y-2">
              {m.tasks.map((t, ti) => {
                const id = `${mi}-${ti}`;
                const on = state.done.includes(id);
                return (
                  <li key={id}>
                    <button onClick={() => toggleTask(c.slug, id)} aria-pressed={on} className="flex w-full items-start gap-2.5 text-left text-sm">
                      {on ? <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" /> : <Circle className="mt-0.5 size-5 shrink-0 text-muted-foreground" />}
                      <span className={on ? "text-muted-foreground line-through" : ""}>{t}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="mb-1 font-semibold">Your project links</h3>
        <p className="mb-3 text-sm text-muted-foreground">Saved in this browser and shown on your Progress page.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1"><GitBranch className="size-3.5" /> GitHub repo</span>
            <input value={repo} onChange={(e) => setRepo(e.target.value)} onBlur={saveLinks} placeholder="https://github.com/you/project" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
          </label>
          <label className="text-xs font-medium text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Globe className="size-3.5" /> Live demo or video</span>
            <input value={demo} onChange={(e) => setDemo(e.target.value)} onBlur={saveLinks} placeholder="https://…" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50" />
          </label>
        </div>
        {err && <p className="mt-2 text-sm text-rose-600">{err}</p>}
        {(safeUrl(state.repo) || safeUrl(state.demo)) && (
          <p className="mt-3 flex flex-wrap gap-3 text-sm">
            {safeUrl(state.repo) && (
              <a href={safeUrl(state.repo)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                Open repo <ExternalLink className="size-3.5" />
              </a>
            )}
            {safeUrl(state.demo) && (
              <a href={safeUrl(state.demo)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                Open demo <ExternalLink className="size-3.5" />
              </a>
            )}
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(readme(c, safeUrl(state.repo), safeUrl(state.demo))).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copied!" : "Copy README template"}
          </button>
          <button
            onClick={() => askMubeen(`I'm building the "${c.title}" capstone. I'm on: ${c.milestones.find((m, mi) => m.tasks.some((_, ti) => !state.done.includes(`${mi}-${ti}`)))?.title ?? "the final review"}. What should I do next, step by step?`)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent"
          >
            <MessageCircle className="size-4" /> Stuck? Ask Mubeen
          </button>
        </div>
      </div>
    </div>
  );
}
