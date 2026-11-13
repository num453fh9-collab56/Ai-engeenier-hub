// Mubeen's face: a friendly AI mentor with glowing eyes and a spark on his
// antenna (the spark links him to the site's brand). Pure SVG.
export function MubeenAvatar({ size = 32, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" role="img" aria-label="Mubeen" className={className}>
      <defs>
        <linearGradient id="mubeen-head" x1="8" y1="10" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#60a5fa" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* antenna with spark */}
      <path d="M32 13 V7" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 0.5 Q33 4 36.5 5 Q33 6 32 9.5 Q31 6 27.5 5 Q31 4 32 0.5 Z" fill="#22d3ee" />
      {/* ears */}
      <rect x="4" y="30" width="6" height="12" rx="3" fill="#7c3aed" />
      <rect x="54" y="30" width="6" height="12" rx="3" fill="#7c3aed" />
      {/* head */}
      <rect x="8" y="12" width="48" height="46" rx="16" fill="url(#mubeen-head)" />
      {/* face visor */}
      <rect x="14" y="22" width="36" height="26" rx="12" fill="#0f1e4a" />
      {/* eyes (friendly, slightly curved) */}
      <path d="M21 34 Q24.5 29.5 28 34" stroke="#67e8f9" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M36 34 Q39.5 29.5 43 34" stroke="#67e8f9" strokeWidth="3.2" strokeLinecap="round" />
      {/* smile */}
      <path d="M27 40.5 Q32 44 37 40.5" stroke="#67e8f9" strokeWidth="2.4" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="19" cy="41" r="2" fill="#f472b6" opacity="0.55" />
      <circle cx="45" cy="41" r="2" fill="#f472b6" opacity="0.55" />
    </svg>
  );
}
