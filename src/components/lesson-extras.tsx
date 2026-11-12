import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, FlaskConical, Home, Lightbulb } from "lucide-react";

export function Breadcrumbs({ track, trackHref, title }: { track: string; trackHref: string; title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      <Link href="/" className="hover:text-foreground" aria-label="Home">
        <Home className="size-3.5" />
      </Link>
      <ChevronRight className="size-3" />
      <Link href={trackHref} className="hover:text-foreground">
        {track}
      </Link>
      <ChevronRight className="size-3" />
      <span className="text-foreground line-clamp-1">{title}</span>
    </nav>
  );
}

// Pull the "## Key Takeaways" bullets out of a lesson so they can lead the page
export function splitTakeaways(content: string): { body: string; takeaways: string[] } {
  const m = content.match(/^##\s+Key Takeaways\s*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/m);
  if (!m) return { body: content, takeaways: [] };
  const takeaways = m[1]
    .split("\n")
    .map((l) => l.match(/^\s*(?:[-*]|\d+\.)\s+(.*)$/)?.[1]?.trim())
    .filter((x): x is string => Boolean(x))
    .map((x) => x.replace(/\*\*(.+?)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1"));
  if (!takeaways.length) return { body: content, takeaways: [] };
  return { body: content.replace(m[0], ""), takeaways };
}

export function KeyTakeaways({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <aside className="not-prose my-8 rounded-2xl border border-primary/25 bg-primary/5 p-5">
      <h2 className="mb-3 flex items-center gap-2 text-base font-bold">
        <Lightbulb className="size-5 text-primary" /> Key takeaways
      </h2>
      <ul className="space-y-2">
        {items.map((t) => (
          <li key={t} className="flex gap-2 text-sm leading-relaxed">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function KeepGoing({ trackCategory }: { trackCategory: string }) {
  const items = [
    { href: "/playground", icon: FlaskConical, title: "Try it hands-on", text: "Tokenizer, embeddings and a live RAG demo." },
    { href: `/books/${trackCategory}`, icon: BookOpen, title: "Read the full track", text: "Every lesson as one printable book." },
  ];
  return (
    <div className="not-prose mt-10 grid gap-3 sm:grid-cols-2">
      {items.map((x) => (
        <Link
          key={x.href}
          href={x.href}
          className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <x.icon className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold">{x.title}</span>
            <span className="block text-xs text-muted-foreground">{x.text}</span>
          </span>
          <ArrowRight className="ml-auto mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  );
}

export function RelatedLessons({
  items,
}: {
  items: { href: string; title: string; description: string; track: string; difficulty: string }[];
}) {
  if (!items.length) return null;
  return (
    <section className="not-prose mt-12">
      <h2 className="mb-4 text-xl font-bold">Related lessons</h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((r) => (
          <Link
            key={r.href}
            href={r.href}
            className="group rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
          >
            <p className="mb-1 text-[11px] font-medium text-primary">
              {r.track} · <span className="capitalize">{r.difficulty}</span>
            </p>
            <p className="mb-1 text-sm font-semibold leading-snug line-clamp-2">{r.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{r.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
