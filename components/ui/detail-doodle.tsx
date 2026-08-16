import { forwardRef } from "react";
import type { SVGProps } from "react";

/**
 * Stroke-only "detalle" icon set (user direction: bear + flowers, gift in
 * galeria, letter in contacto, leaf per catalogo, book en aprende/taller).
 *
 * Every variant is a single continuous or compound stroke path that
 * `getTotalLength()` can measure, so it inherits the same dash-draw
 * choreography as BearDoodle (see components/preloader.tsx): set
 * `strokeDasharray: len; strokeDashoffset: len` then tween offset→0.
 *
 * Purely decorative (callers pass `aria-hidden`). viewBox 0 0 24 24 keeps
 * proportions identical to BearDoodle so they swap 1:1 in the preloader
 * mirror and in the section watermarks.
 */
export type DetailDoodleVariant =
  | "bear"
  | "flower"
  | "gift"
  | "letter"
  | "leaf"
  | "book";

export type DetailDoodleProps = SVGProps<SVGSVGElement> & {
  /** Which detalle icon to draw. Default: "bear" (brand default). */
  variant?: DetailDoodleVariant;
};

/** Returns the list of stroke geometry elements to dash-draw for `variant`. */
export function detailDoodlePaths(
  variant: DetailDoodleVariant
): { d: string; closed?: boolean }[] {
  switch (variant) {
    case "flower":
      // 5-petal flower: one stem + 5 petals (each a rounded arc path).
      return [
        { d: "M12 18 L12 5" },
        {
          d: "M12 5 C 9.5 5 8 6.5 8 8.5 C 8 10.5 10 11.5 12 12 C 14 11.5 16 10.5 16 8.5 C 16 6.5 14.5 5 12 5",
        },
        {
          d: "M12 5 C 13 3.5 15 3.5 16 5 C 17 6.5 16 8 14.5 9",
        },
        {
          d: "M12 5 C 11 3.5 9 3.5 8 5 C 7 6.5 8 8 9.5 9",
        },
        {
          d: "M12 5 C 13.5 2.5 16.5 2.5 18 4 C 19.5 5.5 18.5 7.5 17 8.5",
        },
        {
          d: "M12 5 C 10.5 2.5 7.5 2.5 6 4 C 4.5 5.5 5.5 7.5 7 8.5",
        },
        { d: "M9 18 C 9 19 10 20 12 20 C 14 20 15 19 15 18", closed: true },
      ];
    case "gift":
      // Wrapped gift: box + two bow ribbons.
      return [
        { d: "M12 6 L6 10 L12 18 L18 10 Z", closed: true },
        { d: "M7 9.5 L12 6 L17 9.5", closed: false },
        { d: "M7 9.5 L7 14 L12 11 L12 6", closed: true },
        { d: "M17 9.5 L17 14 L12 11 L12 6", closed: true },
        { d: "M12 6 L9 4 L15 4 Z", closed: true },
        { d: "M12 6 L15 4 L12 2 Z", closed: true },
        { d: "M12 6 L9 4 L12 2 Z", closed: true },
      ];
    case "letter":
      // Envelope: front flap + body + pointed seal tab.
      return [
        { d: "M4 4 L20 4 L20 16 L4 16 Z", closed: true },
        { d: "M4 4 L12 12 L20 4", closed: false },
        { d: "M4 16 L12 10 L20 16", closed: false },
        { d: "M12 10 L12 2 L16 6 L12 10 Z", closed: true },
      ];
    case "leaf":
      // Single curved leaf: midrib + two mirrored veins.
      return [
        { d: "M12 18 C 14 14 17 10 17 6 C 17 3 15 1 12 1 C 9 1 7 3 7 6 C 7 10 10 14 12 18", closed: true },
        { d: "M12 18 C 14 14 15 12 15 9 C 15 7 14 6 12 6", closed: true },
        { d: "M12 4 C 12 2.5 13 1 14.5 1", closed: false },
      ];
    case "book":
      // Book spine + two covers.
      return [
        { d: "M6 6 L18 6 L18 18 L6 18 Z", closed: true },
        { d: "M6 6 L6 18", closed: false },
        { d: "M18 6 L18 18", closed: false },
        { d: "M6 10 L18 10", closed: false },
        { d: "M6 14 L18 14", closed: false },
      ];
    case "bear":
    default:
      // Re-export the preloader bear so callers can swap variants 1:1.
      return [
        { d: "M12 11.5 a7.5 7.5 0 1 0 0 1e-10 a7.5 7.5 0 1 0 0 1e-10" },
        { d: "M6.8 5.4 a2.9 2.9 0 1 0 0 1e-10 a2.9 2.9 0 1 0 0 1e-10" },
        { d: "M17.2 5.4 a2.9 2.9 0 1 0 0 1e-10 a2.9 2.9 0 1 0 0 1e-10" },
        { d: "M9.7 10 a0.9 0.9 0 1 0 0 1e-10 a0.9 0.9 0 1 0 0 1e-10" },
        { d: "M14.3 10 a0.9 0.9 0 1 0 0 1e-10 a0.9 0.9 0 1 0 0 1e-10" },
        { d: "M10.3 13.6 Q 12 15.5 13.7 13.6" },
      ];
  }
}

const DetailDoodle = forwardRef<SVGSVGElement, DetailDoodleProps>(function DetailDoodle(
  { variant = "bear", className, ...rest },
  ref,
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
      {...rest}
    >
      {detailDoodlePaths(variant).map((p, i) => (
        <path key={i} d={p.d} fill={p.closed ? "none" : undefined} />
      ))}
    </svg>
  );
});

export default DetailDoodle;
