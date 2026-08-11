"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { signalEntranceReady } from "@/lib/entrance";

/**
 * Ready gate (user direction — replaces the logo-stroke preloader).
 *
 * A full-viewport entrance gate: the page beneath is blurred behind a pastel
 * rainbow gradient, the headline asks "¿Estás listo?" and a glossy mirror orb
 * is the only way in — clicking it reveals the site. Post-hydration overlay
 * only (`mounted` starts false), so the SSR/no-JS DOM never contains it and
 * all server-rendered content stays visible beneath (pre-R6). The backdrop is
 * translucent + blurred, never opaque, so the hero still paints underneath
 * (pre-R9: the gate must not block the LCP paint).
 *
 * Session-gated (pre-R1): shows at most once per session via
 * `mar-preloader-done`; reduced-motion users skip it entirely (pre-R7). On
 * entry the gate signals the entrance bus exactly once (D1) so the hero
 * choreography starts the moment the gate lifts.
 */

/** Session gate flag: the gate runs at most once per session (pre-R1). */
const STORAGE_KEY = "mar-preloader-done";
/** Gate fade-out before unmount. */
const EXIT_MS = 500;

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLButtonElement>(null);
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

  // Soft entrance of the gate content, then the mirror orb is the exit: a
  // click (or Enter/Space on the orb) signals the entrance bus, persists the
  // session flag and fades the gate out before unmounting (D1).
  useLayoutEffect(() => {
    if (!mounted) return;
    const overlay = overlayRef.current;
    const content = contentRef.current;
    const orb = orbRef.current;
    if (!overlay || !content || !orb) return;

    gsap.fromTo(
      content,
      { autoAlpha: 0, y: 16 },
      { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
    gsap.fromTo(
      orb,
      { scale: 0.9, autoAlpha: 0 },
      { scale: 1, autoAlpha: 1, duration: 0.5, ease: "back.out(1.6)", delay: 0.25 }
    );

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
        autoAlpha: 0,
        duration: EXIT_MS / 1000,
        ease: "power2.inOut",
        onComplete: () => setMounted(false),
      });
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") finish();
    };
    orb.addEventListener("click", finish);
    orb.addEventListener("keydown", onKey);
    return () => {
      orb.removeEventListener("click", finish);
      orb.removeEventListener("keydown", onKey);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
    >
      {/* Pastel rainbow + blur over the page beneath (user direction). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(247,201,214,0.6),rgba(251,243,233,0.5),rgba(169,196,160,0.6),rgba(250,220,228,0.5),rgba(217,169,78,0.45))] backdrop-blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.35),transparent_60%)]"
      />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center gap-7 px-6 text-center opacity-0"
      >
        <p className="font-sans text-xs uppercase tracking-[0.4em] text-mar-brown/70">
          Detalles Maranatha · Bogotá
        </p>

        <p className="font-display text-[clamp(2.8rem,9vw,5.5rem)] leading-none text-mar-brown">
          ¿Estás listo?
        </p>

        <p className="max-w-sm font-sans text-base text-mar-brown/80">
          Entrá y descubrí el detalle perfecto para tu ocasión.
        </p>

        <button
          ref={orbRef}
          type="button"
          aria-label="Entrar al sitio"
          className="group relative mt-1 flex size-24 items-center justify-center rounded-full opacity-0"
        >
          {/* Glossy mirror orb: radial glass sheen + rim light (user direction). */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.95),rgba(255,255,255,0.45)_45%,rgba(190,215,235,0.7)_75%,rgba(140,170,205,0.85))] shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),0_14px_34px_-8px_rgba(58,42,36,0.35)] transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
          />
          <span
            aria-hidden="true"
            className="absolute left-6 top-5 h-3 w-6 -rotate-[18deg] rounded-full bg-white/70 blur-[2px]"
          />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="relative size-7 text-mar-brown/80"
            aria-hidden
          >
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <p className="font-sans text-xs text-mar-brown/60">
          Tocá el espejo para entrar
        </p>
      </div>
    </div>
  );
}
