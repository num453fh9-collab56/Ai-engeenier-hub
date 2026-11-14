import Image from "next/image";

/** A tool's real logo on a white tile (so dark logos stay visible in dark mode). */
export function ToolLogo({ slug, name, size = 56 }: { slug: string; name: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5"
      style={{ width: size, height: size, padding: size * 0.12 }}
    >
      <Image src={`/images/tools/${slug}.png`} alt={`${name} logo`} width={size} height={size} className="h-full w-full object-contain" />
    </span>
  );
}
