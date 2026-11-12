"use client";

import { useState } from "react";
import {
  Brain,
  Network,
  BookOpen,
  Cpu,
  Grid3X3,
  Infinity,
} from "lucide-react";

interface PhaseCard {
  badge: string;
  badgeColor: string;
  icon: typeof Brain;
  gradient: string;
  title: string;
  description: string;
  rating: number;
  language: string;
  lessons: number;
}

const phases: PhaseCard[] = [
  {
    badge: "Python & AI Core",
    badgeColor: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    icon: Brain,
    gradient: "from-blue-600/20 to-indigo-600/10",
    title: "Phase I: Math & ML Foundations",
    description: "Linear algebra, calculus, statistics, and ML fundamentals with Python.",
    rating: 4.9,
    language: "Python",
    lessons: 34,
  },
  {
    badge: "Deep Learning",
    badgeColor: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    icon: Network,
    gradient: "from-purple-600/20 to-pink-600/10",
    title: "Phase II–IV: Deep Learning & Vision",
    description: "Neural networks, CNNs, RNNs, transformers, and computer vision.",
    rating: 4.8,
    language: "Python",
    lessons: 40,
  },
  {
    badge: "RAG Systems",
    badgeColor: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    icon: BookOpen,
    gradient: "from-emerald-600/20 to-teal-600/10",
    title: "Phase XI: Retrieval-Augmented Generation",
    description: "Hybrid search, embeddings, vector databases, and re-ranking pipelines.",
    rating: 4.9,
    language: "Python",
    lessons: 22,
  },
  {
    badge: "Autonomous Agents",
    badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: Cpu,
    gradient: "from-amber-600/20 to-orange-600/10",
    title: "Phase XV: Autonomous Systems",
    description: "ReAct agents, tool calling, multi-agent swarms, and self-improvement loops.",
    rating: 4.7,
    language: "TypeScript",
    lessons: 28,
  },
  {
    badge: "Infrastructure",
    badgeColor: "bg-cyan-500/10 text-cyan-500",
    icon: Grid3X3,
    gradient: "from-cyan-600/20 to-sky-600/10",
    title: "Phase XVII: Production Infrastructure",
    description: "MLOps, model serving, observability, and scalable AI deployments.",
    rating: 4.6,
    language: "Rust",
    lessons: 18,
  },
  {
    badge: "Safety & Alignment",
    badgeColor: "bg-rose-500/10 text-rose-500",
    icon: Infinity,
    gradient: "from-rose-600/20 to-red-600/10",
    title: "Phase XVIII: Safety & Alignment",
    description: "Constitutional AI, red-teaming, evaluations, and responsible deployment.",
    rating: 4.8,
    language: "Python",
    lessons: 16,
  },
];

export function CourseCatalog() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-3">
            Explore the Curriculum
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            20 structured phases covering everything from mathematical
            foundations to multi-agent swarms.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((phase, i) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.title}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30"
              >
                {/* Gradient Banner */}
                <div className={`relative h-28 bg-gradient-to-br ${phase.gradient}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="size-10 text-foreground/10" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${phase.badgeColor}`}>
                      {phase.badge}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                    {phase.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
                    {phase.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-amber-500 text-xs">★</span>
                    <span className="text-xs font-medium">{phase.rating}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {phase.lessons} Lessons
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-border/40 pt-3">
                    <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {phase.language}
                    </span>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {hovered === i ? "Enroll" : `${Math.round((i + 1) * 16.6)}%`}
                      </span>
                      <div className="w-12 h-1 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-300"
                          style={{
                            width: hovered === i ? "100%" : `${(i + 1) * 16.6}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
