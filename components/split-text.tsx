"use client";

import { useLayoutEffect, useRef } from "react";
import type { ElementType, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

/**
 * SplitText — scroll-triggered text reveal using split-type (open-source
 * alternative to GSAP SplitText).
 *
 * Splits text into chars, words, or lines and reveals them one-by-one with
 * a smooth stagger as the element enters the viewport via ScrollTrigger.
 * Server-rendered as plain text (SEO-safe); splitting happens client-side only.
 * Disables under `prefers-reduced-motion`.
 *
 * Brief: divide los textos para que las letras/palabras aparezcan revelándose
 * con un stagger suave al entrar en viewport.
 */
export default function SplitText({
  children,
  as: Tag = "div",
  className = "",
  by = "words",
  stagger = 0.05,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Split mode: "chars", "words", or "lines". Default: "words". */
  by?: "chars" | "words" | "lines";
  /** Stagger delay between split elements (seconds). Default: 0.05. */
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let split: SplitType | null = null;

    const ctx = gsap.context(() => {
      split = new SplitType(el, { types: [by] });
      const elements = el.querySelectorAll<HTMLElement>(`.${by}`);

      // Initial state: hidden + below + blurred
      gsap.set(elements, { y: 20, opacity: 0, filter: "blur(4px)" });

      // Reveal on scroll with stagger
      gsap.to(elements, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => {
      ctx.revert();
      split?.revert();
    };
  }, [by, stagger]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`split-text ${className}`.trim()}
    >
      {children}
    </Tag>
  );
}
