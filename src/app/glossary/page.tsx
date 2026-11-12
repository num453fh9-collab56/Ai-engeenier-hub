import { glossary } from "@/lib/glossary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Glossary",
  description: "Core AI Engineering terminology — 30+ definitions covering LLMs, RAG, agents, MLOps, and more.",
};


export default function GlossaryPage() {
  return (
    <div className="flex flex-col flex-1">
      <section className="px-4 py-12 border-b border-border/40">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">AI Engineering Glossary</h1>
          <p className="text-muted-foreground">
            {glossary.length} core terms defined — from attention mechanisms to vector databases.
          </p>
        </div>
      </section>
      <section className="px-4 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-3">
            {glossary.map((entry) => (
              <div
                key={entry.term}
                className="rounded-lg border border-border/60 bg-card px-4 py-3.5 transition-colors hover:border-primary/20"
              >
                <h3 className="text-sm font-semibold mb-0.5">{entry.term}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {entry.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
