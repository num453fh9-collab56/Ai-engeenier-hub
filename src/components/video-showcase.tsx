import Link from "next/link";
import { ArrowRight, MonitorPlay } from "lucide-react";
import { AutoVideo } from "@/components/auto-video";

/** Homepage "See it in action": a short tour of how lessons work on the site. */
export function VideoShowcase() {
  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">See it in action</p>
          <h2 className="mb-3 text-2xl sm:text-3xl font-bold tracking-tight">Learn it here, build it for real</h2>
          <p className="mx-auto max-w-lg text-muted-foreground">
            A quick look at how lessons work: pick a track, ask Mubeen, follow the module and read real code.
          </p>
        </div>

        <figure className="glass-card overflow-hidden rounded-2xl">
          <div className="relative aspect-video bg-black">
            <AutoVideo
              src="/videos/website-tour.mp4"
              poster="/videos/website-tour.jpg"
              label="Tour of AI Engineering Hub: lesson cards, Ask Mubeen, a module overview and the code view"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <figcaption className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <span className="flex items-start gap-3 text-sm">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <MonitorPlay className="size-5" />
              </span>
              <span>
                <span className="block font-semibold">Site tour</span>
                <span className="text-muted-foreground">
                  Lesson cards → Ask Mubeen → module steps → code side by side.
                </span>
              </span>
            </span>
            <Link
              href="/docs/01-foundations/intro"
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-gradient-to-r from-primary to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-transform hover:-translate-y-0.5 sm:ml-auto sm:self-center"
            >
              Start learning <ArrowRight className="size-3.5" />
            </Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
