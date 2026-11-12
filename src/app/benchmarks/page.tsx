"use client";

import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Cpu,
  DollarSign,
  Gauge,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LlmModel {
  name: string;
  provider: string;
  architecture: string;
  contextWindow: number;
  latencyMs: number;
  costPer1kInput: number;
  costPer1kOutput: number;
  mmlu: number;
  category: "frontier" | "open" | "specialized";
}

const models: LlmModel[] = [
  {
    name: "GPT-4o",
    provider: "OpenAI",
    architecture: "Transformer (Dense)",
    contextWindow: 128000,
    latencyMs: 800,
    costPer1kInput: 0.0025,
    costPer1kOutput: 0.01,
    mmlu: 88.7,
    category: "frontier",
  },
  {
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    architecture: "Transformer (Dense)",
    contextWindow: 200000,
    latencyMs: 950,
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    mmlu: 89.3,
    category: "frontier",
  },
  {
    name: "Llama 3.3 70B",
    provider: "Meta AI",
    architecture: "Transformer (Dense)",
    contextWindow: 128000,
    latencyMs: 600,
    costPer1kInput: 0.0009,
    costPer1kOutput: 0.0009,
    mmlu: 86.1,
    category: "open",
  },
  {
    name: "DeepSeek R1",
    provider: "DeepSeek",
    architecture: "MoE (Mixture of Experts)",
    contextWindow: 128000,
    latencyMs: 1200,
    costPer1kInput: 0.0005,
    costPer1kOutput: 0.0025,
    mmlu: 84.5,
    category: "specialized",
  },
  {
    name: "Gemini 1.5 Pro",
    provider: "Google",
    architecture: "Transformer (MoE)",
    contextWindow: 2000000,
    latencyMs: 700,
    costPer1kInput: 0.00125,
    costPer1kOutput: 0.005,
    mmlu: 87.2,
    category: "frontier",
  },
  {
    name: "Mistral Large 2",
    provider: "Mistral AI",
    architecture: "Transformer (Dense)",
    contextWindow: 128000,
    latencyMs: 550,
    costPer1kInput: 0.002,
    costPer1kOutput: 0.006,
    mmlu: 84.0,
    category: "open",
  },
  {
    name: "Groq Llama 3.3",
    provider: "Groq",
    architecture: "Transformer (LPU)",
    contextWindow: 128000,
    latencyMs: 150,
    costPer1kInput: 0.00059,
    costPer1kOutput: 0.00079,
    mmlu: 86.1,
    category: "specialized",
  },
];

type SortKey = keyof LlmModel;
type SortDir = "asc" | "desc";

const columns: { key: SortKey; label: string; icon: React.ReactNode; format?: (v: unknown) => string }[] = [
  { key: "name", label: "Model", icon: <Cpu className="size-3.5" /> },
  { key: "provider", label: "Provider", icon: null },
  { key: "architecture", label: "Architecture", icon: <Layers className="size-3.5" /> },
  { key: "contextWindow", label: "Context", icon: null, format: (v) => `${(v as number).toLocaleString()} tokens` },
  { key: "latencyMs", label: "Latency", icon: <Gauge className="size-3.5" />, format: (v) => `${v}ms` },
  { key: "costPer1kInput", label: "Cost (Input)", icon: <DollarSign className="size-3.5" />, format: (v) => `$${(v as number).toFixed(4)}/1k` },
  { key: "costPer1kOutput", label: "Cost (Output)", icon: <DollarSign className="size-3.5" />, format: (v) => `$${(v as number).toFixed(4)}/1k` },
  { key: "mmlu", label: "MMLU", icon: null, format: (v) => `${v}%` },
];

const categoryLabels: Record<string, string> = {
  frontier: "Frontier",
  open: "Open Source",
  specialized: "Specialized / Fast",
};

export default function BenchmarksPage() {
  const [sortKey, setSortKey] = useState<SortKey>("mmlu");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const sorted = useMemo(() => {
    let filtered = [...models];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.provider.toLowerCase().includes(q) ||
          m.architecture.toLowerCase().includes(q)
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((m) => m.category === filterCategory);
    }

    filtered.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

    return filtered;
  }, [sortKey, sortDir, search, filterCategory]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  return (
    <div className="flex-1 px-4 py-10 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        LLM Benchmarks
      </h1>
      <p className="text-muted-foreground mb-8">
        Compare latency, cost, context window, and performance across leading
        AI models. Click column headers to sort.
      </p>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search models..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2">
          {["all", "frontier", "open", "specialized"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                filterCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {cat === "all" ? "All" : categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    {col.icon}
                    <span>{col.label}</span>
                    {sortKey === col.key ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="size-3 text-primary" />
                      ) : (
                        <ArrowDown className="size-3 text-primary" />
                      )
                    ) : (
                      <ArrowUpDown className="size-3 opacity-30" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((model) => (
              <tr
                key={model.name}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold">{model.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {model.provider}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {model.provider}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs max-w-[160px]">
                  {model.architecture}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {model.contextWindow.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: `${Math.min(100, (model.latencyMs / 1200) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs">{model.latencyMs}ms</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  ${model.costPer1kInput.toFixed(4)}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  ${model.costPer1kOutput.toFixed(4)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{model.mmlu}%</span>
                    <div className="w-12 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${model.mmlu}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sorted.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No models match your search.
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Data sourced from public benchmarks and provider pricing pages.
        Latency varies by provider, endpoint, and load.
        Last updated July 2026.
      </p>
    </div>
  );
}
