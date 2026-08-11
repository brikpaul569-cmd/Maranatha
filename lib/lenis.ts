"use client";

import type Lenis from "lenis";

/**
 * Shared Lenis registry (ds-R9, hdr-R5; design D5). `smooth-scroll.tsx`
 * registers the single page-wide Lenis instance here; header anchors route
 * through `scrollToHash` so they reuse the smooth instance instead of creating
 * a competing one. Without an active instance, `scrollToHash` falls back to
 * the native `scrollIntoView` — and with JS disabled the browser resolves
 * `href="#…"` natively, so anchors always work (hdr-R5 "No-JS anchor").
 */

let instance: Lenis | null = null;

/** Registers the active Lenis instance (or null on teardown). */
export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

/** Clears the registry (called by smooth-scroll on cleanup). */
export function clearLenis(): void {
  instance = null;
}

/** True while a Lenis instance is registered — used by anchor handlers to
 *  decide whether to intercept the click (D5: preventDefault only when Lenis
 *  is active, so reduced-motion/no-JS keep native anchor behavior). */
export function isLenisActive(): boolean {
  return instance !== null;
}

/**
 * Scrolls to a same-page hash. Uses the shared Lenis instance when one is
 * active; otherwise falls back to native `scrollIntoView`. Returns true when
 * Lenis handled the scroll (callers may preventDefault), false when the
 * target is missing or the browser should keep its native jump.
 */
export function scrollToHash(hash: string, offset = 0): boolean {
  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return false;
  if (instance) {
    instance.scrollTo(target, { offset });
    return true;
  }
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  return false;
}

/**
 * Scrolls to the very top of the page (user direction: the brand logo always
 * returns to the start). Uses the shared Lenis instance when one is active;
 * otherwise falls back to a native smooth scroll.
 */
export function scrollToTop(): boolean {
  if (instance) {
    instance.scrollTo(0);
    return true;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
  return false;
}
