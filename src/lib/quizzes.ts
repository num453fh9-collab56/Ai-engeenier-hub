export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index into options
  why: string;
}

// Keyed by `${category}/${slug}`
export const quizzes: Record<string, QuizQuestion[]> = {
  "01-foundations/intro": [
    {
      q: "Why use structured outputs instead of parsing free-form LLM text?",
      options: [
        "They make the model faster",
        "They guarantee output matches a schema your code can rely on",
        "They remove the need for a system prompt",
        "They reduce token costs to zero",
      ],
      answer: 1,
      why: "A schema (e.g. Pydantic) turns fragile string parsing into validated, typed data.",
    },
    {
      q: "What is the main benefit of an async client with asyncio for batch LLM calls?",
      options: [
        "Requests run concurrently instead of waiting one-by-one",
        "Responses become more accurate",
        "It bypasses provider rate limits",
        "It caches every answer automatically",
      ],
      answer: 0,
      why: "LLM calls are I/O-bound, so concurrency cuts total wall-clock time dramatically.",
    },
    {
      q: "A good retry strategy for transient API errors is…",
      options: [
        "Retry instantly in a tight loop forever",
        "Never retry — fail fast",
        "Exponential backoff with a retry cap",
        "Switch to a random model each time",
      ],
      answer: 2,
      why: "Backoff avoids hammering the API during rate limits; a cap prevents infinite loops.",
    },
  ],
  "01-foundations/prompt-engineering": [
    {
      q: "Chain-of-Thought prompting mainly helps with…",
      options: [
        "Reducing latency",
        "Multi-step reasoning tasks",
        "Shrinking the context window",
        "Image generation",
      ],
      answer: 1,
      why: "Asking the model to reason step-by-step improves accuracy on math and logic problems.",
    },
    {
      q: "In function calling, who actually executes the function?",
      options: [
        "The LLM provider's servers",
        "The model itself, internally",
        "Your application code",
        "The browser",
      ],
      answer: 2,
      why: "The model only emits a call with arguments; your code runs it and returns the result.",
    },
    {
      q: "What does a Pydantic model give you when used for LLM output?",
      options: [
        "Validation and typed fields",
        "A faster tokenizer",
        "Free GPU time",
        "Automatic fine-tuning",
      ],
      answer: 0,
      why: "Pydantic validates the JSON against a schema and raises clear errors on mismatch.",
    },
  ],
  "01-foundations/transformers": [
    {
      q: "Why is attention scaled by √dₖ?",
      options: [
        "To make training use less memory",
        "To keep dot products from growing large and saturating softmax",
        "To normalise the vocabulary",
        "To add positional information",
      ],
      answer: 1,
      why: "Large dot products push softmax into regions with tiny gradients; scaling keeps it stable.",
    },
    {
      q: "What does multi-head attention add over a single head?",
      options: [
        "It lets the model attend to different relationship types in parallel",
        "It removes the need for embeddings",
        "It makes the model bidirectional",
        "It replaces the feed-forward layer",
      ],
      answer: 0,
      why: "Each head learns its own projections, capturing different patterns (syntax, coreference…).",
    },
    {
      q: "A causal (decoder) LM uses a mask so that each token…",
      options: [
        "Sees the whole sequence",
        "Only sees itself",
        "Only attends to earlier tokens",
        "Only attends to later tokens",
      ],
      answer: 2,
      why: "Masking future tokens makes next-token prediction a fair training objective.",
    },
  ],
  "02-rag/hybrid-search": [
    {
      q: "Hybrid search combines…",
      options: [
        "Two LLMs",
        "Dense (embedding) and sparse (keyword, e.g. BM25) retrieval",
        "SQL and NoSQL databases",
        "Fine-tuning and prompting",
      ],
      answer: 1,
      why: "Dense captures meaning; sparse nails exact terms like IDs and names — together they cover both.",
    },
    {
      q: "Reciprocal Rank Fusion merges result lists using…",
      options: [
        "Raw similarity scores",
        "The rank position of each document in each list",
        "Document length",
        "An LLM judge",
      ],
      answer: 1,
      why: "RRF sums 1/(k + rank), so it works even when the retrievers' scores aren't comparable.",
    },
    {
      q: "Why re-rank with a cross-encoder only in a second stage?",
      options: [
        "It's too slow to run over the whole corpus, but very accurate on a short list",
        "It can't handle short queries",
        "It only works with BM25",
        "It needs no model",
      ],
      answer: 0,
      why: "Cross-encoders score query+doc jointly — precise but expensive, so apply them to the top-k only.",
    },
  ],
  "02-rag/rag-eval": [
    {
      q: "'Faithfulness' in RAG evaluation measures whether…",
      options: [
        "The answer is supported by the retrieved context",
        "The retriever is fast",
        "The user liked the answer",
        "The prompt is short",
      ],
      answer: 0,
      why: "Unfaithful answers contain claims the context doesn't back up — i.e. hallucinations.",
    },
    {
      q: "Context recall checks…",
      options: [
        "How many tokens the context uses",
        "Whether retrieval found the information needed for the ground-truth answer",
        "How quickly the model responds",
        "Whether the answer is polite",
      ],
      answer: 1,
      why: "Low recall means the retriever missed relevant chunks — generation can't fix that.",
    },
    {
      q: "Why build an automated eval pipeline for RAG?",
      options: [
        "To avoid writing prompts",
        "To catch quality regressions when you change chunking, models or prompts",
        "To make the vector DB cheaper",
        "Evals are only needed once",
      ],
      answer: 1,
      why: "Every pipeline change can silently hurt quality; a fixed test set makes it measurable.",
    },
  ],
  "02-rag/vector-dbs": [
    {
      q: "You indexed documents with one embedding model and now query with a different one. What happens?",
      options: [
        "It works, just a bit slower",
        "Rankings become meaningless — the vectors live in different spaces",
        "The database converts the vectors automatically",
        "Only the top result is affected",
      ],
      answer: 1,
      why: "Each model has its own vector space. Index and query must use the same model (and dimension).",
    },
    {
      q: "Why do vector databases use approximate (ANN) indexes like HNSW instead of comparing against every vector?",
      options: [
        "Exact search is impossible with embeddings",
        "ANN gives better answers than exact search",
        "Brute force grows linearly with data; ANN stays fast by trading a little recall",
        "ANN needs no memory",
      ],
      answer: 2,
      why: "Flat search compares the query with every vector. ANN skips most of them and occasionally misses a true neighbour.",
    },
    {
      q: "In HNSW, what does increasing ef_search do?",
      options: [
        "Improves recall but makes each query slower",
        "Shrinks the index on disk",
        "Changes the embedding dimension",
        "Makes indexing faster",
      ],
      answer: 0,
      why: "ef_search is the size of the candidate list explored per query: more candidates, better recall, more latency.",
    },
    {
      q: "A multi-tenant app fetches the top 5 results and then removes other customers' documents. What's the risk?",
      options: [
        "None — that's the recommended pattern",
        "The query becomes more accurate",
        "All 5 may belong to other tenants, leaving zero results",
        "It uses more GPU memory",
      ],
      answer: 2,
      why: "Filter during the search (metadata filters, namespaces, SQL WHERE), not after it.",
    },
    {
      q: "Your team already runs PostgreSQL and has about 500k documents. Which choice usually makes the most sense to start with?",
      options: [
        "pgvector — one database, SQL joins and transactions",
        "Build a custom ANN index from scratch",
        "Store vectors in a CSV file",
        "Always a separate managed vector DB, no matter what",
      ],
      answer: 0,
      why: "pgvector keeps vectors next to your data with no new infrastructure; move to a dedicated DB if scale or filtering demands it.",
    },
  ],
  "03-agents/react-pattern": [
    {
      q: "ReAct stands for…",
      options: ["React.js for agents", "Reason + Act", "Recursive Actions", "Retrieval + Action"],
      answer: 1,
      why: "The agent interleaves reasoning (thoughts) with actions (tool calls).",
    },
    {
      q: "What is the correct order of one ReAct step?",
      options: [
        "Act → Thought → Observation",
        "Observation → Act → Thought",
        "Thought → Action → Observation",
        "Answer → Thought → Action",
      ],
      answer: 2,
      why: "The model thinks, calls a tool, then reads the tool's result before the next step.",
    },
    {
      q: "Why cap the number of iterations in an agent loop?",
      options: [
        "To prevent infinite loops and runaway cost",
        "Models can only make three calls",
        "To improve tokenization",
        "It's required by every API",
      ],
      answer: 0,
      why: "Agents can get stuck repeating actions; a max-steps guard keeps them bounded.",
    },
  ],
  "03-agents/swarms": [
    {
      q: "Task decomposition in a multi-agent system means…",
      options: [
        "Deleting failed tasks",
        "Splitting a big goal into sub-tasks assigned to specialised agents",
        "Compressing the prompt",
        "Running one agent many times with the same input",
      ],
      answer: 1,
      why: "Specialists (researcher, coder, reviewer…) each handle the part they're best at.",
    },
    {
      q: "Why use a consensus mechanism between agents?",
      options: [
        "To reduce individual agent errors by agreeing on an answer",
        "To make agents run faster",
        "To share API keys",
        "To avoid using tools",
      ],
      answer: 0,
      why: "Voting or debate lets independent agents catch each other's mistakes.",
    },
    {
      q: "A major risk of multi-agent swarms is…",
      options: [
        "They can't use tools",
        "Higher cost and harder debugging from many interacting calls",
        "They only work offline",
        "They can't share context",
      ],
      answer: 1,
      why: "More agents = more tokens and more failure paths; observability becomes essential.",
    },
  ],
  "04-finetuning/fine-tuning": [
    {
      q: "LoRA fine-tunes a model by…",
      options: [
        "Retraining every weight",
        "Training small low-rank matrices added to frozen weights",
        "Editing the tokenizer",
        "Only changing the system prompt",
      ],
      answer: 1,
      why: "Low-rank adapters train a tiny fraction of parameters, cutting memory and cost.",
    },
    {
      q: "What does QLoRA add on top of LoRA?",
      options: [
        "Quantizing the frozen base model (e.g. 4-bit) to save memory",
        "Quantum computing",
        "A larger context window",
        "Reinforcement learning",
      ],
      answer: 0,
      why: "A 4-bit base model plus LoRA adapters lets large models fit on a single GPU.",
    },
    {
      q: "When is fine-tuning usually the right choice over RAG?",
      options: [
        "When the model needs fresh, frequently changing facts",
        "When you need a consistent style, format or behaviour",
        "When you have no training data",
        "Always — it's strictly better",
      ],
      answer: 1,
      why: "Fine-tuning shapes behaviour; RAG is better for injecting up-to-date knowledge.",
    },
  ],
  "04-finetuning/groq-inference": [
    {
      q: "Groq's speed advantage comes mainly from…",
      options: [
        "Smaller models only",
        "Custom LPU hardware designed for sequential inference",
        "Caching every answer",
        "Running on users' devices",
      ],
      answer: 1,
      why: "The LPU is built for deterministic, low-latency token generation.",
    },
    {
      q: "Why stream responses to users?",
      options: [
        "It lowers perceived latency — the first tokens appear immediately",
        "It makes answers more accurate",
        "It reduces total tokens",
        "Streaming is required for JSON mode",
      ],
      answer: 0,
      why: "Time-to-first-token matters more for UX than total generation time.",
    },
    {
      q: "Groq's API is compatible with which client format?",
      options: ["GraphQL", "OpenAI-style chat completions", "SOAP", "gRPC only"],
      answer: 1,
      why: "You can point OpenAI-compatible SDKs at Groq's base URL with minimal changes.",
    },
  ],
  "04-finetuning/mlops": [
    {
      q: "vLLM speeds up serving largely through…",
      options: [
        "PagedAttention and continuous batching",
        "Smaller vocabularies",
        "Disabling the KV cache",
        "Running on CPU",
      ],
      answer: 0,
      why: "Efficient KV-cache memory and batching dramatically increase throughput.",
    },
    {
      q: "A/B testing two prompts or models in production lets you…",
      options: [
        "Skip evaluation entirely",
        "Compare real user outcomes before fully rolling out a change",
        "Train the model online",
        "Halve your costs automatically",
      ],
      answer: 1,
      why: "Offline evals don't capture everything; live traffic splits reveal real impact.",
    },
    {
      q: "What should an LLM observability stack track?",
      options: [
        "Only server CPU",
        "Latency, token usage/cost, errors and output quality",
        "Only the number of users",
        "Nothing — LLMs are deterministic",
      ],
      answer: 1,
      why: "LLM apps fail in subtle ways; you need both system and quality signals.",
    },
  ],
  "04-finetuning/safety": [
    {
      q: "Constitutional AI uses…",
      options: [
        "A set of written principles the model uses to critique and revise outputs",
        "Government regulation",
        "Only human labellers",
        "A bigger model",
      ],
      answer: 0,
      why: "The model self-critiques against the constitution, reducing reliance on human labels.",
    },
    {
      q: "Guardrails in an LLM app typically…",
      options: [
        "Speed up generation",
        "Check inputs and outputs for unsafe or off-policy content",
        "Replace the system prompt",
        "Encrypt the model weights",
      ],
      answer: 1,
      why: "Input/output filters catch prompt injection, PII leaks and harmful content.",
    },
    {
      q: "Automated red-teaming means…",
      options: [
        "Generating adversarial prompts at scale to find failures",
        "Colouring the UI red on errors",
        "Deleting unsafe users",
        "Training only on safe data",
      ],
      answer: 0,
      why: "Using models to attack your model surfaces jailbreaks before real users do.",
    },
  ],
};
