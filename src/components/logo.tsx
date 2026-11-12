// AI Engineering Hub logo: a brain whose left half is a neural network and
// right half a circuit board, a glowing core in the middle, framed by code
// brackets. Pure SVG; colours come from props so it also works in OG images.
type Colors = { ink?: string; deep?: string };

const MESH: [number, number][] = [
  [30, 20], [44, 14], [52, 24], [22, 34], [38, 32], [16, 48], [32, 46], [22, 62], [36, 62], [44, 76], [28, 76],
];
const MESH_LINKS: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [0, 4], [1, 4], [2, 4], [3, 4], [3, 5], [4, 6], [5, 6], [5, 7], [6, 7], [6, 8], [7, 8], [8, 9], [7, 10], [10, 9],
];
const CORE: [number, number][] = [[52, 46], [58, 40], [66, 42], [69, 50], [63, 57], [55, 55], [60, 49]];
const CORE_LINKS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [6, 0], [6, 2], [6, 4], [6, 1], [6, 3]];

const LEFT =
  "M58,8 C50,3 40,5 36,11 C27,9 19,15 19,24 C11,28 9,38 13,45 C7,51 9,63 18,67 C16,77 24,85 34,83 C39,91 51,93 58,88 Z";
const RIGHT =
  "M62,8 C70,3 80,5 84,11 C93,9 101,15 101,24 C109,28 111,38 107,45 C113,51 111,63 102,67 C104,77 96,85 86,83 C81,91 69,93 62,88 Z";

const TRACES: { d: string; end: [number, number]; c: "a" | "b" }[] = [
  { d: "M72,31 L76,22 H86", end: [88, 22], c: "a" },
  { d: "M79,40 L88,31 H96", end: [98, 31], c: "a" },
  { d: "M80,48 H100", end: [102, 48], c: "b" },
  { d: "M79,56 L88,62 H98", end: [100, 62], c: "a" },
  { d: "M73,67 L80,74 V80", end: [80, 82], c: "b" },
  { d: "M66,70 V82", end: [66, 84], c: "a" },
];

export function LogoMark({
  size = 32,
  className = "",
  withBrackets = true,
  ink = "var(--logo-ink)",
  deep = "var(--logo-deep)",
}: { size?: number; className?: string; withBrackets?: boolean } & Colors) {
  const vb = withBrackets ? "-22 0 164 100" : "6 0 108 100";
  const w = withBrackets ? size * 1.64 : size * 1.08;
  return (
    <svg width={w} height={size} viewBox={vb} fill="none" role="img" aria-label="AI Engineering Hub logo" className={className}>
      <defs>
        <linearGradient id="aeh-left" x1="10" y1="10" x2="58" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a5f3fc" />
          <stop offset="0.55" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="aeh-ring" x1="40" y1="30" x2="80" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <radialGradient id="aeh-glow" cx="60" cy="50" r="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#38bdf8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* left hemisphere: neural mesh */}
      <path d={LEFT} fill="url(#aeh-left)" stroke={ink} strokeWidth={4} strokeLinejoin="round" />
      <g stroke={ink} strokeWidth={1.6} strokeLinecap="round">
        {MESH_LINKS.map(([a, b], i) => (
          <line key={i} x1={MESH[a][0]} y1={MESH[a][1]} x2={MESH[b][0]} y2={MESH[b][1]} />
        ))}
      </g>
      {MESH.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.4} fill={ink} />
      ))}

      {/* right hemisphere: circuit board */}
      <path d={RIGHT} fill={deep} stroke={ink} strokeWidth={4} strokeLinejoin="round" />
      {TRACES.map((t, i) => (
        <g key={i} stroke={t.c === "a" ? "#22d3ee" : "#a78bfa"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d={t.d} />
          <circle cx={t.end[0]} cy={t.end[1]} r={2.4} fill={deep} />
        </g>
      ))}

      {/* glowing core */}
      <circle cx={60} cy={50} r={34} fill="url(#aeh-glow)" />
      <circle cx={60} cy={50} r={20} fill={deep} stroke="url(#aeh-ring)" strokeWidth={3.5} />
      <g stroke="#67e8f9" strokeWidth={1.3} strokeLinecap="round">
        {CORE_LINKS.map(([a, b], i) => (
          <line key={i} x1={CORE[a][0]} y1={CORE[a][1]} x2={CORE[b][0]} y2={CORE[b][1]} />
        ))}
      </g>
      {CORE.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 6 ? 2.6 : 1.8} fill={i === 6 ? "#ffffff" : "#a5f3fc"} />
      ))}

      {/* code brackets  < … /> */}
      {withBrackets && (
        <g stroke={ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M-6,36 L-18,50 L-6,64" />
          <path d="M113,66 L121,34" />
          <path d="M126,36 L138,50 L126,64" />
        </g>
      )}
    </svg>
  );
}

export function Logo({ size = 30, withText = true, textClassName = "" }: { size?: number; withText?: boolean; textClassName?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark size={size} className="shrink-0" />
      {withText && (
        <span className={`font-semibold tracking-tight leading-none ${textClassName}`}>
          AI Engineering <span className="text-primary">Hub</span>
        </span>
      )}
    </span>
  );
}
