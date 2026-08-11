"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import {
  THEME_MODE_CHANGE_EVENT,
  THEME_MODE_STORAGE_KEY,
  readThemeMode,
} from "@/lib/theme";

/**
 * Dark/light mode toggle (user decision): a bare moon/sun glyph — no boxed
 * background. Flips `data-theme-mode` on <html> in-place (the whole palette is
 * var-backed, so no component needs touching), persists the choice in
 * localStorage, and adds a short color transition for a clean, smooth switch.
 * It is a pure palette flip — no navigation, no curtain (the curtain belongs
 * to the ecosystem scissors toggle).
 *
 * Applies to BOTH ecosystems: the `:root[data-theme-mode="dark"]` baseline
 * darkens the tienda, and the `:root[data-ecosystem="taller"][data-theme-mode="dark"]`
 * combo darkens the taller world with its own lavender-night palette.
 *
 * The pre-paint script in layout.tsx applies the stored/default mode before
 * first paint (no flash). Icon visibility is CSS-driven by the attribute
 * (`html[data-theme-mode='dark']`), so the server and client always render
 * identical markup — no hydration mismatch, and the glyph reflects the real
 * mode even before React takes over.
 *
 * Two instances are mounted (desktop + mobile). The icons self-sync via CSS;
 * only the aria state needs a bus: on click we dispatch
 * `maranatha:theme-mode-change` so the sibling instance flips its
 * aria-label/aria-pressed too.
 */

function MoonIcon({ className }: { className?: string }) {
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
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

export default function ThemeModeToggle() {
  const [dark, setDark] = useState(false);

  // Re-apply the attribute after React clears it on the dev StrictMode remount
  // (Next.js guide: "Re-applying attributes in development"). No-op in
  // production; never touches React state, so it stays INP-safe and lint-clean.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme-mode", readThemeMode());
  }, []);

  // Keep this toggle's aria state in sync with the other mounted instance and
  // with the persisted/OS-preference mode. On mount the setState is deferred
  // one macrotask so the effect body never calls it synchronously
  // (react-hooks rule).
  useEffect(() => {
    const timer = window.setTimeout(
      () => setDark(readThemeMode() === "dark"),
      0
    );
    const onThemeModeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ dark: boolean }>).detail;
      if (detail && typeof detail.dark === "boolean") {
        setDark(detail.dark);
      }
    };
    window.addEventListener(THEME_MODE_CHANGE_EVENT, onThemeModeChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(THEME_MODE_CHANGE_EVENT, onThemeModeChange);
    };
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme-mode") !== "dark";
    setDark(next);
    root.classList.add("theme-transition");
    root.setAttribute("data-theme-mode", next ? "dark" : "light");
    try {
      window.localStorage.setItem(
        THEME_MODE_STORAGE_KEY,
        next ? "dark" : "light"
      );
    } catch {
      // Storage unavailable (private mode): the toggle still works this visit.
    }
    window.dispatchEvent(
      new CustomEvent<{ dark: boolean }>(THEME_MODE_CHANGE_EVENT, {
        detail: { dark: next },
      })
    );
    window.setTimeout(() => root.classList.remove("theme-transition"), 400);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={dark}
      className="inline-flex size-9 items-center justify-center text-mar-brown/80 transition-colors hover:text-mar-gold"
    >
      <SunIcon className="hidden size-5 [html[data-theme-mode='dark']_&]:block" />
      <MoonIcon className="size-5 [html[data-theme-mode='dark']_&]:hidden" />
    </button>
  );
}
