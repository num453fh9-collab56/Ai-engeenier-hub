import { getDocsByCategory } from "@/lib/mdx";
import { RoadmapCard } from "./roadmap-card";

export default function RoadmapPage() {
  const docsByCategory = getDocsByCategory();

  const categoryInfo: Record<
    string,
    { label: string; description: string; color: string }
  > = {
    "01-foundations": {
      label: "Foundations",
      description: "Core concepts: async Python, structured outputs, and LLM fundamentals",
      color: "border-l-blue-500",
    },
    "02-rag": {
      label: "RAG",
      description: "Retrieval-Augmented Generation: hybrid search, re-ranking, and pipelines",
      color: "border-l-emerald-500",
    },
    "03-agents": {
      label: "Agents",
      description: "Agent architectures: ReAct pattern, tool calling, and multi-agent systems",
      color: "border-l-violet-500",
    },
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        Learning Roadmap
      </h1>
      <p className="text-muted-foreground mb-10">
        A structured path from fundamentals to advanced AI engineering concepts.
      </p>

      <div className="space-y-8">
        {Object.entries(docsByCategory).map(([category, docs]) => {
          const info = categoryInfo[category] || {
            label: category,
            description: "",
            color: "border-l-gray-500",
          };
          return (
            <section key={category}>
              <div
                className={`border-l-4 ${info.color} pl-4 mb-4`}
              >
                <h2 className="text-xl font-semibold">{info.label}</h2>
                {info.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {info.description}
                  </p>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {docs.map((doc) => (
                  <RoadmapCard key={doc.slug} doc={doc} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
