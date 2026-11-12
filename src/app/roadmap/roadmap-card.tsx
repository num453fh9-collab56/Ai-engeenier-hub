import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { DocNode } from "@/lib/mdx";

export function RoadmapCard({ doc }: { doc: DocNode }) {
  return (
    <Link
      href={`/docs/${doc.category}/${doc.slug}`}
      className="group flex flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent hover:text-accent-foreground"
    >
      <h3 className="font-medium text-sm group-hover:text-accent-foreground">
        {doc.title}
      </h3>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {doc.description}
      </p>
      <div className="flex items-center gap-2 mt-1">
        {doc.difficulty && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
              doc.difficulty === "advanced"
                ? "bg-destructive/10 text-destructive"
                : doc.difficulty === "intermediate"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {doc.difficulty}
          </span>
        )}
        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="size-3" />
          ~15 min
        </span>
        <ArrowRight className="ml-auto size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}
