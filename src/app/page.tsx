import { Newsletter } from "@/components/newsletter";
import { CourseGrid } from "@/components/course-grid";
import { getLessonCards } from "@/lib/lesson-cards";
import { getLearningPath } from "@/lib/learning-path";
import { quizzes } from "@/lib/quizzes";
import { aiTools } from "@/lib/ai-tools";
import { CurriculumRoadmap } from "@/components/curriculum-roadmap";
import { LandingHero } from "@/components/landing-hero";
import { TrackBooks } from "@/components/track-books";
import { VideoShowcase } from "@/components/video-showcase";
import { CardCarousel } from "@/components/card-carousel";
import { LessonCard, TrackCard, type LessonCardData } from "@/components/landing-cards";
import { readingTime } from "@/lib/reading-time";
import { getLessonPhoto } from "@/lib/lesson-photos";
import { getAllDocs } from "@/lib/mdx";
import { getTracks, trackLabel } from "@/lib/tracks";

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

      <VideoShowcase agentsHref={tracks.find((t) => t.category === "03-agents")?.lessons[0]?.href ?? "/catalog"} />

      <CourseGrid lessons={getLessonCards()} />

      <CurriculumRoadmap phases={getLearningPath()} />

      <TrackBooks
        books={tracks.map((t) => {
          const ids = new Set(t.lessons.map((l) => l.id));
          const trackDocs = docs.filter((d) => ids.has(`${d.category}/${d.slug}`));
          return {
            category: t.category,
            label: t.label,
            lessons: t.lessons.length,
            minutes: trackDocs.reduce((n, d) => n + (parseInt(readingTime(d.content), 10) || 0), 0),
            projects: getLessonCards().filter((l) => ids.has(l.id) && l.project).length,
            quizQuestions: t.lessons.reduce((n, l) => n + (quizzes[l.id]?.length ?? 0), 0),
          };
        })}
      />

      <Newsletter />
    </div>
  );
}
