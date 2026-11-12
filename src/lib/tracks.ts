import { getDocsByCategory } from "@/lib/mdx";

import { TRACK_LABELS } from "@/lib/track-labels";
export { TRACK_LABELS };

export interface TrackInfo {
  category: string;
  label: string;
  lessons: { id: string; title: string; href: string }[];
}

export const trackLabel = (category: string) =>
  TRACK_LABELS[category] ?? category.replace(/^\d+-/, "").replace(/-/g, " ");

// Server-only: serialisable track list for client components
export function getTracks(): TrackInfo[] {
  return Object.entries(getDocsByCategory()).map(([category, docs]) => ({
    category,
    label: trackLabel(category),
    lessons: docs.map((d) => ({
      id: `${d.category}/${d.slug}`,
      title: d.title,
      href: `/docs/${d.category}/${d.slug}`,
    })),
  }));
}
