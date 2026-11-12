"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search, Book, FileText, Hash } from "lucide-react";
import type { DocNode } from "@/lib/mdx";

const categoryIcon: Record<string, string> = {
  "01-foundations": "Foundations",
  "02-rag": "RAG",
  "03-agents": "Agents",
};

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [docs, setDocs] = useState<DocNode[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/search")
      .then((res) => res.json())
      .then((data: DocNode[]) => setDocs(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback(
    (doc: DocNode) => {
      setOpen(false);
      setSearch("");
      router.push(`/docs/${doc.category}/${doc.slug}`);
    },
    [router],
  );

  const grouped = docs.reduce(
    (acc, doc) => {
      const group = acc.find((g) => g.category === doc.category);
      if (group) {
        group.items.push(doc);
      } else {
        acc.push({ category: doc.category, items: [doc] });
      }
      return acc;
    },
    [] as { category: string; items: DocNode[] }[],
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex h-8 w-full max-w-[200px] items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-xs text-muted-foreground hover:bg-muted transition-colors"
      >
        <Search className="size-3.5 shrink-0" />
        <span className="flex-1 text-left">Search docs...</span>
        <kbd className="hidden lg:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-background px-1.5 text-[10px] font-medium text-muted-foreground">
          <span className="text-[9px]">&#8984;</span>K
        </kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label="Global search"
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <Command className="relative w-full max-w-lg rounded-xl border border-border bg-popover shadow-2xl overflow-hidden">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 size-4 shrink-0 text-muted-foreground" />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search tutorials..."
              className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[300px] overflow-y-auto p-2">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found.
            </Command.Empty>

            {grouped.map((group) => {
              const label =
                categoryIcon[group.category] || group.category;
              return (
                <Command.Group
                  key={group.category}
                  heading={
                    <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <Book className="size-3" />
                      {label}
                    </div>
                  }
                >
                  {group.items.map((doc) => (
                    <Command.Item
                      key={`${doc.category}/${doc.slug}`}
                      value={`${doc.title} ${doc.tags.join(" ")} ${doc.description}`}
                      onSelect={() => runCommand(doc)}
                      className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground cursor-pointer"
                    >
                      <FileText className="size-4 shrink-0 text-muted-foreground" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate font-medium">
                          {doc.title}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {doc.description}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {doc.difficulty && (
                          <span
                            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                              doc.difficulty === "advanced"
                                ? "bg-destructive/10 text-destructive"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {doc.difficulty}
                          </span>
                        )}
                        {doc.tags.slice(0, 1).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-0.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                          >
                            <Hash className="size-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>
        </Command>
      </Command.Dialog>
    </>
  );
}
