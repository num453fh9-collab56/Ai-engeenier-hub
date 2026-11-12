"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, FileText, Book, Menu, X, CheckCircle2 } from "lucide-react";
import { useProgress } from "@/lib/progress";
import { TRACK_LABELS } from "@/lib/track-labels";
import type { DocNode } from "@/lib/mdx";

const categoryLabel = TRACK_LABELS;

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

  const [mobileOpen, setMobileOpen] = useState(false);
  const progress = useProgress();

  const toggle = (category: string) => {
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const currentTitle =
    Object.values(docsByCategory)
      .flat()
      .find((d) => pathname === `/docs/${d.category}/${d.slug}`)?.title ??
    "Lessons";

  const nav = (
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
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                          isActive
                            ? "bg-accent font-medium text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                        }`}
                      >
                        {progress.completed[`${doc.category}/${doc.slug}`] ? (
                          <CheckCircle2 className="size-3 shrink-0 text-emerald-500" />
                        ) : (
                          <FileText className="size-3 shrink-0" />
                        )}
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
  );

  return (
    <>
      {/* Mobile / tablet: compact bar + drawer */}
      <div className="lg:hidden fixed inset-x-0 top-14 z-30 border-b border-border bg-background/90 backdrop-blur">
        <button
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium"
        >
          {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          <span className="truncate">{currentTitle}</span>
          <ChevronDown
            className={`ml-auto size-4 text-muted-foreground transition-transform ${
              mobileOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {mobileOpen && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-border bg-background shadow-lg">
            {nav}
          </div>
        )}
      </div>
      <div className="lg:hidden h-11 shrink-0" aria-hidden />

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-border bg-muted/30 overflow-y-auto h-[calc(100vh-3.5rem)] sticky top-14">
        {nav}
      </aside>
    </>
  );
}
