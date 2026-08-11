"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { resolveNavMood } from "@/lib/constants";
import { scrollToHash, scrollToTop } from "@/lib/lenis";

/**
 * Curtain/window page transition (user decision).
 *
 * Clicking any nav item in either menu triggers a ripple + container-transform
 * cover: an expanding wave starts from the exact pointer coordinates while a
 * full-viewport container scales up about that point, tinted with the
 * destination section's mood color. Only then does the route change; once the
 * new page has mounted (pathname changed) the overlay retracts to reveal it.
 *
 * Mechanism: a module-level window CustomEvent bus. `triggerNavTransition(x,
 * y, href)` is dispatched from both the desktop and the drawer nav; this
 * overlay (mounted once, as a sibling of <header> inside SiteHeader) listens
 * and owns the GSAP timeline + navigation. The tiny event keeps every consumer
 * decoupled from the overlay instance and avoids re-rendering the header.
 *
 * Implementation notes:
 * - The overlay must NOT be a descendant of the transformed <header> (a
 *   transformed ancestor would turn `fixed` into a header-relative box), so it
 *   renders as a sibling fragment (self-contained inside SiteHeader).
 * - transform/opacity only (scale + autoAlpha) — no layout, no color tween;
 *   the mood color is written as a CSS var string that the browser resolves at
 *   paint time (gsap-performance).
 * - Reads are batched into one pass before the writes (no layout thrash).
 * - prefers-reduced-motion skips the animation and navigates immediately.
 * - aria-hidden, pointer-events-none when idle; pointer-events engage only
 *   while the cover is up so the old page can't be clicked mid-transition.
 * - Navigation uses next/navigation (useRouter/usePathname), never router
 *   events; hash destinations reuse the Lenis-aware scroll helpers.
 */

/** Shared bus event name (mirrors lib/entrance.ts naming). */
const NAVIGATE_EVENT = "maranatha:nav-navigate";
/** Cover duration: container + ripple reach full viewport (s). */
const COVER_S = 0.62;
/** Retract (reveal) duration (s). */
const RETRACT_S = 0.5;
/** Delay after the route pathname changes before the curtain lifts (ms). */
const LIFT_DELAY_MS = 120;
/** Safety net: force the retract if the pathname never changes (ms). */
const FALLBACK_RETRACT_MS = 2000;
/** Fixed-header offset so hash sections clear it when scrolling on /taller (px). */
const HEADER_OFFSET_PX = 80;

type NavigateDetail = {
  /** Viewport x of the click (ripple origin); 0/undefined = centered. */
  x: number;
  /** Viewport y of the click (ripple origin); 0/undefined = centered. */
  y: number;
  href: string;
  /** Optional explicit mood override; defaults to resolveNavMood(href). */
  moodVar?: string;
};

/**
 * Triggers the curtain transition from any nav item (desktop or drawer).
 * Dispatches a window CustomEvent that the NavTransition overlay listens for.
 */
export function triggerNavTransition(
  x: number,
  y: number,
  href: string,
  moodVar?: string
): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<NavigateDetail>(NAVIGATE_EVENT, {
      detail: { x, y, href, moodVar },
    })
  );
}

export default function NavTransition() {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);

  const busyRef = useRef(false);
  const retractingRef = useRef(false);
  const pendingRef = useRef<{ href: string } | null>(null);
  const pathRef = useRef(pathname);
  const liftTimerRef = useRef(0);
  const fallbackTimerRef = useRef(0);
  const tlRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);

  /** Retracts the overlay, revealing the newly mounted page. */
  const retract = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay || !busyRef.current || retractingRef.current) return;
    retractingRef.current = true;
    window.clearTimeout(fallbackTimerRef.current);
    window.clearTimeout(liftTimerRef.current);
    pendingRef.current = null;
    gsap.to(overlay, {
      autoAlpha: 0,
      scale: 0.92,
      duration: RETRACT_S,
      ease: "power2.inOut",
      transformOrigin: "50% 50%",
      onComplete: () => {
        busyRef.current = false;
        retractingRef.current = false;
        overlay.style.pointerEvents = "none";
        overlay.style.willChange = "";
        gsap.set(overlay, { clearProps: "transform" });
        if (containerRef.current) containerRef.current.style.willChange = "";
      },
    });
  }, []);

  /** Lifts the curtain a beat after the destination route has mounted. */
  const scheduleLift = useCallback(() => {
    if (!busyRef.current) return;
    window.clearTimeout(liftTimerRef.current);
    liftTimerRef.current = window.setTimeout(retract, LIFT_DELAY_MS);
  }, [retract]);

  /**
   * Navigates to the destination. Hash hrefs resolve to scrolls on the page
   * that owns them — #inicio lives on the home hero, #talleres/#aprende live
   * on the taller home — reusing the Lenis-aware scroll helpers. Same-page
   * destinations (a hash on the current page, or a click on the route you are
   * already on) never change the pathname, so the curtain is lifted right
   * after the scroll/click instead of waiting for the fallback.
   */
  const navigate = useCallback(
    (href: string) => {
      if (href.startsWith("#")) {
        if (pathRef.current === "/") {
          if (href === "#inicio") scrollToTop();
          else scrollToHash(href);
          scheduleLift();
        } else if (pathRef.current === "/taller") {
          scrollToHash(href, HEADER_OFFSET_PX);
          scheduleLift();
        } else {
          router.push("/");
        }
        return;
      }
      if (href === pathRef.current) {
        scheduleLift();
        return;
      }
      router.push(href);
    },
    [router, scheduleLift]
  );

  /**
   * Cover timeline: ripple from the click point + container scaling over the
   * viewport, both in the destination mood color. transform/opacity only.
   */
  const runTransition = useCallback(
    (detail: NavigateDetail) => {
      const overlay = overlayRef.current;
      const container = containerRef.current;
      const ripple = rippleRef.current;
      if (!overlay || !container || !ripple) return;

      // Keyboard-triggered clicks report (0,0) — fall back to viewport center.
      const originX = detail.x > 0 ? detail.x : window.innerWidth / 2;
      const originY = detail.y > 0 ? detail.y : window.innerHeight / 2;
      const moodVar = detail.moodVar ?? resolveNavMood(detail.href);

      busyRef.current = true;

      // Reduced motion: no curtain — navigate immediately (D5).
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        navigate(detail.href);
        busyRef.current = false;
        return;
      }

      // Single batched read pass, then writes (gsap-performance: no thrash).
      const maxRadius = Math.hypot(
        Math.max(originX, window.innerWidth - originX),
        Math.max(originY, window.innerHeight - originY)
      );

      pendingRef.current = { href: detail.href };
      retractingRef.current = false;

      overlay.style.pointerEvents = "auto";
      overlay.style.willChange = "opacity";
      container.style.background = moodVar;
      container.style.willChange = "transform";
      // Scale the full-viewport container about the exact click point.
      container.style.transformOrigin = `${originX}px ${originY}px`;
      // Ripple: a circle reaching the farthest viewport corner, centered on
      // the click point via a constant -50% translate offset (transform-only).
      ripple.style.background = moodVar;
      ripple.style.width = `${maxRadius * 2}px`;
      ripple.style.height = `${maxRadius * 2}px`;
      ripple.style.left = `${originX}px`;
      ripple.style.top = `${originY}px`;

      tlRef.current?.kill();

      const tl = gsap.timeline({ onComplete: () => navigate(detail.href) });
      tlRef.current = tl;

      tl.set(overlay, { autoAlpha: 1, scale: 1 })
        .fromTo(
          ripple,
          { x: -maxRadius, y: -maxRadius, scale: 0, autoAlpha: 0.85 },
          { scale: 1, autoAlpha: 0, duration: COVER_S * 1.15, ease: "power3.inOut" },
          0
        )
        .fromTo(
          container,
          { scale: 0.04, autoAlpha: 0.5 },
          { scale: 1, autoAlpha: 1, duration: COVER_S, ease: "power2.inOut" },
          0
        );

      // Safety net: if the pathname never changes (same-route click, or a hash
      // scroll on the current page) the curtain still lifts.
      fallbackTimerRef.current = window.setTimeout(retract, FALLBACK_RETRACT_MS);
    },
    [navigate, retract]
  );

  // Bus listener: drives the transition for desktop + drawer (and any future
  // consumer dispatching the same event).
  useEffect(() => {
    const onNavigate = (event: Event) => {
      const detail = (event as CustomEvent<NavigateDetail>).detail;
      if (!detail || busyRef.current) return;
      runTransition(detail);
    };
    window.addEventListener(NAVIGATE_EVENT, onNavigate);
    return () => window.removeEventListener(NAVIGATE_EVENT, onNavigate);
  }, [runTransition]);

  // Retract once the new route has mounted (pathname changed). For #inicio we
  // also snap to the top after landing on the home page.
  useEffect(() => {
    const previous = pathRef.current;
    pathRef.current = pathname;
    const pending = pendingRef.current;
    if (!pending || pathname === previous) return;
    if (pending.href === "#inicio" && pathname === "/") scrollToTop();
    scheduleLift();
  }, [pathname, scheduleLift]);

  // Teardown: kill the timeline and timers when the header unmounts.
  useEffect(() => {
    return () => {
      window.clearTimeout(fallbackTimerRef.current);
      window.clearTimeout(liftTimerRef.current);
      tlRef.current?.kill();
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[55] overflow-hidden"
      style={{ opacity: 0, visibility: "hidden" }}
    >
      <span ref={rippleRef} className="absolute rounded-full opacity-0" />
      <div ref={containerRef} className="absolute inset-0 opacity-0" />
    </div>
  );
}
