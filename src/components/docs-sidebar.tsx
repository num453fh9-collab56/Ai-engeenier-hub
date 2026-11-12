"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, FileText, Book } from "lucide-react";
import type { DocNode } from "@/lib/mdx";

const categoryLabel: Record<string, string> = {
  "01-foundations": "Foundations",
  "02-rag": "RAG",
  "03-agents": "Agents",
};

export function DocsSidebar({
  docsByCategory,
}: {
  docsByCategory: Record<string, DocNode[]>;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const state: Record<string, boolean> = {};
    for (const category of Object.keys(docsByCategory)) {
      state[category] = true;
    }
    return state;
  });

  const toggle = (category: string) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-muted/30 overflow-y-auto h-[calc(100vh-3.5rem)] sticky top-14">
      <div className="p-4">
        <h2 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Documentation
        </h2>
        <nav className="space-y-1">
          {Object.entries(docsByCategory).map(([category, docs]) => (
            <div key={category}>
              <button
                onClick={() => toggle(category)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <ChevronDown
                  className={`size-3.5 shrink-0 text-muted-foreground transition-transform ${
                    expanded[category] ? "rotate-0" : "-rotate-90"
                  }`}
                />
                <Book className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate">
                  {categoryLabel[category] || category}
                </span>
              </button>

              {expanded[category] && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
                  {docs.map((doc) => {
                    const href = `/docs/${doc.category}/${doc.slug}`;
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                          isActive
                            ? "bg-accent font-medium text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        }`}
                      >
                        <FileText className="size-3 shrink-0" />
                        <span className="truncate">{doc.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
