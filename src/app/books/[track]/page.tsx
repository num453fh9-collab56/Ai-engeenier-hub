import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllDocs } from "@/lib/mdx";
import { getTracks } from "@/lib/tracks";
import { mdxComponents } from "@/components/mdx-components";
import { BookActions } from "@/components/book-actions";

interface Props {
  params: Promise<{ track: string }>;
}

export function generateStaticParams() {
  return getTracks().map((t) => ({ track: t.category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track } = await params;
  const info = getTracks().find((t) => t.category === track);
  return {
    title: info ? `${info.label} — Full Book` : "Book",
    description: info ? `All ${info.lessons.length} ${info.label} lessons in one printable book.` : undefined,
  };
}

export default async function BookPage({ params }: Props) {
  const { track } = await params;
  const info = getTracks().find((t) => t.category === track);
  if (!info) notFound();
  const docs = getAllDocs()
    .filter((d) => d.category === track)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="book mx-auto w-full max-w-3xl px-4 py-10">
      <header className="mb-10 text-center book-cover">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">AI Engineering Hub</p>
        <h1 className="text-4xl font-bold tracking-tight mb-2">{info.label}</h1>
        <p className="text-muted-foreground mb-6">{docs.length} lessons · the complete track</p>
        <BookActions track={track} />
        <nav className="mt-8 text-left rounded-xl border border-border p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Contents</p>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            {docs.map((d) => (
              <li key={d.slug}>
                <a href={`#${d.slug}`} className="hover:text-primary">
                  {d.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      {docs.map((d, i) => (
        <section key={d.slug} id={d.slug} className="book-chapter mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">Chapter {i + 1}</p>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{d.title}</h2>
          <p className="text-muted-foreground mb-6">{d.description}</p>
          <div className="prose prose-zinc dark:prose-invert max-w-none prose-pre:overflow-x-auto prose-table:block prose-table:overflow-x-auto">
            <MDXRemote
              source={d.content}
              components={mdxComponents}
              options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
