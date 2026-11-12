import { NextResponse } from "next/server";
import { getAllDocs } from "@/lib/mdx";

export async function GET() {
  const docs = getAllDocs();
  const sanitized = docs.map((doc) => ({
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    order: doc.order,
    difficulty: doc.difficulty,
    tags: doc.tags,
  }));
  return NextResponse.json(sanitized);
}
