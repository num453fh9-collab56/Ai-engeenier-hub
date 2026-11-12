import { getAllDocs } from "@/lib/mdx";
import { readingTime } from "@/lib/reading-time";
import { quizzes } from "@/lib/quizzes";
import { getLessonPhoto } from "@/lib/lesson-photos";
import { trackLabel } from "@/lib/tracks";

// Real, derived-from-content data for lesson cards (no invented ratings or durations)
export interface LessonCardInfo {
  id: string;
  href: string;
  title: string;
  description: string;
  category: string;
  track: string;
  difficulty: string;
  readTime: string;
  codeExamples: number;
  quizQuestions: number;
  project?: string;
  tags: string[];
  photo?: { src: string; alt: string };
}

export function getLessonCards(): LessonCardInfo[] {
  return getAllDocs()
    .sort((a, b) => a.category.localeCompare(b.category) || a.order - b.order)
    .map((d) => {
      const id = `${d.category}/${d.slug}`;
      const photo = getLessonPhoto(id);
      return {
        id,
        href: `/docs/${id}`,
        title: d.title,
        description: d.description,
        category: d.category,
        track: trackLabel(d.category),
        difficulty: d.difficulty,
        readTime: readingTime(d.content),
        codeExamples: Math.floor((d.content.match(/^```/gm) ?? []).length / 2),
        quizQuestions: quizzes[id]?.length ?? 0,
        project: d.content.match(/^##\s+Mini Project:\s*(.+)$/m)?.[1]?.trim(),
        tags: d.tags.slice(0, 3),
        photo: photo ? { src: photo.src, alt: photo.alt } : undefined,
      };
    });
}
