"use client";

import { useLayoutEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import gsap from "gsap";
import SplitType from "split-type";
import { onEntranceReady } from "@/lib/entrance";

/**
 * SplitType SSR-safe headline reveal (D4; hero-R2/R8, cc-R2).
 *
 * The server renders the plain text (SEO — the H1 is real HTML and never
 * hidden without JS); on the entrance signal the text is split into lines and
 * each line rises from below with an initial blur, settling in ≤0.8s. Under
 * `prefers-reduced-motion` no split happens and the text is visible instantly
 * (hero-R8). Cleanup reverts both the GSAP context and the SplitType DOM
 * changes (D4).
 */

type SplitRevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
};

export default function SplitReveal({
  children,
  as: Tag = "h1",
  className = "",
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitType | null = null;
    let ctx: gsap.Context | null = null;

    const dispose = onEntranceReady(() => {
      split = new SplitType(el, { types: "lines" });
      ctx = gsap.context(() => {
        const lines = el.querySelectorAll<HTMLElement>(".line");
        gsap.fromTo(
          lines,
          { yPercent: 110, opacity: 0, filter: "blur(8px)" },
          {
            yPercent: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.07,
          }
        );
      }, el);
    });

    return () => {
      dispose();
      ctx?.revert();
      split?.revert();
    };
  }, []);

  return (
    <Tag ref={ref as React.Ref<HTMLElement>} className={`split-reveal ${className}`}>
      {children}
    </Tag>
  );
}
