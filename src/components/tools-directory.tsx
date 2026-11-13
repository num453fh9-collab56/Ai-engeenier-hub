"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, GitCompare, Search, SlidersHorizontal, X } from "lucide-react";
import { aiTools, TOOL_CATEGORIES, type AiTool, type Pricing } from "@/lib/ai-tools";

const PRICING: Pricing[] = ["Open source", "Free tier", "Paid"];
const HUES = [215, 250, 190, 160, 280, 20, 330];
const hue = (s: string) => HUES[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];

function Monogram({ tool, size = 56 }: { tool: AiTool; size?: number }) {
  const h = hue(tool.name);
  const letters = tool.name.replace(/[^A-Za-z0-9 ]/g, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-md"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(135deg, hsl(${h} 85% 60%), hsl(${h + 25} 75% 42%))`,
      }}
    >
      {letters.toUpperCase()}
    </span>
  );
}

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
  const [sort, setSort] = useState<"az" | "category">("category");
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
      .filter(
        (t) =>
          !s ||
          [t.name, t.tagline, t.description, t.category, t.bestFor, ...t.languages].join(" ").toLowerCase().includes(s)
      )
      .sort((a, b) =>
        sort === "az"
          ? a.name.localeCompare(b.name)
          : TOOL_CATEGORIES.indexOf(a.category as never) - TOOL_CATEGORIES.indexOf(b.category as never) ||
            a.name.localeCompare(b.name)
      );
  }, [q, cat, pricing, selfHost, sort]);

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
              onChange={(e) => setSort(e.target.value as "az" | "category")}
              aria-label="Sort"
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="category">Sort: Category</option>
              <option value="az">Sort: A–Z</option>
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
                  <Monogram tool={t} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-semibold leading-tight">{t.name}</h3>
                        <p className="text-sm text-muted-foreground">{t.tagline}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${pricingStyle[t.pricing]}`}>{t.pricing}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{t.description}</p>
                    <p className="mt-2 text-sm">
                      <span className="font-medium">Best for: </span>
                      <span className="text-muted-foreground">{t.bestFor}</span>
                    </p>
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
                  <Monogram tool={t} size={24} />
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
              <button onClick={() => setShowCompare(false)} aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr>
                    <th className="w-32" />
                    {compared.map((t) => (
                      <th key={t.slug} className="p-3 text-left align-bottom">
                        <Monogram tool={t} size={40} />
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
