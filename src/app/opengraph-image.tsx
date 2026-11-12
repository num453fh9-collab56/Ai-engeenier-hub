import { ImageResponse } from "next/og";

export const alt = "AI Engineering Hub — Master AI Engineering from scratch";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)",
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: "#38bdf8",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            marginBottom: 20,
            fontFamily: "monospace",
          }}
        >
          AI Engineering Hub
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          AI Engineering&nbsp;<span style={{ color: "#38bdf8" }}>From Scratch</span>
        </div>
        <div style={{ fontSize: 28, color: "#94a3b8", marginTop: 24, maxWidth: 900 }}>
          RAG pipelines, AI agents, fine-tuning and MLOps — hands-on lessons with real code.
        </div>
      </div>
    ),
    { ...size },
  );
}
