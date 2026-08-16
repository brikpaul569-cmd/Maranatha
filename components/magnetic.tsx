"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import useMagnetic from "@/lib/use-magnetic";

/**
 * Magnetic — reusable wrapper for the subtle cursor-pull micro-interaction
 * (ds-R10 polish layer).
 *
 * The GSAP transform lands on the INNER wrapper while the outer span keeps
 * the layout box, so nothing reflows and no layout breaks. On mobile/touch
 * or prefers-reduced-motion the hook no-ops and this renders as two plain
 * spans around the unchanged child — no listeners, no transforms.
 *
 * Accessibility untouched: the child stays the focusable control; the spans
 * add no semantics, no keyboard interference and no pointer-events tricks.
 */
export default function Magnetic({ children }: { children: ReactNode }) {
  const innerRef = useRef<HTMLSpanElement>(null);
  useMagnetic(innerRef);

  return (
    <span className="inline-block">
      <span ref={innerRef} className="block">
        {children}
      </span>
    </span>
  );
}
