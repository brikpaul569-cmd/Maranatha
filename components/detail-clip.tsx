"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import gsap from "gsap";
import DetailDoodle, {
  type DetailDoodleVariant,
} from "@/components/ui/detail-doodle";

/**
 * A small "detalle" icon that starts un-drawn (strokes dashed off-screen) and
 * draws itself stroke-by-stroke when a user taps/clicks it, then persists.
 *
 * Designed as a "clip holding text" (user direction): drop it inline next to a
 * headline/paragraph and it acts like a tiny decorative tassel that reveals on
 * click. The icon is the trigger (not the text), so headings keep their
 * semantic role. Mobile = tap fires it; reduced-motion users see the completed
 * icon instantly with no dash setup.
 *
 * `variant` defaults to "bear" (brand default).
 */
export type DetailClipProps = {
  /** Which detalle icon draws on reveal. Default "bear". */
  variant?: DetailDoodleVariant;
  /** Classes for the icon. */
  className?: string;
  children?: ReactNode;
};

export default function DetailClip({
  variant = "bear",
  className = "size-5 shrink-0 text-mar-brown/40",
  children,
}: DetailClipProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  // On mount, dash every path so the icon starts "undrawn" (strokes hidden
  // off-canvas). Skipped entirely under reduced motion — the icon is fully
  // visible from the start.
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const paths = svgRef.current?.querySelectorAll<SVGGeometryElement>("path");
    if (!paths) return;
    paths.forEach((el) => {
      const len = el.getTotalLength();
      el.style.strokeDasharray = `${len} ${len}`;
      el.style.strokeDashoffset = String(len);
    });
  }, []);

  const reveal = () => {
    if (drawn) return;
    const paths = svgRef.current?.querySelectorAll<SVGGeometryElement>("path");
    if (!paths || paths.length === 0) {
      setDrawn(true);
      return;
    }

    // Reduced motion: just expose the full icon instantly.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paths.forEach((el) => {
        el.style.strokeDasharray = "none";
      });
      setDrawn(true);
      return;
    }

    paths.forEach((el, i) => {
      const len = el.getTotalLength();
      el.style.strokeDasharray = `${len} ${len}`;
      gsap.to(el, {
        strokeDashoffset: 0,
        duration: 0.3,
        delay: i * 0.04,
        ease: "power2.out",
      });
    });
    setDrawn(true);
  };

  return (
    <span
  onClick={reveal}
  data-drawn={drawn ? "true" : "false"}
  className={`detail-clip inline-flex cursor-pointer items-center justify-center p-0.5 transition-opacity ${
    drawn
      ? "text-mar-brown/95"
      : "text-mar-brown/55 hover:text-mar-brown/80"
  } ${className}`}>
      <DetailDoodle ref={svgRef} variant={variant} className="size-full" />
      {children}
    </span>
  );
}