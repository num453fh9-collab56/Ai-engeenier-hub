import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, BookOpen, Briefcase, Clock, Rocket, Sparkles } from "lucide-react";
import { capstones } from "@/lib/capstones";
import { aiTools } from "@/lib/ai-tools";
import { getAllDocs } from "@/lib/mdx";
import { ToolLogo } from "@/components/tool-logo";
import { CapstoneTracker } from "@/components/capstone-tracker";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return capstones.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = capstones.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: `Capstone: ${c.title}`, description: c.tagline, alternates: { canonical: `/capstones/${c.slug}` } };
}

export default async function CapstonePage({ params }: Props) {
  const { slug } = await params;
  const c = capstones.find((x) => x.slug === slug);
  if (!c) notFound();
  const titles = Object.fromEntries(getAllDocs().map((d) => [`${d.category}/${d.slug}`, d.title]));
  const tools = c.stack.map((s) => aiTools.find((t) => t.slug === s)).filter((t) => t !== undefined);

  return (
    <div className="flex-1 pb-20">
      <section className="bg-landing px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <Link href="/capstones" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> All capstones
          </Link>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Capstone · {c.level}
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{c.title}</h1>
          <p className="mt-2 text-lg text-muted-foreground">{c.tagline}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="size-4" /> About {c.hours}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section className="rounded-2xl border-l-4 border-primary bg-primary/5 p-5">
            <h2 className="mb-2 flex items-center gap-2 font-bold">
              <Briefcase className="size-4 text-primary" /> The client brief
            </h2>
            <p className="leading-relaxed">{c.brief}</p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">What you&apos;ll build</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {c.youBuild.map((f) => (
                <li key={f} className="flex gap-2 rounded-xl border border-border bg-card p-3 text-sm">
                  <Rocket className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">Milestones</h2>
            <CapstoneTracker capstone={c} />
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">Definition of done</h2>
            <ul className="space-y-2">
              {c.rubric.map((r) => (
                <li key={r} className="flex gap-2.5 text-sm">
                  <BadgeCheck className="mt-0.5 size-5 shrink-0 text-emerald-500" /> {r}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-bold">Stretch goals</h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {c.stretch.map((s) => (
                <li key={s} className="flex gap-2">
                  <Sparkles className="mt-0.5 size-4 shrink-0 text-amber-500" /> {s}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="h-fit space-y-5 lg:sticky lg:top-20">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Finish these lessons first</h2>
            <ul className="space-y-2">
              {c.lessons.map((id) => (
                <li key={id}>
                  <Link href={`/docs/${id}`} className="flex gap-2 text-sm hover:text-primary">
                    <BookOpen className="mt-0.5 size-4 shrink-0 text-primary" /> {titles[id] ?? id}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Suggested stack</h2>
            <p className="mb-3 text-xs text-muted-foreground">Swap any of these for an alternative you prefer.</p>
            <ul className="space-y-2">
              {tools.map((t) => (
                <li key={t.slug}>
                  <Link href={`/directory/${t.slug}`} className="flex items-center gap-2.5 text-sm hover:text-primary">
                    <ToolLogo slug={t.slug} name={t.name} size={28} /> {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <h2 className="mb-1 text-sm font-semibold text-emerald-700 dark:text-emerald-400">Turning this into paid work</h2>
            <p className="text-sm text-muted-foreground">{c.freelance}</p>
            <Link href="/career#freelancing" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
              Freelancing guide →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
