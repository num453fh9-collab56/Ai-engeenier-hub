// LLM API prices (USD per 1M tokens, standard tier, short prompts), copied from
// each provider's official pricing page on PRICES_CHECKED. They change often —
// the UI always shows the date and links to the source.

export const PRICES_CHECKED = "14 Nov 2026";

export interface ModelPrice {
  id: string;
  provider: "OpenAI" | "Anthropic" | "Google" | "Groq";
  model: string;
  tier: "Flagship" | "Mid" | "Small / fast";
  input: number;
  cachedInput?: number;
  output: number;
  note?: string;
  source: string;
}

const OPENAI = "https://developers.openai.com/api/docs/pricing";
const CLAUDE = "https://platform.claude.com/docs/en/about-claude/pricing";
const GEMINI = "https://aistudio.google.com/docs/pricing";
const GROQ = "https://console.groq.com/docs/models";

export const MODEL_PRICES: ModelPrice[] = [
  { id: "gpt-6-astra", provider: "OpenAI", model: "gpt-6-astra", tier: "Flagship", input: 10, cachedInput: 1, output: 50, source: OPENAI },
  { id: "gpt-6.1-sol", provider: "OpenAI", model: "gpt-6.1-sol", tier: "Mid", input: 2, cachedInput: 0.1, output: 10, source: OPENAI },
  { id: "gpt-6.1-terra", provider: "OpenAI", model: "gpt-6.1-terra", tier: "Mid", input: 1, cachedInput: 0.05, output: 5, source: OPENAI },
  { id: "gpt-6-luna", provider: "OpenAI", model: "gpt-6-luna", tier: "Small / fast", input: 0.1, cachedInput: 0.01, output: 0.5, source: OPENAI },
  { id: "gpt-5-nano", provider: "OpenAI", model: "gpt-5-nano", tier: "Small / fast", input: 0.05, cachedInput: 0.005, output: 0.4, source: OPENAI },

  { id: "claude-opus-5-5", provider: "Anthropic", model: "Claude Opus 5.5", tier: "Flagship", input: 4, cachedInput: 0.2, output: 20, source: CLAUDE },
  { id: "claude-sonnet-5-5", provider: "Anthropic", model: "Claude Sonnet 5.5", tier: "Mid", input: 2, cachedInput: 0.1, output: 10, source: CLAUDE },
  { id: "claude-haiku-5-5", provider: "Anthropic", model: "Claude Haiku 5.5", tier: "Small / fast", input: 0.1, cachedInput: 0.01, output: 0.5, note: "Prompts up to 100K tokens", source: CLAUDE },

  { id: "gemini-4-carbon", provider: "Google", model: "Gemini 4 Carbon", tier: "Flagship", input: 2, output: 10, note: "Rises to $4 / $20 on 1 Dec 2026", source: GEMINI },
  { id: "gemini-4-hydrogen", provider: "Google", model: "Gemini 4 Hydrogen", tier: "Mid", input: 1.5, output: 7.5, source: GEMINI },
  { id: "gemini-3-8-flash", provider: "Google", model: "Gemini 3.8 Flash", tier: "Small / fast", input: 0.75, output: 3.75, note: "Rises to $1.50 / $7.50 on 1 Jan 2027", source: GEMINI },
  { id: "gemini-3-1-flash-lite", provider: "Google", model: "Gemini 3.1 Flash-Lite", tier: "Small / fast", input: 0.25, output: 1.5, source: GEMINI },

  { id: "groq-gpt-oss-120b", provider: "Groq", model: "gpt-oss-120b (on Groq)", tier: "Mid", input: 0.15, output: 0.6, note: "Open-weight model; ~500 tokens/s listed", source: GROQ },
  { id: "groq-gpt-oss-20b", provider: "Groq", model: "gpt-oss-20b (on Groq)", tier: "Small / fast", input: 0.075, output: 0.3, note: "Open-weight model; ~1,000 tokens/s listed", source: GROQ },
  { id: "groq-qwen3-8-27b", provider: "Groq", model: "Qwen3.8 27B (on Groq)", tier: "Mid", input: 0.8, output: 4, note: "Open-weight model; ~450 tokens/s listed", source: GROQ },
];

/** Models the live Arena can call (all served by Groq with our key). */
export const ARENA_MODELS: { id: string; label: string; priceId: string }[] = [
  { id: "openai/gpt-oss-120b", label: "gpt-oss-120b", priceId: "groq-gpt-oss-120b" },
  { id: "openai/gpt-oss-20b", label: "gpt-oss-20b", priceId: "groq-gpt-oss-20b" },
  { id: "qwen/qwen3.8-27b", label: "Qwen3.8 27B", priceId: "groq-qwen3-8-27b" },
];
