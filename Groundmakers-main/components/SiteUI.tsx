import Image from "next/image";
import { ImageIcon } from "lucide-react";

function resolveSrc(url: string) {
  return url.includes(".private.blob.vercel-storage.com")
    ? `/api/image?url=${encodeURIComponent(url)}`
    : url;
}

/** Shows the image when `src` is set, otherwise a labelled placeholder. */
export function ImageSlot({
  src, alt, label, className = "", sizes = "(max-width: 768px) 100vw, 50vw", priority = false, imgClassName = "object-center",
}: {
  src?: string; alt: string; label: string; className?: string; sizes?: string; priority?: boolean; imgClassName?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-cream-200 ${className}`}>
      {src ? (
        <Image
          src={resolveSrc(src)}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={src.startsWith("/api/image") || src.includes(".private.blob.")}
          className={`object-cover ${imgClassName}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-300 border border-dashed border-cream-300">
          <ImageIcon className="w-7 h-7" strokeWidth={1.5} />
          <span className="text-[11px] tracking-widest uppercase text-center px-2">{label}</span>
        </div>
      )}
    </div>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-medium tracking-[0.18em] uppercase text-ink-500 ${className}`}>{children}</p>
  );
}

export function Heading({ plain, gold, className = "" }: { plain: string; gold: string; className?: string }) {
  return (
    <h2 className={`font-bold tracking-tight leading-[1.1] text-ink-900 ${className}`}>
      {plain}
      <br />
      <span className="text-violet-600">{gold}</span>
    </h2>
  );
}
