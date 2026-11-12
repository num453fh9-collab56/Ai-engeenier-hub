"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Star } from "lucide-react";
import { courses, type Course } from "@/lib/course-data";
import { BrandFilter } from "@/components/brand-filter";
import { CategoryPills } from "@/components/category-pills";

export function CourseGrid() {
  const [provider, setProvider] = useState("All Providers");
  const [category, setCategory] = useState("All");
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [badgeFilter, setBadgeFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (provider !== "All Providers" && c.provider !== provider) return false;
      if (category !== "All" && c.category !== category) return false;
      if (levelFilter && c.level !== levelFilter) return false;
      if (badgeFilter && !c.badges.includes(badgeFilter)) return false;
      return true;
    });
  }, [provider, category, levelFilter, badgeFilter]);

  function clearFilters() {
    setProvider("All Providers");
    setCategory("All");
    setLevelFilter(null);
    setBadgeFilter(null);
  }

  return (
    <section className="px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">
                Explore Courses
              </h2>
              <p className="text-sm text-muted-foreground">
                {filtered.length} course{filtered.length !== 1 ? "s" : ""} found
                {(levelFilter || badgeFilter || provider !== "All Providers" || category !== "All") && (
                  <button onClick={clearFilters} className="ml-2 text-xs text-primary hover:underline">
                    Clear filters
                  </button>
                )}
              </p>
            </div>
          </div>

          <BrandFilter selected={provider} onSelect={setProvider} />
          <div className="mt-3">
            <CategoryPills selected={category} onSelect={setCategory} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onBadgeClick={(badge) => setBadgeFilter(badge)}
              onLevelClick={(level) => setLevelFilter(level)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No courses match your filters. Try a different combination.
          </div>
        )}
      </div>
    </section>
  );
}

function CourseCard({
  course,
  onBadgeClick,
  onLevelClick,
}: {
  course: Course;
  onBadgeClick: (badge: string) => void;
  onLevelClick: (level: string) => void;
}) {
  return (
    <Link
      href={`/docs/${course.categorySlug}/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/30"
    >
      {course.coverImage ? (
        <div className="relative aspect-video overflow-hidden bg-muted">
          <Image
            src={course.coverImage}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 right-3 flex gap-1 z-10">
            {course.badges.slice(0, 2).map((badge) => (
              <button
                key={badge}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBadgeClick(badge); }}
                className="inline-flex items-center rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-medium text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                {badge}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={`relative h-28 bg-gradient-to-br ${course.gradient}`}>
          <span className="absolute top-3 left-3 text-2xl">{course.icon}</span>
          <div className="absolute top-3 right-3 flex gap-1">
            {course.badges.slice(0, 2).map((badge) => (
              <button
                key={badge}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onBadgeClick(badge); }}
                className="inline-flex items-center rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-medium text-foreground hover:bg-primary/20 hover:text-primary transition-colors"
              >
                {badge}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 text-[11px] font-medium text-primary uppercase tracking-wider">
          {course.provider}
        </span>

        <h3 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors leading-snug">
          {course.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
          {course.description}
        </p>

        {/* Meta footer */}
        <div className="flex items-center justify-between border-t border-border/40 pt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="size-3 fill-amber-500 text-amber-500" />
              <span className="text-xs font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" />
              <span className="text-xs">{course.duration}</span>
            </div>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onLevelClick(course.level); }}
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors hover:ring-1 hover:ring-primary/30 ${
              course.level === "Advanced"
                ? "bg-destructive/10 text-destructive"
                : course.level === "Intermediate"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {course.level}
          </button>
        </div>
      </div>
    </Link>
  );
}
