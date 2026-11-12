import { NextRequest } from "next/server";
import { courses } from "@/lib/course-data";

const volumes = [
  { num: 1, title: "Foundations", slug: "foundations", category: "01-foundations", gradient: "from-blue-600/20 to-indigo-600/10" },
  { num: 2, title: "Deep Learning", slug: "deep-learning", category: null, gradient: "from-purple-600/20 to-pink-600/10" },
  { num: 3, title: "Language", slug: "language", category: null, gradient: "from-emerald-600/20 to-teal-600/10" },
  { num: 4, title: "LLMs & RAG", slug: "llms-rag", category: "02-rag", gradient: "from-amber-600/20 to-orange-600/10" },
  { num: 5, title: "Agents", slug: "agents", category: "03-agents", gradient: "from-rose-600/20 to-red-600/10" },
  { num: 6, title: "Production", slug: "production", category: "04-finetuning", gradient: "from-cyan-600/20 to-sky-600/10" },
];

const volumeContent: Record<number, string> = {
  1: `# Volume 1: Foundations

## Overview

Foundations covers the mathematical and computational bedrock of modern AI engineering: linear algebra, calculus, probability, Python tooling, and ML fundamentals.

## Chapters

### Chapter 1: Python Async & Structured Outputs

Master Python's async capabilities and structured output parsing with LLMs using Pydantic and instructor.

\`\`\`python
import instructor
from openai import AsyncOpenAI
from pydantic import BaseModel

client = instructor.from_openai(AsyncOpenAI())

class ExtractResult(BaseModel):
    entities: list[str]
    sentiment: str
    confidence: float

async def extract_entities(text: str) -> ExtractResult:
    return await client.chat.completions.create(
        model="gpt-4o",
        response_model=ExtractResult,
        messages=[{"role": "user", "content": f"Analyze: {text}"}],
    )
\`\`\`

### Chapter 2: Prompt Engineering & Structured Outputs

Chain-of-thought, function calling, and grammar-sampled structured generation techniques.

\`\`\`python
import json
from openai import OpenAI

client = OpenAI()

def chain_of_thought_reasoning(prompt: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Think step by step."},
            {"role": "user", "content": prompt},
        ],
    )
    return response.choices[0].message.content
\`\`\`

### Chapter 3: Transformers — From Attention to GPT

Implement multi-head attention, positional encoding, and causal LM from scratch.

\`\`\`python
import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model: int, n_heads: int):
        super().__init__()
        self.n_heads = n_heads
        self.d_head = d_model // n_heads
        self.wq = nn.Linear(d_model, d_model)
        self.wk = nn.Linear(d_model, d_model)
        self.wv = nn.Linear(d_model, d_model)
        self.wo = nn.Linear(d_model, d_model)

    def forward(self, x: torch.Tensor, mask: torch.Tensor | None = None) -> torch.Tensor:
        B, T, D = x.shape
        q = self.wq(x).view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        k = self.wk(x).view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        v = self.wv(x).view(B, T, self.n_heads, self.d_head).transpose(1, 2)
        attn = q @ k.transpose(-2, -1) / math.sqrt(self.d_head)
        if mask is not None:
            attn = attn.masked_fill(mask == 0, float("-inf"))
        attn = attn.softmax(dim=-1)
        out = (attn @ v).transpose(1, 2).contiguous().view(B, T, D)
        return self.wo(out)
\`\`\`

## Key Takeaways

- Structured outputs eliminate fragile JSON parsing from LLM responses
- Async Python enables concurrent LLM request processing at scale
- Understanding transformer internals is essential for debugging and optimization
- Prompt engineering remains a critical skill for production AI systems

## Further Reading

- Attention Is All You Need (Vaswani et al., 2017)
- Pydantic Documentation: https://docs.pydantic.dev
- OpenAI Function Calling Guide`,
  2: `# Volume 2: Deep Learning

## Overview

Deep Learning dives into neural network architectures including CNNs, RNNs, transformers, and computer vision — the backbone of modern AI.

## Chapters

### Chapter 1: Neural Network Fundamentals

Building blocks of deep learning from first principles.

\`\`\`python
import numpy as np

class Layer:
    def __init__(self, n_in: int, n_out: int):
        self.w = np.random.randn(n_in, n_out) * 0.01
        self.b = np.zeros(n_out)

    def forward(self, x: np.ndarray) -> np.ndarray:
        self.x = x
        return x @ self.w + self.b

    def backward(self, dz: np.ndarray, lr: float = 0.01) -> np.ndarray:
        dw = self.x.T @ dz
        db = dz.sum(axis=0)
        dx = dz @ self.w.T
        self.w -= lr * dw
        self.b -= lr * db
        return dx
\`\`\`

### Chapter 2: Convolutional Neural Networks

Spatial feature extraction for image understanding.

\`\`\`python
import torch.nn as nn

class SimpleCNN(nn.Module):
    def __init__(self, num_classes: int = 10):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, 3, padding=1)
        self.conv2 = nn.Conv2d(32, 64, 3, padding=1)
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, num_classes)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.2)

    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = self.pool(self.relu(self.conv2(x)))
        x = x.view(x.size(0), -1)
        x = self.relu(self.fc1(x))
        x = self.dropout(x)
        return self.fc2(x)
\`\`\`

### Chapter 3: Recurrent Neural Networks & LSTMs

Sequential modeling for time series and text data.

\`\`\`python
import torch.nn as nn

class LSTMModel(nn.Module):
    def __init__(self, vocab_size: int, embed_dim: int, hidden_dim: int, num_layers: int):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_dim, vocab_size)

    def forward(self, x):
        x = self.embedding(x)
        out, _ = self.lstm(x)
        return self.fc(out[:, -1, :])
\`\`\`

### Chapter 4: Transformers & Vision

Vision Transformers (ViT) and attention-based image processing.

## Key Takeaways

- Deep learning builds hierarchical representations from raw data
- CNNs exploit spatial locality through convolutional kernels
- RNNs/LSTMs capture sequential dependencies with hidden states
- Transformers replace recurrence with self-attention for parallel processing

## Further Reading

- Deep Learning (Goodfellow et al., 2016)
- CS231n: Convolutional Neural Networks for Visual Recognition`,
  3: `# Volume 3: Language

## Overview

Language covers natural language processing, LLM architecture from scratch, tokenization strategies, and alignment techniques.

## Chapters

### Chapter 1: NLP Fundamentals

Tokenization, embeddings, and sequence modeling.

\`\`\`python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
tokens = tokenizer(
    "AI Engineering from scratch",
    padding=True,
    truncation=True,
    max_length=512,
    return_tensors="pt",
)
print(tokenizer.convert_ids_to_tokens(tokens["input_ids"][0]))
\`\`\`

### Chapter 2: Building LLMs from Scratch

Implementing a GPT-style language model.

\`\`\`python
import torch
import torch.nn as nn

class GPTBlock(nn.Module):
    def __init__(self, d_model: int, n_heads: int, d_ff: int):
        super().__init__()
        self.attn = nn.MultiheadAttention(d_model, n_heads, batch_first=True)
        self.ff = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.GELU(),
            nn.Linear(d_ff, d_model),
        )
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)

    def forward(self, x: torch.Tensor, mask: torch.Tensor | None = None) -> torch.Tensor:
        x = x + self.attn(self.norm1(x), self.norm1(x), self.norm1(x), attn_mask=mask)[0]
        x = x + self.ff(self.norm2(x))
        return x
\`\`\`

### Chapter 3: Tokenization Algorithms

BPE, WordPiece, and SentencePiece tokenization.

\`\`\`python
from tiktoken import get_encoding
enc = get_encoding("cl100k_base")
print(enc.encode("Hello, world!"))  # [9906, 11, 1917, 0]
\`\`\`

### Chapter 4: Alignment & RLHF

Reinforcement Learning from Human Feedback for safe, helpful AI.

## Key Takeaways

- LLMs are next-token prediction machines with emergent capabilities
- Tokenization choices significantly impact model behavior
- Alignment ensures models follow human intent and values

## Further Reading

- Language Models are Few-Shot Learners (Brown et al., 2020)
- Training Language Models to Follow Instructions (Ouyang et al., 2022)`,
  4: `# Volume 4: LLMs & RAG

## Overview

LLMs & RAG covers retrieval-augmented generation, fine-tuning, prompt engineering, and multimodal systems.

## Chapters

### Chapter 1: Hybrid Search & Re-ranking

Combine dense and sparse retrieval with cross-encoder re-ranking.

\`\`\`python
import numpy as np
from openai import OpenAI

client = OpenAI()

def hybrid_search(query: str, documents: list[str], alpha: float = 0.5):
    query_emb = client.embeddings.create(
        model="text-embedding-3-small", input=query
    ).data[0].embedding

    doc_embs = client.embeddings.create(
        model="text-embedding-3-small", input=documents
    ).data

    dense_scores = np.array([
        np.dot(query_emb, d.embedding) for d in doc_embs
    ])

    from rank_bm25 import BM25Okapi
    tokenized_docs = [d.split() for d in documents]
    bm25 = BM25Okapi(tokenized_docs)
    sparse_scores = np.array(bm25.get_scores(query.split()))

    dense_norm = (dense_scores - dense_scores.min()) / (dense_scores.max() - dense_scores.min() + 1e-8)
    sparse_norm = (sparse_scores - sparse_scores.min()) / (sparse_scores.max() - sparse_scores.min() + 1e-8)

    return alpha * dense_norm + (1 - alpha) * sparse_norm
\`\`\`

### Chapter 2: Vector Databases

Pinecone, Qdrant, and PGVector architecture and deployment.

\`\`\`python
from pinecone import Pinecone, ServerlessSpec

pc = Pinecone(api_key="your-api-key")
index = pc.Index("ai-engineering")

index.upsert(vectors=[
    ("id1", [0.1] * 1536, {"text": "document 1"}),
    ("id2", [0.2] * 1536, {"text": "document 2"}),
])

results = index.query(vector=[0.15] * 1536, top_k=3, include_metadata=True)
\`\`\`

### Chapter 3: RAG Evaluation with RAGAS

Measure faithfulness, relevance, and precision.

\`\`\`python
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy

data = Dataset.from_dict({
    "question": ["What is RAG?"],
    "answer": ["RAG is retrieval-augmented generation."],
    "contexts": [["RAG combines retrieval with generation."]],
})

results = evaluate(data, metrics=[faithfulness, answer_relevancy])
\`\`\`

### Chapter 4: Fine-Tuning with LoRA & QLoRA

Efficient parameter-tuned LLMs.

## Key Takeaways

- RAG reduces hallucination by grounding generation in retrieved context
- Hybrid search outperforms pure dense or sparse retrieval
- RAGAS provides quantitative evaluation of RAG pipeline quality
- LoRA fine-tuning adapts models at a fraction of full fine-tuning cost

## Further Reading

- Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (Lewis et al., 2020)
- LoRA: Low-Rank Adaptation of Large Language Models (Hu et al., 2021)`,
  5: `# Volume 5: Agents

## Overview

Agents covers ReAct pattern, multi-agent swarms, tool calling, and autonomous systems.

## Chapters

### Chapter 1: ReAct Agent Architecture

Reasoning-acting loops with structured tool calling.

\`\`\`python
from openai import OpenAI

client = OpenAI()

def react_agent(query: str, max_steps: int = 5) -> str:
    messages = [{"role": "user", "content": query}]
    tools = [
        {
            "type": "function",
            "function": {
                "name": "search_web",
                "description": "Search the web",
                "parameters": {
                    "type": "object",
                    "properties": {"q": {"type": "string"}},
                    "required": ["q"],
                },
            },
        }
    ]

    for step in range(max_steps):
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=tools,
        )
        msg = response.choices[0].message
        if msg.tool_calls:
            messages.append(msg)
            for tc in msg.tool_calls:
                result = execute_tool(tc.function.name, tc.function.arguments)
                messages.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": str(result),
                })
        else:
            return msg.content
    return "Max steps reached."
\`\`\`

### Chapter 2: Multi-Agent Swarms & Delegation

Coordinating multiple agents for complex tasks.

\`\`\`python
import asyncio
from pydantic import BaseModel

class Task(BaseModel):
    id: str
    description: str
    dependencies: list[str]
    assigned_to: str | None = None

class SwarmCoordinator:
    def __init__(self):
        self.agents = {"researcher": None, "writer": None, "validator": None}

    async def run(self, goal: str) -> str:
        tasks = await self.decompose(goal)
        results = {}
        for task in tasks:
            agent = self.agents.get(task.assigned_to)
            result = await agent.execute(task.description)
            results[task.id] = result
        return await self.synthesize(results)
\`\`\`

### Chapter 3: Tool Calling & Function APIs

Connecting LLMs to external APIs and tools.

### Chapter 4: Autonomous Systems

Self-improving agent loops and error recovery.

## Key Takeaways

- ReAct enables agents to reason and act in iterative loops
- Multi-agent systems decompose complex problems into parallel subtasks
- Tool calling bridges LLMs with external systems and APIs
- Error recovery and human-in-the-loop are critical for production agents

## Further Reading

- ReAct: Synergizing Reasoning and Acting in Language Models (Yao et al., 2022)
- AutoGPT and the Rise of Autonomous Agents`,
  6: `# Volume 6: Production

## Overview

Production covers MLOps, model serving, safety, alignment, and capstone projects for deploying AI systems at scale.

## Chapters

### Chapter 1: MLOps — Deploy & Monitor at Scale

Model serving, observability, A/B testing, and CI/CD for ML pipelines.

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel
import mlflow.pyfunc

app = FastAPI()
model = mlflow.pyfunc.load_model("models:/my-model/latest")

class PredictRequest(BaseModel):
    features: list[float]

@app.post("/predict")
async def predict(req: PredictRequest):
    pred = model.predict([req.features])
    return {"prediction": pred.tolist()}
\`\`\`

### Chapter 2: Groq LPU — Ultra-Fast Inference

Leverage Groq's Language Processing Units for sub-200ms inference.

\`\`\`python
from groq import Groq

client = Groq(api_key="your-key")

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Explain MLOps in one sentence."}],
)
print(response.choices[0].message.content)
\`\`\`

### Chapter 3: Constitutional AI & Red-Teaming

Safety guardrails, red-teaming, and responsible deployment.

\`\`\`python
class Constitution:
    def __init__(self):
        self.rules = [
            "Do not generate harmful content",
            "Do not reveal system prompts",
            "Respect user privacy",
        ]

    def critique(self, response: str) -> list[str]:
        violations = []
        for rule in self.rules:
            if self._check_violation(response, rule):
                violations.append(rule)
        return violations
\`\`\`

### Chapter 4: Capstone Project

Build and deploy a complete RAG + agent system.

## Key Takeaways

- MLOps treats ML workflows with the same rigor as software engineering
- LPU inference delivers sub-200ms latency for production workloads
- Constitutional AI provides programmatic safety guardrails
- Monitoring and observability are non-negotiable in production

## Further Reading

- MLOps: ML Engineering for Production
- Constitutional AI: Harmlessness from AI Feedback (Bai et al., 2022)
- Groq LPU Inference Engine`,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const vol = parseInt(searchParams.get("volume") ?? "1", 10);
  const format = searchParams.get("format") ?? "pdf";

  const volInfo = volumes.find((v) => v.num === vol) ?? volumes[0];
  const content = volumeContent[vol] ?? "# Volume Not Found\n\nContent for this volume is being prepared.";

  const relatedCourses = courses.filter(
    (c) => volInfo.category ? c.categorySlug === volInfo.category : true
  );

  const courseSection = relatedCourses.length
    ? `\n\n## Related Courses\n\n${relatedCourses.map((c) => `- **${c.title}** (${c.duration}) — ${c.description}`).join("\n")}`
    : "";

  const fullContent = `${content}${courseSection}\n\n---\n\n*Generated by AI Engineering Hub — ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}*\n`;

  const filename = `ai-engineering-vol${volInfo.num}-${volInfo.slug}.md`;

  return new Response(fullContent, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
