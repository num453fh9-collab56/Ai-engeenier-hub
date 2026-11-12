import type { MDXComponents } from "mdx/types";
import { CopyButton } from "@/components/copy-button";
import { Mermaid } from "@/components/mermaid";

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && "props" in node) {
    return getTextContent((node as { props: { children: React.ReactNode } }).props.children);
  }
  return "";
}

function PreWithCopy({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const raw = getTextContent(children);

  return (
    <div className="group relative my-6">
      <pre {...props} className="overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm">
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton text={String(raw)} />
        </div>
        {children}
      </pre>
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  pre: PreWithCopy,
  Mermaid: (props: { chart?: string; children?: string }) => {
    const chart = props.chart ?? (typeof props.children === "string" ? props.children : "");
    return <Mermaid chart={chart} />;
  },
};
