"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { NAV_ITEMS, waMeUrl, type NavItem } from "@/lib/constants";
import { isLenisActive, scrollToHash } from "@/lib/lenis";
import Button from "@/components/ui/button";
import { CloseIcon, MenuIcon, WhatsAppIcon } from "@/components/ui/icons";

gsap.registerPlugin(ScrollTrigger);

/**
 * Semi-fixed global header (hdr-R1–R7; design D5).
 *
 * - Fixed position, no layout shift; ScrollTrigger toggles `.is-scrolled` past
 *   the threshold and CSS transitions transform/opacity in ≤0.8s (hdr-R1).
 * - Only real destinations link: Inicio (`#inicio`) + WhatsApp CTA; future
 *   routes render as muted "próximamente" non-links (hdr-R2).
 * - WhatsApp CTA visible at every breakpoint (hdr-R3): pill in the desktop
 *   nav, icon button in the mobile bar, both built from `waMeUrl()` (cc-R8).
 * - Mobile drawer: `aria-expanded`/`aria-controls`, `inert` when closed,
 *   focus moves in on open and returns to the toggle on close, ESC closes,
 *   Tab cycles inside while main content is `inert` (hdr-R4).
 * - Anchor clicks are intercepted only while Lenis is active; otherwise the
 *   native jump runs — including with JS disabled (hdr-R5, D5).
 */

/** Scroll threshold (px) after which the header switches to the scrolled state. */
const SCROLL_THRESHOLD = 120;

export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const prevOpenRef = useRef(false);

  // Semi-fixed scroll transition (hdr-R1): toggle the scrolled state with
  // ScrollTrigger; the visual change is CSS transform/opacity only (≤0.8s).
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const trigger = ScrollTrigger.create({
      start: SCROLL_THRESHOLD,
      end: () => ScrollTrigger.maxScroll(window),
      onUpdate: (self) => {
        header.classList.toggle("is-scrolled", self.scroll() > SCROLL_THRESHOLD);
      },
    });

    return () => trigger.kill();
  }, []);

  // Drawer focus management (hdr-R4): focus moves into the drawer on open and
  // returns to the toggle on close; main content is marked `inert` while the
  // drawer is open so Tab cannot escape into the page behind it.
  useEffect(() => {
    const panel = panelRef.current;
    const main = document.getElementById("main-content");

    if (open) {
      panel?.querySelector<HTMLElement>("a[href], button")?.focus();
      main?.setAttribute("inert", "");
    } else if (prevOpenRef.current) {
      toggleRef.current?.focus();
      main?.removeAttribute("inert");
    }
    prevOpenRef.current = open;
  }, [open]);

  // ESC closes the drawer; Tab is trapped inside it (hdr-R4).
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
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
  }, [open]);

  // Anchor navigation (hdr-R5): close the drawer, then intercept only when
  // Lenis is active — otherwise let the native jump happen (reduced-motion
  // and no-JS keep native anchor behavior, D5).
  const handleAnchor = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href?: string
  ) => {
    if (!href) return;
    setOpen(false);
    if (!isLenisActive()) return;
    event.preventDefault();
    scrollToHash(href);
  };

  const renderNavItem = (item: NavItem) => {
    if (item.href) {
      return (
        <a
          key={item.label}
          href={item.href}
          onClick={(event) => handleAnchor(event, item.href)}
          className="font-sans text-sm font-medium text-mar-brown/80 transition-colors hover:text-mar-brown"
        >
          {item.label}
        </a>
      );
    }
    return (
      <span
        key={item.label}
        className="flex items-center gap-2 font-sans text-sm text-mar-brown/40"
        aria-disabled="true"
      >
        {item.label}
        <span className="rounded-full border border-mar-brown/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-mar-brown/40">
          próximamente
        </span>
      </span>
    );
  };

  return (
    <header ref={headerRef} className="site-header fixed inset-x-0 top-0 z-50">
      {/* Background layer fades in once scrolled (transform/opacity only). */}
      <div
        aria-hidden="true"
        className="site-header__bg absolute inset-0 border-b border-mar-brown/10 bg-[var(--theme-bg)]/90 backdrop-blur-md"
      />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <a
          href="#inicio"
          onClick={(event) => handleAnchor(event, "#inicio")}
          className="font-display text-lg leading-none text-mar-brown"
        >
          Detalles Maranatha
        </a>

        {/* Desktop navigation (md+) */}
        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-6 md:flex"
        >
          {NAV_ITEMS.map(renderNavItem)}
          {/* Compact WhatsApp CTA (hdr-R3); standalone classes — no utility
              conflicts with the Button primitive's own sizing. */}
          <a
            href={waMeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-mar-gold px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-mar-brown transition-transform duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0"
          >
            <WhatsAppIcon className="size-4 shrink-0" />
            Pedir por WhatsApp
          </a>
        </nav>

        {/* Mobile bar: WhatsApp CTA (hdr-R3) + drawer toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <a
            href={waMeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Pedir por WhatsApp"
            className="inline-flex size-11 items-center justify-center rounded-full bg-mar-gold text-mar-brown"
          >
            <WhatsAppIcon className="size-5" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full text-mar-brown"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
            <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
          </button>
        </div>
      </div>

      {/* Mobile drawer — always mounted (SSR-safe), inert + off-screen when
          closed, slides via transform/opacity ≤0.3s (hdr-R4, D5). */}
      <div
        id="mobile-nav"
        ref={panelRef}
        inert={!open}
        className={[
          "absolute inset-x-0 top-full border-b border-mar-brown/10 bg-[var(--theme-bg)]",
          "transition-[opacity,transform] duration-300 motion-reduce:transition-none md:hidden",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        ].join(" ")}
      >
        <nav
          aria-label="Navegación móvil"
          className="flex flex-col gap-5 px-6 pb-8 pt-2"
        >
          {NAV_ITEMS.map(renderNavItem)}
          <Button
            variant="whatsapp"
            href={waMeUrl()}
            className="mt-2 w-full"
            onClick={() => setOpen(false)}
          >
            Pedir por WhatsApp
          </Button>
        </nav>
      </div>
    </header>
  );
}
