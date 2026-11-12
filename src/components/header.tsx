"use client";

import Link from "next/link";
import { Workflow, BarChart3, BookText, Library, Route, FlaskConical, Trophy, LayoutGrid } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { SearchCommand } from "@/components/search-command";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex h-14 items-center gap-2 px-4 max-w-screen-2xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-sm shrink-0"
        >
          <LogoMark size={28} />
          <span className="hidden sm:inline">
            AI Engineering <span className="text-primary">Hub</span>
          </span>
        </Link>

        <div className="flex-1 flex justify-center max-w-md mx-2">
          <SearchCommand />
        </div>

        <nav className="flex items-center gap-0.5 shrink-0">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/roadmap" aria-label="Roadmap">
              <Route className="size-3.5" />
              <span className="hidden md:inline">Roadmap</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/playground" aria-label="Playground">
              <FlaskConical className="size-3.5" />
              <span className="hidden md:inline">Playground</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/directory" aria-label="AI Tools Directory">
              <LayoutGrid className="size-3.5" />
              <span className="hidden md:inline">Directory</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/catalog" aria-label="Catalog">
              <BookText className="size-3.5" />
              <span className="hidden md:inline">Catalog</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/benchmarks" aria-label="Benchmarks">
              <BarChart3 className="size-3.5" />
              <span className="hidden md:inline">Benchmarks</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tools/decision-matrix" aria-label="Tools">
              <Workflow className="size-3.5" />
              <span className="hidden md:inline">Tools</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/glossary" aria-label="Glossary">
              <Library className="size-3.5" />
              <span className="hidden md:inline">Glossary</span>
            </Link>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/progress" aria-label="My progress">
              <Trophy className="size-3.5" />
              <span className="hidden xl:inline">Progress</span>
            </Link>
          </Button>

          <ThemeSwitcher />

        </nav>
      </div>
    </header>
  );
}
