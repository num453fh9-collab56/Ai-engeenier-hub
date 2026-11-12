"use client";

import { useState } from "react";
import { Binary, Waypoints, DatabaseZap } from "lucide-react";
import { TokenizerPlayground } from "./tokenizer";
import { EmbeddingsPlayground } from "./embeddings";
import { RagPlayground, type Chunk } from "./rag";

const tabs = [
  { id: "tokenizer", label: "Tokenizer", icon: Binary, blurb: "How LLMs read text" },
  { id: "embeddings", label: "Embeddings", icon: Waypoints, blurb: "Similarity as geometry" },
  { id: "rag", label: "RAG", icon: DatabaseZap, blurb: "Retrieve, then generate" },
] as const;

export function PlaygroundTabs({ chunks }: { chunks: Chunk[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("tokenizer");

  return (
    <div>
      <div role="tablist" className="grid grid-cols-3 gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={active === t.id}
            onClick={() => setActive(t.id)}
            className={`rounded-xl border p-3 text-left transition-colors ${
              active === t.id
                ? "border-primary/50 bg-primary/10"
                : "border-border bg-card hover:border-primary/30"
            }`}
          >
            <t.icon className={`size-4 mb-1.5 ${active === t.id ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-sm font-semibold">{t.label}</p>
            <p className="hidden sm:block text-xs text-muted-foreground">{t.blurb}</p>
          </button>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card/50 p-4 sm:p-6">
        {active === "tokenizer" && <TokenizerPlayground />}
        {active === "embeddings" && <EmbeddingsPlayground />}
        {active === "rag" && <RagPlayground chunks={chunks} />}
      </div>
    </div>
  );
}
