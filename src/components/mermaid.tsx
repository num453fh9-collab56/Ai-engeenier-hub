"use client";

import { useEffect, useId, useRef, useState } from "react";

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#3b82f6",
            primaryTextColor: "#f8fafc",
            primaryBorderColor: "#60a5fa",
            lineColor: "#64748b",
            secondaryColor: "#1e293b",
            tertiaryColor: "#0f172a",
            fontFamily: "ui-monospace, monospace",
          },
        });

        if (cancelled || !ref.current) return;

        const { svg } = await mermaid.render(id, (chart ?? "").trim());
        if (ref.current && !cancelled) {
          ref.current.innerHTML = svg;
          setLoaded(true);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to render diagram");
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Failed to render diagram: {error}
      </div>
    );
  }

  return (
    <div className="my-6 flex justify-center overflow-x-auto rounded-lg border border-border bg-card p-4">
      {/* Mermaid writes the SVG here; React never renders children into it. */}
      <div ref={ref} className={loaded ? "contents" : "hidden"} />
      {!loaded && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg
            className="size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Rendering diagram…
        </div>
      )}
    </div>
  );
}
