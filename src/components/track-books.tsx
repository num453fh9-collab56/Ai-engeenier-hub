import Link from "next/link";
import { BookOpen, Clock, FileDown, Hammer, ListChecks } from "lucide-react";

export interface TrackBook {
  category: string;
  label: string;
  lessons: number;
  minutes: number;
  projects: number;
  quizQuestions: number;
}

// Rich, deep "hardcover" colours — one per track — with gold-foil details
const COVERS = [
  "from-[#1e2a5a] via-[#16204a] to-[#0b1230]", // midnight navy
  "from-[#4a1d5c] via-[#3a1548] to-[#220b2e]", // plum / aubergine
  "from-[#6b1a2e] via-[#531324] to-[#300913]", // wine / burgundy
  "from-[#0f4a43] via-[#0b3a35] to-[#05221f]", // deep emerald
];
const GOLD = "#e8c77a";

/** "Read offline" section: every track as a real-looking book with real numbers. */
export function TrackBooks({ books }: { books: TrackBook[] }) {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">Read offline</p>
          <h2 className="mb-3 text-2xl sm:text-3xl font-bold tracking-tight">Every track as a free book</h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            All lessons of a track in one place — read them in your browser, save as a PDF for offline study, or
            download the Markdown.
          </p>
        </div>

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((b, i) => (
            <div key={b.category} className="group flex flex-col items-center">
              {/* 3D book */}
              <Link
                href={`/books/${b.category}`}
                aria-label={`Read the ${b.label} book`}
                className="relative mb-5 block h-60 w-44 [perspective:900px]"
              >
                <div className="relative h-full w-full rounded-r-xl rounded-l-sm shadow-[12px_16px_30px_-10px_rgba(15,23,42,0.45)] transition-transform duration-500 [transform:rotateY(-14deg)] group-hover:[transform:rotateY(-4deg)_translateY(-6px)]">
                  {/* page edges */}
                  <div className="absolute -right-1.5 top-1.5 bottom-1.5 w-2 rounded-r-sm bg-[repeating-linear-gradient(90deg,#f1f5f9_0_1px,#cbd5e1_1px_2px)] dark:bg-[repeating-linear-gradient(90deg,#e2e8f0_0_1px,#94a3b8_1px_2px)]" />
                  {/* cover */}
                  <div className={`relative h-full w-full overflow-hidden rounded-r-xl rounded-l-sm bg-gradient-to-br ${COVERS[i % COVERS.length]} p-4 text-white`}>
                    {/* spine */}
                    <div className="absolute inset-y-0 left-0 w-3 bg-black/25" />
                    <div className="absolute inset-y-0 left-3 w-px bg-white/15" />
                    {/* thin gold frame */}
                    <div className="pointer-events-none absolute inset-2.5 left-5 rounded-md border" style={{ borderColor: `${GOLD}55` }} />
                    {/* subtle circuit lines */}
                    <svg className="absolute -right-6 -bottom-6 size-40 opacity-30" viewBox="0 0 100 100" fill="none" aria-hidden>
                      <path d="M10 90 H40 V60 H70 V30 H95" stroke={GOLD} strokeWidth="1.5" />
                      <path d="M30 100 V75 H55 V45 H85" stroke={GOLD} strokeWidth="1.5" />
                      <circle cx="40" cy="60" r="2.5" fill={GOLD} />
                      <circle cx="70" cy="30" r="2.5" fill={GOLD} />
                      <circle cx="55" cy="45" r="2.5" fill={GOLD} />
                    </svg>
                    <div className="relative flex h-full flex-col pl-3">
                      <span className="text-[9px] font-semibold uppercase tracking-[0.22em]" style={{ color: GOLD }}>AI Engineering Hub</span>
                      <span className="mt-auto text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">Track {i + 1}</span>
                      <span className="font-serif text-xl font-semibold leading-tight text-[#f7f1e3]">{b.label}</span>
                      <span className="mt-2 h-px w-12" style={{ background: GOLD }} />
                      <span className="mt-3 text-[11px] text-white/60">
                        {b.lessons} lessons · {b.minutes} min
                      </span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* real stats */}
              <ul className="mb-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <li className="inline-flex items-center gap-1"><Clock className="size-3.5" /> {b.minutes} min read</li>
                <li className="inline-flex items-center gap-1"><Hammer className="size-3.5" /> {b.projects} projects</li>
                <li className="inline-flex items-center gap-1"><ListChecks className="size-3.5" /> {b.quizQuestions} quiz Qs</li>
              </ul>

              <div className="flex gap-2">
                <Link
                  href={`/books/${b.category}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-transform hover:-translate-y-0.5"
                >
                  <BookOpen className="size-3.5" /> Read &amp; save PDF
                </Link>
                <a
                  href={`/api/download?track=${b.category}`}
                  className="glass-card inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-transform hover:-translate-y-0.5"
                  aria-label={`Download the ${b.label} book as Markdown`}
                >
                  <FileDown className="size-3.5" /> .md
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
