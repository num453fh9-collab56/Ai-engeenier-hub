import type { Metadata } from "next";
import { LayoutGrid } from "lucide-react";
import { aiTools, TOOL_CATEGORIES } from "@/lib/ai-tools";
import { getAllDocs } from "@/lib/mdx";
import { ToolsDirectory } from "@/components/tools-directory";
import { Cube, Ring, Sphere } from "@/components/shapes-3d";

export const metadata: Metadata = {
  title: "AI Tools Directory — Compare LLM APIs, Vector DBs, Frameworks",
  description:
    "Compare AI engineering tools side by side: LLM APIs, local models, agent frameworks, vector databases, evaluation, fine-tuning and guardrails.",
  alternates: { canonical: "/directory" },
};

export default function DirectoryPage() {
  const lessonTitles = Object.fromEntries(getAllDocs().map((d) => [`${d.category}/${d.slug}`, d.title]));
  const openSource = aiTools.filter((t) => t.openSource).length;

  return (
    <div className="flex-1 pb-24">
      <section className="bg-landing relative overflow-hidden px-4 py-14">
        <Ring className="-right-6 top-6" size={110} />
        <Cube className="left-[6%] bottom-6 hidden sm:block" size={36} delay={1} />
        <Sphere className="right-[18%] bottom-4 hidden md:block" size={30} delay={2} />
        <div className="relative mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-primary ring-1 ring-primary/15 mb-4">
            <LayoutGrid className="size-3.5" /> AI Tools Directory
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">Compare AI engineering tools</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            The LLM APIs, frameworks, vector databases and MLOps tools our lessons use — what each one does, what it
            costs, and when to pick it. Select any three to compare side by side.
          </p>
          <div className="mt-6 flex flex-wrap gap-6 text-sm">
            {[
              [aiTools.length, "tools"],
              [TOOL_CATEGORIES.length, "categories"],
              [openSource, "open source"],
            ].map(([v, l]) => (
              <div key={String(l)}>
                <p className="text-2xl font-bold">{v}</p>
                <p className="text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <ToolsDirectory lessonTitles={lessonTitles} />
        <p className="mt-10 text-xs text-muted-foreground">
          Independent listing — no sponsored placements. Pricing models change; check each vendor&apos;s site for current
          details.
        </p>
      </div>
    </div>
  );
}
