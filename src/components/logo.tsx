// AI Engineering Hub logo: angular "AEH" monogram with a green→blue gradient,
// a 3D extrusion and circuit traces (nodes = AI / networks). Pure SVG so it
// stays crisp at any size and also renders in OG images.
type Colors = { ink?: string; deep?: string }; // kept for older call sites

// Upright letter shapes (skewed later for an italic, dynamic look)
const LETTERS: string[] = [
  // A
  "M0,88 L26,12 L40,12 L16,88 Z",
  "M26,12 L40,12 L66,88 L50,88 Z",
  "M17,64 L49,64 L45,53 L21,53 Z",
  // E
  "M76,12 L90,12 L90,88 L76,88 Z",
  "M90,12 L122,12 L118,25 L90,25 Z",
  "M90,44 L116,44 L112,56 L90,56 Z",
  "M90,75 L122,75 L126,88 L90,88 Z",
  // H
  "M136,12 L150,12 L150,88 L136,88 Z",
  "M172,12 L186,12 L186,88 L172,88 Z",
  "M150,44 L172,44 L172,56 L150,56 Z",
];

// Circuit traces and nodes around the letters (in final, un-skewed coordinates)
const TRACES = [
  "M30,9 V3 H166 V9",
  "M8,60 H-8 V92",
  "M212,24 H230",
  "M200,66 H230 V40",
];
const NODES: [number, number][] = [
  [30, 9], [166, 9], [98, 3], [-8, 92], [230, 24], [230, 40],
];

function Monogram({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-face`} x1="0" y1="8" x2="0" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22c55e" />
          <stop offset="0.5" stopColor="#14b8a6" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* circuit traces */}
      <g stroke="#14b8a6" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {TRACES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      {NODES.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="3" fill="#ffffff" stroke="#14b8a6" strokeWidth="1.6" />
      ))}
      <g transform="translate(26,0) skewX(-14)">
        {/* 3D extrusion */}
        <g transform="translate(3,4)" fill="#1e3a8a">
          {LETTERS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        {/* faces */}
        <g fill={`url(#${id}-face)`}>
          {LETTERS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        {/* glossy highlight */}
        <g fill={`url(#${id}-shine)`}>
          {LETTERS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
    </g>
  );
}

export function LogoMark({
  size = 32,
  className = "",
  withBrackets = true, // false → compact square icon (favicon / app icon)
}: { size?: number; className?: string; withBrackets?: boolean } & Colors) {
  if (!withBrackets) {
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" role="img" aria-label="AI Engineering Hub logo" className={className}>
        <defs>
          <linearGradient id="aeh-tile-face" x1="0" y1="20" x2="0" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#22c55e" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="28" fill="#0f1e4a" />
        <g transform="translate(30,14) skewX(-12)">
          <path d="M4,90 L30,16 L46,16 L22,90 Z M30,16 L46,16 L72,90 L54,90 Z M23,66 L53,66 L49,55 L27,55 Z" fill="#1e3a8a" transform="translate(3,4)" />
          <path d="M4,90 L30,16 L46,16 L22,90 Z M30,16 L46,16 L72,90 L54,90 Z M23,66 L53,66 L49,55 L27,55 Z" fill="url(#aeh-tile-face)" />
        </g>
        <path d="M24,22 V12 H96 V22" stroke="#22c55e" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="24" cy="22" r="4" fill="#0f1e4a" stroke="#22c55e" strokeWidth="3" />
        <circle cx="96" cy="22" r="4" fill="#0f1e4a" stroke="#22c55e" strokeWidth="3" />
      </svg>
    );
  }

  return (
    <svg width={size * 2.56} height={size} viewBox="-14 -2 256 100" fill="none" role="img" aria-label="AI Engineering Hub logo" className={className}>
      {/* called as a function (not <Monogram/>): OG image renderer only allows plain SVG tags inside <svg> */}
      {Monogram({ id: "aeh" })}
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
