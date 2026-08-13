"use client";

import { useLayoutEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ParallaxFloat — continuous floating + scroll-driven parallax.
 *
 * Wraps any element with:
 * - Continuous floating: y: [-10, 10], duration 3s, repeat -1, yoyo, sine.inOut
 * - Scroll parallax: yPercent proportional to `speed`, scrubbed via ScrollTrigger
 *
 * Different `speed` values on sibling elements create depth layers.
 * Disables under `prefers-reduced-motion`.
 *
 * Brief: levitación/flotado continuo + parallax a distintas velocidades.
 */
export default function ParallaxFloat({
  children,
  speed = 0,
  float = true,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  /** Parallax intensity: 0 = none, higher = more drift on scroll. */
  speed?: number;
  /** Enable continuous floating oscillation. Default: true. */
  float?: boolean;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Continuous floating: oscillates y between -10px and +10px.
      // Uses fromTo (not array syntax) — GSAP TS types reject [-10, 10]
      // for .to(), and fromTo is semantically correct for a bounded loop.
      if (float) {
        gsap.fromTo(
          el,
          { y: -10 },
          {
            y: 10,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }
        );
      }

      // Scroll parallax: yPercent (relative to element height), scrubbed.
      // yPercent and y are independent GSAP transform props — they compose
      // cleanly: floating oscillates y while parallax drifts yPercent.
      if (speed > 0) {
        gsap.to(el, {
          yPercent: speed * 30,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [speed, float]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      data-parallax-float
      className={className}
    >
      {children}
    </Tag>
  );
}
