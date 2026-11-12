import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getDocBySlug, extractHeadings, getAllDocs } from "@/lib/mdx";
import { readingTime } from "@/lib/reading-time";
import { TableOfContents } from "@/components/toc";
import { Newsletter } from "@/components/newsletter";
import { mdxComponents } from "@/components/mdx-components";
import { DocFallback } from "@/components/doc-fallback";
import { courses } from "@/lib/course-data";
import { quizzes } from "@/lib/quizzes";
import { toPlain } from "@/lib/plain-text";
import { LessonQuiz } from "@/components/lesson-quiz";
import { LessonTutor } from "@/components/lesson-tutor";
import { LessonComplete } from "@/components/lesson-complete";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({
    category: doc.category,
    slug: doc.slug,
  }));
}

function findCourse(category: string, slug: string) {
  return courses.find(
    (c) => c.categorySlug === category && c.slug === slug
  ) ?? courses.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const doc = getDocBySlug(category, slug);

  if (doc) {
    const rt = readingTime(doc.content);
    const categoryLabel = doc.category.replace(/^\d+-/, "").replace(/-/g, " ");
    const ogImage = `/docs/${category}/${slug}/opengraph-image`;

    return {
      title: doc.title,
      description: doc.description,
      keywords: [...doc.tags, categoryLabel, "AI Engineering", "tutorial"],
      openGraph: {
        title: doc.title,
        description: doc.description,
        type: "article",
        publishedTime: new Date().toISOString(),
        authors: ["AI Engineering Hub"],
        section: categoryLabel,
        tags: doc.tags,
        images: [{ url: ogImage, width: 1200, height: 630, alt: doc.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: doc.title,
        description: doc.description,
        images: [ogImage],
      },
      robots: { index: true, follow: true },
      alternates: { canonical: `/docs/${category}/${slug}` },
      other: { "article:reading_time": rt, "article:difficulty": doc.difficulty },
    };
  }

  const course = findCourse(category, slug);
  if (course) {
    return {
      title: course.title,
      description: course.description,
      keywords: [course.category, course.provider, "AI Engineering", "tutorial"],
      openGraph: {
        title: course.title,
        description: course.description,
        type: "article",
        images: [{ url: "/og-default.png", width: 1200, height: 630, alt: course.title }],
      },
      twitter: { card: "summary_large_image", title: course.title, description: course.description },
      robots: { index: true, follow: true },
      alternates: { canonical: `/docs/${category}/${slug}` },
    };
  }

  return { title: "AI Engineering Tutorial", robots: { index: true, follow: true } };
}

export default async function DocPage({ params }: PageProps) {
  const { category, slug } = await params;
  const doc = getDocBySlug(category, slug);

  if (doc) {
    const headings = extractHeadings(doc.content);
    const ordered = getAllDocs().sort(
      (a, b) => a.category.localeCompare(b.category) || a.order - b.order
    );
    const idx = ordered.findIndex((d) => d.category === category && d.slug === slug);
    const next = idx >= 0 ? ordered[idx + 1] : undefined;
    const rt = readingTime(doc.content);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      headline: doc.title,
      description: doc.description,
      author: { "@type": "Organization", name: "AI Engineering Hub" },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      image: `https://aiengineeringhub.com/docs/${category}/${slug}/opengraph-image`,
      url: `https://aiengineeringhub.com/docs/${category}/${slug}`,
      difficulty: doc.difficulty,
      timeRequired: `PT${rt.replace(" min read", "")}M`,
      keywords: doc.tags.join(", "),
      teaches: doc.title,
      educationalLevel: doc.difficulty === "beginner" ? "beginner" : doc.difficulty === "intermediate" ? "intermediate" : "advanced",
      about: { "@type": "Thing", name: doc.tags[0] || "AI Engineering" },
    };

    return (
      <div className="flex">
        <article className="flex-1 min-w-0 max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {doc.category.replace(/^\d+-/, "").replace(/-/g, " ")}
              </span>
              <span className="text-muted-foreground/30">·</span>
              <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                Deep Research
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">{doc.title}</h1>
            <p className="text-muted-foreground">{doc.description}</p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {doc.difficulty && (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  doc.difficulty === "advanced"
                    ? "bg-destructive/10 text-destructive"
                    : doc.difficulty === "intermediate"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "bg-muted text-muted-foreground"
                }`}>
                  {doc.difficulty}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{rt}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/5 px-2.5 py-0.5 text-xs text-primary">
                <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.51l-2.52 10a2 2 0 0 0 2 2.49H10Z"/><path d="M22 10v9a2 2 0 0 1-2 2h-6"/></svg>
                Interactive Sandbox
              </span>
              {doc.tags.map((tag: string) => (
                <span key={tag} className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">{tag}</span>
              ))}
            </div>
          </header>
          <div className="prose prose-zinc dark:prose-invert sm:prose-lg max-w-none prose-pre:overflow-x-auto prose-table:block prose-table:overflow-x-auto">
            <MDXRemote
              source={doc.content}
              components={mdxComponents}
              options={{
                // Content is our own MDX, so allow JS expressions in props
                // (e.g. <Mermaid chart={`...`} />). Dangerous JS stays blocked.
                blockJS: false,
                mdxOptions: { remarkPlugins: [remarkGfm] },
              }}
            />
          </div>
          {quizzes[`${category}/${slug}`] && (
            <LessonQuiz
              id={`${category}/${slug}`}
              questions={quizzes[`${category}/${slug}`]}
            />
          )}
          <LessonComplete
            id={`${category}/${slug}`}
            nextHref={next ? `/docs/${next.category}/${next.slug}` : undefined}
            nextTitle={next?.title}
          />
          <LessonTutor title={doc.title} context={toPlain(doc.content).slice(0, 5000)} />
          <Newsletter variant="compact" />
        </article>
        <TableOfContents headings={headings} />
      </div>
    );
  }

  // Fallback: show dynamically generated deep-research template
  const course = findCourse(category, slug);
  const fallbackTitle = course?.title ?? slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
  const fallbackDesc = course?.description ?? `In-depth guide on ${fallbackTitle} for AI engineers.`;
  const fallbackLevel = course?.level ?? "Intermediate";
  const fallbackProvider = course?.provider ?? category.replace(/^\d+-/, "").replace(/-/g, " ");

  return (
    <div className="flex">
      <DocFallback
        doc={{
          title: fallbackTitle,
          description: fallbackDesc,
          provider: fallbackProvider,
          category: category.replace(/^\d+-/, "").replace(/-/g, " "),
          level: fallbackLevel,
          duration: course?.duration ?? "3 hours",
          rating: course?.rating ?? 4.5,
          slug,
        }}
      />
      <aside className="w-56 shrink-0 hidden xl:block">
        <div className="sticky top-20 overflow-y-auto">
          <h2 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            On This Page
          </h2>
          <nav className="space-y-1">
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5">
              Syllabus
            </a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5">
              Prerequisites
            </a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5">
              Code Example
            </a>
            <a href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-0.5">
              Resources
            </a>
          </nav>
        </div>
      </aside>
    </div>
  );
}
