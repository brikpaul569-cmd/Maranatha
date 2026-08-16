"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { CloseIcon } from "@/components/ui/icons";

gsap.registerPlugin(Flip);

type GalleryItem = {
  src: string;
  alt: string;
  caption: string;
  href: string;
};

type GalleryLightboxProps = {
  items: GalleryItem[];
};

/** Fullscreen target of the traveling element (viewport-relative). */
const FULLSCREEN_STYLE = {
  top: "0px",
  left: "0px",
  width: "100vw",
  height: "100dvh",
} as const;

/**
 * GalleryLightbox — gallery grid + fullscreen lightbox with a GSAP Flip
 * shared-element transition. The clicked image grows FROM its card INTO
 * fullscreen (a morph, not a pop-in modal); closing FLIPs it back and returns
 * focus to the originating card.
 *
 * The grid is SSR-safe: the same <Image> markup as before, served in the
 * initial HTML. Each card is a <button> (native Enter/Space activation). The
 * lightbox overlay renders only while open (activeIndex !== null), so it never
 * appears in the initial HTML.
 *
 * Mechanism: on open, the card's image box rect is measured (viewport-relative
 * via getBoundingClientRect — correct even when the page is scrolled), then a
 * `position: fixed` traveling element is laid out over it inside a
 * useLayoutEffect (pre-paint, no flicker). Its state is captured with
 * Flip.getState, it snaps to fullscreen, and Flip.from animates the growth.
 * prefers-reduced-motion skips the morph and fades in/out instead.
 *
 * Scroll is locked (overflow: hidden on <html> + <body>) before measuring so
 * the rect matches the post-lock layout. lib/lenis.ts exports no instance
 * getter, so the body lock is the sanctioned stop: with the window
 * unscrollable, Lenis' wheel handling cannot move the page.
 */

export default function GalleryLightbox({ items }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const travelingRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const originRectRef = useRef<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const scrollLockRef = useRef<{ html: string; body: string } | null>(null);
  const reducedMotionRef = useRef(false);
  const closingRef = useRef(false);

  const isOpen = activeIndex !== null;
  const activeItem = activeIndex !== null ? items[activeIndex] : null;

  const getCardMediaRect = useCallback((index: number) => {
    const card = cardRefs.current[index];
    const media = card?.querySelector<HTMLElement>("[data-lightbox-media]");
    if (!media) return null;
    const rect = media.getBoundingClientRect();
    return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
  }, []);

  const lockScroll = useCallback(() => {
    const html = document.documentElement;
    const body = document.body;
    if (body.style.overflow === "hidden") return;
    scrollLockRef.current = { html: html.style.overflow, body: body.style.overflow };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
  }, []);

  const unlockScroll = useCallback(() => {
    const prev = scrollLockRef.current;
    if (!prev) return;
    document.documentElement.style.overflow = prev.html;
    document.body.style.overflow = prev.body;
    scrollLockRef.current = null;
  }, []);

  const open = useCallback(
    (index: number) => {
      if (activeIndex !== null) return;
      reducedMotionRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      // Lock before measuring so the rect matches the post-lock layout
      // (removing the scrollbar shifts content by its width).
      lockScroll();
      const rect = getCardMediaRect(index);
      if (!rect) {
        unlockScroll();
        return;
      }
      originRectRef.current = rect;
      setActiveIndex(index);
    },
    [activeIndex, getCardMediaRect, lockScroll, unlockScroll]
  );

  const close = useCallback(() => {
    if (activeIndex === null || closingRef.current) return;
    const overlay = overlayRef.current;
    const el = travelingRef.current;
    const reduce = reducedMotionRef.current;
    const card = cardRefs.current[activeIndex];

    closingRef.current = true;

    const finish = () => {
      closingRef.current = false;
      unlockScroll();
      setActiveIndex(null);
      card?.focus();
    };

    gsap.killTweensOf([overlay, el, captionRef.current, closeBtnRef.current]);
    // Clear any leftover transform from an in-flight open morph so the close
    // capture starts from a clean fullscreen state.
    if (el) gsap.set(el, { clearProps: "transform" });

    if (!overlay) {
      finish();
      return;
    }

    if (reduce || !el) {
      gsap.to(overlay, {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power2.out",
        onComplete: finish,
      });
      return;
    }

    const state = Flip.getState(el);
    const target = getCardMediaRect(activeIndex);
    if (target) {
      el.style.top = `${target.top}px`;
      el.style.left = `${target.left}px`;
      el.style.width = `${target.width}px`;
      el.style.height = `${target.height}px`;
    }
    Flip.from(state, {
      duration: 0.5,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.to(overlay, {
          autoAlpha: 0,
          duration: 0.15,
          onComplete: finish,
        });
      },
    });
  }, [activeIndex, getCardMediaRect, unlockScroll]);

  // Open morph: position the traveling element over the source image box and
  // FLIP it to fullscreen. Runs pre-paint so there is never a visible flicker.
  useLayoutEffect(() => {
    if (activeIndex === null) return;
    const overlay = overlayRef.current;
    const el = travelingRef.current;
    const rect = originRectRef.current;
    if (!overlay || !el || !rect) return;

    const reduce = reducedMotionRef.current;

    el.style.top = `${rect.top}px`;
    el.style.left = `${rect.left}px`;
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;

    gsap.killTweensOf([overlay, el, captionRef.current, closeBtnRef.current]);
    gsap.set([captionRef.current, closeBtnRef.current], { autoAlpha: 0 });

    if (reduce) {
      // Reduced motion: no morph — snap straight to fullscreen and fade in.
      Object.assign(el.style, FULLSCREEN_STYLE);
      gsap.fromTo(
        overlay,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.25, ease: "power2.out" }
      );
      gsap.to(
        [captionRef.current, closeBtnRef.current],
        { autoAlpha: 1, duration: 0.3, ease: "power2.out", delay: 0.1 }
      );
      closeBtnRef.current?.focus();
      return;
    }

    // Fade the dim layer in while the image grows.
    gsap.fromTo(
      backdropRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.35, ease: "power2.out" }
    );

    const state = Flip.getState(el);
    Object.assign(el.style, FULLSCREEN_STYLE);
    Flip.from(state, {
      duration: 0.6,
      ease: "power3.inOut",
      onComplete: () => {
        gsap.to(closeBtnRef.current, {
          autoAlpha: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(captionRef.current, {
          autoAlpha: 1,
          duration: 0.35,
          ease: "power2.out",
          delay: 0.1,
        });
      },
    });
    closeBtnRef.current?.focus();
  }, [activeIndex]);

  // ESC closes; Tab cycles within the overlay (matches the site-header drawer).
  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
        return;
      }
      if (event.key !== "Tab" || !overlay) return;
      const focusables = Array.from(
        overlay.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  // Unmount safety: restore scroll and kill any running tween (e.g. navigating
  // via the "Ver categoría" link while the lightbox is open).
  useEffect(() => {
    const nodes = [
      overlayRef.current,
      backdropRef.current,
      travelingRef.current,
      captionRef.current,
      closeBtnRef.current,
    ];
    return () => {
      unlockScroll();
      gsap.killTweensOf(nodes);
    };
  }, [unlockScroll]);

  return (
    <>
      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
        {items.map((item, index) => (
          <div key={item.caption} data-cascade>
            <button
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              type="button"
              aria-label={item.alt}
              onClick={() => open(index)}
              className="group block w-full cursor-pointer overflow-hidden text-left transition-transform duration-300 motion-safe:hover:-translate-y-1"
            >
              <div
                data-lightbox-media
                className="relative aspect-[4/5] w-full overflow-hidden bg-mar-pink-light"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <span className="block p-4 font-sans text-sm font-semibold uppercase tracking-widest text-mar-brown">
                {item.caption}
              </span>
            </button>
          </div>
        ))}
      </div>

      {activeItem && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.alt}
          className="fixed inset-0 z-[70]"
        >
          <div
            ref={backdropRef}
            aria-hidden="true"
            onClick={close}
            className="absolute inset-0 z-0 bg-black/60 opacity-0 backdrop-blur-sm"
          />

          <div
            ref={travelingRef}
            className="fixed z-[1] overflow-hidden bg-mar-pink-light will-change-transform"
          >
            {/* Plain <img> by design: this is a client-only, morphing copy of
                the card asset (next/image `fill` can't follow a Flip rect
                morph without a fixed size container). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeItem.src}
              alt={activeItem.alt}
              draggable={false}
              className="h-full w-full object-cover"
            />

            <div
              ref={captionRef}
              className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 bg-linear-to-t from-black/70 via-black/25 to-transparent px-5 pb-5 pt-12 opacity-0"
            >
              <p className="font-sans text-sm font-semibold uppercase tracking-widest text-white md:text-base">
                {activeItem.caption}
              </p>
              <Link
                href={activeItem.href}
                onClick={unlockScroll}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-mar-gold px-4 py-2 font-futura text-xs font-semibold uppercase tracking-widest text-mar-brown transition-transform duration-300 motion-safe:hover:-translate-y-0.5"
              >
                Ver categoría
              </Link>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Cerrar"
            onClick={close}
            className="fixed right-4 top-4 z-[2] inline-flex size-11 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-transform duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 md:right-6 md:top-6"
          >
            <CloseIcon className="size-6" />
          </button>
        </div>
      )}
    </>
  );
}
