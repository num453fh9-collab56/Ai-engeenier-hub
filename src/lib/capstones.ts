// Capstone projects: portfolio-grade builds that combine several lessons.
// They are project briefs (requirements, milestones, rubric) — the learner writes the code.

export interface Milestone {
  title: string;
  tasks: string[];
}

export interface Capstone {
  slug: string;
  title: string;
  tagline: string;
  level: "Intermediate" | "Advanced";
  hours: string;
  brief: string;          // the "client" problem
  youBuild: string[];     // features of the finished app
  stack: string[];        // directory slugs
  lessons: string[];      // lesson ids to finish first
  milestones: Milestone[];
  rubric: string[];       // acceptance criteria — "done" means all of these are true
  stretch: string[];
  freelance: string;      // how this becomes paid work
}

export const capstones: Capstone[] = [
  {
    slug: "document-qa-assistant",
    title: "Document Q&A Assistant",
    tagline: "Chat with a company's PDFs and get answers with citations.",
    level: "Intermediate",
    hours: "10–15 hours",
    brief:
      "A small company has 50+ PDFs and policy documents. Staff waste time searching them. They want a chat box where anyone can ask a question and get a correct answer that shows exactly which document and page it came from — and that says \"I don't know\" instead of guessing.",
    youBuild: [
      "Upload or point to a folder of PDFs and Markdown files",
      "Ingestion pipeline: clean, chunk, embed and index",
      "Chat UI that answers with numbered citations (file + page)",
      "Refuses to answer when the documents don't contain the answer",
      "An evaluation script that scores answers on a test set",
    ],
    stack: ["groq", "qdrant", "llamaindex", "ragas", "langfuse"],
    lessons: ["02-rag/chunking", "02-rag/vector-dbs", "02-rag/hybrid-search", "02-rag/rag-eval"],
    milestones: [
      { title: "1. Ingestion", tasks: ["Load PDFs page by page and strip headers/footers", "Chunk with headings and stable IDs", "Embed and store chunks with source + page metadata"] },
      { title: "2. Retrieval", tasks: ["Hybrid search (keyword + vector)", "Re-rank the top results", "Write 25 test questions with expected answers"] },
      { title: "3. Answering", tasks: ["Prompt that answers only from retrieved context", "Numbered citations linking to file + page", "\"I don't know\" when the context is not enough"] },
      { title: "4. Quality", tasks: ["Run an evaluation (faithfulness, answer relevancy)", "Log every request with tokens and latency", "Fix the 3 worst failures and re-run the eval"] },
      { title: "5. Ship it", tasks: ["Simple web UI (Streamlit, Next.js or similar)", "README with architecture diagram and eval results", "Deploy a demo and record a 2-minute video"] },
    ],
    rubric: [
      "At least 80% of your test questions answered correctly (by your own eval)",
      "Every answer shows its sources; no source → no claim",
      "Says it doesn't know for questions outside the documents",
      "Re-ingesting the same file doesn't create duplicates",
      "README explains how to run it in under 5 commands",
    ],
    stretch: ["Per-user document permissions", "Answer in the user's language (e.g. Roman Urdu)", "Incremental re-indexing when a file changes"],
    freelance:
      "\"Chat with your documents\" bots are one of the most requested AI gigs for law firms, schools, clinics and support teams. Your demo + eval numbers are the proof a client needs.",
  },
  {
    slug: "customer-support-agent",
    title: "Customer-Support Agent",
    tagline: "An agent that answers FAQs, checks orders with tools, and hands off to a human.",
    level: "Advanced",
    hours: "15–20 hours",
    brief:
      "An online shop gets hundreds of messages a day: order status, returns, delivery questions. They want an AI agent that answers common questions from their policies, looks up real order data through tools, never invents information, and passes angry or complex cases to a human with a summary.",
    youBuild: [
      "Agent loop with tools: get_order, start_return, search_policies",
      "Policy answers grounded in the shop's FAQ (small RAG)",
      "Guardrails: no refunds above a limit without a human, PII masking",
      "Human handoff with an automatic conversation summary",
      "A test suite of 30 realistic conversations",
    ],
    stack: ["openai-api", "langchain", "chroma", "guardrails-ai", "langsmith"],
    lessons: ["03-agents/react-pattern", "03-agents/mcp", "04-finetuning/safety", "02-rag/vector-dbs"],
    milestones: [
      { title: "1. Tools", tasks: ["Fake order database (JSON or SQLite)", "Tools with clear schemas and input validation", "Expose the tools as an MCP server (optional but impressive)"] },
      { title: "2. Agent loop", tasks: ["ReAct loop with a step limit", "Ground policy answers with a small FAQ index", "Structured final answer: reply + action + confidence"] },
      { title: "3. Safety", tasks: ["Block actions above a refund limit", "Mask phone numbers and emails in logs", "Resist prompt injection from customer messages"] },
      { title: "4. Handoff", tasks: ["Detect frustration or out-of-scope requests", "Create a handoff ticket with a short summary", "Track which conversations needed a human"] },
      { title: "5. Evaluate & ship", tasks: ["30-conversation test suite with expected outcomes", "Trace each run (tools called, tokens, latency)", "Demo UI + README with results"] },
    ],
    rubric: [
      "Correct tool used in at least 90% of your test conversations",
      "Never states an order detail that the tools didn't return",
      "Every refund above the limit goes to a human",
      "Prompt-injection test messages don't change its behaviour",
      "Handoff summaries are short and accurate",
    ],
    stretch: ["WhatsApp or web-widget front end", "Multilingual replies", "Analytics: top questions and handoff rate"],
    freelance:
      "Support agents connected to a store's real systems are high-value automation projects. Show the handoff and guardrails — that's what makes a business trust it.",
  },
  {
    slug: "multi-agent-research-tool",
    title: "Multi-Agent Research Tool",
    tagline: "A team of agents that researches a topic in parallel and writes a cited report.",
    level: "Advanced",
    hours: "15–25 hours",
    brief:
      "A marketing team spends days writing competitor and market reports. They want a tool where they type a goal — \"compare the top 3 project-management apps for small agencies\" — and get a structured, cited report in minutes, with a reviewer step that catches unsupported claims.",
    youBuild: [
      "Lead agent that plans sub-questions",
      "Worker agents that research in parallel with a search tool",
      "Writer that merges findings into a report with sources",
      "Reviewer agent that flags unsupported claims (max 2 revision rounds)",
      "Cost and time budget per run, with a full trace",
    ],
    stack: ["anthropic-api", "crewai", "langfuse", "pinecone"],
    lessons: ["03-agents/swarms", "03-agents/react-pattern", "03-agents/mcp", "04-finetuning/mlops"],
    milestones: [
      { title: "1. Single-agent baseline", tasks: ["One agent + search tool answers the goal", "Save its report and cost as the baseline"] },
      { title: "2. Orchestrator–workers", tasks: ["Lead writes 3–5 delegation briefs", "Workers run in parallel and return structured findings", "Handle a worker failure without crashing the run"] },
      { title: "3. Report & review", tasks: ["Writer produces a cited report", "Reviewer returns approved + list of issues", "At most 2 revision rounds"] },
      { title: "4. Budgets & tracing", tasks: ["Cap tokens, time and number of agents per run", "Trace every agent with a parent ID"] },
      { title: "5. Compare & ship", tasks: ["Compare team vs baseline on 5 goals (quality, cost, time)", "README with the comparison table and a demo"] },
    ],
    rubric: [
      "Every factual sentence in the report has a source",
      "The team beats the single-agent baseline on your quality check — or you explain honestly why not",
      "No run exceeds its token/time budget",
      "A failing worker produces a report with a noted gap, not a crash",
      "Traces show who delegated what to whom",
    ],
    stretch: ["Route easy sub-tasks to a cheaper model", "Save reports and search them later (RAG over past reports)", "Schedule weekly auto-updates of a report"],
    freelance:
      "Research and report automation sells to agencies and consultants. Your baseline-vs-team comparison shows you understand cost, not just hype.",
  },
];

export const capstoneBySlug = Object.fromEntries(capstones.map((c) => [c.slug, c]));

export function taskCount(c: Capstone) {
  return c.milestones.reduce((n, m) => n + m.tasks.length, 0);
}
