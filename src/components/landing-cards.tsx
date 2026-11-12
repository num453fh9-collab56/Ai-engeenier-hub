import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bot, Brain, Clock, Cpu, Database, type LucideIcon } from "lucide-react";
import { Cube, Sphere } from "@/components/shapes-3d";

const ICONS: Record<string, LucideIcon> = {
  "01-foundations": Brain,
  "02-rag": Database,
  "03-agents": Bot,
  "04-finetuning": Cpu,
};
const TINTS = [
  "from-sky-100 to-blue-200 dark:from-sky-950 dark:to-blue-900",
  "from-indigo-100 to-violet-200 dark:from-indigo-950 dark:to-violet-900",
  "from-cyan-100 to-sky-200 dark:from-cyan-950 dark:to-sky-900",
  "from-blue-100 to-indigo-200 dark:from-blue-950 dark:to-indigo-900",
];
const LEVEL: Record<string, string> = {
  beginner: "text-emerald-600 bg-emerald-500/10",
  intermediate: "text-amber-600 bg-amber-500/10",
  advanced: "text-rose-600 bg-rose-500/10",
};

export interface LessonCardData {
  href: string;
  title: string;
  description: string;
  category: string;
  trackLabel: string;
  difficulty: string;
  readTime: string;
  photo?: { src: string; alt: string };
}

export function LessonCard({ l, i }: { l: LessonCardData; i: number }) {
  const Icon = ICONS[l.category] ?? Brain;
  return (
    <Link
      href={l.href}
      className="group snap-start shrink-0 w-[78%] sm:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)] overflow-hidden rounded-2xl bg-card ring-1 ring-border shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className={`relative h-36 overflow-hidden bg-gradient-to-br ${TINTS[i % TINTS.length]}`}>
        {l.photo ? (
          <>
            <Image
              src={l.photo.src}
              alt={l.photo.alt}
              fill
              sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 80vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute left-3 bottom-3 flex size-9 items-center justify-center rounded-xl bg-white/90 text-primary shadow-lg">
              <Icon className="size-5" />
            </span>
          </>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-16 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-lg ring-1 ring-white/60 backdrop-blur transition-transform group-hover:scale-110 dark:bg-white/10">
                <Icon className="size-8" />
              </span>
            </div>
            <Cube className="right-4 top-4" size={22} delay={i * 0.7} />
            <Sphere className="left-5 bottom-4" size={18} delay={i * 0.5} />
          </>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-[11px]">
          <span className="font-medium text-primary">{l.trackLabel}</span>
          <span className={`rounded-full px-2 py-0.5 font-medium capitalize ${LEVEL[l.difficulty] ?? "bg-muted"}`}>
            {l.difficulty}
          </span>
        </div>
        <h3 className="font-semibold leading-snug line-clamp-2 mb-1">{l.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{l.description}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3.5" /> {l.readTime}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            Start <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function TrackCard({
  t,
  i,
}: {
  t: { category: string; label: string; count: number; href: string; topics: string[]; photo?: { src: string; alt: string } };
  i: number;
}) {
  const Icon = ICONS[t.category] ?? Brain;
  return (
    <Link
      href={t.href}
      className="group snap-start shrink-0 w-[88%] sm:w-[calc((100%-1.25rem)/2)] overflow-hidden rounded-2xl ring-1 ring-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className={`relative flex h-full flex-col sm:flex-row bg-gradient-to-br ${TINTS[(i + 1) % TINTS.length]}`}>
        <div className="relative flex h-40 sm:h-auto sm:w-2/5 items-center justify-center overflow-hidden">
          {t.photo && (
            <>
              <Image
                src={t.photo.src}
                alt={t.photo.alt}
                fill
                sizes="(min-width: 640px) 240px, 90vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/25 mix-blend-multiply" />
            </>
          )}
          {!t.photo && <Cube className="left-6 top-6" size={30} delay={i} />}
          <span className="relative flex size-20 items-center justify-center rounded-3xl bg-white/85 text-primary shadow-xl dark:bg-white/10">
            <Icon className="size-10" />
          </span>
        </div>
        <div className="flex-1 bg-card/80 p-5 backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">{t.count} lessons</p>
          <h3 className="text-xl font-bold mb-3">{t.label}</h3>
          <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
            {t.topics.slice(0, 3).map((x) => (
              <li key={x} className="truncate">• {x}</li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Explore track <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
