"use client";

import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";

interface Lesson {
  title: string;
  language: "Python" | "TypeScript" | "Rust" | "Julia";
}

interface Phase {
  phase: string;
  title: string;
  lessons: Lesson[];
}

const curriculum: Phase[] = [
  {
    phase: "Phase 0",
    title: "Setup & Tooling",
    lessons: [
      { title: "Development Environment Setup", language: "Python" },
      { title: "Python for AI Engineering", language: "Python" },
      { title: "Git & Version Control for ML", language: "Python" },
      { title: "Docker for ML Workflows", language: "Python" },
      { title: "Package Management & Virtual Environments", language: "Python" },
      { title: "Jupyter & Notebooks for Research", language: "Python" },
      { title: "VS Code & IDE Extensions", language: "TypeScript" },
      { title: "Shell Scripting for Automation", language: "Python" },
      { title: "CI/CD for ML Pipelines", language: "Python" },
      { title: "Cloud Setup (AWS/GCP/Azure)", language: "Python" },
      { title: "Experiment Tracking Tools", language: "Python" },
      { title: "Project Templates & Best Practices", language: "Python" },
    ],
  },
  {
    phase: "Phase I",
    title: "Math Foundations",
    lessons: [
      { title: "Linear Algebra for ML", language: "Python" },
      { title: "Calculus & Optimization", language: "Python" },
      { title: "Probability Theory", language: "Python" },
      { title: "Statistics for Data Science", language: "Python" },
      { title: "Information Theory", language: "Python" },
      { title: "Matrix Decompositions", language: "Python" },
      { title: "Numerical Methods", language: "Rust" },
      { title: "Graph Theory", language: "Python" },
      { title: "Bayesian Inference", language: "Python" },
      { title: "Differential Equations", language: "Julia" },
      { title: "Entropy & KL Divergence", language: "Python" },
      { title: "Convex Optimization", language: "Python" },
      { title: "Principal Component Analysis", language: "Python" },
      { title: "Singular Value Decomposition", language: "Python" },
      { title: "Monte Carlo Methods", language: "Python" },
      { title: "Markov Chains", language: "Python" },
      { title: "Random Processes", language: "Python" },
      { title: "Spectral Methods", language: "Julia" },
      { title: "Manifold Learning", language: "Python" },
      { title: "Kernel Methods", language: "Python" },
      { title: "Generative vs Discriminative Models", language: "Python" },
      { title: "Loss Functions & Regularization", language: "Python" },
    ],
  },
  {
    phase: "Phase II",
    title: "ML Fundamentals",
    lessons: [
      { title: "Supervised Learning (Regression)", language: "Python" },
      { title: "Supervised Learning (Classification)", language: "Python" },
      { title: "Decision Trees & Random Forests", language: "Python" },
      { title: "Support Vector Machines", language: "Python" },
      { title: "K-Nearest Neighbors", language: "Python" },
      { title: "Naive Bayes", language: "Python" },
      { title: "Gradient Boosting (XGBoost, LightGBM)", language: "Python" },
      { title: "Unsupervised Learning (Clustering)", language: "Python" },
      { title: "Dimensionality Reduction", language: "Python" },
      { title: "Feature Engineering", language: "Python" },
      { title: "Model Evaluation & Validation", language: "Python" },
      { title: "Bias-Variance Tradeoff", language: "Python" },
      { title: "Regularization Techniques", language: "Python" },
      { title: "Hyperparameter Tuning", language: "Python" },
      { title: "Ensemble Methods", language: "Python" },
      { title: "Imbalanced Learning", language: "Python" },
      { title: "Anomaly Detection", language: "Python" },
      { title: "Time Series Forecasting", language: "Python" },
    ],
  },
  {
    phase: "Phase III",
    title: "Deep Learning Foundations",
    lessons: [
      { title: "Neural Networks from Scratch", language: "Python" },
      { title: "Backpropagation & Automatic Differentiation", language: "Python" },
      { title: "Activation Functions", language: "Python" },
      { title: "Weight Initialization", language: "Python" },
      { title: "Batch Normalization", language: "Python" },
      { title: "Dropout & Regularization", language: "Python" },
      { title: "Optimizers (SGD, Adam, RMSprop)", language: "Python" },
      { title: "Learning Rate Schedules", language: "Python" },
      { title: "PyTorch Fundamentals", language: "Python" },
      { title: "TensorFlow & Keras", language: "Python" },
      { title: "JAX for High-Performance Computing", language: "Python" },
      { title: "Training Loops & Callbacks", language: "Python" },
      { title: "Gradient Clipping & Stability", language: "Python" },
      { title: "Loss Functions for Deep Learning", language: "Python" },
      { title: "Transfer Learning", language: "Python" },
    ],
  },
  {
    phase: "Phase IV",
    title: "Computer Vision",
    lessons: [
      { title: "Convolutional Neural Networks", language: "Python" },
      { title: "Image Classification", language: "Python" },
      { title: "Object Detection (YOLO, DETR)", language: "Python" },
      { title: "Semantic Segmentation", language: "Python" },
      { title: "Vision Transformers (ViT)", language: "Python" },
      { title: "Image Generation (GANs, Diffusion)", language: "Python" },
      { title: "Data Augmentation", language: "Python" },
      { title: "Image Embeddings & CLIP", language: "Python" },
    ],
  },
  {
    phase: "Phase V",
    title: "Natural Language Processing",
    lessons: [
      { title: "Tokenization & Text Preprocessing", language: "Python" },
      { title: "Word Embeddings (Word2Vec, GloVe)", language: "Python" },
      { title: "Recurrent Neural Networks", language: "Python" },
      { title: "LSTMs & GRUs", language: "Python" },
      { title: "Sequence-to-Sequence Models", language: "Python" },
      { title: "Attention Mechanism", language: "Python" },
      { title: "Text Classification", language: "Python" },
      { title: "Named Entity Recognition", language: "Python" },
      { title: "Machine Translation", language: "Python" },
      { title: "Sentiment Analysis", language: "Python" },
    ],
  },
  {
    phase: "Phase VI",
    title: "Transformers from Scratch",
    lessons: [
      { title: "The Transformer Architecture", language: "Python" },
      { title: "Multi-Head Attention", language: "Python" },
      { title: "Positional Encoding", language: "Python" },
      { title: "Layer Normalization & Residuals", language: "Python" },
      { title: "Encoder-Decoder Architecture", language: "Python" },
      { title: "Training Transformers", language: "Python" },
      { title: "Inference Optimization", language: "Rust" },
      { title: "Scalable Transformer Patterns", language: "Python" },
    ],
  },
  {
    phase: "Phase VII",
    title: "Reinforcement Learning",
    lessons: [
      { title: "Markov Decision Processes", language: "Python" },
      { title: "Dynamic Programming", language: "Python" },
      { title: "Q-Learning & Deep Q-Networks", language: "Python" },
      { title: "Policy Gradients", language: "Python" },
      { title: "Actor-Critic Methods", language: "Python" },
      { title: "PPO & TRPO", language: "Python" },
      { title: "RLHF Fundamentals", language: "Python" },
    ],
  },
  {
    phase: "Phase VIII",
    title: "LLMs from Scratch",
    lessons: [
      { title: "GPT Architecture Deep Dive", language: "Python" },
      { title: "Pre-training Objectives", language: "Python" },
      { title: "Causal Language Modeling", language: "Python" },
      { title: "Scaling Laws", language: "Python" },
      { title: "Distributed Training (FSDP, DeepSpeed)", language: "Python" },
      { title: "Tokenization (BPE, SentencePiece)", language: "Rust" },
      { title: "KV-Cache Inference", language: "Rust" },
      { title: "Quantization (GPTQ, AWQ)", language: "Python" },
      { title: "Speculative Decoding", language: "Python" },
      { title: "Flash Attention", language: "Rust" },
    ],
  },
  {
    phase: "Phase IX",
    title: "Fine-Tuning & Alignment",
    lessons: [
      { title: "Supervised Fine-Tuning (SFT)", language: "Python" },
      { title: "LoRA & QLoRA", language: "Python" },
      { title: "RLHF & DPO", language: "Python" },
      { title: "Preference Optimization", language: "Python" },
      { title: "Constitutional AI", language: "Python" },
      { title: "Evaluation Benchmarks", language: "Python" },
      { title: "Data Curation for Fine-Tuning", language: "Python" },
      { title: "Catastrophic Forgetting", language: "Python" },
    ],
  },
  {
    phase: "Phase X",
    title: "Prompt Engineering & Structured Outputs",
    lessons: [
      { title: "Prompt Design Patterns", language: "Python" },
      { title: "Chain-of-Thought Reasoning", language: "Python" },
      { title: "Structured Outputs with Pydantic", language: "Python" },
      { title: "Function/Tool Calling", language: "TypeScript" },
      { title: "JSON Mode & Grammar Sampling", language: "TypeScript" },
      { title: "Instructor Library Deep Dive", language: "Python" },
      { title: "Output Validation & Retry", language: "Python" },
    ],
  },
  {
    phase: "Phase XI",
    title: "Retrieval-Augmented Generation",
    lessons: [
      { title: "Embedding Models & Semantic Search", language: "Python" },
      { title: "Vector Databases (Pinecone, Qdrant, PGVector)", language: "Python" },
      { title: "Hybrid Search (Dense + Sparse)", language: "Python" },
      { title: "BM25 & Sparse Retrieval", language: "Python" },
      { title: "Reciprocal Rank Fusion", language: "Python" },
      { title: "Cross-Encoder Re-ranking", language: "Python" },
      { title: "Chunking Strategies", language: "Python" },
      { title: "Metadata Filtering", language: "TypeScript" },
      { title: "RAG Evaluation (RAGAS)", language: "Python" },
      { title: "Advanced RAG (Graph RAG, HyDE)", language: "Python" },
    ],
  },
  {
    phase: "Phase XII",
    title: "Multimodal AI",
    lessons: [
      { title: "Vision-Language Models", language: "Python" },
      { title: "Image Captioning & VQA", language: "Python" },
      { title: "Audio Processing & Whisper", language: "Python" },
      { title: "Text-to-Speech & Speech-to-Text", language: "Python" },
      { title: "Multimodal Embeddings", language: "Python" },
      { title: "Video Understanding", language: "Python" },
      { title: "Multimodal RAG", language: "Python" },
    ],
  },
  {
    phase: "Phase XIII",
    title: "Tools & Protocols",
    lessons: [
      { title: "MCP (Model Context Protocol)", language: "TypeScript" },
      { title: "A2A (Agent-to-Agent Protocol)", language: "TypeScript" },
      { title: "OpenAI Function Calling", language: "Python" },
      { title: "Anthropic Tool Use", language: "Python" },
      { title: "Building Custom Tools", language: "TypeScript" },
      { title: "Tool Discovery & Registries", language: "TypeScript" },
    ],
  },
  {
    phase: "Phase XIV",
    title: "Agent Engineering",
    lessons: [
      { title: "ReAct Pattern Implementation", language: "Python" },
      { title: "LangGraph for Orchestration", language: "Python" },
      { title: "CrewAI for Multi-Agent", language: "Python" },
      { title: "Custom Agent Loop", language: "TypeScript" },
      { title: "Memory & State Management", language: "TypeScript" },
      { title: "Observability for Agents", language: "TypeScript" },
      { title: "Error Recovery & Retry", language: "TypeScript" },
      { title: "Agent Evaluation", language: "Python" },
    ],
  },
  {
    phase: "Phase XV",
    title: "Autonomous Systems & Self-Improvement",
    lessons: [
      { title: "Self-Improving Agent Loops", language: "TypeScript" },
      { title: "Reflection & Self-Correction", language: "TypeScript" },
      { title: "Code Generation Agents", language: "TypeScript" },
      { title: "Autonomous Research Agents", language: "Python" },
      { title: "Agent Sandboxing", language: "Rust" },
      { title: "Rate Limiting & Budgeting", language: "Rust" },
      { title: "Continuous Learning Systems", language: "Python" },
    ],
  },
  {
    phase: "Phase XVI",
    title: "Multi-Agent Swarms",
    lessons: [
      { title: "Swarm Architectures", language: "TypeScript" },
      { title: "Agent Communication Patterns", language: "TypeScript" },
      { title: "Task Decomposition & Allocation", language: "TypeScript" },
      { title: "Consensus & Voting Mechanisms", language: "Python" },
      { title: "Swarm Observability", language: "TypeScript" },
      { title: "Scaling Agent Swarms", language: "Rust" },
    ],
  },
  {
    phase: "Phase XVII",
    title: "Production Infrastructure",
    lessons: [
      { title: "Model Serving (vLLM, TGI, Triton)", language: "Rust" },
      { title: "GPU Inference Optimization", language: "Rust" },
      { title: "Kubernetes for ML", language: "TypeScript" },
      { title: "ML Pipelines (Kubeflow, Airflow)", language: "Python" },
      { title: "Monitoring & Observability", language: "Rust" },
      { title: "A/B Testing for LLMs", language: "Python" },
      { title: "Cost Optimization", language: "TypeScript" },
      { title: "CI/CD for ML Models", language: "TypeScript" },
    ],
  },
  {
    phase: "Phase XVIII",
    title: "Safety & Alignment",
    lessons: [
      { title: "Red-Teaming LLMs", language: "Python" },
      { title: "Adversarial Robustness", language: "Python" },
      { title: "Bias Detection & Mitigation", language: "Python" },
      { title: "Guardrails & Content Filtering", language: "TypeScript" },
      { title: "Evaluation Suites", language: "Python" },
      { title: "Responsible AI Practices", language: "Python" },
    ],
  },
  {
    phase: "Phase XIX",
    title: "Capstone Projects",
    lessons: [
      { title: "Build a RAG System", language: "Python" },
      { title: "Build a ReAct Agent", language: "TypeScript" },
      { title: "Fine-Tune an LLM", language: "Python" },
      { title: "Build a Multi-Agent System", language: "TypeScript" },
      { title: "Deploy at Scale", language: "Rust" },
      { title: "Production Monitoring Stack", language: "Rust" },
    ],
  },
];

const langColors: Record<string, string> = {
  Python: "bg-blue-500/10 text-blue-500",
  TypeScript: "bg-amber-500/10 text-amber-500",
  Rust: "bg-purple-500/10 text-purple-500",
  Julia: "bg-emerald-500/10 text-emerald-500",
};

export function CurriculumRoadmap() {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section className="px-4 py-20 bg-muted/30">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight mb-3">
            Curriculum Roadmap — 20 Phases
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            The full path from zero to autonomous agent swarms. New lessons
            are added every week.
          </p>
        </div>

        <div className="space-y-2">
          {curriculum.map((phase, i) => {
            const isOpen = expanded === i;
            return (
              <div
                key={phase.phase}
                className="rounded-xl border border-border/60 bg-card overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-medium text-muted-foreground min-w-[5ch]">
                      {phase.phase}
                    </span>
                    <span className="text-sm font-semibold">{phase.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {phase.lessons.length} Lessons
                    </span>
                    <ChevronDown
                      className={`size-4 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-border/40 px-5 py-3">
                    <div className="grid gap-2 sm:grid-cols-2">
                      {phase.lessons.map((lesson) => (
                        <div
                          key={lesson.title}
                          className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent/40 transition-colors"
                        >
                          <BookOpen className="size-3 shrink-0 text-muted-foreground" />
                          <span className="text-xs flex-1">{lesson.title}</span>
                          <span
                            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium shrink-0 ${
                              langColors[lesson.language]
                            }`}
                          >
                            {lesson.language}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
