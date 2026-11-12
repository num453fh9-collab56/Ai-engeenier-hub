// Custom, theme-aware SVG diagrams that explain each track's core idea.
import { Arrow, Box, C, type Node } from "@/components/illus-primitives";
import { lessonDiagrams } from "@/components/lesson-diagrams";
import { ExplainerPlayer } from "@/components/explainer-player";

function Pipeline({ nodes, labels = [] }: { nodes: Omit<Node, "y">[]; labels?: string[] }) {
  const y = 128;
  return (
    <>
      {nodes.map((n, i) => (
        <g key={i}>
          <Box {...n} y={y} />
          {i < nodes.length - 1 && (
            <Arrow x1={n.x + n.w + 4} y1={y + 32} x2={nodes[i + 1].x - 6} y2={y + 32} label={labels[i]} />
          )}
        </g>
      ))}
    </>
  );
}

const diagrams: Record<string, { caption: string; body: React.ReactNode }> = {
  "01-foundations": {
    caption: "How an LLM turns your text into an answer: tokenize, embed, attend, predict.",
    body: (
      <>
        <Pipeline
          nodes={[
            { x: 30, w: 120, label: "Your text", sub: "\"Explain RAG\"" },
            { x: 190, w: 120, label: "Tokens", sub: "[Expl][ain][ R][AG]" },
            { x: 350, w: 150, label: "Transformer", sub: "self-attention × N", accent: true },
            { x: 540, w: 100, label: "Logits", sub: "next-token probs" },
            { x: 680, w: 92, label: "Output", sub: "streamed" },
          ]}
        />
        {/* attention heat-grid */}
        {Array.from({ length: 5 }, (_, r) =>
          Array.from({ length: 5 }, (_, c) => (
            <rect
              key={`${r}-${c}`}
              x={383 + c * 17}
              y={36 + r * 15}
              width={15}
              height={13}
              rx={3}
              fill={C.primary}
              opacity={c <= r ? 0.15 + ((r * 3 + c * 7) % 10) / 12 : 0.05}
            />
          ))
        )}
        <text x={425} y={26} textAnchor="middle" fontSize={10} fill={C.muted}>causal attention</text>
        <path d="M425,114 L425,124" stroke={C.border} strokeWidth={1.5} strokeDasharray="3 3" />
      </>
    ),
  },
  "02-rag": {
    caption: "Retrieval-Augmented Generation: fetch the right context first, then let the LLM answer from it.",
    body: (
      <>
        <Pipeline
          nodes={[
            { x: 20, w: 110, label: "Question" },
            { x: 165, w: 110, label: "Embed", sub: "→ vector" },
            { x: 310, w: 130, label: "Vector DB", sub: "top-k search", accent: true },
            { x: 475, w: 130, label: "LLM + context", sub: "grounded prompt" },
            { x: 640, w: 140, label: "Answer", sub: "with citations" },
          ]}
        />
        {/* documents being indexed */}
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${318 + i * 40},${30 + (i % 2) * 8})`}>
            <rect width={30} height={38} rx={5} fill={C.card} stroke={C.border} strokeWidth={1.5} />
            <path d="M7,12 H23 M7,19 H23 M7,26 H18" stroke={C.muted} strokeWidth={1.5} />
          </g>
        ))}
        <text x={375} y={22} textAnchor="middle" fontSize={10} fill={C.muted}>your documents (chunked + embedded)</text>
        <path d="M375,84 L375,122" stroke={C.primary} strokeWidth={1.5} strokeDasharray="4 4" markerEnd="url(#arrow)" />
        <path d="M375,196 C375,250 540,250 540,198" fill="none" stroke={C.primary} strokeWidth={1.5} strokeDasharray="4 4" markerEnd="url(#arrow)" />
        <text x={458} y={262} textAnchor="middle" fontSize={10} fill={C.muted}>retrieved chunks</text>
      </>
    ),
  },
  "03-agents": {
    caption: "The agent loop: the model reasons, calls a tool, observes the result — and repeats until done.",
    body: (
      <>
        <Box x={330} y={128} w={140} label="LLM agent" sub="plans next step" accent />
        <Box x={330} y={20} w={140} label="Thought" sub="what to do next?" />
        <Box x={600} y={128} w={150} label="Action" sub="call a tool" />
        <Box x={330} y={236} w={140} label="Observation" sub="tool result" />
        <Box x={50} y={128} w={150} label="Final answer" sub="when goal is met" />
        <path d="M470,52 C560,52 640,80 670,124" fill="none" stroke={C.primary} strokeWidth={2} markerEnd="url(#arrow)" className="illus-flow" />
        <path d="M630,196 C610,250 560,268 474,268" fill="none" stroke={C.primary} strokeWidth={2} markerEnd="url(#arrow)" className="illus-flow" />
        <path d="M330,268 C260,268 250,200 330,170" fill="none" stroke={C.primary} strokeWidth={2} markerEnd="url(#arrow)" className="illus-flow" />
        <path d="M400,128 L400,88" stroke={C.primary} strokeWidth={2} markerEnd="url(#arrow)" className="illus-flow" />
        <path d="M330,160 L206,160" stroke={C.muted} strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#arrow-muted)" />
        {["search", "code", "API"].map((t, i) => (
          <g key={t} transform={`translate(${652 + i * 44},${212})`}>
            <rect width={40} height={22} rx={11} fill={C.bg} stroke={C.border} />
            <text x={20} y={15} textAnchor="middle" fontSize={10} fill={C.muted}>{t}</text>
          </g>
        ))}
      </>
    ),
  },
  "04-finetuning": {
    caption: "From base model to production: adapt it cheaply with LoRA, serve it fast, and watch it closely.",
    body: (
      <>
        <Pipeline
          nodes={[
            { x: 20, w: 120, label: "Base model", sub: "frozen weights" },
            { x: 180, w: 130, label: "+ LoRA", sub: "small adapters", accent: true },
            { x: 350, w: 120, label: "Evaluate", sub: "evals + red-team" },
            { x: 510, w: 120, label: "Serve", sub: "vLLM / Groq" },
            { x: 670, w: 110, label: "Monitor", sub: "cost · latency" },
          ]}
        />
        {/* tiny low-rank matrices */}
        <g transform="translate(205,40)">
          <rect width={20} height={64} rx={4} fill={C.primary} opacity={0.35} />
          <text x={32} y={36} fontSize={14} fill={C.muted}>×</text>
          <rect x={44} y={22} width={64} height={20} rx={4} fill={C.primary} opacity={0.6} />
        </g>
        <text x={245} y={30} textAnchor="middle" fontSize={10} fill={C.muted}>A · B (rank r)</text>
        <path d="M725,196 C725,270 80,270 80,198" fill="none" stroke={C.muted} strokeWidth={1.5} strokeDasharray="5 4" markerEnd="url(#arrow-muted)" />
        <text x={400} y={258} textAnchor="middle" fontSize={10} fill={C.muted}>feedback → next training round</text>
      </>
    ),
  },
};

export function LessonIllustration({ category, slug, title }: { category: string; slug: string; title: string }) {
  const lesson = lessonDiagrams[`${category}/${slug}`];
  const d = lesson ?? diagrams[category] ?? diagrams["01-foundations"];
  const steps = lesson?.steps ?? [];
  const svg = (
      <div className="illus overflow-hidden rounded-2xl border border-border">
      <svg viewBox="0 0 800 300" role="img" aria-label={`${title} — diagram: ${d.caption}`} className="block w-full h-auto">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={C.primary} />
          </marker>
          <marker id="arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill={C.muted} />
          </marker>
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#1e3a8a" floodOpacity="0.12" />
          </filter>
          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={C.border} />
          </pattern>
        </defs>
        <rect width="800" height="300" fill={C.bg} />
        <rect width="800" height="300" fill="url(#dots)" />
        {d.body}
      </svg>
    </div>
  );

  return (
    <figure className="not-prose my-8">
      {steps.length ? <ExplainerPlayer steps={steps} caption={d.caption}>{svg}</ExplainerPlayer> : svg}
      {!steps.length && <figcaption className="mt-2 text-center text-xs text-muted-foreground">{d.caption}</figcaption>}
      {steps.length > 0 && <figcaption className="sr-only">{d.caption}</figcaption>}
    </figure>
  );
}
