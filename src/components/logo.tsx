// AI Engineering Hub logo: code braces { } around a glowing AI spark ✦.
// Pure SVG; colours come from props so it also renders in OG images.
type Colors = { ink?: string; deep?: string }; // deep kept for older call sites; unused

// Four-point sparkle centred on (cx, cy) with "radius" r (concave sides)
const sparkle = (cx: number, cy: number, r: number, k = 0.16) => {
  const c = r * k; // how far the curves pull toward the centre
  return `M${cx},${cy - r} Q${cx + c},${cy - c} ${cx + r},${cy} Q${cx + c},${cy + c} ${cx},${cy + r} Q${cx - c},${cy + c} ${cx - r},${cy} Q${cx - c},${cy - c} ${cx},${cy - r} Z`;
};

const LEFT_BRACE = "M34,14 C23,14 22,21 22,30 L22,39 C22,46 18,50 11,50 C18,50 22,54 22,61 L22,70 C22,79 23,86 34,86";
const RIGHT_BRACE = "M86,14 C97,14 98,21 98,30 L98,39 C98,46 102,50 109,50 C102,50 98,54 98,61 L98,70 C98,79 97,86 86,86";

export function LogoMark({
  size = 32,
  className = "",
  withBrackets = true,           // false → compact square app-icon tile
  ink = "var(--logo-ink)",
}: { size?: number; className?: string; withBrackets?: boolean } & Colors) {
  if (!withBrackets) {
    // Square tile for favicons / app icons: white braces + spark on a gradient
    return (
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" role="img" aria-label="AI Engineering Hub logo" className={className}>
        <defs>
          <linearGradient id="aeh-tile" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <rect width="120" height="120" rx="28" fill="url(#aeh-tile)" />
        <g transform="translate(0,10)">
          <g stroke="#ffffff" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none">
            <path d={LEFT_BRACE} />
            <path d={RIGHT_BRACE} />
          </g>
          <path d={sparkle(60, 50, 24)} fill="#ffffff" />
          <path d={sparkle(78, 27, 7)} fill="#a5f3fc" />
        </g>
      </svg>
    );
  }

  return (
    <svg width={size * 1.2} height={size} viewBox="0 0 120 100" fill="none" role="img" aria-label="AI Engineering Hub logo" className={className}>
      <defs>
        <linearGradient id="aeh-spark" x1="36" y1="24" x2="84" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#3b82f6" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
        <radialGradient id="aeh-glow" cx="60" cy="50" r="30" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#60a5fa" stopOpacity="0.45" />
          <stop offset="1" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="50" r="30" fill="url(#aeh-glow)" />
      <g stroke={ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={LEFT_BRACE} />
        <path d={RIGHT_BRACE} />
      </g>
      <path d={sparkle(60, 50, 27)} fill="url(#aeh-spark)" />
      <path d={sparkle(79, 26, 8)} fill="#22d3ee" />
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
