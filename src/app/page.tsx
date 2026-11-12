import Link from "next/link";
import {
  ArrowRight,
  Route,
  Sparkles,
  BookOpen,
  FileDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Newsletter } from "@/components/newsletter";
import { CourseGrid } from "@/components/course-grid";
import { CurriculumRoadmap } from "@/components/curriculum-roadmap";
import { HeroDemo } from "@/components/hero-demo";
import { getAllDocs } from "@/lib/mdx";
import { glossary } from "@/lib/glossary";

const technologies = [
  { label: "OpenAI" },
  { label: "Anthropic Claude" },
  { label: "Meta LLaMA" },
  { label: "DeepSeek" },
  { label: "LangChain" },
  { label: "Pinecone" },
  { label: "Groq" },
];

const volumes = [
  {
    vol: "Vol. 1",
    title: "Foundations",
    description: "Math, ML fundamentals, Python, and tooling setup.",
    gradient: "from-blue-600/20 to-indigo-600/10",
  },
  {
    vol: "Vol. 2",
    title: "Deep Learning",
    description: "Neural networks, CNNs, RNNs, transformers, and vision.",
    gradient: "from-purple-600/20 to-pink-600/10",
  },
  {
    vol: "Vol. 3",
    title: "Language",
    description: "NLP, LLMs from scratch, tokenization, and alignment.",
    gradient: "from-emerald-600/20 to-teal-600/10",
  },
  {
    vol: "Vol. 4",
    title: "LLMs & RAG",
    description: "Fine-tuning, prompt engineering, RAG, and multimodal.",
    gradient: "from-amber-600/20 to-orange-600/10",
  },
  {
    vol: "Vol. 5",
    title: "Agents",
    description: "ReAct, multi-agent swarms, tools, and autonomous systems.",
    gradient: "from-rose-600/20 to-red-600/10",
  },
  {
    vol: "Vol. 6",
    title: "Production",
    description: "MLOps, serving, safety, alignment, and capstone projects.",
    gradient: "from-cyan-600/20 to-sky-600/10",
  },
];

export default function Home() {
  const docs = getAllDocs();
  const lessonCount = docs.length;
  const trackCount = new Set(docs.map((d) => d.category)).size;

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-20">
        <div className="absolute inset-0 bg-radial-gradient-hero pointer-events-none" />
        <div className="absolute inset-0 bg-hero-grid pointer-events-none" />
        <div className="absolute -top-24 left-1/4 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-3xl pointer-events-none animate-aurora" />
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none animate-aurora [animation-delay:-6s]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="text-center lg:text-left animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary mb-6">
                <Sparkles className="size-3.5" />
                <span>{lessonCount} lessons live — new lessons every week</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4">
                Become the AI Engineer{" "}
                <span className="bg-gradient-to-r from-primary via-cyan-400 to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
                  companies hire
                </span>
              </h1>

              <p className="max-w-2xl mx-auto lg:mx-0 text-lg text-muted-foreground mb-8">
                From raw math to production RAG and autonomous agents — free,
                hands-on lessons with real Python &amp; TypeScript code. Try the
                live AI demo — ask it anything.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-12">
                <Button size="lg" asChild>
                  <Link href="/docs/01-foundations/intro">
                    Start Learning
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-background/60 backdrop-blur-sm border-primary/20 hover:bg-primary/5"
                  asChild
                >
                  <Link href="/roadmap">
                    <Route className="size-4" />
                    View Full Curriculum
                  </Link>
                </Button>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto lg:mx-0">
                {[
                  { value: String(lessonCount), label: "In-Depth Lessons" },
                  { value: String(trackCount), label: "Learning Tracks" },
                  { value: "20", label: "Roadmap Phases" },
                  { value: String(glossary.length), label: "Glossary Terms" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-border/60 bg-card/50 backdrop-blur px-4 py-3 transition-colors hover:border-primary/40"
                  >
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Right Column — Live AI demo */}
            <div className="flex items-center justify-center">
              <HeroDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Logo Ticker */}
      <section className="py-8 border-y border-border/40">
        <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Powered by industry leaders
        </p>
        <div className="relative overflow-hidden">
          <div className="flex gap-12 animate-ticker w-max items-center">
            {[...technologies, ...technologies].map((tech, i) => (
              <div
                key={`${tech.label}-${i}`}
                className="flex items-center justify-center rounded-lg border border-border/50 bg-card/50 px-4 py-2.5 shrink-0"
              >
                <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
                  {tech.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CourseGrid />

      <CurriculumRoadmap />

      {/* Compiled Book Editions */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-3">
              Compiled Book Editions
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Six volumes covering the complete AI Engineering curriculum.
              Download EPUB or PDF for offline reading.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {volumes.map((vol, i) => (
              <div
                key={vol.vol}
                className="group relative overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:shadow-md hover:border-primary/30"
              >
                <div className={`h-24 bg-gradient-to-br ${vol.gradient} flex items-center justify-center`}>
                  <BookOpen className="size-8 text-foreground/15" />
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-md bg-background/80 px-2 py-0.5 text-xs font-semibold">
                    {vol.vol}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-1">{vol.title}</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    {vol.description}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href={`/api/download?volume=${i + 1}&format=epub`}
                      download
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                    >
                      <FileDown className="size-3.5" />
                      EPUB
                    </a>
                    <a
                      href={`/api/download?volume=${i + 1}&format=pdf`}
                      download
                      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                    >
                      <FileDown className="size-3.5" />
                      PDF
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
