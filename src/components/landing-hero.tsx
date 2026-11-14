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
    <section className="bg-landing relative overflow-hidden px-4 pt-10 pb-14 sm:pt-12 sm:pb-16">
      {/* floating 3D shapes */}
      <Ring className="-left-6 top-10 opacity-90" size={120} />
      <Cube className="left-[38%] top-8 hidden md:block" size={40} delay={1.5} />
      <Sphere className="left-[44%] bottom-10 hidden md:block" size={54} delay={0.8} />
      <Plus className="right-[4%] top-24 hidden lg:block" size={46} delay={2.2} />
      <Cube className="right-[6%] bottom-12" size={52} delay={0.4} />
      <Sphere className="left-[8%] bottom-6 hidden sm:block" size={34} delay={3} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="text-center lg:text-left animate-fade-up">
          <div className="glass-card inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-primary mb-5">
            <Sparkles className="size-3.5" />
            Free AI Engineering course · {lessonCount} lessons
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-[-0.035em] leading-[1.04] mb-4">
            Build real{" "}
            <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              AI products
            </span>
            , not just demos
          </h1>
          <p className="mx-auto lg:mx-0 max-w-md text-base sm:text-lg leading-relaxed text-muted-foreground mb-7">
            Hands-on lessons on LLMs, RAG, agents and fine-tuning — with
            playgrounds, quizzes and an AI tutor on every page.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <Link
              href="/docs/01-foundations/intro"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 ring-1 ring-white/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
            >
              Start learning <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/playground"
              className="glass-card inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            >
              Try the playground
            </Link>
          </div>
          <div className="mt-8 flex justify-center lg:justify-start divide-x divide-border text-sm">
            {[
              [lessonCount, "lessons"],
              [trackCount, "tracks"],
              ["100%", "free"],
            ].map(([v, l]) => (
              <div key={String(l)} className="px-6 first:pl-0">
                <p className="text-2xl font-bold tracking-tight">{v}</p>
                <p className="text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: workflow visualizer, Mubeen on a laptop, tools, feature cards */}
        <div className="relative mx-auto w-full max-w-[34rem] space-y-3 animate-fade-up [animation-delay:150ms]">
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

          {/* Tools strip — one compact line */}
          <div className="glass-card flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2">
            <span className="shrink-0 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">You&apos;ll learn</span>
            <ul className="no-scrollbar flex flex-1 gap-3 overflow-x-auto">
              {TOOLS.map((t) => (
                <li key={t.name} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold">
                  <t.icon className="size-3.5 text-primary" /> {t.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Feature cards — real numbers only */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="glass-card flex items-center gap-2.5 rounded-xl px-3 py-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Trophy className="size-4" />
              </span>
              <span className="text-[11px] leading-tight">
                <span className="block text-xs font-semibold">Certificates</span>
                <span className="text-muted-foreground">Per track · free</span>
              </span>
            </div>
            <div className="glass-card flex items-center gap-2.5 rounded-xl px-3 py-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
                <Flame className="size-4" />
              </span>
              <span className="text-[11px] leading-tight">
                <span className="block text-xs font-semibold">Daily streaks</span>
                <span className="text-muted-foreground">Mubeen reminds you</span>
              </span>
            </div>
            <div className="glass-card flex items-center gap-2.5 rounded-xl px-3 py-2">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                <ListChecks className="size-4" />
              </span>
              <span className="text-[11px] leading-tight">
                <span className="block text-xs font-semibold">{stats.quizQuestions} quiz questions</span>
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
