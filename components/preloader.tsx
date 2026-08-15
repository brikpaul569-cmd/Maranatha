"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { signalEntranceReady } from "@/lib/entrance";
import BearDoodle from "@/components/ui/bear-doodle";

/**
 * Ready gate (user direction — replaces the logo-stroke preloader).
 *
 * A full-viewport entrance gate: the page beneath is blurred behind a
 * var-backed backdrop that re-themes per ecosystem × theme-mode (tienda,
 * taller, dark, lavender-night), the headline is ecosystem-aware ("¿Estás
 * listo?" / "¿Listo para crear?") and a glossy mirror orb is the only way in
 * — clicking it reveals the site. Post-hydration overlay
 * only (`mounted` starts false), so the SSR/no-JS DOM never contains it and
 * all server-rendered content stays visible beneath (pre-R6). The backdrop is
 * translucent + blurred, never opaque, so the hero still paints underneath
 * (pre-R9: the gate must not block the LCP paint).
 *
 * On exit the mirror orb gives way to a teddy-bear doodle whose strokes draw
 * themselves in the final second before the gate opens (stroke-dash
 * choreography, purely decorative and aria-hidden).
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

/** Ecosystem-aware copy (user direction): tienda vs taller read differently. */
const ECOSYSTEM_COPY = {
  tienda: {
    headline: "¿Estás listo?",
    sub: "Entrá y descubrí el detalle perfecto para tu ocasión.",
    orbLabel: "Entrar al sitio",
  },
  taller: {
    headline: "¿Listo para crear?",
    sub: "Entrá al taller y aprendé a hacer los detalles con tus manos.",
    orbLabel: "Entrar al taller",
  },
} as const;

type Ecosystem = keyof typeof ECOSYSTEM_COPY;

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [ecosystem, setEcosystem] = useState<Ecosystem>("tienda");
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLButtonElement>(null);
  const doodleWrapRef = useRef<HTMLDivElement>(null);
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
    const timer = window.setTimeout(() => {
      // data-ecosystem is set pre-paint on <html>, so a first-render read is
      // authoritative; both state flips stay deferred one macrotask (react-hooks
      // rule) so the effect body never calls setState synchronously.
      setEcosystem(
        document.documentElement.getAttribute("data-ecosystem") === "taller"
          ? "taller"
          : "tienda"
      );
      setMounted(true);
    }, 0);
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

      // Fallback: the original plain overlay fade (graceful degradation if
      // the doodle choreography cannot run).
      const plainFade = () =>
        gsap.to(overlay, {
          autoAlpha: 0,
          duration: EXIT_MS / 1000,
          ease: "power2.inOut",
          onComplete: () => setMounted(false),
        });

      const doodle = doodleWrapRef.current;
      if (!doodle) {
        plainFade();
        return;
      }

      // Final-second choreography, all inside the 500ms exit budget
      // (transform/opacity only, CLS-safe): the headline/orb yield to the
      // teddy-bear doodle, whose strokes draw themselves while the whole
      // overlay fades out. Content + entrance signal are handled above.
      try {
        gsap.to(content, {
          autoAlpha: 0,
          duration: 0.15,
          ease: "power2.in",
        });
        gsap.fromTo(
          doodle,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.15, ease: "power2.out", delay: 0.05 }
        );

        // Stroke-draw: dash each shape to its own length, then chase the
        // offsets back to 0. All doodle shapes are stroke-only, so the
        // dash trick works. Reads (getTotalLength) happen before writes.
        const shapes = doodle.querySelectorAll<SVGGeometryElement>(
          "circle, path"
        );
        shapes.forEach((el) => {
          const len = el.getTotalLength();
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        });
        // Durations trimmed (0.25s / stagger 0.03) so the last shape lands
        // exactly at the 500ms mark instead of past the unmount.
        gsap.to(shapes, {
          strokeDashoffset: 0,
          duration: 0.25,
          ease: "power2.inOut",
          stagger: 0.03,
          delay: 0.1,
        });

        gsap.to(overlay, {
          autoAlpha: 0,
          duration: EXIT_MS / 1000 - 0.2,
          ease: "power2.inOut",
          delay: 0.2,
          onComplete: () => setMounted(false),
        });
      } catch {
        plainFade();
      }
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

  const copy = ECOSYSTEM_COPY[ecosystem];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
    >
      {/* Var-backed world backdrop + blur over the page beneath (user
          direction): --preloader-gradient re-themes per ecosystem × mode. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(image:--preloader-gradient) backdrop-blur-2xl"
      />
      {/* Radial sheen, dimmed toward the dark combos (--preloader-glow). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(image:--preloader-glow)"
      />

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center gap-7 px-6 text-center opacity-0"
      >
        <p className="font-sans text-xs uppercase tracking-[0.4em] text-mar-brown/70">
          Detalles Maranatha · Bogotá
        </p>

        <p className="font-display text-[clamp(2.8rem,9vw,5.5rem)] leading-none text-mar-brown">
          {copy.headline}
        </p>

        <p className="max-w-sm font-sans text-base text-mar-brown/80">
          {copy.sub}
        </p>

        <button
          ref={orbRef}
          type="button"
          aria-label={copy.orbLabel}
          className="group relative mt-1 flex size-24 items-center justify-center rounded-full opacity-0"
        >
          {/* Glossy mirror orb: radial glass sheen + rim light (user direction). */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-(image:--preloader-orb) shadow-(--preloader-orb-shadow) transition-transform duration-300 group-hover:scale-105 group-active:scale-95"
          />
          <span
            aria-hidden="true"
            className="absolute left-6 top-5 h-3 w-6 -rotate-[18deg] rounded-full bg-(--preloader-orb-highlight) blur-[2px]"
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

      {/* Teddy-bear stroke-draw: hidden until the exit choreography reveals
          it. Purely decorative (aria-hidden) — the orb stays the accessible
          entry, and the doodle needs no focus management. */}
      <div
        ref={doodleWrapRef}
        aria-hidden="true"
        className="absolute inset-0 z-10 flex items-center justify-center opacity-0 text-mar-brown/80"
      >
        <BearDoodle className="size-28 md:size-36" />
      </div>
    </div>
  );
}
