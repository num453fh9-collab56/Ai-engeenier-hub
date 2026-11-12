import { NextRequest } from "next/server";
import { getAllDocs } from "@/lib/mdx";
import { trackLabel } from "@/lib/tracks";

// Compiles a track's real lesson files into one Markdown book.
export async function GET(request: NextRequest) {
  const track = request.nextUrl.searchParams.get("track") ?? "";
  const docs = getAllDocs()
    .filter((d) => d.category === track)
    .sort((a, b) => a.order - b.order);

  if (!docs.length) {
    return new Response("Unknown track.", { status: 404 });
  }

  const label = trackLabel(track);
  const parts = [
    `# AI Engineering Hub — ${label}`,
    "",
    `${docs.length} lessons · compiled ${new Date().toISOString().slice(0, 10)}`,
    "",
    "## Contents",
    "",
    ...docs.map((d, i) => `${i + 1}. ${d.title}`),
    "",
    ...docs.flatMap((d, i) => [
      "---",
      "",
      `# Chapter ${i + 1}: ${d.title}`,
      "",
      `> ${d.description}`,
      "",
      // Demote lesson headings one level so chapters stay top-level
      d.content.replace(/^(#{1,5}) /gm, "#$1 ").trim(),
      "",
    ]),
  ];

  const filename = `ai-engineering-hub-${track.replace(/^\d+-/, "")}.md`;
  return new Response(parts.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
