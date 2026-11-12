import { getDocsByCategory } from "@/lib/mdx";
import { DocsSidebar } from "@/components/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docsByCategory = getDocsByCategory();

  return (
    <div className="flex flex-1">
      <DocsSidebar docsByCategory={docsByCategory} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
