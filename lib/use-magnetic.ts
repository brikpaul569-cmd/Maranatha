"use client";

import { useEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";

/** Shared desktop-only gate: the custom cursor and the magnetic pull both
 *  require a precision pointer (>=1024px AND `pointer: fine`). */
export const DESKTOP_FINE_POINTER = "(min-width: 1024px) and (pointer: fine)";

/** Max pull distance in px — subtle by design, never gimmicky. */
const MAX_PULL = 8;
/** Fraction of the cursor-to-center delta that is translated. */
const PULL_FACTOR = 0.3;
/** Follow/spring-back duration, within the 0.3–0.5s choreography window. */
const DURATION = 0.35;

/**
 * useMagnetic — subtle GSAP pull of an element toward the cursor (desktop
 * only). While hovered the element translates a few px toward the pointer and
 * springs back on leave.
 *
 * Performance: the pointermove handler only feeds `gsap.quickTo` tweens — it
 * never writes the DOM per event; GSAP batches the transform writes on its
 * ticker (see the gsap-performance skill: prefer quickTo for frequently
 * updated properties). Transform/opacity only, `will-change: transform` while
 * active.
 *
 * Desktop-only + reduced-motion-aware: on mobile/touch or
 * prefers-reduced-motion the element is left untouched — no listeners, no
 * transforms, no will-change. The element stays the accessible, focusable
 * control; the effect is purely visual and never manipulates pointer-events.
 *
 * Usage:
 *   const ref = useRef<HTMLButtonElement>(null);
 *   useMagnetic(ref);
 */
export default function useMagnetic(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(DESKTOP_FINE_POINTER).matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(el, { x: 0, y: 0 });
    el.style.willChange = "transform";

    const xTo = gsap.quickTo(el, "x", {
      duration: DURATION,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: DURATION,
      ease: "power3.out",
    });

    const clamp = (value: number) =>
      Math.max(-MAX_PULL, Math.min(MAX_PULL, value));

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      xTo(clamp(relX * PULL_FACTOR));
      yTo(clamp(relY * PULL_FACTOR));
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
      el.style.willChange = "";
    };
  }, [ref]);
}
