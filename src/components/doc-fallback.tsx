"use client";

import { useState } from "react";
import { Clock, Star, Copy, Check, FileDown, BookOpen, Target, GitBranch, ExternalLink } from "lucide-react";

interface FallbackDoc {
  title: string;
  description: string;
  provider: string;
  category: string;
  level: string;
  duration: string;
  rating: number;
  slug: string;
}

const contentBySlug: Record<string, {
  objectives: string[];
  prerequisites: string[];
  syllabus: { title: string; items: string[] }[];
  code: { language: string; filename: string; code: string }[];
  exercises: string[];
  resources: { label: string; url: string }[];
}> = {
  default: {
    objectives: [
      "Understand the core concepts and architecture of the topic",
      "Implement a production-ready solution with best practices",
      "Evaluate trade-offs between different approaches",
      "Apply the knowledge to real-world AI engineering problems",
    ],
    prerequisites: [
      "Basic Python programming (functions, classes, async/await)",
      "Familiarity with machine learning concepts",
      "Comfortable with command line tools and package management",
    ],
    syllabus: [
      { title: "Introduction & Motivation", items: ["Why this matters", "Real-world use cases", "Expected outcomes"] },
      { title: "Core Concepts & Architecture", items: ["Key terminology", "System design overview", "Component interactions"] },
      { title: "Mathematical Derivation", items: ["Formal definition", "Key equations", "Intuition behind the math"] },
      { title: "Implementation Walkthrough", items: ["Step-by-step setup", "Core implementation", "Edge cases and error handling"] },
      { title: "Production Code Example", items: ["Complete runnable script", "Configuration and environment", "Testing strategy"] },
      { title: "Best Practices & Pitfalls", items: ["Common mistakes", "Performance optimization", "Security considerations"] },
    ],
    code: [
      {
        language: "python",
        filename: "implementation.py",
        code: `"""
Production-ready implementation template.
Replace with actual logic for your specific use case.
"""
import os
import logging
from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Config:
    def __init__(self):
        self.api_key: Optional[str] = os.getenv("API_KEY")
        self.model: str = os.getenv("MODEL", "gpt-4o")
        self.max_retries: int = int(os.getenv("MAX_RETRIES", "3"))

class Implementation:
    def __init__(self, config: Optional[Config] = None):
        self.config = config or Config()

    async def run(self, input_data: str) -> dict:
        logger.info("Processing input of length %d", len(input_data))
        result = await self._process(input_data)
        return {"status": "success", "result": result}

    async def _process(self, data: str) -> str:
        # Main processing logic
        return f"Processed: {data}"

async def main():
    impl = Implementation()
    result = await impl.run("example input")
    logger.info("Result: %s", result)

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())`,
      },
    ],
    exercises: [
      "Extend the implementation to support batch processing of multiple inputs",
      "Add error handling and retry logic with exponential backoff",
      "Write unit tests covering the main processing pipeline",
      "Benchmark performance and identify the primary bottleneck",
    ],
    resources: [
      { label: "Official Documentation", url: "#" },
      { label: "Research Paper", url: "#" },
      { label: "Reference Implementation", url: "#" },
    ],
  },
  "async-structured-outputs": {
    objectives: [
      "Master async Python patterns for concurrent LLM requests",
      "Build type-safe structured output pipelines with Pydantic",
      "Handle rate limiting, retries, and error recovery in production",
    ],
    prerequisites: [
      "Intermediate Python (decorators, type hints, context managers)",
      "Basic understanding of LLM APIs",
      "Familiarity with async/await syntax",
    ],
    syllabus: [
      { title: "Why Structured Outputs?", items: ["Fragility of raw text parsing", "Type safety at the API boundary", "Pydantic model validation"] },
      { title: "Async LLM Clients", items: ["AsyncOpenAI setup", "Concurrent request patterns", "Connection pooling and reuse"] },
      { title: "The Instructor Library", items: ["Response model binding", "Retry and validation", "Streaming with structured outputs"] },
      { title: "Production Patterns", items: ["Rate limiting with semaphores", "Graceful degradation", "Observability and logging"] },
    ],
    code: [
      {
        language: "python",
        filename: "structured_outputs.py",
        code: `import instructor
from openai import AsyncOpenAI
from pydantic import BaseModel, Field
import asyncio

client = instructor.from_openai(AsyncOpenAI())

class EntityExtraction(BaseModel):
    entities: list[str] = Field(description="Extracted named entities")
    relationships: list[dict] = Field(description="Entity relationships")
    confidence: float = Field(ge=0, le=1)

async def extract(text: str) -> EntityExtraction:
    return await client.chat.completions.create(
        model="gpt-4o",
        response_model=EntityExtraction,
        messages=[{"role": "user", "content": f"Extract entities: {text}"}],
    )

async def batch_extract(texts: list[str]) -> list[EntityExtraction]:
    sem = asyncio.Semaphore(5)
    async def bounded(text: str) -> EntityExtraction:
        async with sem:
            return await extract(text)
    return await asyncio.gather(*[bounded(t) for t in texts])

if __name__ == "__main__":
    results = asyncio.run(batch_extract([
        "Apple acquired a startup in Cupertino",
        "Microsoft partnered with OpenAI on Azure",
    ]))
    for r in results:
        print(r.model_dump_json(indent=2))`,
      },
    ],
    exercises: [
      "Add a custom validator that ensures all entities are unique",
      "Implement a streaming version that yields results as they arrive",
      "Add Prometheus metrics for request latency and error rates",
    ],
    resources: [
      { label: "Instructor Docs", url: "https://python.useinstructor.com" },
      { label: "OpenAI Structured Outputs Guide", url: "https://platform.openai.com/docs/guides/structured-outputs" },
    ],
  },
};

export function DocFallback({ doc }: { doc: FallbackDoc }) {
  const [copied, setCopied] = useState(false);
  const content = contentBySlug[doc.slug] ?? contentBySlug.default;

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback silent */ }
  };

  return (
    <article className="flex-1 min-w-0 max-w-3xl mx-auto px-6 py-10">
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {doc.category}
          </span>
          <span className="text-muted-foreground/30">·</span>
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            Deep Research
          </span>
          <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
            {doc.provider}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight mb-2">{doc.title}</h1>
        <p className="text-muted-foreground mb-4">{doc.description}</p>

        <div className="flex items-center gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-amber-500 text-amber-500" />
            <span className="font-medium">{doc.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-4" />
            <span>{doc.duration}</span>
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            doc.level === "Advanced"
              ? "bg-destructive/10 text-destructive"
              : doc.level === "Intermediate"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                : "bg-muted text-muted-foreground"
          }`}>
            {doc.level}
          </span>
        </div>
      </header>

      {/* Learning Objectives */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Target className="size-4 text-primary" />
          Learning Objectives
        </h2>
        <ul className="space-y-2">
          {content.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-0.5 size-1.5 rounded-full bg-primary shrink-0" />
              {obj}
            </li>
          ))}
        </ul>
      </div>

      {/* Prerequisites */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Prerequisites</h2>
        <ul className="space-y-1.5">
          {content.prerequisites.map((pr, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="mt-0.5 size-1.5 rounded-full bg-amber-500 shrink-0" />
              {pr}
            </li>
          ))}
        </ul>
      </div>

      {/* Syllabus with details */}
      <div className="mb-8 space-y-4">
        {content.syllabus.map((section, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {i + 1}
              </span>
              {section.title}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item, j) => (
                <li key={j} className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="text-primary/50">&ndash;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Code Examples */}
      {content.code.map((example, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="size-4 text-primary" />
            {i === 0 ? "Production Code Example" : `Code Example ${i + 1}`}
          </h2>
          <div className="group relative rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  {example.filename}
                </span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {example.language}
                </span>
              </div>
              <button
                onClick={() => handleCopy(example.code)}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {copied ? <Check className="size-3.5 text-green-500" /> : <Copy className="size-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
              <code>{example.code}</code>
            </pre>
          </div>
        </div>
      ))}

      {/* Interactive Exercises */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <GitBranch className="size-4 text-primary" />
          Interactive Exercises
        </h2>
        <ol className="space-y-2">
          {content.exercises.map((ex, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] font-medium text-emerald-500 mt-0.5">
                {i + 1}
              </span>
              {ex}
            </li>
          ))}
        </ol>
      </div>

      {/* Resources */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="text-sm font-semibold mb-3">Resources</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.resources.map((res, i) => (
            <a
              key={i}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm transition-colors hover:bg-accent"
            >
              {i === 0 ? <ExternalLink className="size-4 text-primary" /> :
               i === 1 ? <FileDown className="size-4 text-primary" /> :
                         <GitBranch className="size-4 text-primary" />}
              <span className="font-medium">{res.label}</span>
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
