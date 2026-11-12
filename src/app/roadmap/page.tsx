import type { Metadata } from "next";
import { Route } from "lucide-react";
import { getLearningPath } from "@/lib/learning-path";
import { CurriculumRoadmap } from "@/components/curriculum-roadmap";

export const metadata: Metadata = {
  title: "The AI Engineer Path — Roadmap",
  description:
    "A focused, step-by-step path to becoming an AI engineer: LLM foundations, RAG, agents, fine-tuning, production and safety — with every live and planned lesson clearly marked.",
  alternates: { canonical: "/roadmap" },
};

export default function RoadmapPage() {
  const phases = getLearningPath();
  const live = phases.reduce((n, p) => n + p.liveCount, 0);
  const planned = phases.reduce((n, p) => n + p.items.length - p.liveCount, 0);

  return (
    <div className="flex-1 w-full px-4 py-12">
      <div className="mx-auto max-w-4xl mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
          <Route className="size-3.5" /> Roadmap
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">The AI Engineer Path</h1>
        <p className="text-muted-foreground max-w-2xl">
          {`Follow the phases in order — each builds on the last. ${phases.length} phases, ${live} lessons live and ${planned} planned. `}
          Live lessons open with a click; planned ones are marked &ldquo;Coming soon&rdquo; so you always know exactly
          what&apos;s available.
        </p>
      </div>
      <CurriculumRoadmap phases={phases} allOpen showHeader={false} />
    </div>
  );
}
