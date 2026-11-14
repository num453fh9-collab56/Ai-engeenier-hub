"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Check, Layers, Link2, MessageCircle, RotateCcw, Search, Shuffle, X } from "lucide-react";
import { GLOSSARY_CATEGORIES, glossary, glossaryBySlug, type GlossaryTerm } from "@/lib/glossary";
import { aiTools } from "@/lib/ai-tools";
import { askMubeen } from "@/lib/my-stack";
import { ToolLogo } from "@/components/tool-logo";

const CAT_STYLE: Record<string, string> = {
  Foundations: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Prompting: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "RAG & Search": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Agents: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Training: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  "Production & Safety": "bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

const letterOf = (t: GlossaryTerm) => t.term[0].toUpperCase();

export function GlossaryExplorer({ lessonTitles }: { lessonTitles: Record<string, string> }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const [urdu, setUrdu] = useState(true);
  const [cards, setCards] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Remember the Roman Urdu preference
  useEffect(() => {
    try {
      if (localStorage.getItem("aeh-glossary-urdu") === "0") setUrdu(false);
    } catch {}
  }, []);
  const toggleUrdu = () => {
    setUrdu((v) => {
      try {
        localStorage.setItem("aeh-glossary-urdu", v ? "0" : "1");
      } catch {}
      return !v;
    });
  };

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return [...glossary]
      .filter((t) => cat === "All" || t.cat === cat)
      .filter((t) => !s || [t.term, t.def, t.urdu].join(" ").toLowerCase().includes(s))
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [q, cat]);

  const letters = useMemo(() => [...new Set(list.map(letterOf))], [list]);

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/glossary#${slug}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(slug);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div>
      {/* Controls */}
      <div className="z-20 -mx-4 mb-6 sm:sticky sm:top-16 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-md">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search terms, e.g. 'token', 'refund', 'agent'…"
              className="w-full rounded-lg border border-border bg-background py-2.5 pl-9 pr-9 text-sm outline-none focus:border-primary/50"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground">
                <X className="size-4" />
              </button>
            )}
          </label>
          <div className="flex gap-2">
            <button
              onClick={toggleUrdu}
              aria-pressed={urdu}
              className={`rounded-lg border px-3 py-2 text-sm font-medium ${urdu ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
            >
              Roman Urdu {urdu ? "on" : "off"}
            </button>
            <button
              onClick={() => setCards(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              <Layers className="size-4" /> Flashcards
            </button>
          </div>
        </div>
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {["All", ...GLOSSARY_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${cat === c ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-accent"}`}
            >
              {c} <span className="opacity-70">{c === "All" ? glossary.length : glossary.filter((t) => t.cat === c).length}</span>
            </button>
          ))}
        </div>
        {/* A–Z */}
        <nav aria-label="Jump to letter" className="no-scrollbar mt-2 flex gap-1 overflow-x-auto text-xs">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) =>
            letters.includes(l) ? (
              <a key={l} href={`#letter-${l}`} className="rounded px-1.5 py-0.5 font-semibold text-primary hover:bg-primary/10">
                {l}
              </a>
            ) : (
              <span key={l} className="px-1.5 py-0.5 text-muted-foreground/40">{l}</span>
            )
          )}
        </nav>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {list.length} term{list.length === 1 ? "" : "s"}
        {cat !== "All" && ` in ${cat}`}
      </p>

      {letters.map((l) => (
        <section key={l} id={`letter-${l}`} className="scroll-mt-20 sm:scroll-mt-56">
          <h2 className="mb-3 mt-6 text-2xl font-extrabold text-primary/80">{l}</h2>
          <div className="grid gap-3">
            {list.filter((t) => letterOf(t) === l).map((t) => {
              const tool = t.tool ? aiTools.find((x) => x.slug === t.tool) : undefined;
              return (
                <article key={t.slug} id={t.slug} className="scroll-mt-20 sm:scroll-mt-56 rounded-xl border border-border/70 bg-card p-4 target:border-primary target:ring-2 target:ring-primary/20">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-base font-semibold">{t.term}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${CAT_STYLE[t.cat]}`}>{t.cat}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed">{t.def}</p>
                  {urdu && (
                    <p className="mt-2 rounded-lg bg-primary/5 px-3 py-2 text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-primary">Aasaan alfaaz: </span>
                      {t.urdu}
                    </p>
                  )}

                  {t.related?.length ? (
                    <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-muted-foreground">Related:</span>
                      {t.related.filter((r) => glossaryBySlug[r]).map((r) => (
                        <a
                          key={r}
                          href={`#${r}`}
                          onClick={() => {
                            setQ("");
                            setCat("All");
                          }}
                          className="rounded-full border border-border px-2 py-0.5 hover:border-primary/40 hover:text-primary"
                        >
                          {glossaryBySlug[r].term.split(" (")[0]}
                        </a>
                      ))}
                    </p>
                  ) : null}

                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3 text-xs">
                    {t.lesson && lessonTitles[t.lesson] && (
                      <Link href={`/docs/${t.lesson}`} className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 font-medium text-primary hover:bg-primary/15">
                        <BookOpen className="size-3.5" /> {lessonTitles[t.lesson]}
                      </Link>
                    )}
                    {tool && (
                      <Link href={`/directory/${tool.slug}`} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2 py-1 hover:bg-accent">
                        <ToolLogo slug={tool.slug} name={tool.name} size={16} /> {tool.name}
                      </Link>
                    )}
                    <span className="ml-auto flex gap-1">
                      <button
                        onClick={() => askMubeen(`Explain "${t.term}" simply, with an example${urdu ? " (Roman Urdu me)" : ""}.`)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <MessageCircle className="size-3.5" /> Ask Mubeen
                      </button>
                      <button
                        onClick={() => copyLink(t.slug)}
                        aria-label={`Copy link to ${t.term}`}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        {copied === t.slug ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
                        {copied === t.slug ? "Copied" : "Link"}
                      </button>
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      {!list.length && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No terms match. Try another word — or{" "}
          <button onClick={() => askMubeen(`What does "${q}" mean in AI engineering?`)} className="font-medium text-primary hover:underline">
            ask Mubeen what &ldquo;{q}&rdquo; means
          </button>
          .
        </div>
      )}

      {cards && <Flashcards terms={list.length ? list : glossary} urdu={urdu} onClose={() => setCards(false)} />}
    </div>
  );
}

/** Flip-card practice: see the term, recall the meaning, then flip and mark yourself. */
function Flashcards({ terms, urdu, onClose }: { terms: GlossaryTerm[]; urdu: boolean; onClose: () => void }) {
  const [deck, setDeck] = useState<GlossaryTerm[]>(() => [...terms].sort(() => Math.random() - 0.5));
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const done = i >= deck.length;
  const card = deck[i];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && !done) {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, onClose]);

  const next = (knew: boolean) => {
    if (knew) setKnown((k) => k + 1);
    setFlipped(false);
    setI((n) => n + 1);
  };
  const restart = () => {
    setDeck([...terms].sort(() => Math.random() - 0.5));
    setI(0);
    setKnown(0);
    setFlipped(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="Glossary flashcards" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
        <div className="mb-3 flex items-center justify-between text-sm text-white">
          <span>
            {done ? deck.length : i + 1} / {deck.length} · {known} known
          </span>
          <button onClick={onClose} aria-label="Close flashcards" className="rounded-lg p-1 hover:bg-white/10">
            <X className="size-5" />
          </button>
        </div>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(Math.min(i, deck.length) / deck.length) * 100}%` }} />
        </div>

        {done ? (
          <div className="rounded-2xl bg-card p-8 text-center shadow-2xl">
            <p className="text-4xl font-extrabold">
              {known}/{deck.length}
            </p>
            <p className="mt-2 text-muted-foreground">terms you already knew. Practise again to lock in the rest.</p>
            <button onClick={restart} className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              <RotateCcw className="size-4" /> Shuffle &amp; restart
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setFlipped((f) => !f)}
              className="block h-72 w-full [perspective:1200px]"
              aria-label={flipped ? "Show term" : "Show meaning"}
            >
              <span
                className="relative block h-full w-full rounded-2xl transition-transform duration-500 [transform-style:preserve-3d]"
                style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
              >
                <span className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-card p-6 text-center shadow-2xl [backface-visibility:hidden]">
                  <span className={`mb-3 rounded-full px-2 py-0.5 text-[11px] font-medium ${CAT_STYLE[card.cat]}`}>{card.cat}</span>
                  <span className="text-2xl font-bold">{card.term}</span>
                  <span className="mt-4 text-xs text-muted-foreground">Tap or press Space to flip</span>
                </span>
                <span className="absolute inset-0 flex flex-col justify-center gap-3 overflow-y-auto rounded-2xl bg-card p-6 text-left shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <span className="text-sm leading-relaxed">{card.def}</span>
                  {urdu && <span className="text-sm leading-relaxed text-muted-foreground">{card.urdu}</span>}
                </span>
              </span>
            </button>
            <div className="mt-4 flex justify-center gap-3">
              <button onClick={() => next(false)} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20">
                <Shuffle className="size-4" /> Still learning
              </button>
              <button onClick={() => next(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600">
                <Check className="size-4" /> I knew it
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
