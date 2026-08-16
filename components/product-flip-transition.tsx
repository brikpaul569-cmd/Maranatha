"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { takeProductFlip } from "@/lib/product-flip-bus";

gsap.registerPlugin(Flip, ScrollTrigger);

/**
 * Destination side of the catalog → product shared-element transition.
 *
 * Mounted on /producto/[slug] AFTER the hero/copy `<Reveal>` wrappers in the
 * DOM so its effect runs after theirs (React flushes effects depth-first in
 * tree order). When the product-flip bus carries a capture for this slug
 * (i.e. the user came from a catalog card), it:
 *
 *   1. neutralizes the Reveal entrances on the hero and copy wrappers — kills
 *      their ScrollTriggers and forces the final resting state — so nothing
 *      fights the flip,
 *   2. runs `Flip.from` mapping the hero image frame back to the card frame
 *      (shared element morph),
 *   3. fades the copy column in over the flip tail.
 *
 * Everything stays within the ~500ms budget and animates only transform /
 * opacity. Without a pending capture (direct visit, hard reload, reduced
 * motion, or navigation from any other route) it renders nothing and the page
 * uses its normal Reveal entrance.
 */

const FLIP_S = 0.38;
const COPY_FADE_S = 0.3;
const COPY_DELAY_S = 0.14;

type ProductFlipTransitionProps = {
  slug: string;
};

export default function ProductFlipTransition({
  slug,
}: ProductFlipTransitionProps) {
  useEffect(() => {
    const state = takeProductFlip(slug);
    if (!state) return;

    // Reduced motion: the Reveal entrance already renders instantly; never
    // animate here either (double guard with the departure side).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const hero = document.querySelector<HTMLElement>("[data-flip-hero]");
    const copy = document.querySelector<HTMLElement>("[data-flip-copy]");
    const heroWrapper = hero?.parentElement;
    const copyWrapper = copy?.parentElement;
    if (!hero || !heroWrapper) return;

    const ctx = gsap.context(() => {
      // 1. Neutralize the Reveal entrances so they can't override the flip or
      //    re-hide the copy mid-fade (both wrappers animate autoAlpha/y).
      const wrappers = [heroWrapper, copyWrapper].filter(
        (el): el is HTMLElement => Boolean(el)
      );
      ScrollTrigger.getAll().forEach((trigger) => {
        const t = trigger.trigger;
        if (t && wrappers.includes(t as HTMLElement)) trigger.kill();
      });

      // Force the final resting layout before measuring, so the Flip "last"
      // state is the true destination (the Reveals left mid-tween styles).
      gsap.set(heroWrapper, { autoAlpha: 1, y: 0 });

      // 2. Morph the hero frame back to the card frame captured on the
      //    catalog page. `data-flip-id` matches this element to the captured
      //    state's idLookup; `clearProps` is defaulted on by Flip.from, so no
      //    transforms linger after the animation.
      Flip.from(state, {
        targets: hero,
        duration: FLIP_S,
        ease: "power2.inOut",
        onStart: () => {
          hero.style.willChange = "transform";
          // The glass blur is invisible on an opaque full-bleed image and
          // costs an extra compositor layer during a large scale — drop it
          // for the flip, restore it after.
          hero.style.backdropFilter = "none";
          hero.style.setProperty("-webkit-backdrop-filter", "none");
        },
        onComplete: () => {
          hero.style.willChange = "";
          hero.style.backdropFilter = "";
          hero.style.removeProperty("-webkit-backdrop-filter");
        },
      });

      // 3. Fade the copy column in on top of the flip tail.
      if (copyWrapper) {
        gsap.set(copyWrapper, { autoAlpha: 0, y: 16 });
        gsap.to(copyWrapper, {
          autoAlpha: 1,
          y: 0,
          duration: COPY_FADE_S,
          delay: COPY_DELAY_S,
          ease: "power2.out",
        });
      }
    }, hero);

    return () => ctx.revert();
  }, [slug]);

  return null;
}
