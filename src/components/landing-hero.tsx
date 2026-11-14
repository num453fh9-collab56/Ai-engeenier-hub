import Link from "next/link";
import { ArrowRight, Bot, Boxes, Database, Flame, Link2, ListChecks, Smile, Sparkles, Trophy, Zap } from "lucide-react";
import { AgentWorkflow } from "@/components/agent-workflow";
import { HeroDemo } from "@/components/hero-demo";
import { HeroProgressCard } from "@/components/hero-progress-card";
import { Cube, Plus, Ring, Sphere } from "@/components/shapes-3d";

// Tools taught in the lessons (names only — no brand logos, no implied partnership)
const TOOLS = [
  { name: "OpenAI", icon: Sparkles, color: "text-emerald-500" },
  { name: "Claude", icon: Bot, color: "text-orange-500" },
  { name: "LangChain", icon: Link2, color: "text-teal-500" },
  { name: "Hugging Face", icon: Smile, color: "text-yellow-500" },
  { name: "Pinecone", icon: Database, color: "text-sky-500" },
  { name: "Qdrant", icon: Boxes, color: "text-rose-500" },
  { name: "Groq", icon: Zap, color: "text-amber-500" },
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

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="text-center lg:text-left animate-fade-up">
          <div className="glass-card inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-primary mb-5">
            <Sparkles className="size-3.5" />
            Free AI Engineering course · {lessonCount} lessons
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-extrabold tracking-[-0.04em] leading-[1.02] mb-5">
            Build{" "}
            <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">real AI</span>
            <br className="hidden sm:block" /> products, not just demos
          </h1>
          <p className="mx-auto lg:mx-0 max-w-md text-base sm:text-lg leading-relaxed text-muted-foreground mb-7">
            Hands-on lessons on LLMs, RAG, agents and fine-tuning — with
            playgrounds, quizzes and an AI tutor on every page.
          </p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <Link
              href="/docs/01-foundations/intro"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 ring-1 ring-white/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
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

        {/* Right column: workflow visualizer, Mubeen window, tools, feature cards */}
        <div className="relative mx-auto w-full max-w-[40rem] space-y-4 animate-fade-up [animation-delay:150ms]">
          <AgentWorkflow />

          {/* floating certificate badge */}
          <div className="glass-card absolute -right-6 top-[6.5rem] z-10 hidden items-center gap-2.5 rounded-xl px-3 py-2 shadow-lg xl:flex">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Trophy className="size-4" />
            </span>
            <span className="text-[11px] leading-tight">
              <span className="block text-xs font-semibold">Certificates</span>
              <span className="text-muted-foreground">Per track</span>
            </span>
          </div>

          {/* Mubeen window, slightly tilted in 3D on large screens */}
          <div className="lg:[perspective:1600px]">
            <div className="transition-transform duration-500 lg:[transform:rotateY(-7deg)_rotateX(3deg)] lg:hover:[transform:rotateY(-2deg)_rotateX(1deg)]">
              <HeroDemo embedded />
            </div>
          </div>

          {/* Tools pill — the tools the lessons actually teach (names only, no brand logos) */}
          <div className="relative rounded-full p-px shadow-[0_0_30px_-6px] shadow-cyan-400/50 [background:linear-gradient(90deg,var(--color-primary),#22d3ee,var(--color-primary))]">
            <ul className="no-scrollbar flex items-center gap-5 overflow-x-auto rounded-full bg-card/95 px-5 py-2.5">
              {TOOLS.map((t) => (
                <li key={t.name} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold">
                  <t.icon className={`size-4 ${t.color}`} /> {t.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Feature cards — real numbers only */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="glass-card flex flex-col gap-2 rounded-xl px-3 py-2.5">
              <span className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Trophy className="size-4" />
                </span>
                <span className="text-[11px] leading-tight">
                  <span className="block text-xs font-semibold">Certificates</span>
                  <span className="text-muted-foreground">
                    Per track · <span className="text-emerald-600 dark:text-emerald-400">Live</span>
                  </span>
                </span>
              </span>
              <span className="flex items-center gap-2.5">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500">
                  <Flame className="size-4" />
                </span>
                <span className="text-[11px] leading-tight">
                  <span className="block text-xs font-semibold">Daily streaks</span>
                  <span className="text-muted-foreground">Keep learning</span>
                </span>
              </span>
            </div>
            <HeroProgressCard lessonCount={lessonCount} />
            <div className="glass-card flex items-center gap-2.5 rounded-xl px-3 py-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
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
