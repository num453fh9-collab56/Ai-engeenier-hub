// Pure-CSS "3D" decorative shapes (no images, no JS)
type Pos = { className?: string; size?: number; delay?: number };

export function Cube({ className = "", size = 56, delay = 0 }: Pos) {
  const half = size / 2;
  const faces = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];
  return (
    <div
      aria-hidden
      className={`shape-float absolute pointer-events-none ${className}`}
      style={{ width: size, height: size, perspective: 600, animationDelay: `${delay}s` }}
    >
      <div className="cube-spin relative size-full" style={{ animationDelay: `${delay}s` }}>
        {faces.map((t, i) => (
          <div key={i} className={`cube-face cube-face-${i}`} style={{ transform: t }} />
        ))}
      </div>
    </div>
  );
}

export function Sphere({ className = "", size = 64, delay = 0 }: Pos) {
  return (
    <div
      aria-hidden
      className={`shape-float shape-sphere absolute pointer-events-none rounded-full ${className}`}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
    />
  );
}

export function Ring({ className = "", size = 110, delay = 0 }: Pos) {
  return (
    <div
      aria-hidden
      className={`shape-float absolute pointer-events-none ${className}`}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
    >
      <div className="shape-ring size-full rounded-full" />
    </div>
  );
}

export function Plus({ className = "", size = 48, delay = 0 }: Pos) {
  return (
    <div
      aria-hidden
      className={`shape-float absolute pointer-events-none ${className}`}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
    >
      <div className="shape-plus size-full" />
    </div>
  );
}
