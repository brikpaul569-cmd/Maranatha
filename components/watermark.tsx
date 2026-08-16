import Image from "next/image";
import DetailDoodle from "@/components/ui/detail-doodle";
import type { DetailDoodleVariant } from "@/components/ui/detail-doodle";

/**
 * Anthropic-style motif watermark (user direction): a faint professional
 * "detalle" icon (flower / gift / ribbon) that drifts gently inside a section.
 * Purely decorative (aria-hidden, empty alt), transform-only float animation
 * (see `.watermark-float` in globals.css), disabled under reduced motion.
 *
 * Consumers position it via `className` (e.g. `right-6 top-8 w-20`) and place
 * it inside a `relative` section container.
 *
 * `doodle` renders a stroke-only DetailDoodle (bear/flower/…) instead of a
 * raster image — used for the faint background watermarks de fondo.
 */

export type WatermarkProps = {
  src?: string;
  alt?: string;
  className?: string;
  /** Opacity of the motif (0–1). Default 0.14 for a watermark feel. */
  opacity?: number;
  /** Enable the slow drift animation. Default true. */
  float?: boolean;
  /** Stroke-only detalle icon to render (mutually exclusive with `src`). */
  doodle?: DetailDoodleVariant;
};

export default function Watermark({
  src,
  alt = "",
  className = "",
  opacity = 0.14,
  float = true,
  doodle,
}: WatermarkProps) {
  if (doodle) {
    return (
      <DetailDoodle
        variant={doodle}
        aria-hidden
        className={`pointer-events-none absolute select-none ${
          float ? "watermark-float" : ""
        } ${className}`}
        style={{ opacity }}
      />
    );
  }
  return (
    <Image
      src={src!}
      alt={alt}
      aria-hidden
      width={96}
      height={96}
      loading="lazy"
      className={`pointer-events-none absolute select-none object-contain ${
        float ? "watermark-float" : ""
      } ${className}`}
      style={{ opacity }}
    />
  );
}
