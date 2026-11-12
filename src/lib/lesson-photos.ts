import photos from "./lesson-photos.json";

export interface LessonPhoto {
  src: string;
  alt: string;
  author: string;
  source: string;
}

// Photos from Pixabay (free for commercial use), keyed by `${category}/${slug}`
export const lessonPhotos = photos as Record<string, LessonPhoto>;
export const getLessonPhoto = (id: string): LessonPhoto | undefined => lessonPhotos[id];
