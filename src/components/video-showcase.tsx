"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Bot, MonitorPlay, Workflow } from "lucide-react";

/** Muted looping video that only plays while it is on screen (saves data + CPU). */
function AutoVideo({ src, poster, label, className }: { src: string; poster: string; label: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Respect "reduce motion": show the poster + controls, never autoplay
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.controls = true;
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => (v.controls = true));
        else v.pause();
      },
      { threshold: 0.35 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className={className}
    />
  );
}

/** Homepage "See it in action": a short tour of the site + an n8n multi-agent workflow. */
export function VideoShowcase({ agentsHref }: { agentsHref: string }) {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">See it in action</p>
          <h2 className="mb-3 text-2xl sm:text-3xl font-bold tracking-tight">Learn it here, build it for real</h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            A quick look at how lessons work on this site — and the kind of multi-agent workflow you&apos;ll be able
            to build after the Agents track.
          </p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[1.75fr_1fr]">
          {/* Website tour (landscape) */}
          <figure className="glass-card flex flex-col overflow-hidden rounded-2xl">
            <div className="relative aspect-video bg-black">
              <AutoVideo
                src="/videos/website-tour.mp4"
                poster="/videos/website-tour.jpg"
                label="Tour of AI Engineering Hub: lesson cards, Ask Mubeen, a module overview and the code view"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <figcaption className="flex flex-1 items-start gap-3 p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <MonitorPlay className="size-5" />
              </span>
              <span className="text-sm">
                <span className="block font-semibold">Site tour</span>
                <span className="text-muted-foreground">
                  Pick a lesson, ask Mubeen when you&apos;re stuck, follow the module steps and read real code side by
                  side.
                </span>
              </span>
            </figcaption>
          </figure>

          {/* n8n multi-agent workflow (portrait) */}
          <figure className="glass-card flex flex-col overflow-hidden rounded-2xl sm:flex-row lg:flex-col">
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[16rem] bg-black sm:max-w-[13rem] lg:h-[22rem] lg:w-auto lg:max-w-none">
              <AutoVideo
                src="/videos/n8n-agents.mp4"
                poster="/videos/n8n-agents.jpg"
                label="n8n workflow: a trigger fans out to Sales, Marketing and Product AI agents whose outputs are processed and bundled"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <figcaption className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400">
                  <Workflow className="size-5" />
                </span>
                <span className="text-sm">
                  <span className="block font-semibold">Multi-agent workflow in n8n</span>
                  <span className="text-muted-foreground">
                    One trigger, three specialist AI agents (Sales, Marketing, Product) with structured output — then
                    their results are processed and bundled.
                  </span>
                </span>
              </div>
              <Link
                href={agentsHref}
                className="mt-auto inline-flex items-center gap-1.5 self-start rounded-full bg-gradient-to-r from-primary to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-transform hover:-translate-y-0.5"
              >
                <Bot className="size-3.5" /> Start the Agents track <ArrowRight className="size-3.5" />
              </Link>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
