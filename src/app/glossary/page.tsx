import type { Metadata } from "next";
import { BookA } from "lucide-react";
import { GLOSSARY_CATEGORIES, glossary } from "@/lib/glossary";
import { getAllDocs } from "@/lib/mdx";
import { GlossaryExplorer } from "@/components/glossary-explorer";
import { Cube, Ring, Sphere } from "@/components/shapes-3d";

export const metadata: Metadata = {
  title: "AI Engineering Glossary — LLM, RAG & agent terms explained simply",
  description: `${glossary.length} AI engineering terms explained in plain English and Roman Urdu — tokens, context windows, RAG, embeddings, agents, MCP, LoRA, evals and more — with links to lessons and tools.`,
  alternates: { canonical: "/glossary" },
};

export default function GlossaryPage() {
  const lessonTitles = Object.fromEntries(getAllDocs().map((d) => [`${d.category}/${d.slug}`, d.title]));
  // Structured data so search engines understand this is a glossary
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "AI Engineering Glossary",
    hasDefinedTerm: glossary.map((t) => ({ "@type": "DefinedTerm", name: t.term, description: t.def, url: `/glossary#${t.slug}` })),
  };

  return (
    <div className="flex flex-1 flex-col pb-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="bg-landing relative overflow-hidden px-4 py-14">
        <Ring className="-right-6 top-6" size={110} />
        <Cube className="left-[6%] bottom-6 hidden sm:block" size={36} delay={1} />
        <Sphere className="right-[18%] bottom-4 hidden md:block" size={30} delay={2} />
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/15">
            <BookA className="size-3.5" /> Glossary
          </div>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight sm:text-5xl">AI engineering, in plain words</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Every term you&apos;ll meet in the lessons — explained simply in English and Roman Urdu, linked to the lesson
            that teaches it and the tools that use it. Then test yourself with flashcards.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            {[
              [glossary.length, "terms"],
              [GLOSSARY_CATEGORIES.length, "categories"],
              [glossary.filter((t) => t.lesson).length, "linked to lessons"],
            ].map(([v, l]) => (
              <div key={String(l)}>
                <p className="text-2xl font-bold">{v}</p>
                <p className="text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto w-full max-w-4xl px-4">
        <GlossaryExplorer lessonTitles={lessonTitles} />
      </div>
    </div>
  );
}
