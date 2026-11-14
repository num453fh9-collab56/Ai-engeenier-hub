// Free-tier and pricing facts for every tool in the directory.
// Checked against each tool's official pricing page / GitHub repo on PRICING_CHECKED.
// Prices change often — the UI always links to the official page.

export const PRICING_CHECKED = "Nov 2026";

export interface ToolPricing {
  free: string;         // what you get for $0
  paid?: string;        // where paid starts (if any)
  license?: string;     // for open-source / source-available projects
  stars?: string;       // GitHub stars on PRICING_CHECKED
  pricingUrl: string;   // official page to double-check
}

export const TOOL_PRICING: Record<string, ToolPricing> = {
  // LLM APIs
  "openai-api": {
    free: "No free API tier. Pay-as-you-go per token.",
    paid: "Cheapest: gpt-5-nano $0.05 in / $0.40 out per 1M tokens",
    pricingUrl: "https://developers.openai.com/api/docs/pricing",
  },
  "anthropic-api": {
    free: "No free API tier. Pay-as-you-go per token.",
    paid: "Cheapest: Claude Haiku 5.5 $0.10 in / $0.50 out per 1M tokens",
    pricingUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
  },
  "gemini-api": {
    free: "Free tier for many Flash / Flash-Lite models via Google AI Studio. Free-tier content is used to improve Google's products.",
    paid: "From $0.25 in / $1.50 out per 1M tokens (Gemini 3.1 Flash-Lite)",
    pricingUrl: "https://aistudio.google.com/docs/pricing",
  },
  groq: {
    free: "Free plan, no credit card. Rate-limited (e.g. gpt-oss-120b: 30 requests/min, 1K requests/day).",
    paid: "Developer plan: add a card for higher limits, pay per token",
    pricingUrl: "https://console.groq.com/docs/rate-limits",
  },
  mistral: {
    free: "Free plan includes Studio access with limited usage.",
    paid: "Pay per token, e.g. Mistral Large $0.50 in / $1.50 out per 1M tokens",
    pricingUrl: "https://mistral.ai/pricing",
  },
  together: {
    free: "Some models are free on serverless inference (e.g. Ternary Bonsai 27B).",
    paid: "Pay per token, e.g. Qwen3.5 9B $0.17 in / $0.25 out per 1M tokens",
    pricingUrl: "https://www.together.ai/pricing",
  },

  // Local & self-hosted
  ollama: {
    free: "Running models locally is free and unlimited. Ollama Cloud has a $0 pay-as-you-go plan.",
    paid: "Cloud Pro $20/month (includes $60 usage credits)",
    license: "MIT", stars: "187k",
    pricingUrl: "https://ollama.com/pricing",
  },
  vllm: { free: "Free and open source — you pay only for your own GPUs.", license: "Apache-2.0", stars: "97k", pricingUrl: "https://github.com/vllm-project/vllm" },
  "llama-cpp": { free: "Free and open source — runs on CPUs and modest GPUs.", license: "MIT", stars: "135k", pricingUrl: "https://github.com/ggml-org/llama.cpp" },
  "hf-transformers": { free: "Free and open source library.", license: "Apache-2.0", stars: "169k", pricingUrl: "https://github.com/huggingface/transformers" },

  // Frameworks & agents
  langchain: { free: "Free and open source framework.", paid: "Optional: LangSmith for tracing (see below)", license: "MIT", stars: "149k", pricingUrl: "https://www.langchain.com/pricing" },
  llamaindex: {
    free: "Framework is free and open source. LlamaCloud / LlamaParse: 10K free credits per month.",
    paid: "LlamaCloud pay-as-you-go $1.50 per 1K credits; Pro $500/month",
    license: "MIT", stars: "53k",
    pricingUrl: "https://www.llamaindex.ai/pricing",
  },
  "ai-sdk": { free: "Free and open source — use it with any model provider.", license: "Apache-2.0", stars: "28k", pricingUrl: "https://github.com/vercel/ai" },
  dspy: { free: "Free and open source.", license: "MIT", stars: "39k", pricingUrl: "https://github.com/stanfordnlp/dspy" },
  crewai: {
    free: "Framework is free and open source. Hosted platform (AMP) free plan: 50 workflow executions per month.",
    paid: "Enterprise: custom pricing",
    license: "MIT", stars: "61k",
    pricingUrl: "https://www.crewai.com/pricing",
  },
  autogen: { free: "Free and open source.", license: "MIT (code)", stars: "62k", pricingUrl: "https://github.com/microsoft/autogen" },

  // Vector databases
  pinecone: {
    free: "Starter: free — 2 GB storage, 2M write + 1M read units/month, 5 indexes (AWS us-east-1).",
    paid: "Builder $20/month",
    pricingUrl: "https://www.pinecone.io/pricing/",
  },
  qdrant: {
    free: "Open source (self-host free). Qdrant Cloud: free-forever 1 GB RAM / 4 GB disk cluster for prototypes.",
    paid: "Standard: usage-based, billed hourly",
    license: "Apache-2.0", stars: "36k",
    pricingUrl: "https://qdrant.tech/pricing/",
  },
  weaviate: {
    free: "Open source (self-host free). Weaviate Cloud: always-free cluster — 100K objects, 1 GB memory, 10 GB disk.",
    paid: "Flex from $45/month, pay-as-you-go",
    license: "BSD-3-Clause", stars: "17k",
    pricingUrl: "https://weaviate.io/pricing",
  },
  chroma: {
    free: "Open source (self-host free). Chroma Cloud Starter: $0/month + usage, with $5 free credits.",
    paid: "Team $250/month + usage",
    license: "Apache-2.0", stars: "30k",
    pricingUrl: "https://www.trychroma.com/pricing",
  },
  pgvector: { free: "Free and open source Postgres extension — included by many hosted Postgres providers.", license: "PostgreSQL", stars: "24k", pricingUrl: "https://github.com/pgvector/pgvector" },
  milvus: {
    free: "Open source (self-host free). Zilliz Cloud free tier: 5 GB storage, 5 collections, 2.5M vCUs/month.",
    paid: "Zilliz Standard: serverless from $0 + usage, dedicated from $126/month",
    license: "Apache-2.0", stars: "47k",
    pricingUrl: "https://zilliz.com/pricing",
  },

  // Evaluation & observability
  ragas: { free: "Free and open source.", license: "Apache-2.0", stars: "16k", pricingUrl: "https://github.com/explodinggradients/ragas" },
  langsmith: {
    free: "Developer: free — 1 seat, 5K traces/month, then pay-as-you-go.",
    paid: "Plus $39 per seat/month (10K traces included)",
    pricingUrl: "https://www.langchain.com/pricing",
  },
  langfuse: {
    free: "Self-hosting is free (open source). Cloud Hobby: 50K units/month, 2 users, 30 days of data.",
    paid: "Core $29/month",
    license: "MIT (core)", stars: "37k",
    pricingUrl: "https://langfuse.com/pricing",
  },
  wandb: {
    free: "Free plan for personal projects: 5 GB storage/month, 1 GB Weave ingestion/month.",
    paid: "Pro from $60/month (30-day trial)",
    pricingUrl: "https://coreweave.com/forge-pricing",
  },
  phoenix: {
    free: "Phoenix is free to self-host (source-available). Arize AX Free: 25K spans/month, 15-day retention.",
    paid: "AX Pro $50/month",
    license: "Elastic License 2.0", stars: "12k",
    pricingUrl: "https://arize.com/pricing/",
  },

  // Fine-tuning
  unsloth: { free: "Free and open source library — works on free Colab GPUs.", license: "Apache-2.0", stars: "79k", pricingUrl: "https://github.com/unslothai/unsloth" },
  axolotl: { free: "Free and open source.", license: "Apache-2.0", stars: "13k", pricingUrl: "https://github.com/axolotl-ai-cloud/axolotl" },
  peft: { free: "Free and open source library.", license: "Apache-2.0", stars: "22k", pricingUrl: "https://github.com/huggingface/peft" },

  // Safety
  "nemo-guardrails": { free: "Free and open source toolkit.", license: "Apache-2.0", stars: "7.5k", pricingUrl: "https://github.com/NVIDIA/NeMo-Guardrails" },
  "guardrails-ai": { free: "Free and open source library.", license: "Apache-2.0", stars: "7.6k", pricingUrl: "https://github.com/guardrails-ai/guardrails" },
};
