export type Pricing = "Open source" | "Free tier" | "Paid";
export type Deploy = "Cloud" | "Self-host" | "Local";

export interface AiTool {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  pricing: Pricing;
  openSource: boolean;
  deploy: Deploy[];
  languages: string[];
  bestFor: string;
  url: string;
  lessons?: string[]; // related lesson ids `${category}/${slug}`
}

export const TOOL_CATEGORIES = [
  "LLM APIs",
  "Local & Self-hosted Models",
  "Frameworks & Agents",
  "Vector Databases",
  "Evaluation & Observability",
  "Fine-Tuning",
  "Safety & Guardrails",
] as const;

export const aiTools: AiTool[] = [
  // LLM APIs
  {
    slug: "openai-api", name: "OpenAI API", category: "LLM APIs",
    tagline: "GPT models via a hosted API",
    description: "Hosted access to OpenAI's GPT and reasoning models, with function calling, structured outputs, embeddings and speech.",
    pricing: "Paid", openSource: false, deploy: ["Cloud"], languages: ["Python", "TypeScript", "REST"],
    bestFor: "General-purpose apps that need a broad, well-documented model lineup", url: "https://openai.com/api/",
    lessons: ["01-foundations/prompt-engineering", "01-foundations/intro"],
  },
  {
    slug: "anthropic-api", name: "Claude API", category: "LLM APIs",
    tagline: "Anthropic's Claude models for reasoning and coding",
    description: "Hosted Claude models with long context windows, tool use and prompt caching, popular for coding and agentic workloads.",
    pricing: "Paid", openSource: false, deploy: ["Cloud"], languages: ["Python", "TypeScript", "REST"],
    bestFor: "Long-document reasoning, coding assistants and agents", url: "https://www.anthropic.com/api",
    lessons: ["03-agents/react-pattern"],
  },
  {
    slug: "gemini-api", name: "Gemini API", category: "LLM APIs",
    tagline: "Google's multimodal models",
    description: "Google's Gemini models through AI Studio and Vertex AI, with native multimodal input (text, image, audio, video).",
    pricing: "Free tier", openSource: false, deploy: ["Cloud"], languages: ["Python", "TypeScript", "REST"],
    bestFor: "Multimodal apps and teams already on Google Cloud", url: "https://ai.google.dev/",
  },
  {
    slug: "groq", name: "Groq", category: "LLM APIs",
    tagline: "Ultra-low-latency inference on LPUs",
    description: "Serves popular open-weight models on custom LPU hardware through an OpenAI-compatible API, known for very high tokens/second.",
    pricing: "Free tier", openSource: false, deploy: ["Cloud"], languages: ["Python", "TypeScript", "REST"],
    bestFor: "Real-time chat and voice where latency matters most", url: "https://groq.com/",
    lessons: ["04-finetuning/groq-inference"],
  },
  {
    slug: "mistral", name: "Mistral AI", category: "LLM APIs",
    tagline: "Efficient models, hosted or open-weight",
    description: "European model provider offering a hosted API (La Plateforme) as well as several open-weight models you can run yourself.",
    pricing: "Paid", openSource: false, deploy: ["Cloud", "Self-host"], languages: ["Python", "TypeScript", "REST"],
    bestFor: "Cost-efficient models and EU data-residency needs", url: "https://mistral.ai/",
  },
  {
    slug: "together", name: "Together AI", category: "LLM APIs",
    tagline: "Run and fine-tune open models in the cloud",
    description: "Cloud platform for inference and fine-tuning of open-source models such as Llama, Qwen and DeepSeek.",
    pricing: "Paid", openSource: false, deploy: ["Cloud"], languages: ["Python", "TypeScript", "REST"],
    bestFor: "Using open models without managing GPUs", url: "https://www.together.ai/",
    lessons: ["04-finetuning/fine-tuning"],
  },
  // Local & self-hosted
  {
    slug: "ollama", name: "Ollama", category: "Local & Self-hosted Models",
    tagline: "Run LLMs on your own machine",
    description: "One-command download and serving of open models on macOS, Linux and Windows, with a local REST API.",
    pricing: "Open source", openSource: true, deploy: ["Local"], languages: ["CLI", "REST", "Python", "TypeScript"],
    bestFor: "Private, offline prototyping on a laptop", url: "https://ollama.com/",
  },
  {
    slug: "vllm", name: "vLLM", category: "Local & Self-hosted Models",
    tagline: "High-throughput LLM serving engine",
    description: "Open-source inference server using PagedAttention and continuous batching; exposes an OpenAI-compatible endpoint.",
    pricing: "Open source", openSource: true, deploy: ["Self-host"], languages: ["Python", "REST"],
    bestFor: "Serving open models in production on your own GPUs", url: "https://docs.vllm.ai/",
    lessons: ["04-finetuning/mlops"],
  },
  {
    slug: "llama-cpp", name: "llama.cpp", category: "Local & Self-hosted Models",
    tagline: "LLM inference in plain C/C++",
    description: "Lightweight inference for quantized (GGUF) models that runs on CPUs, Apple Silicon and consumer GPUs.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host"], languages: ["C++", "CLI", "REST"],
    bestFor: "Running models on modest or edge hardware", url: "https://github.com/ggml-org/llama.cpp",
  },
  {
    slug: "hf-transformers", name: "Hugging Face Transformers", category: "Local & Self-hosted Models",
    tagline: "The standard library for open models",
    description: "Python library to load, run and train thousands of pretrained models from the Hugging Face Hub.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host"], languages: ["Python"],
    bestFor: "Research, experimentation and custom training code", url: "https://huggingface.co/docs/transformers",
    lessons: ["01-foundations/transformers"],
  },
  // Frameworks & agents
  {
    slug: "langchain", name: "LangChain", category: "Frameworks & Agents",
    tagline: "Composable building blocks for LLM apps",
    description: "Framework with integrations for models, retrievers and tools, plus LangGraph for stateful, graph-based agents.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host", "Cloud"], languages: ["Python", "TypeScript"],
    bestFor: "Quickly wiring many integrations together", url: "https://www.langchain.com/",
    lessons: ["03-agents/react-pattern"],
  },
  {
    slug: "llamaindex", name: "LlamaIndex", category: "Frameworks & Agents",
    tagline: "Data framework for RAG and agents",
    description: "Focused on ingesting, indexing and querying your data, with document parsers, retrievers and agent workflows.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host", "Cloud"], languages: ["Python", "TypeScript"],
    bestFor: "Document-heavy RAG applications", url: "https://www.llamaindex.ai/",
    lessons: ["02-rag/hybrid-search"],
  },
  {
    slug: "ai-sdk", name: "Vercel AI SDK", category: "Frameworks & Agents",
    tagline: "TypeScript toolkit for AI apps",
    description: "Provider-agnostic TypeScript SDK for streaming chat UIs, structured output, tool calling and agents in web apps.",
    pricing: "Open source", openSource: true, deploy: ["Cloud", "Self-host"], languages: ["TypeScript"],
    bestFor: "Next.js / React apps with streaming AI features", url: "https://ai-sdk.dev/",
  },
  {
    slug: "dspy", name: "DSPy", category: "Frameworks & Agents",
    tagline: "Program — don't prompt — LLMs",
    description: "Declarative framework from Stanford that compiles modular LLM programs and optimizes their prompts automatically.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host"], languages: ["Python"],
    bestFor: "Systematically optimizing multi-step pipelines", url: "https://dspy.ai/",
    lessons: ["01-foundations/prompt-engineering"],
  },
  {
    slug: "crewai", name: "CrewAI", category: "Frameworks & Agents",
    tagline: "Role-based multi-agent crews",
    description: "Python framework for orchestrating teams of role-playing agents that collaborate on tasks.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host", "Cloud"], languages: ["Python"],
    bestFor: "Multi-agent workflows with clear roles", url: "https://www.crewai.com/",
    lessons: ["03-agents/swarms"],
  },
  {
    slug: "autogen", name: "AutoGen", category: "Frameworks & Agents",
    tagline: "Microsoft's multi-agent framework",
    description: "Framework for building conversational multi-agent systems where agents message each other to solve tasks.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host"], languages: ["Python", ".NET"],
    bestFor: "Research and prototyping of agent conversations", url: "https://microsoft.github.io/autogen/",
    lessons: ["03-agents/swarms"],
  },
  // Vector DBs
  {
    slug: "pinecone", name: "Pinecone", category: "Vector Databases",
    tagline: "Fully managed vector database",
    description: "Serverless vector database with metadata filtering and hybrid search — no infrastructure to run.",
    pricing: "Free tier", openSource: false, deploy: ["Cloud"], languages: ["Python", "TypeScript", "REST"],
    bestFor: "Zero-ops vector search at scale", url: "https://www.pinecone.io/",
    lessons: ["02-rag/vector-dbs"],
  },
  {
    slug: "qdrant", name: "Qdrant", category: "Vector Databases",
    tagline: "Rust vector search engine",
    description: "Open-source vector database with rich payload filtering, quantization and a managed cloud option.",
    pricing: "Open source", openSource: true, deploy: ["Self-host", "Cloud"], languages: ["Python", "TypeScript", "Rust", "REST"],
    bestFor: "Self-hosted search with advanced filters", url: "https://qdrant.tech/",
    lessons: ["02-rag/vector-dbs"],
  },
  {
    slug: "weaviate", name: "Weaviate", category: "Vector Databases",
    tagline: "AI-native vector database",
    description: "Open-source vector database with built-in hybrid (vector + keyword) search and model integrations.",
    pricing: "Open source", openSource: true, deploy: ["Self-host", "Cloud"], languages: ["Python", "TypeScript", "Go"],
    bestFor: "Hybrid search out of the box", url: "https://weaviate.io/",
    lessons: ["02-rag/hybrid-search"],
  },
  {
    slug: "chroma", name: "Chroma", category: "Vector Databases",
    tagline: "Developer-friendly embedding store",
    description: "Simple open-source embedding database that runs in-process for prototypes, with a hosted option.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host", "Cloud"], languages: ["Python", "TypeScript"],
    bestFor: "Prototypes and small RAG apps", url: "https://www.trychroma.com/",
  },
  {
    slug: "pgvector", name: "pgvector", category: "Vector Databases",
    tagline: "Vector search inside Postgres",
    description: "Postgres extension adding a vector type plus HNSW and IVFFlat indexes, so embeddings live next to your data.",
    pricing: "Open source", openSource: true, deploy: ["Self-host", "Cloud"], languages: ["SQL"],
    bestFor: "Teams already running PostgreSQL", url: "https://github.com/pgvector/pgvector",
    lessons: ["02-rag/vector-dbs"],
  },
  {
    slug: "milvus", name: "Milvus", category: "Vector Databases",
    tagline: "Vector database built for scale",
    description: "Distributed open-source vector database designed for billions of vectors, with a managed version (Zilliz Cloud).",
    pricing: "Open source", openSource: true, deploy: ["Self-host", "Cloud"], languages: ["Python", "Go", "Java", "TypeScript"],
    bestFor: "Very large-scale similarity search", url: "https://milvus.io/",
  },
  // Eval & observability
  {
    slug: "ragas", name: "Ragas", category: "Evaluation & Observability",
    tagline: "Metrics for RAG pipelines",
    description: "Library for evaluating RAG with metrics like faithfulness, answer relevancy and context recall.",
    pricing: "Open source", openSource: true, deploy: ["Local"], languages: ["Python"],
    bestFor: "Measuring RAG quality in CI", url: "https://docs.ragas.io/",
    lessons: ["02-rag/rag-eval"],
  },
  {
    slug: "langsmith", name: "LangSmith", category: "Evaluation & Observability",
    tagline: "Tracing and evals for LLM apps",
    description: "Platform from the LangChain team to trace, debug, test and monitor LLM applications (works without LangChain too).",
    pricing: "Free tier", openSource: false, deploy: ["Cloud", "Self-host"], languages: ["Python", "TypeScript"],
    bestFor: "Debugging complex chains and agents", url: "https://www.langchain.com/langsmith",
    lessons: ["03-agents/react-pattern"],
  },
  {
    slug: "langfuse", name: "Langfuse", category: "Evaluation & Observability",
    tagline: "Open-source LLM engineering platform",
    description: "Traces, prompt management, evaluations and cost tracking — self-host it or use the cloud version.",
    pricing: "Open source", openSource: true, deploy: ["Self-host", "Cloud"], languages: ["Python", "TypeScript"],
    bestFor: "Self-hosted observability with cost tracking", url: "https://langfuse.com/",
    lessons: ["04-finetuning/mlops"],
  },
  {
    slug: "wandb", name: "Weights & Biases", category: "Evaluation & Observability",
    tagline: "Experiment tracking for ML teams",
    description: "Tracks training runs, datasets and model versions, with Weave for tracing and evaluating LLM apps.",
    pricing: "Free tier", openSource: false, deploy: ["Cloud", "Self-host"], languages: ["Python", "TypeScript"],
    bestFor: "Fine-tuning experiments and model comparison", url: "https://wandb.ai/",
    lessons: ["04-finetuning/fine-tuning"],
  },
  {
    slug: "phoenix", name: "Arize Phoenix", category: "Evaluation & Observability",
    tagline: "Open-source AI observability",
    description: "Notebook-friendly tracing and evaluation built on OpenTelemetry, for RAG and agent debugging.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host", "Cloud"], languages: ["Python", "TypeScript"],
    bestFor: "OpenTelemetry-based tracing", url: "https://phoenix.arize.com/",
  },
  // Fine-tuning
  {
    slug: "unsloth", name: "Unsloth", category: "Fine-Tuning",
    tagline: "Faster, lighter LoRA fine-tuning",
    description: "Optimized kernels that make LoRA/QLoRA fine-tuning of open models faster and use less GPU memory.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host"], languages: ["Python"],
    bestFor: "Fine-tuning on a single consumer or Colab GPU", url: "https://unsloth.ai/",
    lessons: ["04-finetuning/fine-tuning"],
  },
  {
    slug: "axolotl", name: "Axolotl", category: "Fine-Tuning",
    tagline: "Config-driven fine-tuning",
    description: "YAML-configured training for full fine-tuning, LoRA and QLoRA across many model architectures.",
    pricing: "Open source", openSource: true, deploy: ["Self-host"], languages: ["Python", "YAML"],
    bestFor: "Reproducible multi-GPU training runs", url: "https://github.com/axolotl-ai-cloud/axolotl",
    lessons: ["04-finetuning/fine-tuning"],
  },
  {
    slug: "peft", name: "Hugging Face PEFT", category: "Fine-Tuning",
    tagline: "Parameter-efficient fine-tuning",
    description: "Library implementing LoRA, prefix tuning and other adapters on top of Transformers models.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host"], languages: ["Python"],
    bestFor: "Custom training code with adapters", url: "https://huggingface.co/docs/peft",
    lessons: ["04-finetuning/fine-tuning"],
  },
  // Safety
  {
    slug: "nemo-guardrails", name: "NeMo Guardrails", category: "Safety & Guardrails",
    tagline: "Programmable rails for LLM apps",
    description: "NVIDIA toolkit to add topical, safety and security rails to conversational apps with a simple config language.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host"], languages: ["Python"],
    bestFor: "Keeping chatbots on-topic and safe", url: "https://github.com/NVIDIA/NeMo-Guardrails",
    lessons: ["04-finetuning/safety"],
  },
  {
    slug: "guardrails-ai", name: "Guardrails AI", category: "Safety & Guardrails",
    tagline: "Validate LLM inputs and outputs",
    description: "Framework of reusable validators (PII, toxicity, schema…) that check and correct model inputs and outputs.",
    pricing: "Open source", openSource: true, deploy: ["Local", "Self-host", "Cloud"], languages: ["Python"],
    bestFor: "Output validation and PII filtering", url: "https://www.guardrailsai.com/",
    lessons: ["04-finetuning/safety"],
  },
];
