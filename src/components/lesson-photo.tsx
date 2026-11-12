import Image from "next/image";
import type { LessonPhoto as Photo } from "@/lib/lesson-photos";

export function LessonPhoto({ photo }: { photo: Photo }) {
  return (
    <figure className="not-prose mt-6 mb-2">
      <div className="relative aspect-[16/8] overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority
          sizes="(min-width: 1024px) 768px, 100vw"
          className="object-cover"
        />
      </div>
      <figcaption className="mt-1.5 text-right text-[11px] text-muted-foreground">
        Photo by{" "}
        <a href={photo.source} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
          {photo.author} on Pixabay
        </a>
      </figcaption>
    </figure>
  );
}
