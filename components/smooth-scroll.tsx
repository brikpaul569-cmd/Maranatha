"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { clearLenis, setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

type SmoothScrollProps = {
  children: React.ReactNode;
  /** Optional id forwarded to the wrapper — lets overlays (e.g. the header
   *  drawer) mark main content `inert` while open (D5). */
  id?: string;
};

export default function SmoothScroll({ children, id }: SmoothScrollProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setEnabled(!mq.matches);
    sync();
    mq.addEventListener("change", sync);

    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({ respectReducedMotion: true });
    // Register the shared instance so anchors route through it (ds-R9).
    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(0);
      clearLenis();
      lenis.destroy();
    };
  }, [enabled]);

  return (
    <div id={id} className="lenis">
      {children}
    </div>
  );
}
