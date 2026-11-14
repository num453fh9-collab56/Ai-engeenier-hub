import { NextRequest } from "next/server";
import { getAllDocs } from "@/lib/mdx";
import { trackLabel } from "@/lib/tracks";

// Demote markdown headings one level, skipping fenced code blocks
// (so "# pip install ..." comments inside code stay unchanged).
function demoteHeadings(md: string): string {
  let inFence = false;
  return md
    .split("\n")
    .map((line) => {
      if (/^\s*```/.test(line)) inFence = !inFence;
      return !inFence && /^#{1,5} /.test(line) ? `#${line}` : line;
    })
    .join("\n");
}

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
      // Video embeds can't play in Markdown — leave a short note instead
      demoteHeadings(
        d.content.replace(/<N8nAgentsVideo\s*\/>/g, "*(Video: an n8n multi-agent workflow — watch it in this lesson on the website.)*")
      ).trim(),
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
