import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeDollarSign, BookOpen, ExternalLink, Gift, GitCompare, Scale, Star } from "lucide-react";
import { aiTools } from "@/lib/ai-tools";
import { PRICING_CHECKED, TOOL_PRICING } from "@/lib/ai-tools-pricing";
import { getAllDocs } from "@/lib/mdx";
import { ToolLogo } from "@/components/tool-logo";
import { ToolActions } from "@/components/tool-actions";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return aiTools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = aiTools.find((x) => x.slug === slug);
  if (!t) return {};
  return {
    title: `${t.name} — free tier, pricing & alternatives`,
    description: `${t.tagline}. What ${t.name} costs, what the free tier includes, when to use it and the best alternatives.`,
    alternates: { canonical: `/directory/${t.slug}` },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const t = aiTools.find((x) => x.slug === slug);
  if (!t) notFound();
  const p = TOOL_PRICING[t.slug];
  const titles = Object.fromEntries(getAllDocs().map((d) => [`${d.category}/${d.slug}`, d.title]));
  const alternatives = aiTools.filter((x) => x.category === t.category && x.slug !== t.slug);
  const compareHref = `/directory?compare=${[t.slug, ...alternatives.slice(0, 2).map((a) => a.slug)].join(",")}`;

  const facts: [string, string][] = [
    ["Category", t.category],
    ["Pricing", t.pricing],
    ["Open source", t.openSource ? "Yes" : "No"],
    ["License", p?.license ?? "Proprietary"],
    ["Runs on", t.deploy.join(", ")],
    ["Languages", t.languages.join(", ")],
  ];

  return (
    <div className="flex-1 pb-20">
      <section className="bg-landing px-4 py-10">
        <div className="mx-auto max-w-5xl">
          <Link href="/directory" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> All tools
          </Link>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ToolLogo slug={t.slug} name={t.name} size={84} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{t.category}</p>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t.name}</h1>
              <p className="mt-1 text-lg text-muted-foreground">{t.tagline}</p>
              {p?.stars && (
                <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="size-4 fill-amber-400 text-amber-400" /> {p.stars} GitHub stars
                </p>
              )}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground"
            >
              Visit website <ExternalLink className="size-3.5" />
            </a>
            <ToolActions slug={t.slug} name={t.name} />
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <section>
            <h2 className="mb-2 text-xl font-bold">What it is</h2>
            <p className="leading-relaxed">{t.description}</p>
            <p className="mt-3">
              <span className="font-semibold">Best for: </span>
              <span className="text-muted-foreground">{t.bestFor}</span>
            </p>
          </section>

          {p && (
            <section>
              <h2 className="mb-3 text-xl font-bold">Free tier &amp; pricing</h2>
              <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] p-5">
                <p className="flex gap-2.5">
                  <Gift className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">Free: </span>
                    {p.free}
                  </span>
                </p>
                <p className="mt-3 flex gap-2.5">
                  <BadgeDollarSign className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <span className="font-semibold">Paid: </span>
                    <span className="text-muted-foreground">{p.paid ?? "Nothing to pay for the software itself — you only pay for the hardware you run it on."}</span>
                  </span>
                </p>
                <a
                  href={p.pricingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  Checked {PRICING_CHECKED} — verify on the official page <ExternalLink className="size-3.5" />
                </a>
              </div>
            </section>
          )}

          {t.lessons?.length ? (
            <section>
              <h2 className="mb-3 text-xl font-bold">Learn it in a lesson</h2>
              <ul className="space-y-2">
                {t.lessons.map((id) => (
                  <li key={id}>
                    <Link
                      href={`/docs/${id}`}
                      className="flex items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      <BookOpen className="size-5 shrink-0 text-primary" />
                      <span className="font-medium">{titles[id] ?? id}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {alternatives.length > 0 && (
            <section>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold">Alternatives to {t.name}</h2>
                <Link href={compareHref} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  <GitCompare className="size-4" /> Compare side by side
                </Link>
              </div>
              <ul className="grid gap-3 sm:grid-cols-2">
                {alternatives.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/directory/${a.slug}`}
                      className="flex h-full gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40"
                    >
                      <ToolLogo slug={a.slug} name={a.name} size={40} />
                      <span className="min-w-0">
                        <span className="block font-semibold">{a.name}</span>
                        <span className="line-clamp-2 text-xs text-muted-foreground">{TOOL_PRICING[a.slug]?.free ?? a.tagline}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-20">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">At a glance</h2>
          <dl className="space-y-3 text-sm">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted-foreground">{k}</dt>
                <dd className="font-medium">
                  {k === "License" ? (
                    <span className="inline-flex items-center gap-1">
                      <Scale className="size-3.5" /> {v}
                    </span>
                  ) : (
                    v
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
}
