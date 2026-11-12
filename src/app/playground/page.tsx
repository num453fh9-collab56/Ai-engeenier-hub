import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { getAllDocs } from "@/lib/mdx";
import { toPlain } from "@/lib/plain-text";
import { PlaygroundTabs } from "@/components/playground/tabs";
import type { Chunk } from "@/components/playground/rag";

export const metadata: Metadata = {
  title: "AI Playground — Tokenizer, Embeddings & RAG",
  description:
    "Interactive, in-browser demos: see how text becomes tokens, how embeddings rank similarity, and how RAG retrieves context before generating.",
  alternates: { canonical: "/playground" },
};

function chunkDocs(): Chunk[] {
  const chunks: Chunk[] = [];
  for (const doc of getAllDocs()) {
    const href = `/docs/${doc.category}/${doc.slug}`;
    const sections = doc.content.split(/^##\s+/m);
    sections.forEach((sec, i) => {
      const [first, ...rest] = sec.split("\n");
      const heading = i === 0 ? "Introduction" : first.trim();
      const text = toPlain(i === 0 ? sec : rest.join("\n"));
      if (text.length < 60) return;
      chunks.push({
        id: `${href}#${i}`,
        title: doc.title,
        heading,
        href,
        text: text.slice(0, 900),
      });
    });
  }
  return chunks;
}

export default function PlaygroundPage() {
  const chunks = chunkDocs();
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary mb-4">
          <FlaskConical className="size-3.5" />
          Runs in your browser
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">AI Playground</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Don&apos;t just read about LLM internals — poke them. Watch text turn
          into tokens, rank sentences by embedding similarity, and run a real
          RAG pipeline over this site&apos;s lessons.
        </p>
      </div>
      <PlaygroundTabs chunks={chunks} />
    </div>
  );
}
