"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DESKTOP_FINE_POINTER } from "@/lib/use-magnetic";

/**
 * CustomCursor — dot + lagging ring cursor, desktop precision pointers only.
 *
 * Mounts only when `(min-width: 1024px) and (pointer: fine)` AND
 * prefers-reduced-motion is off; otherwise it renders `null` and the native
 * cursor stays (touch devices never get it — mobile-first is the site's
 * primary flow). The dot tracks the pointer almost instantly (quickTo,
 * ~0.1s); the ring lags behind (quickTo, ~0.22s) for the trailing feel.
 * Both animate transform/opacity only, on `position: absolute` layers inside
 * a `fixed inset-0` pointer-events-none host — Lenis uses native scroll (no
 * body transform, see lib/lenis.ts), so fixed positioning is never offset.
 *
 * While active, `has-custom-cursor` is toggled on <html> and globals.css
 * hides the native cursor only then; cleanup reverts it. Pure decoration:
 * aria-hidden, pointer-events none, never focusable, never a click target.
 * Reduced-motion: no custom cursor at all — the native cursor remains.
 */
export default function CustomCursor() {
  const [active, setActive] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_FINE_POINTER);
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setActive(mq.matches && !rm.matches);
    sync();
    mq.addEventListener("change", sync);
    rm.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      rm.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    // Park off-viewport and hidden; xPercent/yPercent center each layer on
    // the pointer so no layout-affecting negative margins are needed.
    gsap.set([dot, ring], {
      x: -100,
      y: -100,
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0,
    });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", {
      duration: 0.22,
      ease: "power3.out",
    });
    const ringY = gsap.quickTo(ring, "y", {
      duration: 0.22,
      ease: "power3.out",
    });
    const ringScale = gsap.quickTo(ring, "scale", {
      duration: 0.3,
      ease: "power2.out",
    });

    let visible = false;
    const INTERACTIVE = "a, button, [role='button']";
    const isInteractive = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(INTERACTIVE));

    const onMove = (event: PointerEvent) => {
      if (!visible) {
        // NOTE: no `overwrite` here — it would kill the quickTo tweens
        // (dotX/dotY/ringX/ringY) that follow, leaving the cursor parked.
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 });
        visible = true;
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onWindowLeave = () => {
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.2, overwrite: true });
      visible = false;
    };

    // Event delegation for the ring's subtle scale-up over links/buttons.
    // `relatedTarget` keeps the scale stable while moving between a control
    // and its children (no flicker), and reverts when leaving the control.
    const onHoverChange = (event: MouseEvent) => {
      const enteredInteractive = isInteractive(event.target);
      const leftInteractive = isInteractive(event.relatedTarget);
      if (enteredInteractive !== leftInteractive) {
        ringScale(enteredInteractive ? 1.4 : 1);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onWindowLeave);
    document.addEventListener("mouseover", onHoverChange, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onWindowLeave);
      document.removeEventListener("mouseover", onHoverChange);
      root.classList.remove("has-custom-cursor");
      gsap.killTweensOf([dot, ring]);
      gsap.set([dot, ring], { x: 0, y: 0, scale: 1, autoAlpha: 0 });
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
    >
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </div>
  );
}
