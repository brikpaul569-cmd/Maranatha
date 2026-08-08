"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onEntranceReady } from "@/lib/entrance";

gsap.registerPlugin(ScrollTrigger);

export type CollageItem = {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  /** Marks the dominant image and preloads it (Next 16.3 `preload` prop;
   *  replaces the deprecated `priority` — cc-R7, hero-R4). */
  preload?: boolean;
};

type FloatingCollageProps = {
  items: CollageItem[];
  /**
   * Positioning class for the root (e.g. `absolute inset-0` for a full-bleed
   * backdrop). The root MUST be positioned: collage layers are absolutely
   * positioned inside it, so `top`/`bottom` percentages resolve against it.
   * (The component deliberately does not force `relative` — combining it with
   * a consumer `absolute` is a cascade conflict that collapses the box.)
   */
  className?: string;
};

export default function FloatingCollage({
  items,
  className,
}: FloatingCollageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Entrance choreography (hero-R3/R9): the dominant layer settles from
  // scale 1.08 → 1 with a fade in ≤0.8s; satellites follow with a 50–80ms
  // stagger. Subscribes to the entrance bus so the reveal plays exactly once —
  // after the preloader exits AND when it is skipped. Reduced-motion/no-JS:
  // nothing is pre-hidden (cc-R2, hero-R8).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-collage-layer]")
    );
    const dominant = layers.find((layer) => layer.dataset.dominant === "true");
    const satellites = layers.filter((layer) => layer !== dominant);

    const dispose = onEntranceReady(() => {
      if (dominant) {
        gsap.fromTo(
          dominant,
          { scale: 1.08, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: "power2.out" }
        );
      }
      gsap.fromTo(
        satellites,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.06,
          delay: 0.1,
        }
      );
    });

    return () => dispose();
  }, [items]);

  // Scroll parallax — desktop only (cc-R2: gated at min-width 768px via
  // gsap.matchMedia; hero-R6 "Mobile parallax off").
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const layers = root.querySelectorAll<HTMLElement>("[data-parallax]");
      layers.forEach((layer) => {
        const speed = Number(layer.dataset.parallax) || 1;
        const drift = 20 * speed;
        gsap.fromTo(
          layer,
          { yPercent: -drift },
          {
            yPercent: drift,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    });

    return () => mm.revert();
  }, [items]);

  return (
    <div className={className} ref={rootRef}>
      {items.map((item) => (
        <div
          key={item.src}
          className={`absolute ${item.className ?? ""}`}
          data-collage-layer
          data-dominant={item.preload ? "true" : undefined}
          data-parallax={item.speed ?? 1}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
            loading={item.preload ? "eager" : "lazy"}
            preload={item.preload}
          />
        </div>
      ))}
    </div>
  );
}
