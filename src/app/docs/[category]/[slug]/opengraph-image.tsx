import { ImageResponse } from "next/og";
import { getDocBySlug } from "@/lib/mdx";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { category: string; slug: string };
}

export default async function Image({ params }: Props) {
  const { category, slug } = await params;
  const doc = getDocBySlug(category, slug);

  const title = doc?.title ?? "AI Engineering Hub";
  const description = doc?.description ?? "Master AI Engineering from scratch";

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
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#38bdf8",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            marginBottom: 16,
            fontFamily: "monospace",
          }}
        >
          {category.replace(/^\d+-/, "").replace(/-/g, " ")} &middot; AI Engineering Hub
        </div>
        <h1
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#f8fafc",
            lineHeight: 1.15,
            margin: "0 0 16px 0",
            maxWidth: 700,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 22,
            color: "#94a3b8",
            lineHeight: 1.4,
            margin: 0,
            maxWidth: 650,
          }}
        >
          {description}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 32,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "#64748b",
              fontFamily: "monospace",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#2563eb">
              <circle cx="12" cy="12" r="10" />
            </svg>
            aiengineeringhub.com
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
