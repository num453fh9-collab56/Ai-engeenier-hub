import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

export interface DocNode {
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  difficulty: string;
  tags: string[];
  content: string;
}

export interface SerializedDoc extends Omit<DocNode, "content"> {
  serialized: MDXRemoteSerializeResult;
}

const contentDir = path.join(process.cwd(), "content/docs");

export function getAllDocs(): DocNode[] {
  const categories = fs.readdirSync(contentDir, { withFileTypes: true });
  const docs: DocNode[] = [];

  for (const dirent of categories) {
    if (!dirent.isDirectory()) continue;
    const categoryPath = path.join(contentDir, dirent.name);
    const files = fs
      .readdirSync(categoryPath)
      .filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const source = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(source);

      docs.push({
        slug: data.slug || file.replace(".mdx", ""),
        title: data.title,
        description: data.description,
        category: dirent.name,
        order: data.order ?? 0,
        difficulty: data.difficulty || "beginner",
        tags: data.tags || [],
        content,
      });
    }
  }

  return docs.sort((a, b) => a.order - b.order);
}

export function getDocsByCategory(): Record<string, DocNode[]> {
  const docs = getAllDocs();
  return docs.reduce(
    (acc, doc) => {
      if (!acc[doc.category]) acc[doc.category] = [];
      acc[doc.category].push(doc);
      return acc;
    },
    {} as Record<string, DocNode[]>,
  );
}

export function getDocBySlug(
  category: string,
  slug: string,
): DocNode | null {
  const docPath = path.join(contentDir, category, `${slug}.mdx`);
  if (!fs.existsSync(docPath)) return null;

  const source = fs.readFileSync(docPath, "utf8");
  const { data, content } = matter(source);

  return {
    slug: data.slug || slug,
    title: data.title,
    description: data.description,
    category,
    order: data.order ?? 0,
    difficulty: data.difficulty || "beginner",
    tags: data.tags || [],
    content,
  };
}

export async function serializeDoc(
  category: string,
  slug: string,
): Promise<SerializedDoc | null> {
  const doc = getDocBySlug(category, slug);
  if (!doc) return null;

  const serialized = await serialize(doc.content);

  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    order: doc.order,
    difficulty: doc.difficulty,
    tags: doc.tags,
    serialized,
  };
}

export function extractHeadings(content: string) {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { level: number; text: string; id: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    headings.push({ level, text, id });
  }

  return headings;
}
