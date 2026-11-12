import { cn } from "@/lib/utils";
import { providers } from "@/lib/course-data";

interface BrandFilterProps {
  selected: string;
  onSelect: (provider: string) => void;
}

export function BrandFilter({ selected, onSelect }: BrandFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {providers.map((provider) => (
        <button
          key={provider}
          onClick={() => onSelect(provider)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
            selected === provider
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
        >
          {provider}
        </button>
      ))}
    </div>
  );
}
