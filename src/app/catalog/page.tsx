import type { Metadata } from "next";
import Link from "next/link";
import { Award, BookOpen, Route } from "lucide-react";
import { CourseGrid } from "@/components/course-grid";
import { getLessonCards } from "@/lib/lesson-cards";
import { getTracks } from "@/lib/tracks";
import { getLearningPath } from "@/lib/learning-path";

export const metadata: Metadata = {
  title: "Course Catalog",
  description:
    "Every live lesson on AI Engineering Hub, grouped by track — with reading time, code examples, a mini project and a quiz in each.",
  alternates: { canonical: "/catalog" },
};

export default function CatalogPage() {
  // Everything on this page comes from the real lesson files — no invented numbers.
  const tracks = getTracks();
  const lessons = getLessonCards();
  const planned = getLearningPath().reduce((n, p) => n + p.items.length - p.liveCount, 0);

  return (
    <div className="flex flex-col flex-1">
      <section className="bg-landing px-4 py-14 border-b border-border/40">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Course Catalog</h1>
          <p className="max-w-2xl text-muted-foreground">
            {lessons.length} live lessons in {tracks.length} tracks, free. Finish every lesson in a track to earn its
            certificate. {planned} more lessons are planned on the{" "}
            <Link href="/roadmap" className="font-medium text-primary hover:underline">
              roadmap
            </Link>
            .
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((t) => (
              <div key={t.category} className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {t.lessons.length} lessons
                </p>
                <h2 className="mt-1 mb-3 text-lg font-bold">{t.label}</h2>
                <ul className="mb-4 space-y-1 text-sm text-muted-foreground">
                  {t.lessons.map((l) => (
                    <li key={l.id} className="truncate">
                      <Link href={l.href} className="hover:text-foreground">
                        {l.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Link
                    href={t.lessons[0]?.href ?? "/roadmap"}
                    className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 font-semibold text-primary-foreground"
                  >
                    <Route className="size-3.5" /> Start
                  </Link>
                  <Link
                    href={`/books/${t.category}`}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 font-medium hover:bg-accent"
                  >
                    <BookOpen className="size-3.5" /> Book
                  </Link>
                  <Link
                    href={`/certificate/${t.category}`}
                    className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 font-medium hover:bg-accent"
                  >
                    <Award className="size-3.5" /> Certificate
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CourseGrid lessons={lessons} />
    </div>
  );
}
