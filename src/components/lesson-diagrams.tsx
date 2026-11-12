import { Arrow, Box, C } from "@/components/illus-primitives";

// One diagram per lesson, keyed by `${category}/${slug}`. Canvas is 800 × 300.
type Diagram = { caption: string; body: React.ReactNode };

const Note = ({ x, y, children, anchor = "middle" }: { x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end" }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize={11} fill={C.muted}>
    {children}
  </text>
);

const Curve = ({ d, muted }: { d: string; muted?: boolean }) => (
  <path
    d={d}
    fill="none"
    stroke={muted ? C.muted : C.primary}
    strokeWidth={muted ? 1.5 : 2}
    strokeDasharray={muted ? "5 4" : undefined}
    markerEnd={muted ? "url(#arrow-muted)" : "url(#arrow)"}
    className={muted ? undefined : "illus-flow"}
  />
);

const Pill = ({ x, y, w, label, strong }: { x: number; y: number; w: number; label: string; strong?: boolean }) => (
  <g>
    <rect x={x} y={y} width={w} height={24} rx={12} fill={strong ? C.primary : C.card} stroke={strong ? C.primary : C.border} />
    <text x={x + w / 2} y={y + 16} textAnchor="middle" fontSize={11} fontWeight={600} fill={strong ? "var(--primary-foreground)" : C.text}>
      {label}
    </text>
  </g>
);

export const lessonDiagrams: Record<string, Diagram> = {
  /* ---------- Foundations ---------- */
  "01-foundations/intro": {
    caption: "Fire many LLM calls concurrently, then validate every reply against a Pydantic schema — retrying when it doesn't fit.",
    body: (
      <>
        <Note x={75} y={28}>asyncio.gather()</Note>
        <Box x={20} y={40} w={110} label="Request 1" />
        <Box x={20} y={118} w={110} label="Request 2" />
        <Box x={20} y={196} w={110} label="Request 3" />
        <Arrow x1={134} y1={72} x2={184} y2={146} />
        <Arrow x1={134} y1={150} x2={184} y2={158} />
        <Arrow x1={134} y1={228} x2={184} y2={170} />
        <Box x={190} y={128} w={120} label="LLM" sub="concurrent calls" accent />
        <Arrow x1={314} y1={160} x2={344} y2={160} />
        <Box x={350} y={128} w={120} label="Raw JSON" sub={'{"name": "John"}'} />
        <Arrow x1={474} y1={160} x2={504} y2={160} />
        <Box x={510} y={128} w={120} label="Pydantic" sub="validate schema" />
        <Arrow x1={634} y1={160} x2={664} y2={160} />
        <Box x={670} y={128} w={115} label="Typed object" sub="Person(age=30)" />
        <Curve d="M570,196 C570,262 250,262 250,198" muted />
        <Note x={410} y={278}>ValidationError → retry with exponential backoff</Note>
      </>
    ),
  },
  "01-foundations/prompt-engineering": {
    caption: "A well-built prompt (role + examples + question) lets the model reason step by step, call functions, and return structured output.",
    body: (
      <>
        <Box x={20} y={40} w={140} label="System role" sub="who the model is" />
        <Box x={20} y={118} w={140} label="Few-shot" sub="worked examples" />
        <Box x={20} y={196} w={140} label="Question" sub="the user's task" />
        <Arrow x1={164} y1={72} x2={204} y2={146} />
        <Arrow x1={164} y1={150} x2={204} y2={158} />
        <Arrow x1={164} y1={228} x2={204} y2={170} />
        <Box x={210} y={128} w={110} label="LLM" sub="temperature 0" accent />
        <Arrow x1={324} y1={160} x2={354} y2={160} />
        <Box x={360} y={128} w={130} label="Reasoning" sub="step by step" />
        <Pill x={345} y={52} w={52} label="parse" />
        <Pill x={401} y={52} w={48} label="plan" />
        <Pill x={453} y={52} w={52} label="solve" />
        <Note x={425} y={40}>chain of thought</Note>
        <path d="M425,78 L425,122" stroke={C.border} strokeWidth={1.5} strokeDasharray="3 3" />
        <Arrow x1={494} y1={160} x2={524} y2={160} />
        <Box x={530} y={128} w={125} label="Function call" sub="get_weather()" />
        <Arrow x1={659} y1={160} x2={684} y2={160} />
        <Box x={690} y={128} w={95} label="Answer" sub="schema-valid" />
      </>
    ),
  },
  "01-foundations/transformers": {
    caption: "Self-attention: each token builds a query, key and value; scaled scores decide how much of every other token it mixes in.",
    body: (
      <>
        <Box x={20} y={128} w={130} label="Embeddings" sub="token + position" />
        <Arrow x1={154} y1={150} x2={194} y2={78} />
        <Arrow x1={154} y1={160} x2={194} y2={160} />
        <Arrow x1={154} y1={170} x2={194} y2={240} />
        <Box x={200} y={40} w={80} label="Q" sub="query" />
        <Box x={200} y={128} w={80} label="K" sub="key" />
        <Box x={200} y={216} w={80} label="V" sub="value" />
        <Arrow x1={284} y1={72} x2={324} y2={72} />
        <Arrow x1={284} y1={150} x2={324} y2={88} />
        <Box x={330} y={40} w={170} label="QKᵀ / √dₖ" sub="attention scores" />
        <Arrow x1={415} y1={108} x2={415} y2={210} />
        <Note x={455} y={164}>softmax</Note>
        <Arrow x1={284} y1={248} x2={324} y2={248} />
        <Box x={330} y={216} w={170} label="weights · V" sub="weighted mix" accent />
        <Arrow x1={504} y1={240} x2={534} y2={186} />
        <Box x={540} y={128} w={130} label="Concat heads" sub="h heads in parallel" />
        <Arrow x1={674} y1={160} x2={694} y2={160} />
        <Box x={700} y={128} w={85} label="LM head" sub="next token" />
        {Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 4 }, (_, c) => (
            <rect
              key={`${r}-${c}`}
              x={560 + c * 18}
              y={30 + r * 16}
              width={16}
              height={14}
              rx={3}
              fill={C.primary}
              opacity={c <= r ? 0.2 + ((r * 5 + c * 3) % 8) / 10 : 0.06}
            />
          ))
        )}
        <Note x={710} y={58} anchor="start">causal</Note>
        <Note x={710} y={72} anchor="start">mask</Note>
      </>
    ),
  },

  /* ---------- RAG ---------- */
  "02-rag/hybrid-search": {
    caption: "Hybrid retrieval: dense vectors catch meaning, BM25 catches exact terms; RRF fuses both and a cross-encoder re-ranks the best.",
    body: (
      <>
        <Box x={20} y={128} w={100} label="Query" />
        <Arrow x1={124} y1={150} x2={164} y2={88} />
        <Arrow x1={124} y1={170} x2={164} y2={232} />
        <Box x={170} y={50} w={150} label="Dense" sub="embeddings · meaning" />
        <Box x={170} y={206} w={150} label="Sparse (BM25)" sub="exact keywords" />
        <Arrow x1={324} y1={82} x2={364} y2={148} />
        <Arrow x1={324} y1={238} x2={364} y2={172} />
        <Box x={370} y={128} w={130} label="RRF fusion" sub="Σ 1 / (k + rank)" accent />
        <Arrow x1={504} y1={160} x2={534} y2={160} />
        <Box x={540} y={128} w={135} label="Cross-encoder" sub="re-rank top 50" />
        <Arrow x1={679} y1={160} x2={704} y2={160} />
        <Box x={710} y={128} w={75} label="Top 5" sub="to LLM" />
        <Note x={600} y={226}>stage 2: slow but precise, only on a short list</Note>
      </>
    ),
  },
  "02-rag/vector-dbs": {
    caption: "HNSW search hops through sparse upper layers to get close fast, then refines in the dense bottom layer — the index behind most vector DBs.",
    body: (
      <>
        <Note x={40} y={28} anchor="start">HNSW index</Note>
        {[
          { y: 40, h: 50, label: "Layer 2 · few nodes" },
          { y: 120, h: 50, label: "Layer 1" },
          { y: 200, h: 62, label: "Layer 0 · every vector" },
        ].map((l) => (
          <g key={l.y}>
            <rect x={40} y={l.y} width={330} height={l.h} rx={14} fill={C.primary} opacity={0.06} stroke={C.border} />
            <Note x={364} y={l.y + 14} anchor="end">{l.label}</Note>
          </g>
        ))}
        {(
          [
            [[90, 68], [250, 68], [330, 66]],
            [[70, 148], [130, 144], [200, 152], [250, 146], [310, 150]],
            [[60, 236], [95, 220], [120, 248], [150, 228], [185, 244], [210, 220], [240, 236], [270, 250], [300, 226], [335, 242]],
          ] as [number, number][][]
        ).map((nodes, li) => (
          <g key={li}>
            {nodes.slice(1).map(([x, y], i) => (
              <line key={i} x1={nodes[i][0]} y1={nodes[i][1]} x2={x} y2={y} stroke={C.border} strokeWidth={1.5} />
            ))}
            {nodes.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={5} fill={C.card} stroke={C.muted} strokeWidth={1.5} />
            ))}
          </g>
        ))}
        <path
          d="M90,68 L250,68 L250,146 L200,152 L210,220 L240,236"
          fill="none"
          stroke={C.primary}
          strokeWidth={2.5}
          className="illus-flow"
          markerEnd="url(#arrow)"
        />
        <circle cx={240} cy={236} r={9} fill="none" stroke={C.primary} strokeWidth={2} />
        <Note x={240} y={284}>nearest neighbour found</Note>
        <Box x={440} y={22} w={340} label="Pinecone" sub="fully managed · serverless" />
        <Box x={440} y={118} w={340} label="Qdrant" sub="open source · rich payload filters" accent />
        <Box x={440} y={214} w={340} label="pgvector" sub="vectors inside PostgreSQL" />
      </>
    ),
  },
  "02-rag/rag-eval": {
    caption: "Evaluate both halves of RAG: retrieval (did we fetch the right context?) and generation (is the answer faithful and relevant?).",
    body: (
      <>
        <Box x={20} y={128} w={105} label="Question" />
        <Arrow x1={129} y1={160} x2={154} y2={160} />
        <Box x={160} y={128} w={125} label="Retriever" sub="top-k chunks" />
        <Arrow x1={289} y1={160} x2={314} y2={160} />
        <Box x={320} y={128} w={125} label="Generator" sub="LLM answer" accent />
        <Arrow x1={449} y1={160} x2={474} y2={160} />
        <Box x={480} y={128} w={110} label="Answer" />
        <rect x={615} y={22} width={175} height={256} rx={14} fill={C.card} stroke={C.border} filter="url(#shadow)" />
        <text x={702} y={46} textAnchor="middle" fontSize={13} fontWeight={700} fill={C.text}>RAGAS scores</text>
        {[
          ["Context precision", 0.78],
          ["Context recall", 0.64],
          ["Faithfulness", 0.91],
          ["Answer relevancy", 0.85],
        ].map(([label, v], i) => (
          <g key={label as string} transform={`translate(630,${70 + i * 50})`}>
            <text fontSize={11} fill={C.muted}>{label}</text>
            <rect y={8} width={145} height={10} rx={5} fill={C.border} />
            <rect y={8} width={145 * (v as number)} height={10} rx={5} fill={C.primary} opacity={i < 2 ? 0.55 : 1} />
          </g>
        ))}
        <Note x={702} y={268}>example scores</Note>
        <Curve d="M222,124 C222,60 520,70 610,86" muted />
        <Curve d="M382,196 C382,262 560,250 610,214" muted />
      </>
    ),
  },

  /* ---------- Agents ---------- */
  "03-agents/react-pattern": {
    caption: "The ReAct loop: Thought → Action (tool call) → Observation, repeated until the agent can give a final answer — with a max-step guard.",
    body: (
      <>
        <Box x={330} y={128} w={140} label="LLM agent" sub="plans next step" accent />
        <Box x={330} y={20} w={140} label="Thought" sub="what to do next?" />
        <Box x={600} y={128} w={150} label="Action" sub="call a tool" />
        <Box x={330} y={236} w={140} label="Observation" sub="tool result" />
        <Box x={50} y={128} w={150} label="Final answer" sub="when goal is met" />
        <Curve d="M470,52 C560,52 640,80 670,124" />
        <Curve d="M630,196 C610,250 560,268 474,268" />
        <Curve d="M330,268 C260,268 250,200 330,170" />
        <Arrow x1={400} y1={128} x2={400} y2={88} />
        <path d="M330,160 L206,160" stroke={C.muted} strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#arrow-muted)" />
        <Pill x={652} y={212} w={40} label="web" />
        <Pill x={696} y={212} w={40} label="code" />
        <Pill x={740} y={212} w={40} label="API" />
        <Note x={125} y={220}>max_steps guard stops runaway loops</Note>
      </>
    ),
  },
  "03-agents/swarms": {
    caption: "A multi-agent swarm: an orchestrator splits the goal, specialist agents work (and talk) in parallel, and a consensus step merges their output.",
    body: (
      <>
        <Box x={20} y={128} w={105} label="Goal" sub="user's task" />
        <Arrow x1={129} y1={160} x2={164} y2={160} />
        <Box x={170} y={128} w={145} label="Orchestrator" sub="decomposes task" accent />
        <Arrow x1={319} y1={148} x2={369} y2={66} />
        <Arrow x1={319} y1={160} x2={369} y2={160} />
        <Arrow x1={319} y1={172} x2={369} y2={254} />
        <Box x={375} y={30} w={140} label="Researcher" sub="gathers facts" />
        <Box x={375} y={128} w={140} label="Coder" sub="writes code" />
        <Box x={375} y={226} w={140} label="Reviewer" sub="checks the work" />
        <path d="M445,96 L445,124" stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 3" markerStart="url(#arrow-muted)" markerEnd="url(#arrow-muted)" />
        <path d="M445,194 L445,222" stroke={C.muted} strokeWidth={1.5} strokeDasharray="3 3" markerStart="url(#arrow-muted)" markerEnd="url(#arrow-muted)" />
        <Note x={470} y={114} anchor="start">messages</Note>
        <Arrow x1={519} y1={62} x2={559} y2={148} />
        <Arrow x1={519} y1={160} x2={559} y2={160} />
        <Arrow x1={519} y1={258} x2={559} y2={172} />
        <Box x={565} y={128} w={120} label="Consensus" sub="vote / debate" />
        <Arrow x1={689} y1={160} x2={709} y2={160} />
        <Box x={715} y={128} w={72} label="Result" />
      </>
    ),
  },

  /* ---------- Fine-tuning & production ---------- */
  "04-finetuning/fine-tuning": {
    caption: "LoRA keeps the big pretrained matrix W frozen and trains two thin matrices B and A; QLoRA also stores W in 4-bit to save memory.",
    body: (
      <>
        <rect x={40} y={40} width={180} height={180} rx={10} fill={C.muted} opacity={0.12} stroke={C.border} />
        {Array.from({ length: 5 }, (_, i) => (
          <g key={i}>
            <line x1={40 + (i + 1) * 30} y1={40} x2={40 + (i + 1) * 30} y2={220} stroke={C.border} />
            <line x1={40} y1={40 + (i + 1) * 30} x2={220} y2={40 + (i + 1) * 30} stroke={C.border} />
          </g>
        ))}
        <text x={130} y={124} textAnchor="middle" fontSize={22} fontWeight={800} fill={C.text}>W</text>
        <Note x={130} y={144}>frozen · d × d</Note>
        <Note x={130} y={246}>QLoRA: W stored in 4-bit</Note>
        <text x={250} y={138} textAnchor="middle" fontSize={26} fill={C.muted}>+</text>
        <rect x={280} y={40} width={30} height={180} rx={6} fill={C.primary} opacity={0.75} />
        <Note x={295} y={246}>B · d × r</Note>
        <text x={330} y={138} textAnchor="middle" fontSize={20} fill={C.muted}>×</text>
        <rect x={350} y={115} width={180} height={30} rx={6} fill={C.primary} opacity={0.5} />
        <Note x={440} y={105}>A · r × d</Note>
        <text x={555} y={138} textAnchor="middle" fontSize={26} fill={C.muted}>=</text>
        <Box x={585} y={98} w={200} label="W + B·A" sub="fine-tuned behaviour" accent />
        <Note x={685} y={190}>only B and A are trained (r ≪ d)</Note>
        <Note x={685} y={206}>→ a tiny fraction of the parameters</Note>
      </>
    ),
  },
  "04-finetuning/groq-inference": {
    caption: "Groq serves open-weight models on LPU chips behind an OpenAI-compatible API; streaming sends tokens the moment they're generated.",
    body: (
      <>
        <Box x={20} y={128} w={110} label="Your app" sub="stream=True" />
        <Arrow x1={134} y1={160} x2={164} y2={160} />
        <Box x={170} y={128} w={150} label="Groq API" sub="OpenAI-compatible" />
        <Arrow x1={324} y1={160} x2={354} y2={160} />
        <Box x={360} y={128} w={110} label="LPU" sub="inference chip" accent />
        <Box x={540} y={40} w={180} label="Open models" sub="e.g. Llama, Qwen" />
        <Curve d="M540,72 C500,72 440,90 425,124" muted />
        <Curve d="M415,196 C415,212 422,218 430,224" />
        {["The", "answer", "streams", "token", "by", "token…"].map((t, i, arr) => {
          const x = 430 + arr.slice(0, i).reduce((s, w) => s + w.length * 7 + 22, 0);
          return (
            <g key={i} opacity={0.35 + (i / arr.length) * 0.65}>
              <rect x={x} y={228} width={t.length * 7 + 16} height={24} rx={6} fill={C.card} stroke={C.primary} />
              <text x={x + (t.length * 7 + 16) / 2} y={244} textAnchor="middle" fontSize={11} fill={C.text}>{t}</text>
            </g>
          );
        })}
        <line x1={430} y1={272} x2={785} y2={272} stroke={C.border} strokeWidth={1.5} markerEnd="url(#arrow-muted)" />
        <line x1={446} y1={266} x2={446} y2={278} stroke={C.primary} strokeWidth={2} />
        <Note x={446} y={292} anchor="start">time to first token</Note>
      </>
    ),
  },
  "04-finetuning/mlops": {
    caption: "Production LLMOps: version the model, gate it with tests and evals, serve it with vLLM, A/B test on live traffic, and monitor everything.",
    body: (
      <>
        <Box x={15} y={128} w={140} label="Model registry" sub="versioned weights" />
        <Arrow x1={159} y1={160} x2={184} y2={160} />
        <Box x={190} y={128} w={120} label="CI/CD" sub="tests + evals" />
        <Arrow x1={314} y1={160} x2={339} y2={160} />
        <Box x={345} y={128} w={145} label="vLLM serving" sub="batched inference" accent />
        <Arrow x1={494} y1={148} x2={534} y2={74} label="" />
        <Arrow x1={494} y1={172} x2={534} y2={246} />
        <Note x={515} y={122} anchor="start">A/B split</Note>
        <Box x={540} y={40} w={120} label="Model A" sub="90% traffic" />
        <Box x={540} y={216} w={120} label="Model B" sub="10% traffic" />
        <Arrow x1={664} y1={74} x2={694} y2={146} />
        <Arrow x1={664} y1={246} x2={694} y2={174} />
        <Box x={700} y={128} w={88} label="Monitor" sub="latency · cost" />
      </>
    ),
  },
  "04-finetuning/safety": {
    caption: "Defense in depth: guardrails check input and output, a constitution drives self-critique, and automated red-teaming probes for weaknesses.",
    body: (
      <>
        <Box x={20} y={20} w={150} label="Red-team bot" sub="adversarial prompts" />
        <Curve d="M170,52 C210,52 235,80 235,122" muted />
        <Box x={20} y={128} w={110} label="User input" />
        <Arrow x1={134} y1={160} x2={164} y2={160} />
        <Box x={170} y={128} w={130} label="Input guard" sub="injection · PII" />
        <path d="M235,196 L235,240" stroke={C.muted} strokeWidth={1.5} strokeDasharray="4 4" markerEnd="url(#arrow-muted)" />
        <Note x={235} y={258}>blocked ✕</Note>
        <Arrow x1={304} y1={160} x2={334} y2={160} />
        <Box x={340} y={128} w={100} label="LLM" accent />
        <path d="M375,196 L375,222" stroke={C.primary} strokeWidth={2} markerEnd="url(#arrow)" />
        <path d="M405,222 L405,200" stroke={C.primary} strokeWidth={2} markerEnd="url(#arrow)" />
        <Box x={300} y={226} w={180} label="Critique → revise" sub="against the constitution" />
        <Arrow x1={444} y1={160} x2={474} y2={160} />
        <Box x={480} y={128} w={135} label="Output guard" sub="toxicity · policy" />
        <Arrow x1={619} y1={160} x2={649} y2={160} />
        <Box x={655} y={128} w={130} label="Safe reply" />
      </>
    ),
  },
};
