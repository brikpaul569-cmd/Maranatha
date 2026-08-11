import Image from "next/image";

/**
 * PhotoFrame — paper photo frame primitive for the collage-zigzag redesign
 * (nosotros pilot; PROJECT-BRIEF-05 "Collage Flotante").
 *
 * A rounded paper mat (`bg-mar-card` + padding) around a `next/image` media
 * area. The frame reads as a physical object through a soft mar-brown-tinted
 * `drop-shadow` — never a hard box-shadow (art-direction rule §3.3) — and a
 * gentle static tilt passed in via `rotate` (e.g. `-rotate-3`). Only the
 * frame (visual media) rotates, never text blocks.
 *
 * Server component: no "use client". All props are plain presentation; the
 * image is lazy-loaded, matching the Next 16.3 conventions in card.tsx /
 * floating-collage.tsx (`fill` + `sizes` + `loading="lazy"`; `preload` is
 * reserved for hero-dominant images).
 */

export type PhotoFrameProps = {
  src: string;
  alt: string;
  className?: string;
  /** Tailwind rotate utility applied to the outer frame (e.g. "-rotate-3"). */
  rotate?: string;
  /** Optional small caption rendered under the frame. */
  caption?: string;
  /** Aspect-ratio class for the media area. Default "aspect-[4/5]". */
  aspect?: string;
  /**
   * Paper-tape accent strip near the top edge. Off by default; decorative
   * (aria-hidden) so it never pollutes the accessibility tree.
   */
  tape?: boolean;
  /**
   * Image fit. "cover" (default) crops to the media area. "contain" letterboxes
   * the artwork against a soft cream gradient so SVG motifs read as a designed
   * card instead of being stretched or cropped.
   */
  fit?: "cover" | "contain";
};

export default function PhotoFrame({
  src,
  alt,
  className = "",
  rotate = "",
  caption,
  aspect = "aspect-[4/5]",
  tape = false,
  fit = "cover",
}: PhotoFrameProps) {
  return (
    <figure
      className={`drop-shadow-[0_20px_30px_rgba(93,64,55,0.18)] ${rotate} ${className}`}
    >
      <div className="relative rounded-2xl bg-mar-card p-3 md:p-4">
        {tape && (
          <div
            aria-hidden
            className="absolute -top-2.5 right-10 z-10 h-5 w-16 -rotate-6 rounded-[2px] bg-mar-gold/70"
          />
        )}
        <div
          className={`relative w-full overflow-hidden rounded-lg bg-linear-to-br from-mar-cream to-mar-card ${aspect}`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 45vw, 90vw"
            className={fit === "contain" ? "object-contain" : "object-cover"}
            loading="lazy"
          />
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center font-futura text-xs uppercase tracking-widest text-mar-brown/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
