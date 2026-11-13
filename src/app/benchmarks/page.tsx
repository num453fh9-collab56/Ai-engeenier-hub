import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, CheckCircle2, ExternalLink, TriangleAlert } from "lucide-react";
import { CostCalculator } from "@/components/cost-calculator";

export const metadata: Metadata = {
  title: "LLM Benchmarks: How to Compare Models",
  description:
    "What MMLU-Pro, GPQA, SWE-bench and LMArena actually measure, where to find live, up-to-date numbers, what benchmarks miss, and a cost calculator for choosing a model.",
  alternates: { canonical: "/benchmarks" },
};

// No scores are hard-coded on purpose: model rankings change every few weeks,
// so we explain the benchmarks and link to sources that keep numbers current.
const BENCHMARKS = [
  {
    name: "MMLU-Pro",
    measures: "Broad knowledge and reasoning across many subjects (10-option multiple choice).",
    useFor: "A rough sense of general knowledge.",
    caveat: "Top models score close together, so small differences mean little.",
    source: { label: "Paper (arXiv:2406.01574)", href: "https://arxiv.org/abs/2406.01574" },
  },
  {
    name: "GPQA Diamond",
    measures: "Very hard, expert-written science questions designed to resist web searching.",
    useFor: "Comparing deep reasoning of frontier models.",
    caveat: "Small question set; science-heavy, not typical app tasks.",
    source: { label: "Paper (arXiv:2311.12022)", href: "https://arxiv.org/abs/2311.12022" },
  },
  {
    name: "SWE-bench (Verified)",
    measures: "Whether a model/agent can fix real GitHub issues so the project's tests pass.",
    useFor: "Coding assistants and software agents.",
    caveat: "Results depend heavily on the agent scaffold, not just the model.",
    source: { label: "swebench.com", href: "https://www.swebench.com/" },
  },
  {
    name: "LMArena",
    measures: "Human preference: people compare two anonymous answers and vote.",
    useFor: "How pleasant and helpful a chat model feels overall.",
    caveat: "Rewards style and length; not a test of your specific task.",
    source: { label: "lmarena.ai", href: "https://lmarena.ai/" },
  },
];

const LIVE_SOURCES = [
  { name: "Artificial Analysis", what: "Independent quality index, speed (tokens/s, time to first token) and price per provider.", href: "https://artificialanalysis.ai/" },
  { name: "LMArena", what: "Live human-preference leaderboard for chat, coding and vision.", href: "https://lmarena.ai/" },
  { name: "SWE-bench", what: "Leaderboard of coding agents on real GitHub issues.", href: "https://www.swebench.com/" },
  { name: "Epoch AI Benchmarking Hub", what: "Independent runs of major benchmarks with historical trends.", href: "https://epoch.ai/benchmarks" },
];

const CHECKLIST = [
  ["Quality on YOUR task", "Run 30–50 of your real examples through each candidate and score them."],
  ["Latency", "Time to first token and tokens per second, at the p95, not just the average."],
  ["Price", "Cost per 1M input and output tokens, times your real traffic (use the calculator below)."],
  ["Context window", "Big enough for your prompts plus retrieved documents?"],
  ["Features", "Structured outputs, tool/function calling, vision, streaming."],
  ["Data & privacy", "Where data is processed, retention, and whether it's used for training."],
  ["Open-weight vs API", "Self-hosting gives control; APIs are simpler to run."],
  ["Limits & reliability", "Rate limits, uptime, and a fallback provider."],
];

export default function BenchmarksPage() {
  return (
    <div className="flex-1">
      <section className="bg-landing px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/15 mb-4">
            <BarChart3 className="size-3.5" /> Guide · updated November 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">LLM Benchmarks: How to Compare Models</h1>
          <p className="max-w-2xl text-muted-foreground">
            Model rankings change every few weeks, so instead of a table that goes stale, this page explains what the
            major benchmarks really measure, links to sources that keep numbers current, and gives you a checklist and
            calculator to choose a model for your own app.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-14 px-4 py-12">
        <section>
          <h2 className="mb-4 text-2xl font-bold">What the main benchmarks measure</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {BENCHMARKS.map((b) => (
              <div key={b.name} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-2 text-lg font-semibold">{b.name}</h3>
                <p className="mb-2 text-sm">{b.measures}</p>
                <p className="mb-2 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Useful for: </span>
                  {b.useFor}
                </p>
                <p className="mb-3 flex gap-1.5 text-sm text-amber-700 dark:text-amber-400">
                  <TriangleAlert className="mt-0.5 size-4 shrink-0" /> {b.caveat}
                </p>
                <a href={b.source.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  {b.source.label} <ExternalLink className="size-3" />
                </a>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-bold">Where to find live numbers</h2>
          <p className="mb-4 text-sm text-muted-foreground">These sources update continuously — check them before you decide.</p>
          <ul className="space-y-2">
            {LIVE_SOURCES.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
                >
                  <ExternalLink className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    <span className="block font-semibold group-hover:text-primary">{s.name}</span>
                    <span className="block text-sm text-muted-foreground">{s.what}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">What benchmarks don&apos;t tell you</h2>
          <ul className="space-y-3 text-sm leading-relaxed">
            <li><strong>Contamination:</strong> test questions can leak into training data, inflating scores.</li>
            <li><strong>Saturation:</strong> when every top model scores 90%+, the benchmark stops separating them.</li>
            <li><strong>Your task is different:</strong> a model that wins at maths may lose at your support emails or Urdu text.</li>
            <li><strong>Settings matter:</strong> prompts, tools and agent scaffolds can change results as much as the model.</li>
            <li><strong>Quality isn&apos;t everything:</strong> a slightly weaker model that is 5× cheaper and faster is often the better product choice.</li>
          </ul>
          <p className="mt-4 text-sm">
            The reliable answer is your own evaluation set — see{" "}
            <Link href="/docs/02-rag/rag-eval" className="font-medium text-primary hover:underline">RAG Evaluation</Link>{" "}
            for how to build one.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Model-choice checklist</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {CHECKLIST.map(([title, text]) => (
              <div key={title} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                <span>
                  <span className="block text-sm font-semibold">{title}</span>
                  <span className="block text-sm text-muted-foreground">{text}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-2xl font-bold">Cost calculator</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Compare two models for your traffic. Paste prices from each provider&apos;s pricing page.
          </p>
          <CostCalculator />
        </section>
      </div>
    </div>
  );
}
