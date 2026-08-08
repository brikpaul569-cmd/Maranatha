"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type CollageItem = {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  priority?: boolean;
};

type FloatingCollageProps = {
  items: CollageItem[];
  className?: string;
};

export default function FloatingCollage({
  items,
  className,
}: FloatingCollageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

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
    <div className={`relative ${className ?? ""}`} ref={rootRef}>
      {items.map((item) => (
        <div
          key={item.src}
          className={`absolute ${item.className ?? ""}`}
          data-parallax={item.speed ?? 1}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover"
            loading={item.priority ? "eager" : "lazy"}
            priority={item.priority}
          />
        </div>
      ))}
    </div>
  );
}
