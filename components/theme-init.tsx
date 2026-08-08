import { getThemeInitScript } from "@/lib/theme";

/**
 * Server component rendering the pre-paint theme script inside <head>
 * (design D2, preventing-flash-before-hydration pattern). The inline script
 * runs synchronously during HTML parsing — before first paint — so the
 * session theme is applied with no flash (st-R3).
 *
 * The root layout does not re-render on client-side navigations, so this
 * script runs once on full page loads; <html data-theme> persists for the
 * whole session (st-R4).
 */
export default function ThemeInit() {
  return <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />;
}
