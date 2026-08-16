"use client";

import { useRef } from "react";
import { waMeUrl } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/ui/icons";
import useMagnetic from "@/lib/use-magnetic";

/**
 * Floating WhatsApp widget (ds-R5). Client component so the magnetic
 * cursor-pull (ds-R10) can attach to the fixed circle button on desktop.
 *
 * The hook applies GSAP x/y directly to the anchor instead of wrapping it in
 * a Magnetic wrapper: wrapping a `position: fixed` element in a transformed
 * (or will-change) wrapper would re-root its containing block and break the
 * corner anchoring. A transform on the fixed element itself is purely
 * visual — the layout box stays viewport-anchored (Lenis uses native scroll,
 * so no body transform offsets it).
 *
 * Server-rendered markup is unchanged: the anchor, href and aria-label all
 * ship in the SSR HTML (cc-R8, SEO intact); the magnetic effect is a
 * client-only, desktop-only, reduced-motion-aware polish layer.
 */
export default function FloatingWhatsApp() {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref);

  return (
    <a
      ref={ref}
      href={waMeUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-4 right-4 z-40 flex size-14 items-center justify-center rounded-full bg-mar-gold text-mar-brown shadow-lg transition-transform duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 md:bottom-6 md:right-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
