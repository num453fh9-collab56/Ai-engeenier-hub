"use client";

import { useState } from "react";
import { ExternalLink, TriangleAlert } from "lucide-react";

type UseCase = "chat" | "coding" | "agents" | "rag" | "reasoning" | "vision";

interface Benchmark {
  name: string;
  area: string;
  measures: string;
  useFor: string;
  caveat: string;
  source: { label: string; href: string };
  cases: UseCase[];
}

// Descriptions only — no scores, because leaderboards change every few weeks.
const BENCHMARKS: Benchmark[] = [
  { name: "LMArena", area: "Human preference", measures: "People compare two anonymous answers and vote; votes become an Elo-style ranking.", useFor: "How helpful and pleasant a chat model feels overall.", caveat: "Rewards style and length; not a test of your specific task.", source: { label: "lmarena.ai", href: "https://lmarena.ai/" }, cases: ["chat"] },
  { name: "MMLU-Pro", area: "Knowledge", measures: "Broad knowledge and reasoning across many subjects (10-option multiple choice).", useFor: "A rough sense of general knowledge.", caveat: "Top models score close together, so small gaps mean little.", source: { label: "arXiv:2406.01574", href: "https://arxiv.org/abs/2406.01574" }, cases: ["chat", "rag"] },
  { name: "GPQA Diamond", area: "Reasoning", measures: "Very hard, expert-written science questions designed to resist web search.", useFor: "Comparing deep reasoning of frontier models.", caveat: "Small question set; science-heavy, not typical app tasks.", source: { label: "arXiv:2311.12022", href: "https://arxiv.org/abs/2311.12022" }, cases: ["reasoning"] },
  { name: "Humanity's Last Exam", area: "Reasoning", measures: "Thousands of extremely hard questions across many fields, written by subject experts.", useFor: "Seeing how far frontier models are from expert level.", caveat: "Scores are low for every model; tells you little about everyday tasks.", source: { label: "arXiv:2501.14249", href: "https://arxiv.org/abs/2501.14249" }, cases: ["reasoning"] },
  { name: "AIME", area: "Math", measures: "Problems from the American Invitational Mathematics Examination, a hard high-school competition.", useFor: "Multi-step math reasoning (often reported for reasoning models).", caveat: "Only 15 problems per exam, and past exams can leak into training data.", source: { label: "About AIME (Wikipedia)", href: "https://en.wikipedia.org/wiki/American_Invitational_Mathematics_Examination" }, cases: ["reasoning"] },
  { name: "SWE-bench Verified", area: "Coding", measures: "Whether a model or agent can fix real GitHub issues so the project's tests pass.", useFor: "Coding assistants and software agents.", caveat: "Results depend heavily on the agent scaffold, not just the model.", source: { label: "swebench.com", href: "https://www.swebench.com/" }, cases: ["coding", "agents"] },
  { name: "LiveCodeBench", area: "Coding", measures: "Coding problems collected over time from contests, so newer problems can't have been memorized.", useFor: "Code generation while avoiding contamination.", caveat: "Contest puzzles, not real-world codebases.", source: { label: "arXiv:2403.07974", href: "https://arxiv.org/abs/2403.07974" }, cases: ["coding"] },
  { name: "Terminal-Bench", area: "Agents", measures: "Whether an agent can finish real tasks in a computer terminal (setup, debugging, data work).", useFor: "Command-line and DevOps agents.", caveat: "Very sensitive to the agent harness and time limits.", source: { label: "tbench.ai", href: "https://www.tbench.ai/" }, cases: ["agents", "coding"] },
  { name: "τ-bench (tau-bench)", area: "Agents", measures: "Agents talk to a simulated user and call tools in domains like retail and airline support, following policies.", useFor: "Customer-support and tool-using agents.", caveat: "Simulated users are imperfect; domains are narrow.", source: { label: "arXiv:2406.12045", href: "https://arxiv.org/abs/2406.12045" }, cases: ["agents", "chat"] },
  { name: "BFCL", area: "Tool calling", measures: "Berkeley Function-Calling Leaderboard: can the model pick the right function and fill its arguments correctly?", useFor: "Apps that rely on function calling / structured tool use.", caveat: "Checks the call, not whether the whole task succeeded.", source: { label: "Leaderboard", href: "https://gorilla.cs.berkeley.edu/leaderboard.html" }, cases: ["agents"] },
  { name: "RULER", area: "Long context", measures: "Synthetic tasks that test whether a model really uses its full context window, not just its claimed size.", useFor: "Long-document Q&A and big-context RAG.", caveat: "Synthetic tasks; real documents can behave differently.", source: { label: "arXiv:2404.06654", href: "https://arxiv.org/abs/2404.06654" }, cases: ["rag"] },
  { name: "MMMU", area: "Multimodal", measures: "College-level questions that need both images (charts, diagrams) and text to answer.", useFor: "Vision-language apps.", caveat: "Academic images; may not reflect photos or screenshots in your app.", source: { label: "arXiv:2311.16502", href: "https://arxiv.org/abs/2311.16502" }, cases: ["vision"] },
];

const CASES: [UseCase | "all", string][] = [
  ["all", "Show all"],
  ["chat", "Chatbot / assistant"],
  ["rag", "RAG / long documents"],
  ["coding", "Coding"],
  ["agents", "Agents & tools"],
  ["reasoning", "Math & reasoning"],
  ["vision", "Images"],
];

export function BenchmarkExplorer() {
  const [uc, setUc] = useState<UseCase | "all">("all");
  const list = BENCHMARKS.filter((b) => uc === "all" || b.cases.includes(uc));

  return (
    <div>
      <p className="mb-2 text-sm font-medium">What are you building? We&apos;ll show the benchmarks that matter for it.</p>
      <div className="mb-5 flex flex-wrap gap-2">
        {CASES.map(([v, label]) => (
          <button
            key={v}
            onClick={() => setUc(v)}
            aria-pressed={uc === v}
            className={`rounded-full px-3.5 py-1.5 text-sm ${uc === v ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {list.map((b) => (
          <div key={b.name} className="flex flex-col rounded-2xl border border-border bg-card p-5">
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold">{b.name}</h3>
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">{b.area}</span>
            </div>
            <p className="mb-2 text-sm">{b.measures}</p>
            <p className="mb-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Useful for: </span>
              {b.useFor}
            </p>
            <p className="mb-3 flex gap-1.5 text-sm text-amber-700 dark:text-amber-400">
              <TriangleAlert className="mt-0.5 size-4 shrink-0" /> {b.caveat}
            </p>
            <a href={b.source.href} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              {b.source.label} <ExternalLink className="size-3" />
            </a>
          </div>
        ))}
      </div>
      {uc !== "all" && (
        <p className="mt-4 text-sm text-muted-foreground">
          Benchmarks narrow the shortlist — then test the 2–3 finalists on 30–50 of <em>your</em> real examples.
        </p>
      )}
    </div>
  );
}
