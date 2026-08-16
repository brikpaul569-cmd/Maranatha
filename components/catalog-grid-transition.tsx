"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { storeProductFlip } from "@/lib/product-flip-bus";
import { isNavTransitionBusy } from "@/components/nav-transition";

gsap.registerPlugin(Flip);

/**
 * Departure side of the catalog → product shared-element transition.
 *
 * Wraps the product grid on /catalogo and /catalogo/[categoria] and delegates
 * clicks on product card links. It does NOT intercept navigation — the card's
 * own `next/link` keeps full control, so no-JS, reduced-motion, curtain-busy
 * and modified clicks all navigate exactly as before. This component only
 * captures a GSAP Flip state of the clicked card's image frame
 * (`[data-flip-source]`) into the shared bus right before the soft route
 * change, letting the destination page morph its hero image back to that
 * frame.
 *
 * Why it works: the native click listener on this wrapper fires before the
 * React root-delegated handler on the `next/link`, so the capture lands in
 * the bus before `router.push` starts the navigation. The Flip state is
 * captured in the same tick the click occurs (batched read, no forced
 * reflow), matching the layout the user is looking at.
 *
 * Scope guard: only primary left-clicks without modifiers on a link carrying
 * `data-product-slug` are captured. The occasion/category filter buttons and
 * the "ver todos" back links carry no slug and pass through untouched.
 */

type CatalogGridTransitionProps = {
  children: React.ReactNode;
};

export default function CatalogGridTransition({
  children,
}: CatalogGridTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onClick = (event: MouseEvent) => {
      // Primary left click without modifiers only; anything else lets the
      // Link handle it (new tab, context menu, middle click, etc.).
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
        "a[data-product-slug]"
      );
      if (!link) return;

      const slug = link.dataset.productSlug;
      const source = link
        .closest("article")
        ?.querySelector<HTMLElement>("[data-flip-source]");
      if (!slug || !source) return;

      // Reduced motion: plain navigation, no flip (the destination agrees, and
      // the card's own motion-reduce handling keeps the page calm).
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // A curtain cover mid-flight blocks real pointer events, but a keyboard
      // Enter can still fire — fall back to standard navigation rather than
      // capturing a Flip state against a mid-transition layout.
      if (isNavTransitionBusy()) return;

      storeProductFlip(slug, Flip.getState(source));
    };

    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
