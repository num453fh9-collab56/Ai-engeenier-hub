import Link from "next/link";
import { BookOpen, FileDown } from "lucide-react";
import { Newsletter } from "@/components/newsletter";
import { CourseGrid } from "@/components/course-grid";
import { getLessonCards } from "@/lib/lesson-cards";
import { getLearningPath } from "@/lib/learning-path";
import { quizzes } from "@/lib/quizzes";
import { aiTools } from "@/lib/ai-tools";
import { CurriculumRoadmap } from "@/components/curriculum-roadmap";
import { LandingHero } from "@/components/landing-hero";
import { CardCarousel } from "@/components/card-carousel";
import { LessonCard, TrackCard, type LessonCardData } from "@/components/landing-cards";
import { readingTime } from "@/lib/reading-time";
import { getLessonPhoto } from "@/lib/lesson-photos";
import { getAllDocs } from "@/lib/mdx";
import { getTracks, trackLabel } from "@/lib/tracks";

const trackGradients = [
  "from-blue-600/20 to-indigo-600/10",
  "from-amber-600/20 to-orange-600/10",
  "from-rose-600/20 to-red-600/10",
  "from-cyan-600/20 to-sky-600/10",
  "from-emerald-600/20 to-teal-600/10",
  "from-purple-600/20 to-pink-600/10",
];

export default function Home() {
  const docs = getAllDocs();
  const lessonCount = docs.length;
  const tracks = getTracks();
  const lessonCards: LessonCardData[] = [...docs]
    .sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order)
    .map((d) => ({
      href: `/docs/${d.category}/${d.slug}`,
      title: d.title,
      description: d.description,
      category: d.category,
      trackLabel: trackLabel(d.category),
      difficulty: d.difficulty,
      readTime: readingTime(d.content),
      photo: getLessonPhoto(`${d.category}/${d.slug}`),
    }));
  const trackCount = tracks.length;

  return (
    <div className="flex flex-col flex-1">
      <LandingHero
        lessonCount={lessonCount}
        trackCount={trackCount}
        stats={{
          quizQuestions: Object.values(quizzes).reduce((n, q) => n + q.length, 0),
          projects: getLessonCards().filter((l) => l.project).length,
          tools: aiTools.length,
        }}
      />

      <CardCarousel
        title="Popular lessons"
        subtitle="Pick a lesson and start building in minutes."
        count={lessonCards.length}
      >
        {lessonCards.map((l, i) => (
          <LessonCard key={l.href} l={l} i={i} />
        ))}
      </CardCarousel>

      <CardCarousel
        title="Explore by track"
        subtitle="Follow a full path and earn a certificate."
        count={tracks.length}
      >
        {tracks.map((t, i) => (
          <TrackCard
            key={t.category}
            i={i}
            t={{
              category: t.category,
              label: t.label,
              count: t.lessons.length,
              href: t.lessons[0]?.href ?? "/docs",
              topics: t.lessons.map((x) => x.title),
              photo: t.lessons.length ? getLessonPhoto(t.lessons[t.lessons.length - 1].id) : undefined,
            }}
          />
        ))}
      </CardCarousel>

      <CourseGrid lessons={getLessonCards()} />

      <CurriculumRoadmap phases={getLearningPath()} />

      {/* Compiled Track Books */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              Read Offline: Full Track Books
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Every lesson in a track compiled into one book. Save it as a
              PDF or download the Markdown — free.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((t, i) => (
              <div
                key={t.category}
                className="group relative overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md hover:border-primary/30"
              >
                <div className={`h-24 bg-gradient-to-br ${trackGradients[i % trackGradients.length]} flex items-center justify-center`}>
                  <BookOpen className="size-8 text-foreground/15" />
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-background/80 px-2 py-0.5 text-xs font-semibold">
                    {t.lessons.length} lessons
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-3">{t.label}</h3>
                  <div className="flex gap-2">
                    <Link
                      href={`/books/${t.category}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                    >
                      <BookOpen className="size-3.5" />
                      Read / PDF
                    </Link>
                    <a
                      href={`/api/download?track=${t.category}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                    >
                      <FileDown className="size-3.5" />
                      .md
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
