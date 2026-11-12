import Link from "next/link";
import { Logo } from "@/components/logo";


export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-sm mb-3">
              <Logo size={28} />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Master AI from raw math to autonomous agent swarms. With hands-on Python and TypeScript code.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Learn</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/roadmap" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Roadmap</Link>
              <Link href="/catalog" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Course Catalog</Link>
              <Link href="/docs/01-foundations/intro" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Start Learning</Link>
            </nav>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Resources</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/benchmarks" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Benchmarks</Link>
              <Link href="/tools/decision-matrix" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Decision Tools</Link>
              <Link href="/glossary" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Glossary</Link>
            </nav>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border/40 flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground">&copy; {new Date().getFullYear()} AI Engineering Hub. All rights reserved.</p>
          <p className="text-[11px] text-muted-foreground">Built for AI engineers &middot; New lessons weekly</p>
        </div>
      </div>
    </footer>
  );
}
