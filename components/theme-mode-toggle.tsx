"use client";

import { useEffect, useState } from "react";

/**
 * Dark/light mode toggle (user direction): a bare moon/sun glyph — no boxed
 * background. Flips `data-theme-mode` on <html> (the whole palette is
 * var-backed, so no component needs touching), persists the choice in
 * localStorage, and adds a short color transition for a clean, smooth switch.
 *
 * The pre-paint script in ThemeInit applies the stored/default mode before
 * first paint, so there is no flash (FOUC-free).
 */

const STORAGE_KEY = "maranatha-theme-mode";

function readMode(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5"
      aria-hidden
    >
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      className="size-5"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

export default function ThemeModeToggle() {
  // Lazy initializer reads the stored/system mode on the client; the button
  // carries suppressHydrationWarning because the server can only render the
  // default (light) icon while the stored mode may be dark (the pre-paint
  // script already flipped <html data-theme-mode> before hydration).
  const [dark, setDark] = useState<boolean>(() => readMode() === "dark");

  const toggle = () => {
    const next = !dark;
    setDark(next);
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.setAttribute("data-theme-mode", next ? "dark" : "light");
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // Storage unavailable (private mode): the toggle still works this visit.
    }
    window.setTimeout(() => root.classList.remove("theme-transition"), 400);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      suppressHydrationWarning
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      aria-pressed={dark}
      className="inline-flex size-9 items-center justify-center text-mar-brown/80 transition-colors hover:text-mar-gold"
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
