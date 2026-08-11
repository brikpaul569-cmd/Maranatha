"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import {
  ECOSYSTEM_CHANGE_EVENT,
  ECOSYSTEM_STORAGE_KEY,
  readEcosystem,
  type Ecosystem,
} from "@/lib/theme";
import { triggerNavTransition } from "@/components/nav-transition";

/**
 * Ecosystem switcher (user decision): a round scissors button that swaps the
 * WHOLE site between the pastel shop ("tienda") and a completely different
 * pastel workshop world ("taller"). Same brand, same pastel family, same
 * WhatsApp voice; the switch happens behind the curtain trance (ripple from
 * the click point + container transform + destination mood).
 *
 * Click flow (eco-E4):
 *   1. compute the next ecosystem from <html data-ecosystem>
 *   2. persist it in localStorage (maranatha-ecosystem)
 *   3. set `data-ecosystem` on <html> immediately (the whole palette is
 *      var-backed, so no component needs touching)
 *   4. dispatch `maranatha:ecosystem-change` so the header re-renders its nav
 *      and the sibling toggle keeps its aria state in sync
 *   5. trigger the curtain transition toward /taller (or / back to the shop)
 *      tinted with the destination mood, which performs the reveal.
 *
 * The destination mood reads the CURRENT (post-flip) palette: switching to
 * taller in dark mode tints the curtain with the lavender-night
 * `--mood-taller-hero` because the attribute flips before the trigger fires.
 *
 * Icon is a static scissors glyph — always visible in both states, no
 * CSS-driven swap needed (the ecosystem is only revealed by the curtain).
 */

function ScissorsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M8.12 8.12 12 12" />
      <path d="M20 4 8.12 15.88" />
      <path d="M14.8 14.8 20 20" />
    </svg>
  );
}

export default function EcosystemToggle() {
  const [ecosystem, setEcosystem] = useState<Ecosystem>("tienda");

  // Re-apply the attribute after React clears it on the dev StrictMode remount
  // (Next.js guide: "Re-applying attributes in development"). No-op in
  // production; never touches React state, so it stays INP-safe and lint-clean.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-ecosystem", readEcosystem());
  }, []);

  // Keep this toggle's aria state in sync with the other mounted instance and
  // with the persisted choice. On mount the setState is deferred one macrotask
  // so the effect body never calls it synchronously (react-hooks rule).
  useEffect(() => {
    const timer = window.setTimeout(
      () => setEcosystem(readEcosystem()),
      0
    );
    const onEcosystemChange = (event: Event) => {
      const detail = (event as CustomEvent<{ ecosystem: Ecosystem }>).detail;
      if (
        detail &&
        (detail.ecosystem === "tienda" || detail.ecosystem === "taller")
      ) {
        setEcosystem(detail.ecosystem);
      }
    };
    window.addEventListener(ECOSYSTEM_CHANGE_EVENT, onEcosystemChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(ECOSYSTEM_CHANGE_EVENT, onEcosystemChange);
    };
  }, []);

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const root = document.documentElement;
    const next: Ecosystem =
      root.getAttribute("data-ecosystem") === "taller" ? "tienda" : "taller";

    try {
      window.localStorage.setItem(ECOSYSTEM_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): the switch still works this visit.
    }

    root.setAttribute("data-ecosystem", next);

    window.dispatchEvent(
      new CustomEvent<{ ecosystem: Ecosystem }>(ECOSYSTEM_CHANGE_EVENT, {
        detail: { ecosystem: next },
      })
    );

    const dest = next === "taller" ? "/taller" : "/";
    const moodVar =
      next === "taller" ? "var(--mood-taller-hero)" : "var(--mood-hero)";
    triggerNavTransition(event.clientX, event.clientY, dest, moodVar);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        ecosystem === "taller"
          ? "Ir al ecosistema tienda"
          : "Ir al ecosistema taller"
      }
      aria-pressed={ecosystem === "taller"}
      className="inline-flex size-9 items-center justify-center rounded-full text-mar-brown/80 transition-colors hover:text-mar-gold"
    >
      <ScissorsIcon className="size-5" />
    </button>
  );
}
