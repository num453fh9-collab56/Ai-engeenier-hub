"use client";

import { useState } from "react";

const outerNodes = [
  { emoji: "🤖", label: "Agent Swarms" },
  { emoji: "🧠", label: "LoRA Fine-Tuning" },
];

const innerNodes = [
  { emoji: "⚡", label: "RAG Pipeline" },
  { emoji: "⚙️", label: "Groq LPU" },
];

export function AiCoreGraphic() {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center w-full aspect-square max-w-md mx-auto select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background ambient glow */}
      <div className="absolute inset-[15%] rounded-full bg-blue-500/10 blur-3xl" />

      {/* Circuit line — top */}
      <div className={`absolute top-[10%] left-1/2 h-px w-[30%] -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-400 to-transparent ${hovered ? "opacity-40" : ""}`} style={{ animation: "circuit-pulse 3s ease-in-out infinite", animationDelay: "0s" }} />

      {/* Circuit line — bottom-right */}
      <div className={`absolute bottom-[18%] right-[8%] h-px w-[25%] bg-gradient-to-r from-transparent via-blue-400 to-transparent rotate-45 ${hovered ? "opacity-40" : ""}`} style={{ animation: "circuit-pulse 3s ease-in-out infinite", animationDelay: "0.8s" }} />

      {/* Circuit line — bottom-left */}
      <div className={`absolute bottom-[18%] left-[8%] h-px w-[25%] bg-gradient-to-r from-transparent via-blue-400 to-transparent -rotate-45 ${hovered ? "opacity-40" : ""}`} style={{ animation: "circuit-pulse 3s ease-in-out infinite", animationDelay: "1.6s" }} />

      {/* Outer orbit ring */}
      <div className="absolute w-[90%] h-[90%] rounded-full border border-blue-500/20" />

      {/* Inner orbit ring */}
      <div className="absolute w-[64%] h-[64%] rounded-full border border-blue-500/15" />

      {/* Hexagon Core */}
      <div className="relative z-10">
        <div className="absolute -inset-6 bg-gradient-to-br from-cyan-500 to-blue-600 opacity-15 blur-2xl animate-pulse-glow rounded-full" />
        <div
          className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-blue-500/30"
          style={{
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            boxShadow: "0 0 50px rgba(37,99,235,0.35), inset 0 0 30px rgba(37,99,235,0.15)",
          }}
        >
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]">
            AI
          </span>
        </div>
      </div>

      {/* Outer orbit nodes */}
      <div
        className="absolute w-[90%] h-[90%]"
        style={{ animation: hovered ? "none" : "orbit-spin 24s linear infinite" }}
      >
        {/* Top — 0deg */}
        <div className="absolute left-1/2 top-0" style={{ transform: "translateX(-50%) translateY(-50%)" }}>
          <div style={{ animation: hovered ? "none" : "orbit-counter 24s linear infinite" }}>
            <NodeBadge emoji={outerNodes[0].emoji} label={outerNodes[0].label} />
          </div>
        </div>
        {/* Bottom — 180deg */}
        <div className="absolute left-1/2 bottom-0" style={{ transform: "translateX(-50%) translateY(50%)" }}>
          <div style={{ animation: hovered ? "none" : "orbit-counter 24s linear infinite" }}>
            <NodeBadge emoji={outerNodes[1].emoji} label={outerNodes[1].label} />
          </div>
        </div>
      </div>

      {/* Inner orbit nodes */}
      <div
        className="absolute w-[64%] h-[64%]"
        style={{ animation: hovered ? "none" : "orbit-spin 18s linear infinite reverse" }}
      >
        {/* Right — 90deg */}
        <div className="absolute top-1/2 right-0" style={{ transform: "translateX(50%) translateY(-50%)" }}>
          <div style={{ animation: hovered ? "none" : "orbit-counter 18s linear infinite reverse" }}>
            <NodeBadge emoji={innerNodes[0].emoji} label={innerNodes[0].label} />
          </div>
        </div>
        {/* Left — 270deg */}
        <div className="absolute top-1/2 left-0" style={{ transform: "translateX(-50%) translateY(-50%)" }}>
          <div style={{ animation: hovered ? "none" : "orbit-counter 18s linear infinite reverse" }}>
            <NodeBadge emoji={innerNodes[1].emoji} label={innerNodes[1].label} />
          </div>
        </div>
      </div>

      {/* AI AGENT READY badge */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400 whitespace-nowrap shadow-[0_0_20px_rgba(52,211,153,0.15)]">
          <span className="text-emerald-400">⚡</span>
          AI AGENT READY
        </span>
      </div>
    </div>
  );
}

function NodeBadge({ emoji, label }: { emoji: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-background/80 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-foreground whitespace-nowrap shadow-lg shadow-blue-500/10 hover:border-blue-400/60 hover:shadow-blue-400/20 hover:bg-blue-950/20 transition-all duration-300">
      <span>{emoji}</span>
      <span>{label}</span>
    </span>
  );
}
