"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Top-edge scroll progress bar (micro-interaction). Reads scroll progress each
 * tick and stretches a gold bar from left — subtle, always-on orientation cue
 * that makes scrolling feel "connected" to the page. Lenis updates
 * window.scrollY on its rAF loop, so this stays in sync without coupling to
 * the smooth-scroll instance. Disabled under prefers-reduced-motion.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onTick = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      gsap.set(bar, { scaleX: progress, transformOrigin: "left" });
    };

    onTick();
    const tick = gsap.ticker.add(onTick);
    window.addEventListener("scroll", onTick, { passive: true });
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("scroll", onTick);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-0 h-0.5 w-full overflow-hidden bg-transparent"
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-mar-gold"
      />
    </div>
  );
}
