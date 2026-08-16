"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DetailDoodle from "@/components/ui/detail-doodle";

gsap.registerPlugin(ScrollTrigger);

type PawPrintsProps = {
  /** Absolute-position wrapper class — the caller places the cluster (e.g. "bottom-10 left-6"). */
  className?: string;
  /** Tailwind width class for each paw. Default "w-5 md:w-7". */
  sizeClassName?: string;
  /** Effective stroke opacity for the cluster (0-1). Default 0.5. */
  opacity?: number;
};

const PAW_SPOTS = [
  "-left-3 top-1/2 -translate-y-1/2 -rotate-12",
  "-right-3 top-1/3 -translate-y-1/2 rotate-12",
  "left-0 -bottom-3 -rotate-6",
  "right-1 -bottom-4 rotate-8",
];

export default function PawPrints({
  className,
  sizeClassName = "w-5 md:w-7",
  opacity = 0.5,
}: PawPrintsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-paw]"),
        { autoAlpha: 0, scale: 0.4 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.55,
          ease: "back.out(1.8)",
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute ${className ?? ""}`}
      style={{ opacity }}
    >
      {PAW_SPOTS.map((spot, i) => (
        <DetailDoodle
          key={i}
          data-paw
          variant="paw"
          className={`absolute ${spot} h-auto ${sizeClassName} text-mar-brown`}
        />
      ))}
    </div>
  );
}
