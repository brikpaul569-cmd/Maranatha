"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { signalEntranceReady } from "@/lib/entrance";
import Button from "@/components/ui/button";

/**
 * Session-gated brand preloader (pre-R1–R8; design D1).
 *
 * Post-hydration overlay only: `mounted` starts false, so the overlay never
 * exists in the SSR/no-JS DOM and all server-rendered content stays visible
 * beneath it (pre-R6). The overlay background is 96% opaque (color-mix) so
 * the browser cannot skip painting the hero headline underneath — a fully
 * opaque fixed overlay would defer the LCP paint until its fade (pre-R9).
 * On mount it checks the session gate and
 * `prefers-reduced-motion`; when either applies it signals the entrance bus
 * immediately and renders nothing (pre-R1, pre-R7). Otherwise it draws the
 * logo stroke with core GSAP `stroke-dashoffset` (pre-R3 — no DrawSVGPlugin)
 * over `var(--theme-bg)` (pre-R5), with a visible skip control (pre-R4) and a
 * forced exit so the site is fully revealed within the 1.5s budget (pre-R2).
 * On exit it flags the session and signals the entrance bus exactly once (D1).
 */

/** Session gate flag: preloader runs at most once per session (pre-R1). */
const STORAGE_KEY = "mar-preloader-done";
/**
 * Stroke draw duration (pre-R3). Kept at 550ms — well inside the 1.5s cap —
 * so the intro choreography cannot push LCP past the 2.0s mobile budget
 * (pre-R9: the preloader MUST NOT delay LCP past 2.0s).
 */
const DRAW_MS = 550;
/** Overlay fade-out before unmount. */
const EXIT_MS = 150;
/**
 * Forced-exit cap: `HARD_CAP_MS + EXIT_MS` keeps the full reveal inside the
 * 1.5s budget even if the draw stalls (pre-R2).
 */
const HARD_CAP_MS = 650;

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const strokeRef = useRef<SVGPathElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const finishRef = useRef<() => void>(() => {});
  const doneRef = useRef(false);

  // Session gate + reduced-motion check. Client-only by definition (effects),
  // so the overlay is never part of the initial HTML (pre-R6). The skip path
  // signals the entrance synchronously (D1); the mount flip is deferred one
  // macrotask so the effect body never calls setState directly (react-hooks
  // rule) — imperceptible and avoids cascading renders.
  useEffect(() => {
    let skip = false;
    try {
      skip = sessionStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      // Privacy mode: treat as a fresh session; the gate is best-effort.
    }
    if (!skip && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      skip = true;
    }
    if (skip) {
      signalEntranceReady();
      return;
    }
    const timer = window.setTimeout(() => setMounted(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Draw + exit choreography. Runs before paint once the overlay mounts.
  useLayoutEffect(() => {
    if (!mounted) return;
    const overlay = overlayRef.current;
    const stroke = strokeRef.current;
    const wordmark = wordmarkRef.current;
    if (!overlay || !stroke || !wordmark) return;

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      signalEntranceReady();
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // Privacy mode — best effort only.
      }
      gsap.to(overlay, {
        opacity: 0,
        duration: EXIT_MS / 1000,
        ease: "power2.inOut",
        onComplete: () => setMounted(false),
      });
    };
    finishRef.current = finish;

    // `pathLength={1}` normalizes the path to one unit, so dasharray=1 and a
    // dashoffset 1→0 draws 0%→100% with core GSAP only (pre-R3).
    gsap.set(stroke, { strokeDasharray: 1, strokeDashoffset: 1, opacity: 1 });
    gsap.fromTo(
      wordmark,
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", delay: 0.3 }
    );
    const draw = gsap.to(stroke, {
      strokeDashoffset: 0,
      duration: DRAW_MS / 1000,
      ease: "power2.inOut",
      onComplete: finish,
    });

    // Signal the entrance before the draw completes (pre-R9): the hero reveal
    // starts while the logo stroke finishes and the overlay fades, so the
    // headline paints in parallel with the last draw segment instead of
    // waiting for it. `signalEntranceReady` is idempotent, so the later
    // `finish` call (skip/cap) is a no-op for the bus.
    const signalTimer = window.setTimeout(() => {
      if (!doneRef.current) signalEntranceReady();
    }, Math.round(DRAW_MS * 0.75));

    // Forced exit cap (pre-R2): reveal completes within the 1.5s budget no
    // matter what happens to the draw.
    const cap = window.setTimeout(finish, HARD_CAP_MS);

    return () => {
      window.clearTimeout(signalTimer);
      window.clearTimeout(cap);
      draw.kill();
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-10 bg-[color-mix(in_srgb,var(--theme-bg)_96%,transparent)]"
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="size-20 text-[var(--theme-accent)]"
        fill="none"
      >
        <path
          ref={strokeRef}
          d="M50 96 C22 74 18 32 50 8 C82 32 78 74 50 96 Z"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          className="preloader-stroke"
          opacity={0}
        />
      </svg>

      <div ref={wordmarkRef} className="flex flex-col items-center gap-2">
        <p className="font-display text-2xl text-mar-brown">
          Detalles Maranatha
        </p>
        <p className="font-sans text-xs uppercase tracking-[0.35em] text-mar-brown/60">
          Flores &amp; detalles artesanales
        </p>
      </div>

      <Button
        variant="ghost"
        className="text-xs"
        onClick={() => finishRef.current()}
      >
        Omitir
      </Button>
    </div>
  );
}
