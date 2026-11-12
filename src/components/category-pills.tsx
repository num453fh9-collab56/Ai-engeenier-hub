import { cn } from "@/lib/utils";
import { categories } from "@/lib/course-data";

interface CategoryPillsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryPills({ selected, onSelect }: CategoryPillsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelect("All")}
        className={cn(
          "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
          selected === "All"
            ? "border-primary bg-primary/10 text-primary"
            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
        )}
      >
        All Categories
      </button>
      {categories.map((cat) => (
        <button
          key={cat.label}
          onClick={() => onSelect(cat.label)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
            selected === cat.label
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}
