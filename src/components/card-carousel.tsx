"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CardCarousel({
  title,
  subtitle,
  children,
  count,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  count: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = () => {
    const el = track.current;
    if (!el) return;
    const total = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPages(total);
    setPage(Math.min(total - 1, Math.round(el.scrollLeft / el.clientWidth)));
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const go = (dir: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <section className="px-4 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="relative">
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="absolute -left-3 sm:-left-5 top-1/2 z-10 -translate-y-1/2 hidden sm:flex size-10 items-center justify-center rounded-full bg-background shadow-lg ring-1 ring-border hover:text-primary"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div
            ref={track}
            onScroll={measure}
            onMouseEnter={measure}
            className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4"
            aria-label={`${title} — ${count} items`}
          >
            {children}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="absolute -right-3 sm:-right-5 top-1/2 z-10 -translate-y-1/2 hidden sm:flex size-10 items-center justify-center rounded-full bg-background shadow-lg ring-1 ring-border hover:text-primary"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
        {pages > 1 && (
          <div className="mt-4 flex justify-center gap-1.5">
            {Array.from({ length: pages }, (_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === page ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
