"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * CascadeReveal — wraps a grid/list of items and animates each
 * `[data-cascade]` child with a staggered scroll-triggered reveal.
 * Falls back to immediate visibility for reduced-motion users.
 *
 * Usage:
 *   <CascadeReveal>
 *     <div className="grid ...">
 *       {items.map(item => (
 *         <div key={item.id} data-cascade><Child /></div>
 *       ))}
 *     </div>
 *   </CascadeReveal>
 */
export default function CascadeReveal({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Reduced-motion: make items visible immediately, no animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const items = root.querySelectorAll<HTMLElement>("[data-cascade]");
      items.forEach((item) => {
        item.style.opacity = "1";
        item.style.transform = "none";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-cascade]", root);
      if (items.length === 0) return;

      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: i * 0.05,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
