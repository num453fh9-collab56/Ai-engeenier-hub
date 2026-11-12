import photos from "./lesson-photos.json";
import photos2 from "./lesson-photos-2.json";

export interface LessonPhoto {
  src: string;
  alt: string;
  author: string;
  source: string;
}

// Photos from Pixabay (free for commercial use), keyed by `${category}/${slug}`
export const lessonPhotos = photos as Record<string, LessonPhoto>;
export const getLessonPhoto = (id: string): LessonPhoto | undefined => lessonPhotos[id];

// Second photo per lesson, shown in the middle of the article
const lessonPhotos2 = photos2 as Record<string, LessonPhoto>;
export const getLessonPhoto2 = (id: string): LessonPhoto | undefined => lessonPhotos2[id];

// Split MDX at the "##" heading closest to the middle (ignoring code fences)
export function splitAtMiddle(md: string): [string, string] {
  const lines = md.split("\n");
  const heads: number[] = [];
  let inFence = false;
  lines.forEach((l, i) => {
    if (/^\s*```/.test(l)) inFence = !inFence;
    else if (!inFence && /^##\s/.test(l)) heads.push(i);
  });
  if (heads.length < 2) return [md, ""];
  const at = heads[Math.floor(heads.length / 2)];
  return [lines.slice(0, at).join("\n"), lines.slice(at).join("\n")];
}
