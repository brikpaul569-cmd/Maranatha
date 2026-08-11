import { getThemeInitScript } from "@/lib/theme";

/**
 * Server component rendering the pre-paint theme scripts inside <head>
 * (design D2, preventing-flash-before-hydration pattern). The inline scripts
 * run synchronously during HTML parsing — before first paint — so the session
 * theme AND the dark/light mode are applied with no flash (st-R3).
 *
 * The root layout does not re-render on client-side navigations, so these
 * scripts run once on full page loads; <html data-theme> persists for the
 * whole session (st-R4).
 */

/** Pre-paint dark/light mode: stored choice wins, else prefers-color-scheme. */
const MODE_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem("maranatha-theme-mode");if(m!=="dark"&&m!=="light"){m=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme-mode",m);}catch(e){document.documentElement.setAttribute("data-theme-mode","light");}})();`;

export default function ThemeInit() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
      <script dangerouslySetInnerHTML={{ __html: MODE_INIT_SCRIPT }} />
    </>
  );
}
