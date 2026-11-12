// Shared SVG building blocks for lesson diagrams
export type Node = { x: number; y: number; w: number; label: string; sub?: string; accent?: boolean };

export const C = {
  bg: "var(--illus-bg)",
  card: "var(--card)",
  border: "var(--border)",
  text: "var(--foreground)",
  muted: "var(--muted-foreground)",
  primary: "var(--primary)",
};

export function Box({ x, y, w, label, sub, accent }: Node) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={64}
        rx={14}
        fill={accent ? C.primary : C.card}
        stroke={accent ? C.primary : C.border}
        strokeWidth={1.5}
        filter="url(#shadow)"
      />
      <text
        x={x + w / 2}
        y={y + (sub ? 28 : 37)}
        textAnchor="middle"
        fontSize={15}
        fontWeight={700}
        fill={accent ? "var(--primary-foreground)" : C.text}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + 47}
          textAnchor="middle"
          fontSize={11}
          fill={accent ? "var(--primary-foreground)" : C.muted}
          opacity={accent ? 0.85 : 1}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export function Arrow({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) {
  return (
    <g>
      <path d={`M${x1},${y1} L${x2},${y2}`} stroke={C.primary} strokeWidth={2} markerEnd="url(#arrow)" className="illus-flow" />
      {label && (
        <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} textAnchor="middle" fontSize={10} fill={C.muted}>
          {label}
        </text>
      )}
    </g>
  );
}

