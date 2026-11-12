import Image from "next/image";
import type { LessonPhoto as Photo } from "@/lib/lesson-photos";

export function LessonPhoto({ photo, priority = true, caption }: { photo: Photo; priority?: boolean; caption?: string }) {
  return (
    <figure className={`not-prose ${priority ? "mt-6 mb-2" : "my-10"}`}>
      <div className="relative aspect-[16/8] overflow-hidden rounded-2xl border border-border bg-muted">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 768px, 100vw"
          className="object-cover"
        />
      </div>
      <figcaption className={`mt-2 flex flex-col gap-0.5 text-[11px] text-muted-foreground ${caption ? "items-center text-center" : "items-end text-right"}`}>
        {caption && <span className="text-sm italic text-foreground/80">{caption}</span>}
        <span>
          Photo by{" "}
          <a href={photo.source} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
            {photo.author} on Pixabay
          </a>
        </span>
      </figcaption>
    </figure>
  );
}
