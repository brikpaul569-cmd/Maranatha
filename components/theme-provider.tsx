"use client";

import { useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { THEME_STORAGE_KEY } from "@/lib/theme";

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * Client re-apply of the session theme (st-R3/R4, D2 dev caveat).
 *
 * In development, React StrictMode remounts components and resets the
 * attributes React manages on <html>, clearing the one the pre-paint script
 * set. This effect re-applies it before paint. In production it is a no-op:
 * the inline script result stays intact and nothing here touches the DOM.
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
  }, []);

  return <>{children}</>;
}
