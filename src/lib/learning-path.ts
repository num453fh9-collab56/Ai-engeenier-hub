import { getAllDocs } from "@/lib/mdx";
import { readingTime } from "@/lib/reading-time";

// The single source of truth for the curriculum. Live lessons reference real
// files; planned ones are clearly marked — never promise what doesn't exist.
type Item = { lesson: string } | { planned: string };

interface PhaseDef {
  id: string;
  title: string;
  goal: string;
  items: Item[];
}

export const PATH: PhaseDef[] = [
  {
    id: "1",
    title: "LLM Foundations",
    goal: "Call LLMs from code reliably: prompts, structured outputs and async pipelines.",
    items: [
      { lesson: "01-foundations/prompt-engineering" },
      { lesson: "01-foundations/intro" },
      { planned: "LLM APIs in practice: tokens, context windows and pricing" },
      { planned: "Streaming responses into a web app" },
    ],
  },
  {
    id: "2",
    title: "How LLMs Work",
    goal: "Understand the transformer so model behaviour, cost and limits make sense.",
    items: [
      { lesson: "01-foundations/transformers" },
      { planned: "Embeddings explained: meaning as vectors" },
      { planned: "Choosing a model: quality, cost and latency" },
    ],
  },
  {
    id: "3",
    title: "Retrieval-Augmented Generation",
    goal: "Ground answers in your own data with search that actually finds the right chunks.",
    items: [
      { lesson: "02-rag/vector-dbs" },
      { lesson: "02-rag/hybrid-search" },
      { lesson: "02-rag/rag-eval" },
      { planned: "Chunking and document ingestion" },
      { planned: "Build a complete RAG app end to end" },
    ],
  },
  {
    id: "4",
    title: "Tools & Agents",
    goal: "Let models take actions safely through tools and the agent loop.",
    items: [
      { lesson: "03-agents/react-pattern" },
      { planned: "Model Context Protocol (MCP): connecting tools" },
      { planned: "Agent memory and state" },
    ],
  },
  {
    id: "5",
    title: "Multi-Agent Systems",
    goal: "Coordinate several agents — and know when one is enough.",
    items: [
      { lesson: "03-agents/swarms" },
      { planned: "Agent frameworks compared" },
    ],
  },
  {
    id: "6",
    title: "Fine-Tuning",
    goal: "Adapt open models to your task cheaply with LoRA and QLoRA.",
    items: [
      { lesson: "04-finetuning/fine-tuning" },
      { planned: "Preparing training data" },
      { planned: "Prompting vs RAG vs fine-tuning: a decision guide" },
    ],
  },
  {
    id: "7",
    title: "Production & LLMOps",
    goal: "Serve, monitor and scale LLM features without surprises.",
    items: [
      { lesson: "04-finetuning/groq-inference" },
      { lesson: "04-finetuning/mlops" },
      { planned: "Cost optimization and caching" },
      { planned: "Observability and tracing" },
    ],
  },
  {
    id: "8",
    title: "Safety & Responsible AI",
    goal: "Ship AI features that are safe, private and hard to abuse.",
    items: [
      { lesson: "04-finetuning/safety" },
      { planned: "Privacy, PII and compliance" },
    ],
  },
  {
    id: "9",
    title: "Capstone Projects",
    goal: "Put it all together in portfolio projects you can show employers.",
    items: [
      { planned: "Capstone: document Q&A assistant" },
      { planned: "Capstone: customer-support agent" },
      { planned: "Capstone: multi-agent research tool" },
    ],
  },
];

export interface PathItem {
  title: string;
  live: boolean;
  id?: string;
  href?: string;
  difficulty?: string;
  readTime?: string;
}
export interface PathPhase {
  id: string;
  title: string;
  goal: string;
  items: PathItem[];
  liveCount: number;
}

// Server-only: resolve lesson references to real titles and links
export function getLearningPath(): PathPhase[] {
  const docs = new Map(getAllDocs().map((d) => [`${d.category}/${d.slug}`, d]));
  return PATH.map((p) => {
    const items: PathItem[] = p.items.map((it) => {
      if ("planned" in it) return { title: it.planned, live: false };
      const d = docs.get(it.lesson);
      if (!d) return { title: it.lesson, live: false };
      return {
        title: d.title,
        live: true,
        id: it.lesson,
        href: `/docs/${it.lesson}`,
        difficulty: d.difficulty,
        readTime: readingTime(d.content),
      };
    });
    return { id: p.id, title: p.title, goal: p.goal, items, liveCount: items.filter((i) => i.live).length };
  });
}
