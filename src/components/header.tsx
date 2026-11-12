"use client";

import Link from "next/link";
import { Radio, Workflow, BarChart3, BookText, Library } from "lucide-react";
import { SearchCommand } from "@/components/search-command";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-2 px-4 max-w-screen-2xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-sm shrink-0"
        >
          <Radio className="size-5 text-primary" />
          <span className="hidden sm:inline">AI Engineering Hub</span>
        </Link>

        <div className="flex-1 flex justify-center max-w-md mx-2">
          <SearchCommand />
        </div>

        <nav className="flex items-center gap-0.5">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/roadmap">Roadmap</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/catalog">
              <BookText className="size-3.5" />
              Catalog
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/benchmarks">
              <BarChart3 className="size-3.5" />
              Benchmarks
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tools/decision-matrix">
              <Workflow className="size-3.5" />
              Tools
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/glossary">
              <Library className="size-3.5" />
              Glossary
            </Link>
          </Button>

          <ThemeSwitcher />

        </nav>
      </div>
    </header>
  );
}
