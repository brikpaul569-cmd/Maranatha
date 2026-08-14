"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  NAV_ITEMS_DESKTOP,
  NAV_ITEMS_MOBILE,
  NAV_ITEMS_TALLER_DESKTOP,
  NAV_ITEMS_TALLER_MOBILE,
  type NavItem,
} from "@/lib/constants";
import { ECOSYSTEM_CHANGE_EVENT, type Ecosystem } from "@/lib/theme";
import ThemeModeToggle from "@/components/theme-mode-toggle";
import EcosystemToggle from "@/components/ecosystem-toggle";
import NavTransition, {
  triggerNavTransition,
} from "@/components/nav-transition";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fixed global header (hdr-R1–R7; design D5) — navigation redesign
 * (user decision).
 *
 * - No header logo: the brand mark lives in the hero lockup only. The desktop
 *   nav shows the four primary routes and is truly centered (flex centering +
 *   absolutely positioned controls); the mobile drawer (id="mobile-nav")
 *   carries a deliberately DIFFERENT set of destinations.
 * - Every nav item (desktop + drawer) triggers the curtain transition —
 *   ripple + container transform + destination mood — before navigating.
 *   NavTransition renders as a sibling fragment so the fixed overlay is never
 *   a descendant of this transformed header (a transformed ancestor would turn
 *   `fixed` into a header-relative box).
 * - Fixed position, no layout shift; ScrollTrigger toggles `.is-scrolled` past
 *   the threshold and CSS transitions transform/opacity in ≤0.8s (hdr-R1).
 * - Ecosystem-aware nav (eco-E4): the round scissors toggle swaps the whole
 *   site between "tienda" (existing nav sets) and "taller" (workshop nav
 *   sets). The header listens for `maranatha:ecosystem-change` (and
 *   initializes from the <html> attribute) and swaps the rendered items — the
 *   curtain overlay covers the swap so it is never visible. The sun/moon
 *   toggle is the restored dark/light mode: an in-place palette flip that
 *   applies to both ecosystems and never navigates.
 * - Mobile drawer: `aria-expanded`/`aria-controls`, `inert` when closed,
 *   focus moves in on open and returns to the toggle on close, ESC closes,
 *   Tab cycles inside while main content is `inert` (hdr-R4).
 */

/** Scroll threshold (px) after which the header switches to the scrolled state. */
const SCROLL_THRESHOLD = 120;

export default function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const prevOpenRef = useRef(false);
  const [ecosystem, setEcosystem] = useState<Ecosystem>("tienda");

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

  // Ecosystem-aware nav (eco-E4): initialize from the <html> attribute and
  // keep in sync with the toggle via the shared event bus (the toggle fires it
  // while the curtain covers, so the swap happens behind the transition). The
  // mount setState is deferred one macrotask so the effect body never calls it
  // synchronously (react-hooks rule).
  useEffect(() => {
    const apply = (next: string) => {
      if (next === "taller" || next === "tienda") setEcosystem(next);
    };
    const timer = window.setTimeout(() => {
      apply(document.documentElement.getAttribute("data-ecosystem") ?? "tienda");
    }, 0);
    const onEcosystemChange = (event: Event) => {
      const detail = (event as CustomEvent<{ ecosystem: string }>).detail;
      if (detail) apply(detail.ecosystem);
    };
    window.addEventListener(ECOSYSTEM_CHANGE_EVENT, onEcosystemChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(ECOSYSTEM_CHANGE_EVENT, onEcosystemChange);
    };
  }, []);

  // Unified nav click (redesign): intercept every item in both menus, close
  // the drawer, and hand the click coordinates + href to the curtain overlay,
  // which runs the ripple/container cover, then navigates. Reduced-motion and
  // no-JS keep working: no-JS never reaches this handler (native anchor), and
  // reduced-motion navigates immediately inside NavTransition (D5).
  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href?: string
  ) => {
    if (!href) return;
    event.preventDefault();
    setOpen(false);
    triggerNavTransition(event.clientX, event.clientY, href);
  };

  const renderNavItem = (item: NavItem) => {
    if (item.href) {
      return (
        <a
          key={item.label}
          href={item.href}
          onClick={(event) => handleNavClick(event, item.href)}
          className="font-futura text-base font-medium text-mar-brown/80 transition-colors hover:text-mar-brown"
        >
          {item.label}
        </a>
      );
    }
    return (
      <span
        key={item.label}
        className="flex items-center gap-2 font-futura text-base text-mar-brown/40"
        aria-disabled="true"
      >
        {item.label}
        <span className="rounded-full border border-mar-brown/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-mar-brown/40">
          próximamente
        </span>
      </span>
    );
  };

  // Ecosystem-aware nav sets: the workshop world swaps the whole nav (eco-E4).
  const desktopItems =
    ecosystem === "taller" ? NAV_ITEMS_TALLER_DESKTOP : NAV_ITEMS_DESKTOP;
  const mobileItems =
    ecosystem === "taller" ? NAV_ITEMS_TALLER_MOBILE : NAV_ITEMS_MOBILE;

  return (
    <>
      <header ref={headerRef} className="site-header fixed inset-x-0 top-0 z-50">
        {/* Background layer fades in once scrolled (transform/opacity only). */}
        <div
          aria-hidden="true"
          className="site-header__bg absolute inset-0 border-b border-mar-brown/10 bg-[var(--theme-bg)]/90 backdrop-blur-md"
        />

        <div className="relative mx-auto flex min-h-14 max-w-6xl items-center justify-center gap-4 px-6 py-3.5">
          {/* Desktop navigation (md+): truly centered; the theme toggle and
              the mobile controls sit absolutely at the right edge. */}
          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-6 md:flex"
          >
            {desktopItems.map(renderNavItem)}
          </nav>

          {/* Desktop controls (md+): dark/light mode + ecosystem toggles */}
          <div className="absolute right-6 hidden items-center gap-1 md:flex">
            <ThemeModeToggle />
            <EcosystemToggle />
          </div>

          {/* Mobile bar: dark/light + ecosystem toggles + drawer toggle (single
              contact lives in the FloatingWhatsApp widget) */}
          <div className="absolute right-6 flex items-center gap-1 md:hidden">
            <ThemeModeToggle />
            <EcosystemToggle />
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
            {mobileItems.map(renderNavItem)}
          </nav>
        </div>
      </header>

      {/* Curtain transition overlay — sibling of <header>, not a descendant,
          so `fixed` stays viewport-relative (see component docs). */}
      <NavTransition />
    </>
  );
}
