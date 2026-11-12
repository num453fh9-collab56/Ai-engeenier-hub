"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Brain,
  Database,
  Network,
  Sparkles,
} from "lucide-react";

type Step = "rag-vs-finetune" | "vector-db" | "agent-framework" | "results";

interface Choice {
  id: string;
  label: string;
  description: string;
  pros: string[];
  cons: string[];
}

const ragVsFineTune: Choice[] = [
  {
    id: "rag",
    label: "RAG (Retrieval-Augmented Generation)",
    description: "Best for grounding LLMs with external, updatable knowledge",
    pros: [
      "No training required — add knowledge immediately",
      "Easy to update — swap documents, not models",
      "Transparent — citations are natural",
      "Cost-effective for large knowledge bases",
    ],
    cons: [
      "Requires retrieval infrastructure",
      "Latency from retrieval + generation",
      "Quality depends on retrieval accuracy",
    ],
  },
  {
    id: "finetune",
    label: "Fine-Tuning",
    description: "Best for teaching the model new skills, tone, or behavior",
    pros: [
      "No retrieval latency at inference",
      "Can learn complex output formats",
      "Works offline without external deps",
      "Better for task-specific behavior",
    ],
    cons: [
      "Requires labeled training data",
      "Expensive to retrain on new info",
      "Risk of catastrophic forgetting",
      "Fixed knowledge cutoff",
    ],
  },
];

const vectorDbs: Choice[] = [
  {
    id: "pinecone",
    label: "Pinecone",
    description: "Managed vector database — zero ops, high scale",
    pros: [
      "Fully managed — no infrastructure",
      "Excellent performance at scale",
      "Built-in hybrid search",
      "Serverless option available",
    ],
    cons: [
      "Vendor lock-in",
      "Higher cost at large scale",
      "Less control over internals",
    ],
  },
  {
    id: "qdrant",
    label: "Qdrant",
    description: "Open-source vector DB with rich filtering",
    pros: [
      "Self-host or cloud — flexible",
      "Advanced filtering with payload",
      "Rust-based — high performance",
      "Good multi-tenancy support",
    ],
    cons: [
      "Smaller ecosystem than Pinecone",
      "Self-hosting adds ops burden",
      "Fewer managed region options",
    ],
  },
  {
    id: "pgvector",
    label: "PGVector (PostgreSQL)",
    description: "Vector search inside existing PostgreSQL database",
    pros: [
      "No additional infrastructure",
      "Transactional + vector in one DB",
      "ACID compliance",
      "Open source and mature",
    ],
    cons: [
      "Slower at very large scale",
      "Limited index options (IVFFlat, HNSW)",
      "Not purpose-built for vectors",
    ],
  },
];

const agentFrameworks: Choice[] = [
  {
    id: "langgraph",
    label: "LangGraph",
    description: "Graph-based agent orchestration from LangChain",
    pros: [
      "Rich ecosystem of integrations",
      "Graph-based — flexible control flow",
      "Built-in persistence & streaming",
      "Active development & community",
    ],
    cons: [
      "Heavy dependency footprint",
      "Abstraction leaks under complexity",
      "Debugging can be challenging",
    ],
  },
  {
    id: "crewai",
    label: "CrewAI",
    description: "Multi-agent orchestration framework",
    pros: [
      "Simple role-based API",
      "Great for multi-agent scenarios",
      "Built-in delegation & tools",
      "Active community",
    ],
    cons: [
      "Less flexible for custom flows",
      "Newer — fewer production case studies",
      "Opinionated architecture",
    ],
  },
  {
    id: "custom",
    label: "Custom ReAct",
    description: "Build your own agent loop from scratch",
    pros: [
      "Full control — no abstractions",
      "Minimal dependencies",
      "Easy to debug and extend",
      "Best for simple, well-defined tasks",
    ],
    cons: [
      "More boilerplate to write",
      "No built-in persistence/streaming",
      "Must build observability yourself",
    ],
  },
];

const steps: { key: Step; title: string; icon: React.ReactNode }[] = [
  { key: "rag-vs-finetune", title: "RAG vs Fine-Tune", icon: <Brain className="size-4" /> },
  { key: "vector-db", title: "Vector Database", icon: <Database className="size-4" /> },
  { key: "agent-framework", title: "Agent Framework", icon: <Network className="size-4" /> },
  { key: "results", title: "Results", icon: <Sparkles className="size-4" /> },
];

function ChoiceCard({
  choice,
  selected,
  onSelect,
}: {
  choice: Choice;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full rounded-xl border-2 p-5 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/40 hover:shadow-sm"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold">{choice.label}</h3>
        {selected && (
          <div className="flex size-6 items-center justify-center rounded-full bg-primary">
            <Check className="size-3.5 text-primary-foreground" />
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-3">{choice.description}</p>

      {selected && (
        <div className="grid gap-4 sm:grid-cols-2 mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
              Pros
            </p>
            <ul className="space-y-1">
              {choice.pros.map((pro) => (
                <li
                  key={pro}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                >
                  <span className="mt-0.5 text-emerald-500">+</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-2">
              Cons
            </p>
            <ul className="space-y-1">
              {choice.cons.map((con) => (
                <li
                  key={con}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground"
                >
                  <span className="mt-0.5 text-destructive">-</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </button>
  );
}

export default function DecisionMatrix() {
  const [step, setStep] = useState<Step>("rag-vs-finetune");
  const [ragChoice, setRagChoice] = useState<string | null>(null);
  const [dbChoice, setDbChoice] = useState<string | null>(null);
  const [agentChoice, setAgentChoice] = useState<string | null>(null);

  const stepIndex = steps.findIndex((s) => s.key === step);

  function goTo(s: Step) {
    if (s === "results") {
      if (!ragChoice || !dbChoice || !agentChoice) return;
    }
    // allow navigating back freely
    if (steps.findIndex((st) => st.key === s) > stepIndex) {
      // going forward
      if (step === "rag-vs-finetune" && !ragChoice) return;
      if (step === "vector-db" && !dbChoice) return;
      if (step === "agent-framework" && !agentChoice) return;
    }
    setStep(s);
  }

  function renderChoices(
    choices: Choice[],
    selected: string | null,
    onSelect: (id: string) => void
  ) {
    return (
      <div className="space-y-3">
        {choices.map((choice) => (
          <ChoiceCard
            key={choice.id}
            choice={choice}
            selected={selected === choice.id}
            onSelect={() => onSelect(choice.id)}
          />
        ))}
      </div>
    );
  }

  function getLabel(id: string, choices: Choice[]): string {
    return choices.find((c) => c.id === id)?.label ?? id;
  }

  return (
    <div className="flex-1 px-4 py-10 max-w-3xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Decision Matrix
      </h1>
      <p className="text-muted-foreground mb-8">
        Navigate key architectural decisions for your AI application.
      </p>

      {/* Progress + Nav */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => goTo(s.key)}
              disabled={
                i > stepIndex &&
                ((step === "rag-vs-finetune" && !ragChoice) ||
                  (step === "vector-db" && !dbChoice) ||
                  (step === "agent-framework" && !agentChoice))
              }
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                s.key === step
                  ? "bg-primary text-primary-foreground"
                  : i < stepIndex ||
                      (s.key === "results" && ragChoice && dbChoice && agentChoice)
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {s.icon}
              {s.title}
            </button>
            {i < steps.length - 1 && (
              <ArrowRight className="size-3 text-muted-foreground/40" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === "rag-vs-finetune" && (
        <div>
          <h2 className="text-xl font-semibold mb-1">RAG vs Fine-Tuning</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Which approach should ground your LLM application?
          </p>
          {renderChoices(ragVsFineTune, ragChoice, setRagChoice)}
        </div>
      )}

      {step === "vector-db" && (
        <div>
          <h2 className="text-xl font-semibold mb-1">Vector Database</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Which vector store fits your infrastructure?
          </p>
          {renderChoices(vectorDbs, dbChoice, setDbChoice)}
        </div>
      )}

      {step === "agent-framework" && (
        <div>
          <h2 className="text-xl font-semibold mb-1">Agent Framework</h2>
          <p className="text-sm text-muted-foreground mb-6">
            How should you orchestrate your AI agents?
          </p>
          {renderChoices(agentFrameworks, agentChoice, setAgentChoice)}
        </div>
      )}

      {step === "results" && (
        <div>
          <h2 className="text-xl font-semibold mb-1">Your Stack</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Based on your selections, here is your recommended AI stack.
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="size-4 text-primary" />
                <span className="text-sm font-medium">Knowledge Strategy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getLabel(ragChoice ?? "", ragVsFineTune)}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <Database className="size-4 text-primary" />
                <span className="text-sm font-medium">Vector Database</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getLabel(dbChoice ?? "", vectorDbs)}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-1">
                <Network className="size-4 text-primary" />
                <span className="text-sm font-medium">Agent Framework</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {getLabel(agentChoice ?? "", agentFrameworks)}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setStep("rag-vs-finetune");
              setRagChoice(null);
              setDbChoice(null);
              setAgentChoice(null);
            }}
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Start over
          </button>
        </div>
      )}

      {/* Bottom Nav */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => {
            const idx = steps.findIndex((s) => s.key === step);
            if (idx > 0) setStep(steps[idx - 1].key);
          }}
          disabled={stepIndex === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
        >
          <ArrowLeft className="size-4" />
          Previous
        </button>

        {step !== "results" && (
          <button
            onClick={() => {
              if (step === "rag-vs-finetune" && ragChoice) setStep("vector-db");
              else if (step === "vector-db" && dbChoice) setStep("agent-framework");
              else if (step === "agent-framework" && agentChoice) setStep("results");
            }}
            disabled={
              (step === "rag-vs-finetune" && !ragChoice) ||
              (step === "vector-db" && !dbChoice) ||
              (step === "agent-framework" && !agentChoice)
            }
            className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-30"
          >
            Next
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
