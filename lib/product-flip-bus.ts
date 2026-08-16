"use client";

import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

/**
 * Module-scoped bus for the catalog → product shared-element transition.
 *
 * The departure side (CatalogGridTransition on /catalogo and
 * /catalogo/[categoria]) captures a GSAP Flip state of the clicked card's
 * image box right before the soft route change. The destination side
 * (ProductFlipTransition on /producto/[slug]) consumes it on mount and runs
 * `Flip.from(state, { targets: heroImageBox })` mapping the hero image back
 * to the card image — a shared-element morph, not a modal that pops.
 *
 * A module variable (not sessionStorage, not a window event) is enough: App
 * Router client-side navigation keeps this module alive across soft route
 * changes, and a hard load starts with an empty bus so direct visits and
 * reduced-motion users get the plain Reveal entrance (the Flip never blocks
 * navigation; it is purely a progressive enhancement).
 *
 * `takeProductFlip` is keyed by slug and consumes (clears) the payload, so a
 * stale capture can never animate the wrong product.
 */

export type ProductFlipPayload = {
  /** Product slug the card links to — must match the mounted product page. */
  slug: string;
  /** Flip state captured from the card image box on the catalog page. */
  state: Flip.FlipState;
};

let pending: ProductFlipPayload | null = null;

/** Stores the departure capture (one per navigation; later clicks overwrite). */
export function storeProductFlip(slug: string, state: Flip.FlipState): void {
  pending = { slug, state };
}

/**
 * Consumes the pending capture if it targets `slug`; clears the bus in any
 * case so stale payloads never leak into a later navigation.
 */
export function takeProductFlip(slug: string): Flip.FlipState | null {
  const state = pending?.slug === slug ? pending.state : null;
  pending = null;
  return state;
}
