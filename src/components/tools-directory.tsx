"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BadgeDollarSign, Check, ExternalLink, Gift, GitCompare, Link2, Scale, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { aiTools, TOOL_CATEGORIES, type AiTool, type Pricing } from "@/lib/ai-tools";
import { PRICING_CHECKED, TOOL_PRICING } from "@/lib/ai-tools-pricing";
import { useMyStack } from "@/lib/my-stack";
import { ToolLogo } from "@/components/tool-logo";
import { ToolActions } from "@/components/tool-actions";

const PRICING: Pricing[] = ["Open source", "Free tier", "Paid"];
function Logo({ tool, size = 56 }: { tool: AiTool; size?: number }) {
  return <ToolLogo slug={tool.slug} name={tool.name} size={size} />;
}

const freeToStart = (t: AiTool) => !TOOL_PRICING[t.slug]?.free.startsWith("No free");

const starsNum = (t: AiTool) => {
  const s = TOOL_PRICING[t.slug]?.stars;
  return s ? parseFloat(s) * (s.endsWith("k") ? 1000 : 1) : 0;
};

const pricingStyle: Record<Pricing, string> = {
  "Open source": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  "Free tier": "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  Paid: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

export function ToolsDirectory({ lessonTitles }: { lessonTitles: Record<string, string> }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [selfHost, setSelfHost] = useState(false);
  const [freeOnly, setFreeOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [copied, setCopied] = useState(false);
  const myStack = useMyStack();
  const [sort, setSort] = useState<"az" | "category" | "stars">("category");
  const [compare, setCompare] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  // Accessible modal: focus moves in, Tab stays inside, Escape closes,
  // and focus returns to the button that opened it.
  useEffect(() => {
    if (!showCompare) return;
    const dialog = dialogRef.current;
    const opener = openerRef.current;
    const focusables = () =>
      Array.from(dialog?.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])') ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCompare(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [showCompare]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Shareable URLs: read filters from ?q=&cat=&compare= once, then keep the URL in sync.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("q")) setQ(sp.get("q")!);
    const c = sp.get("cat");
    if (c && (TOOL_CATEGORIES as readonly string[]).includes(c)) setCat(c);
    const cmp = (sp.get("compare") ?? "").split(",").filter((x) => aiTools.some((t) => t.slug === x)).slice(0, 3);
    if (cmp.length) {
      setCompare(cmp);
      if (cmp.length > 1) setShowCompare(true);
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (cat !== "All") sp.set("cat", cat);
    if (compare.length) sp.set("compare", compare.join(","));
    const qs = sp.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [ready, q, cat, compare]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: aiTools.length };
    for (const t of aiTools) c[t.category] = (c[t.category] ?? 0) + 1;
    return c;
  }, []);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return aiTools
      .filter((t) => cat === "All" || t.category === cat)
      .filter((t) => !pricing.length || pricing.includes(t.pricing))
      .filter((t) => !selfHost || t.deploy.some((d) => d !== "Cloud"))
      .filter((t) => !freeOnly || freeToStart(t))
      .filter((t) => !savedOnly || myStack.includes(t.slug))
      .filter(
        (t) =>
          !s ||
          [t.name, t.tagline, t.description, t.category, t.bestFor, ...t.languages].join(" ").toLowerCase().includes(s)
      )
      .sort((a, b) =>
        sort === "stars"
          ? starsNum(b) - starsNum(a)
          : sort === "az"
          ? a.name.localeCompare(b.name)
          : TOOL_CATEGORIES.indexOf(a.category as never) - TOOL_CATEGORIES.indexOf(b.category as never) ||
            a.name.localeCompare(b.name)
      );
  }, [q, cat, pricing, selfHost, freeOnly, savedOnly, myStack, sort]);

  const toggleCompare = (slug: string) =>
    setCompare((c) => (c.includes(slug) ? c.filter((x) => x !== slug) : c.length >= 3 ? c : [...c, slug]));
  const compared = compare.map((s) => aiTools.find((t) => t.slug === s)!).filter(Boolean);

  const filters = (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</p>
        <ul className="space-y-0.5">
          {["All", ...TOOL_CATEGORIES].map((c) => (
            <li key={c}>
              <button
                onClick={() => setCat(c)}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm ${
                  cat === c ? "bg-primary/10 font-medium text-primary" : "hover:bg-accent"
                }`}
              >
                <span>{c === "All" ? "All tools" : c}</span>
                <span className="text-xs text-muted-foreground">{counts[c] ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pricing</p>
        {PRICING.map((p) => (
          <label key={p} className="flex cursor-pointer items-center gap-2 py-1 text-sm">
            <input
              type="checkbox"
              checked={pricing.includes(p)}
              onChange={() => setPricing((x) => (x.includes(p) ? x.filter((y) => y !== p) : [...x, p]))}
              className="size-4 accent-[var(--primary)]"
            />
            {p}
          </label>
        ))}
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deployment</p>
        <label className="flex cursor-pointer items-center gap-2 py-1 text-sm">
          <input type="checkbox" checked={selfHost} onChange={() => setSelfHost((v) => !v)} className="size-4 accent-[var(--primary)]" />
          Can run locally / self-host
        </label>
        <label className="flex cursor-pointer items-center gap-2 py-1 text-sm">
          <input type="checkbox" checked={freeOnly} onChange={() => setFreeOnly((v) => !v)} className="size-4 accent-[var(--primary)]" />
          Free to start
        </label>
      </div>
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">My stack</p>
        <label className="flex cursor-pointer items-center gap-2 py-1 text-sm">
          <input type="checkbox" checked={savedOnly} onChange={() => setSavedOnly((v) => !v)} className="size-4 accent-[var(--primary)]" />
          Show only saved ({myStack.length})
        </label>
      </div>
    </div>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
      {/* Filters */}
      <aside className="hidden lg:block">
        <div className="sticky top-20">{filters}</div>
      </aside>

      <div className="min-w-0">
        <div className="mb-4 flex flex-col sm:flex-row gap-3">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search tools, e.g. 'vector', 'TypeScript', 'agents'…"
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary/50"
            />
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltersOpen((v) => !v)}
              className="lg:hidden inline-flex items-center gap-1.5 rounded-lg border border-border px-3 text-sm"
            >
              <SlidersHorizontal className="size-4" /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as "az" | "category" | "stars")}
              aria-label="Sort"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="category">Sort: Category</option>
              <option value="az">Sort: A–Z</option>
              <option value="stars">Sort: GitHub stars</option>
            </select>
          </div>
        </div>
        {filtersOpen && <div className="lg:hidden mb-4 rounded-xl border border-border p-4">{filters}</div>}

        <p className="mb-3 text-sm text-muted-foreground">
          {list.length} tool{list.length === 1 ? "" : "s"}
          {cat !== "All" && ` in ${cat}`} · select up to 3 to compare
        </p>

        <ul className="space-y-4">
          {list.map((t) => {
            const picked = compare.includes(t.slug);
            return (
              <li key={t.slug} className={`rounded-2xl border bg-card p-4 sm:p-5 transition-colors ${picked ? "border-primary/60" : "border-border"}`}>
                <div className="flex gap-4">
                  <Logo tool={t} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold leading-tight">
                          <Link href={`/directory/${t.slug}`} className="hover:text-primary hover:underline">{t.name}</Link>
                        </h3>
                        <p className="text-sm text-muted-foreground">{t.tagline}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${pricingStyle[t.pricing]}`}>{t.pricing}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{t.description}</p>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Best for: </span>
                      <span className="text-muted-foreground">{t.bestFor}</span>
                    </p>
                    {TOOL_PRICING[t.slug] && <PricingBox slug={t.slug} />}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="rounded-md bg-muted px-2 py-0.5 text-xs">{t.category}</span>
                      {t.deploy.map((d) => (
                        <span key={d} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{d}</span>
                      ))}
                      {t.languages.slice(0, 3).map((l) => (
                        <span key={l} className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">{l}</span>
                      ))}
                    </div>
                    {t.lessons?.length ? (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Learn it:{" "}
                        {t.lessons.map((id, i) => (
                          <span key={id}>
                            {i > 0 && " · "}
                            <Link href={`/docs/${id}`} className="text-primary hover:underline">
                              {lessonTitles[id] ?? id}
                            </Link>
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-border pt-3">
                  <ToolActions slug={t.slug} name={t.name} compact />
                  <Link href={`/directory/${t.slug}`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-accent">
                    Details
                  </Link>
                  <button
                    onClick={() => toggleCompare(t.slug)}
                    disabled={!picked && compare.length >= 3}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-40 ${
                      picked ? "bg-primary/10 text-primary" : "border border-border hover:bg-accent"
                    }`}
                  >
                    {picked ? <Check className="size-4" /> : <GitCompare className="size-4" />}
                    {picked ? "Added" : "Compare"}
                  </button>
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
                  >
                    Visit website <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </li>
            );
          })}
          {!list.length && (
            <li className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              No tools match these filters.
            </li>
          )}
        </ul>
      </div>

      {/* Compare tray */}
      {compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
            <div className="flex flex-1 items-center gap-2 overflow-x-auto">
              {compared.map((t) => (
                <span key={t.slug} className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-muted py-1 pl-1 pr-2 text-sm">
                  <Logo tool={t} size={24} />
                  {t.name}
                  <button onClick={() => toggleCompare(t.slug)} aria-label={`Remove ${t.name}`}>
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <button
              ref={openerRef}
              onClick={() => setShowCompare(true)}
              disabled={compare.length < 2}
              className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              Compare {compare.length}
            </button>
          </div>
        </div>
      )}

      {showCompare && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-6" onClick={() => setShowCompare(false)}>
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Compare tools"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-t-2xl sm:rounded-2xl bg-background p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Side-by-side comparison</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent"
                >
                  {copied ? <Check className="size-4" /> : <Link2 className="size-4" />} {copied ? "Link copied" : "Copy link"}
                </button>
                <button onClick={() => setShowCompare(false)} aria-label="Close">
                  <X className="size-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr>
                    <th className="w-32" />
                    {compared.map((t) => (
                      <th key={t.slug} className="p-3 text-left align-bottom">
                        <Logo tool={t} size={40} />
                        <p className="mt-2 font-semibold">{t.name}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["Category", (t: AiTool) => t.category],
                      ["Pricing", (t: AiTool) => t.pricing],
                      ["Free tier", (t: AiTool) => TOOL_PRICING[t.slug]?.free ?? "—"],
                      ["Paid", (t: AiTool) => TOOL_PRICING[t.slug]?.paid ?? "Free"],
                      ["License", (t: AiTool) => TOOL_PRICING[t.slug]?.license ?? "Proprietary"],
                      ["GitHub stars", (t: AiTool) => TOOL_PRICING[t.slug]?.stars ?? "—"],
                      ["Open source", (t: AiTool) => (t.openSource ? "Yes" : "No")],
                      ["Deployment", (t: AiTool) => t.deploy.join(", ")],
                      ["Languages", (t: AiTool) => t.languages.join(", ")],
                      ["Best for", (t: AiTool) => t.bestFor],
                      ["What it is", (t: AiTool) => t.description],
                    ] as const
                  ).map(([label, get]) => (
                    <tr key={label} className="border-t border-border">
                      <th className="p-3 text-left align-top text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</th>
                      {compared.map((t) => (
                        <td key={t.slug} className="p-3 align-top">{get(t)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** What you get for free, where paid starts, license and popularity — with a link to verify. */
function PricingBox({ slug }: { slug: string }) {
  const p = TOOL_PRICING[slug];
  return (
    <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06] p-3 text-sm">
      <p className="flex gap-2">
        <Gift className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">Free: </span>
          {p.free}
        </span>
      </p>
      {p.paid && (
        <p className="mt-1.5 flex gap-2">
          <BadgeDollarSign className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>
            <span className="font-semibold">Paid: </span>
            <span className="text-muted-foreground">{p.paid}</span>
          </span>
        </p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {p.license && (
          <span className="inline-flex items-center gap-1">
            <Scale className="size-3.5" /> {p.license}
          </span>
        )}
        {p.stars && (
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5 fill-amber-400 text-amber-400" /> {p.stars} GitHub stars
          </span>
        )}
        <a href={p.pricingUrl} target="_blank" rel="noopener noreferrer" className="ml-auto inline-flex items-center gap-1 text-primary hover:underline">
          Checked {PRICING_CHECKED} · verify <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  );
}
