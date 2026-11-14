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
      q: "Why is Structured Outputs more reliable than asking for JSON in the prompt?",
      options: [
        "It makes the model faster",
        "Generation is constrained to match your schema",
        "It removes the need for an API key",
        "It always gives correct facts",
      ],
      answer: 1,
      why: "With a schema, the output has your fields and types — though it still can't guarantee the facts are true.",
    },
    {
      q: "A field may not appear in every email. How should you type it in Pydantic?",
      options: [
        "int",
        "str",
        "int | None",
        "Literal['yes']",
      ],
      answer: 2,
      why: "Making it optional lets the model return null instead of inventing a value.",
    },
    {
      q: "Why does asyncio speed up 500 LLM calls?",
      options: [
        "It uses more CPU cores",
        "The calls are I/O-bound, so their waiting can overlap",
        "It compresses the prompts",
        "It skips slow requests",
      ],
      answer: 1,
      why: "Your program mostly waits on the network; async lets many waits happen at the same time.",
    },
    {
      q: "What is the asyncio.Semaphore for in a batch of LLM calls?",
      options: [
        "Retrying failed calls",
        "Limiting how many requests run at once, to respect rate limits",
        "Validating JSON",
        "Caching responses",
      ],
      answer: 1,
      why: "Without a limit, gather fires every request at once and triggers HTTP 429 errors.",
    },
    {
      q: "What does return_exceptions=True in asyncio.gather give you?",
      options: [
        "Faster requests",
        "Errors are returned in the results list instead of raising the first exception",
        "Automatic retries",
        "Fewer tokens used",
      ],
      answer: 1,
      why: "You get a result or an exception per input, in order, so you can retry just the failures.",
    },
  ],
  "01-foundations/prompt-engineering": [
    {
      q: "Where do stable rules and examples belong in a prompt?",
      options: [
        "At the end of the user message",
        "In the system/developer instructions",
        "In a separate API call",
        "Nowhere — they waste tokens",
      ],
      answer: 1,
      why: "Stable parts go in the instructions; changing input goes in the user message (and benefits from caching).",
    },
    {
      q: "What is the most effective way to show a model the exact output format you want?",
      options: [
        "Write the word IMPORTANT in capitals",
        "Give a few consistent examples (few-shot)",
        "Raise the temperature",
        "Use a longer system prompt",
      ],
      answer: 1,
      why: "Models imitate examples very faithfully; make sure examples follow your own rules.",
    },
    {
      q: "In function calling, who actually runs the function?",
      options: [
        "The model, on the provider's servers",
        "Your application code",
        "The browser",
        "Nobody — the model imagines the result",
      ],
      answer: 1,
      why: "The model only requests a call with arguments; your code executes it and returns the output.",
    },
    {
      q: "Why add 'If the answer isn't in the policy, say you don't know' to a prompt?",
      options: [
        "To make answers shorter",
        "To give the model a safe exit instead of inventing an answer",
        "It's required by the API",
        "To enable function calling",
      ],
      answer: 1,
      why: "Without an exit, models tend to fill gaps with plausible but made-up content.",
    },
    {
      q: "What is the strongest defence against prompt injection in a tool-using app?",
      options: [
        "A sentence asking the model to ignore malicious instructions",
        "Validating arguments and permissions in code, plus least-privilege tools",
        "Using a bigger model",
        "Hiding the system prompt",
      ],
      answer: 1,
      why: "No prompt fully prevents injection; enforce security in your functions and require confirmation for risky actions.",
    },
  ],
  "01-foundations/transformers": [
    {
      q: "What does a GPT-style model fundamentally predict?",
      options: [
        "The whole answer at once",
        "A probability for every possible next token",
        "The meaning of each word",
        "The user's intent label",
      ],
      answer: 1,
      why: "Generation is a loop: predict the next token, append it, repeat.",
    },
    {
      q: "In attention, what does the dot product of a query with a key represent?",
      options: [
        "The token's position",
        "How relevant that token is to the querying token",
        "The vocabulary size",
        "The temperature",
      ],
      answer: 1,
      why: "High query–key scores mean 'this token is relevant to me'; softmax turns scores into weights.",
    },
    {
      q: "Why are attention scores divided by √dₖ?",
      options: [
        "To save memory",
        "To keep large dot products from making softmax too extreme",
        "To add position information",
        "To hide future tokens",
      ],
      answer: 1,
      why: "Scaling keeps softmax in a range where gradients still flow during training.",
    },
    {
      q: "What does the causal mask do in a GPT model?",
      options: [
        "Removes stop words",
        "Prevents tokens from attending to future positions",
        "Speeds up tokenization",
        "Mixes the attention heads",
      ],
      answer: 1,
      why: "Future scores are set to −∞ before softmax, so each token only sees earlier tokens.",
    },
    {
      q: "What does raising the temperature do?",
      options: [
        "Makes outputs always identical",
        "Flattens the probability distribution so less likely tokens get picked more often",
        "Increases the context window",
        "Adds more attention heads",
      ],
      answer: 1,
      why: "Temperature divides the logits before softmax: higher = flatter = more varied output.",
    },
  ],
  "02-rag/hybrid-search": [
    {
      q: "A user searches for 'error E1042'. Which retriever is most likely to find the exact page?",
      options: [
        "Dense (embedding) search",
        "BM25 keyword search",
        "Neither can",
        "Only a cross-encoder",
      ],
      answer: 1,
      why: "Embedding models know little about rare tokens like error codes; BM25 matches the exact term.",
    },
    {
      q: "Why can't you simply add cosine scores and BM25 scores together?",
      options: [
        "They're on different scales, so one retriever would dominate",
        "BM25 scores are always negative",
        "Cosine scores are secret",
        "It's too slow",
      ],
      answer: 0,
      why: "Cosine is roughly -1 to 1, BM25 can be 0 to 30+. Use RRF (ranks only) or normalize first.",
    },
    {
      q: "In Reciprocal Rank Fusion, what decides a document's final score?",
      options: [
        "Its raw similarity scores",
        "Its length",
        "Its rank position in each list",
        "How recently it was added",
      ],
      answer: 2,
      why: "RRF sums 1 / (k + rank) across lists, so a document ranked well in both lists wins.",
    },
    {
      q: "Why is a cross-encoder used only on a short list of candidates?",
      options: [
        "It can only read 5 documents",
        "It must run once per query–document pair, which is slow",
        "It needs BM25 scores as input",
        "It only works offline",
      ],
      answer: 1,
      why: "It reads query and document together: very accurate, but too slow to score a whole corpus.",
    },
    {
      q: "Which is the standard two-stage retrieval pipeline?",
      options: [
        "Re-rank everything, then retrieve",
        "Retrieve wide for recall (hybrid), then re-rank a short list for precision",
        "Only BM25, then an LLM",
        "Fine-tune the LLM instead of retrieving",
      ],
      answer: 1,
      why: "Fast retrievers find ~20–50 candidates; the cross-encoder picks the best few for the LLM.",
    },
  ],
  "02-rag/rag-eval": [
    {
      q: "Your bot invents a refund policy that isn't in the retrieved chunks. Which metric catches this?",
      options: [
        "Hit rate",
        "Faithfulness",
        "MRR",
        "Latency",
      ],
      answer: 1,
      why: "Faithfulness checks whether the answer's claims are supported by the retrieved context.",
    },
    {
      q: "The correct chunk was never retrieved, so the answer was wrong. Which metric points to this?",
      options: [
        "Context recall (or hit rate)",
        "Response relevancy",
        "Answer length",
        "Temperature",
      ],
      answer: 0,
      why: "Missing context is a retrieval failure — context recall and hit rate measure it.",
    },
    {
      q: "For one question the first correct chunk is at rank 4. What is its reciprocal rank?",
      options: [
        "4",
        "0.4",
        "0.25",
        "1",
      ],
      answer: 2,
      why: "Reciprocal rank = 1 / rank = 1/4 = 0.25. MRR averages this over all questions.",
    },
    {
      q: "Why measure retrieval separately from the final answer?",
      options: [
        "It's required by RAGAS",
        "So you know whether to fix the retriever or the generation step",
        "Retrieval is always fine",
        "It makes answers longer",
      ],
      answer: 1,
      why: "An end-to-end score can't tell you which half broke.",
    },
    {
      q: "What is a sensible way to use LLM-judge scores like faithfulness?",
      options: [
        "Treat 0.81 vs 0.83 as a definite win",
        "Track trends across versions and hand-check the worst cases",
        "Ignore them completely",
        "Use them instead of a test set",
      ],
      answer: 1,
      why: "LLM judges are noisy and biased; they're great for trends, not exact truth.",
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
      q: "What is the core loop of a ReAct agent?",
      options: [
        "Plan → Execute → Deploy",
        "Thought → Action (tool call) → Observation, repeated",
        "Retrieve → Rerank → Answer",
        "Prompt → Fine-tune → Serve",
      ],
      answer: 1,
      why: "The model reasons, calls a tool, reads the result, and repeats until it can answer.",
    },
    {
      q: "When should you prefer a fixed workflow over an agent?",
      options: [
        "When the steps are known in advance",
        "When the task is open-ended",
        "Never — agents are always better",
        "Only for chatbots",
      ],
      answer: 0,
      why: "If you can write the steps down, code them: cheaper, faster and easier to test.",
    },
    {
      q: "Why must every agent loop have a step limit?",
      options: [
        "APIs require it",
        "Agents can loop forever and burn time and money",
        "It improves the model's accuracy",
        "To enable parallel tool calls",
      ],
      answer: 1,
      why: "A max_steps (and token/time budget) guard stops runaway loops.",
    },
    {
      q: "What should a tool return when something goes wrong?",
      options: [
        "Nothing",
        "A crash so you notice",
        "A clear error message the model can act on",
        "A random fallback value",
      ],
      answer: 2,
      why: "Helpful errors (e.g. 'order IDs are 4 digits') let the model correct itself.",
    },
    {
      q: "Why is calling eval() on a model's tool arguments dangerous?",
      options: [
        "It's slow",
        "It allows arbitrary code execution chosen by model output",
        "It returns strings",
        "It breaks JSON",
      ],
      answer: 1,
      why: "Model output is untrusted input. Parse and validate it — e.g. allow only arithmetic, as the safe calculator does.",
    },
  ],
  "03-agents/mcp": [
    {
      q: "What problem does MCP mainly solve?",
      options: [
        "It makes models smarter at reasoning",
        "It replaces M × N custom integrations with one standard, so a tool written once works in any compatible app",
        "It trains models on your tools",
        "It is a vector database for agents",
      ],
      answer: 1,
      why: "Each app implements MCP once and each tool implements it once: M + N instead of M × N.",
    },
    {
      q: "In MCP, which feature is controlled by the model (the model decides when to use it)?",
      options: ["Resources", "Prompts", "Tools", "Transports"],
      answer: 2,
      why: "Tools are model-controlled; resources are app-controlled and prompts are user-picked.",
    },
    {
      q: "Your stdio MCP server randomly breaks. You added print() calls for debugging. Why is that the likely cause?",
      options: [
        "print() is too slow",
        "stdout carries the JSON-RPC messages, so printed text corrupts the protocol",
        "print() is not allowed in async code",
        "MCP servers cannot use Python's standard library",
      ],
      answer: 1,
      why: "In stdio servers, log to stderr (e.g. the logging module) and keep stdout for protocol messages.",
    },
    {
      q: "A tool receives limit=99 but only allows 1–20. What should it do so the model can recover?",
      options: [
        "Raise a ToolError so the call returns isError: true with a clear message",
        "Raise a normal Python exception",
        "Silently use limit=20",
        "Crash the server so the host restarts it",
      ],
      answer: 0,
      why: "Tool execution errors are returned to the model with isError: true so it can fix its arguments and retry.",
    },
    {
      q: "What does it mean that the 2026-07-28 MCP spec is stateless?",
      options: [
        "Servers can't store any data",
        "Tools can't return results",
        "There is no initialize handshake or protocol session; each request carries its own version and capabilities, and state uses explicit handles",
        "Only stdio is allowed",
      ],
      answer: 2,
      why: "Statelessness makes servers easy to scale; cross-call state is passed as an explicit handle like basket_id.",
    },
  ],
  "03-agents/swarms": [
    {
      q: "According to Anthropic's report, what was the trade-off of its multi-agent research system?",
      options: [
        "Cheaper but less accurate",
        "90.2% better than a single agent on its research eval, but about 15× the tokens of a chat",
        "Same quality, fewer tokens",
        "Faster but unable to use tools",
      ],
      answer: 1,
      why: "Multi-agent can win big on parallel research, but it is expensive.",
    },
    {
      q: "Which task is the WORST fit for a multi-agent design?",
      options: [
        "Researching independent sub-questions",
        "Reviewing a draft with a separate critic",
        "A task where every step depends on the previous one and shares the same context",
        "Voting on a classification",
      ],
      answer: 2,
      why: "Heavy dependencies and shared context make coordination overhead outweigh the benefits.",
    },
    {
      q: "What should a good delegation brief to a worker agent contain?",
      options: [
        "Just a topic word",
        "Objective, scope boundaries, output format and expected effort",
        "The orchestrator's full chat history",
        "Only the final deadline",
      ],
      answer: 1,
      why: "Vague briefs cause duplicated work and gaps; precise briefs keep workers focused.",
    },
    {
      q: "In the orchestrator–workers pattern, why do workers run with isolated contexts?",
      options: [
        "To save disk space",
        "Each focuses on its sub-task with a small, clean context, and they can run in parallel",
        "Because models can't share memory",
        "It's required by asyncio",
      ],
      answer: 1,
      why: "Focused contexts improve quality and allow concurrency.",
    },
    {
      q: "How should a generator–critic loop be controlled?",
      options: [
        "Let it run until the critic is happy, however long it takes",
        "With a hard limit on revision rounds and a budget",
        "By removing the critic after one round always",
        "By using the same prompt for both agents",
      ],
      answer: 1,
      why: "Critics can keep finding issues; cap rounds and tokens.",
    },
  ],
  "04-finetuning/fine-tuning": [
    {
      q: "Your bot must answer from a policy document that changes every month. Best first tool?",
      options: [
        "Fine-tuning",
        "RAG",
        "A bigger model",
        "Higher temperature",
      ],
      answer: 1,
      why: "Knowledge that changes belongs in retrieval; fine-tuning is for behaviour, style and format.",
    },
    {
      q: "What does LoRA actually train?",
      options: [
        "Every weight in the model",
        "Small low-rank matrices added to frozen layers",
        "Only the tokenizer",
        "The embedding model",
      ],
      answer: 1,
      why: "The base weights stay frozen; only the small A and B matrices are learned.",
    },
    {
      q: "What makes QLoRA cheaper than LoRA?",
      options: [
        "It skips training",
        "The frozen base model is loaded in 4-bit precision",
        "It uses fewer examples",
        "It removes the attention layers",
      ],
      answer: 1,
      why: "4-bit quantization of the base model cuts memory so large models fit on a single GPU.",
    },
    {
      q: "Why keep a held-out test set and a prompt-only baseline?",
      options: [
        "To make training faster",
        "To prove the fine-tune is actually better on unseen data",
        "Because TRL requires it",
        "To reduce adapter size",
      ],
      answer: 1,
      why: "Without a baseline and unseen test data you can't tell whether fine-tuning helped.",
    },
    {
      q: "Which dataset matters most for a style fine-tune?",
      options: [
        "As many scraped examples as possible",
        "A few hundred consistent, high-quality examples covering edge cases",
        "Only the user messages",
        "Random internet text",
      ],
      answer: 1,
      why: "The model learns exactly what you show it — quality and consistency beat volume.",
    },
  ],
  "04-finetuning/groq-inference": [
    {
      q: "What does time to first token (TTFT) measure?",
      options: [
        "Total cost",
        "How long until the first token of the answer arrives",
        "Model accuracy",
        "Tokens in the prompt",
      ],
      answer: 1,
      why: "TTFT is how long the screen stays blank — critical for perceived speed.",
    },
    {
      q: "Why are long answers slow even on fast hardware?",
      options: [
        "Output tokens are generated one at a time",
        "The prompt is re-sent for each word",
        "Networks are slow",
        "Answers are compressed",
      ],
      answer: 0,
      why: "Decode is sequential; each new token needs another pass through the model.",
    },
    {
      q: "Why measure p95 latency and not just the average?",
      options: [
        "Averages are illegal",
        "Averages hide the slow requests your unluckiest users experience",
        "p95 is always lower",
        "It's cheaper to compute",
      ],
      answer: 1,
      why: "Tail latency reveals spikes that make an app feel unreliable.",
    },
    {
      q: "How can existing OpenAI-SDK code call Groq?",
      options: [
        "It can't",
        "By changing the base URL and API key to Groq's OpenAI-compatible endpoint",
        "By retraining the model",
        "Only through a browser",
      ],
      answer: 1,
      why: "Groq offers an OpenAI-compatible endpoint, so common calls work with a new base URL.",
    },
    {
      q: "What is the main reason to configure a fallback provider?",
      options: [
        "To get cheaper tokens",
        "So rate limits or outages at one provider don't take your app down",
        "To make answers longer",
        "It's required by Groq",
      ],
      answer: 1,
      why: "Timeouts plus a second provider keep the feature working during failures.",
    },
  ],
  "04-finetuning/mlops": [
    {
      q: "A teammate changes the system prompt and quality drops. What would have caught it before release?",
      options: [
        "A bigger GPU",
        "An automated eval gate in CI",
        "Higher temperature",
        "More logging only",
      ],
      answer: 1,
      why: "Running the golden test set on every change blocks regressions before users see them.",
    },
    {
      q: "Which should be versioned and logged with every request?",
      options: [
        "Only the model name",
        "Prompts, model ID, retrieval settings and parameters",
        "Nothing — LLMs are stateless",
        "Only the user's name",
      ],
      answer: 1,
      why: "Any of these can change outputs; you need to know which combination produced each answer.",
    },
    {
      q: "What does vLLM's PagedAttention improve?",
      options: [
        "Prompt wording",
        "GPU memory use for the attention cache, enabling more concurrent requests",
        "Tokenization speed only",
        "Model accuracy",
      ],
      answer: 1,
      why: "Managing the KV cache in pages wastes far less memory, raising throughput.",
    },
    {
      q: "What is a canary release?",
      options: [
        "Releasing to everyone at once",
        "Sending a small share of traffic to the new version and watching metrics",
        "Testing only on developers' laptops",
        "Deleting the old version first",
      ],
      answer: 1,
      why: "Gradual rollout limits the blast radius of a bad change; keep a kill switch.",
    },
    {
      q: "Why assign A/B variants by hashing the user ID?",
      options: [
        "It's more random",
        "Each user consistently sees the same version, keeping results clean",
        "Hashes are faster than models",
        "It hides the user's identity from the model",
      ],
      answer: 1,
      why: "Deterministic assignment avoids users flipping between versions mid-experiment.",
    },
  ],
  "04-finetuning/safety": [
    {
      q: "Why is prompt injection so hard to prevent with prompts alone?",
      options: [
        "Models ignore system prompts",
        "LLMs can't reliably tell your instructions from instructions hidden in content they read",
        "It only affects images",
        "Prompts are encrypted",
      ],
      answer: 1,
      why: "That's why critical rules must be enforced in code, not just in words.",
    },
    {
      q: "A support bot has a tool that can delete any customer account. Which OWASP risk is this?",
      options: [
        "Misinformation",
        "Excessive Agency",
        "Supply Chain",
        "System Prompt Leakage",
      ],
      answer: 1,
      why: "Tools should have the minimum permissions needed, with human approval for irreversible actions.",
    },
    {
      q: "What is 'Improper Output Handling'?",
      options: [
        "Answers that are too short",
        "Trusting model output blindly — e.g. rendering it as HTML or running it as code",
        "Slow streaming",
        "Using the wrong font",
      ],
      answer: 1,
      why: "Treat model output as untrusted input: escape, validate and never execute it.",
    },
    {
      q: "How does Constitutional AI guide model behaviour?",
      options: [
        "Only with large amounts of human-labelled harmful content",
        "With written principles used for critique-and-revise and AI feedback",
        "By removing training data",
        "By blocking all sensitive topics",
      ],
      answer: 1,
      why: "A constitution of principles drives self-critique (supervised) and AI preference judgments (RLAIF).",
    },
    {
      q: "What makes red-teaming effective over time?",
      options: [
        "Doing it once before launch",
        "A growing, repeatable attack suite run continuously, like tests",
        "Keeping attacks secret from developers",
        "Only testing with friendly users",
      ],
      answer: 1,
      why: "Attacks and models change; add every incident to the suite and run it in CI.",
    },
  ],
};
