"use client";

import { useLayoutEffect } from "react";
import type { ReactNode } from "react";
import {
  THEME_STORAGE_KEY,
  readEcosystem,
  readThemeMode,
} from "@/lib/theme";

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * Client re-apply of the session theme, the theme mode and the ecosystem
 * (st-R3/R4, eco-E6, D2 dev caveat).
 *
 * In development, React StrictMode remounts components and resets the
 * attributes React manages on <html>, clearing the ones the pre-paint scripts
 * set. This effect re-applies all three before paint. In production it is a
 * no-op: the inline script results stay intact and nothing here touches the
 * DOM.
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  useLayoutEffect(() => {
    try {
      const theme = window.sessionStorage.getItem(THEME_STORAGE_KEY);
      if (theme) {
        document.documentElement.setAttribute("data-theme", theme);
      }
    } catch {
      // sessionStorage unavailable (e.g. privacy mode) — :root defaults apply.
    }
    try {
      document.documentElement.setAttribute("data-ecosystem", readEcosystem());
    } catch {
      // localStorage unavailable (e.g. privacy mode) — tienda defaults apply.
    }
    try {
      document.documentElement.setAttribute(
        "data-theme-mode",
        readThemeMode()
      );
    } catch {
      // localStorage unavailable (e.g. privacy mode) — light mode applies.
    }
  }, []);

  return <>{children}</>;
}
