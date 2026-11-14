import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, Clock, Hammer, ListChecks, Trophy } from "lucide-react";
import { capstones, taskCount } from "@/lib/capstones";
import { CapstoneProgressPill } from "@/components/capstone-tracker";
import { Cube, Ring } from "@/components/shapes-3d";

export const metadata: Metadata = {
  title: "Capstone Projects — build portfolio-grade AI apps",
  description: "Three real-world AI projects with briefs, milestones and a rubric: a document Q&A assistant, a customer-support agent and a multi-agent research tool.",
  alternates: { canonical: "/capstones" },
};

const STEPS = [
  { icon: ListChecks, title: "Follow the milestones", text: "Each project is split into 5 milestones with clear tasks. Tick them off — your progress is saved." },
  { icon: Hammer, title: "Build it yourself", text: "You write the code, using the lessons and tools linked on each project. Stuck? Ask Mubeen." },
  { icon: Trophy, title: "Pass the rubric", text: "\"Done\" means every acceptance criterion is true — the same bar a client would set." },
  { icon: Briefcase, title: "Show it off", text: "Add your GitHub and demo links, copy the README template, and put it in your portfolio." },
];

export default function CapstonesPage() {
  return (
    <div className="flex-1 pb-20">
      <section className="bg-landing relative overflow-hidden px-4 py-14">
        <Ring className="-right-6 top-6" size={110} />
        <Cube className="left-[6%] bottom-6 hidden sm:block" size={36} delay={1} />
        <div className="relative mx-auto max-w-5xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Capstone projects</p>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-5xl">Build proof, not just knowledge</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Lessons teach the skills. Capstones are where you prove them: three real-world projects written like client
            briefs, with milestones and a rubric — the kind of work that gets you hired or paid.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-border bg-card p-4">
              <s.icon className="mb-2 size-5 text-primary" />
              <p className="text-sm font-semibold">
                {i + 1}. {s.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="grid gap-5 lg:grid-cols-3">
          {capstones.map((c) => (
            <Link
              key={c.slug}
              href={`/capstones/${c.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.level === "Advanced" ? "bg-rose-500/10 text-rose-700 dark:text-rose-300" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"}`}>
                  {c.level}
                </span>
                <CapstoneProgressPill capstone={c} />
              </div>
              <h2 className="text-xl font-bold group-hover:text-primary">{c.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm">
                {c.youBuild.slice(0, 3).map((f) => (
                  <li key={f} className="flex gap-2">
                    <span className="text-primary">•</span> {f}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" /> {c.hours} · {taskCount(c)} tasks
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-primary">
                  Open brief <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
          <p className="font-semibold">Not sure which job these projects lead to?</p>
          <p className="mt-1 text-sm text-muted-foreground">The career guide shows the roles, a 90-day plan and how to find your first paid AI work.</p>
          <Link href="/career" className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Read the career guide <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
