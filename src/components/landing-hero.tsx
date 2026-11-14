import Link from "next/link";
import { ArrowRight, Bot, Boxes, Database, Flame, Link2, ListChecks, Server, Sparkles, Trophy, Zap } from "lucide-react";
import { AgentWorkflow } from "@/components/agent-workflow";
import { HeroDemo } from "@/components/hero-demo";
import { Cube, Plus, Ring, Sphere } from "@/components/shapes-3d";

// Tools taught in the lessons (names only — no brand logos, no implied partnership)
const TOOLS = [
  { name: "OpenAI API", icon: Sparkles },
  { name: "Claude", icon: Bot },
  { name: "LangChain", icon: Link2 },
  { name: "Pinecone", icon: Database },
  { name: "Qdrant", icon: Boxes },
  { name: "Groq", icon: Zap },
  { name: "vLLM", icon: Server },
];

export function LandingHero({
  lessonCount,
  trackCount,
  stats,
}: {
  lessonCount: number;
  trackCount: number;
  stats: { quizQuestions: number; projects: number; tools: number };
}) {
  return (
    <section className="bg-landing relative overflow-hidden px-4 pt-14 pb-20 sm:pt-20 sm:pb-28">
      {/* floating 3D shapes */}
      <Ring className="-left-6 top-10 opacity-90" size={120} />
      <Cube className="left-[38%] top-8 hidden md:block" size={40} delay={1.5} />
      <Sphere className="left-[44%] bottom-10 hidden md:block" size={54} delay={0.8} />
      <Plus className="right-[4%] top-24 hidden lg:block" size={46} delay={2.2} />
      <Cube className="right-[6%] bottom-12" size={52} delay={0.4} />
      <Sphere className="left-[8%] bottom-6 hidden sm:block" size={34} delay={3} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.15fr]">
        <div className="text-center lg:text-left animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-primary shadow-sm ring-1 ring-primary/15 mb-6">
            <Sparkles className="size-3.5" />
            Free AI Engineering course · {lessonCount} lessons
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-5">
            Build real{" "}
            <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
              AI products
            </span>
            , not just demos
          </h1>
          <p className="mx-auto lg:mx-0 max-w-lg text-lg text-muted-foreground mb-8">
            Hands-on lessons on LLMs, RAG, agents and fine-tuning — with
            playgrounds, quizzes and an AI tutor on every page.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <Link
              href="/docs/01-foundations/intro"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
            >
              Start learning <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-full bg-background/80 px-6 py-3 text-sm font-semibold ring-1 ring-border shadow-sm transition-transform hover:-translate-y-0.5"
            >
              Try the playground
            </Link>
          </div>
          <div className="mt-10 flex justify-center lg:justify-start gap-8 text-sm">
            {[
              [lessonCount, "lessons"],
              [trackCount, "tracks"],
              ["100%", "free"],
            ].map(([v, l]) => (
              <div key={String(l)}>
                <p className="text-2xl font-bold">{v}</p>
                <p className="text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: workflow visualizer, Mubeen on a laptop, tools, feature cards */}
        <div className="relative mx-auto w-full max-w-xl space-y-5 animate-fade-up [animation-delay:150ms]">
          <AgentWorkflow />

          <div className="laptop-tilt">
            <div className="rounded-t-2xl border-[10px] border-b-[14px] border-zinc-800 bg-zinc-800 shadow-2xl shadow-primary/25 dark:border-zinc-700 dark:bg-zinc-700">
              <div className="overflow-hidden rounded-md">
                <HeroDemo embedded />
              </div>
            </div>
            <div className="relative mx-auto h-3.5 w-[112%] -translate-x-[5.4%] rounded-b-xl bg-gradient-to-b from-zinc-300 to-zinc-400 dark:from-zinc-600 dark:to-zinc-700">
              <div className="absolute left-1/2 top-0 h-1.5 w-20 -translate-x-1/2 rounded-b-md bg-zinc-400/80 dark:bg-zinc-800" />
            </div>
          </div>

          {/* Tools strip */}
          <div className="rounded-2xl bg-gradient-to-r from-primary/30 via-cyan-400/30 to-primary/30 p-px shadow-lg shadow-primary/10">
            <div className="rounded-2xl bg-background/85 px-4 py-3 backdrop-blur-md">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Tools you&apos;ll learn</p>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {TOOLS.map((t) => (
                  <li key={t.name} className="inline-flex items-center gap-1.5 text-sm font-semibold">
                    <t.icon className="size-4 text-primary" /> {t.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Feature cards — real numbers only */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-2xl bg-background/85 p-3 shadow-md ring-1 ring-border backdrop-blur">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Trophy className="size-4" />
              </span>
              <span className="text-xs leading-tight">
                <span className="block text-sm font-semibold">Certificates</span>
                <span className="text-muted-foreground">Per track · free</span>
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-background/85 p-3 shadow-md ring-1 ring-border backdrop-blur">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500">
                <Flame className="size-4" />
              </span>
              <span className="text-xs leading-tight">
                <span className="block text-sm font-semibold">Daily streaks</span>
                <span className="text-muted-foreground">Mubeen reminds you</span>
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-background/85 p-3 shadow-md ring-1 ring-border backdrop-blur">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <ListChecks className="size-4" />
              </span>
              <span className="text-xs leading-tight">
                <span className="block text-sm font-semibold">{stats.quizQuestions} quiz questions</span>
                <span className="text-muted-foreground">
                  {stats.projects} projects · {stats.tools} tools
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
