import type { Metadata } from "next";
import { CourseCatalog } from "@/components/course-catalog";
import { CourseGrid } from "@/components/course-grid";
import { getLessonCards } from "@/lib/lesson-cards";

export const metadata: Metadata = {
  title: "Course Catalog",
  description: "Browse our full catalog of AI Engineering courses — from foundations to multi-agent swarms.",
};

export default function CatalogPage() {
  return (
    <div className="flex flex-col flex-1">
      <section className="px-4 py-12 border-b border-border/40">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Course Catalog</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Every course, tutorial, and phase in the AI Engineering curriculum — filter by provider, category, level, and topic.
          </p>
        </div>
      </section>
      <CourseCatalog />
      <div className="border-t border-border/40">
        <CourseGrid lessons={getLessonCards()} />
      </div>
    </div>
  );
}
