/**
 * Session-theme mechanism (st-R1–R6): curated themes applied via CSS custom
 * properties on <html data-theme="tN">. Purely decorative and session-scoped;
 * content, links, and SSR markup never depend on the active theme.
 *
 * Palettes come from PROJECT-BRIEF-02 §4:
 *   t1 Amanecer pastel (rosa + durazno)
 *   t2 Jardín (verde salvia + crema)
 *   t3 Atardecer romántico (rosa intenso + dorado)
 *   t4 Minimal crema (beige + blanco roto)
 *
 * The CSS values for each theme live in app/globals.css as
 * `[data-theme="t1..t4"]` blocks overriding --theme-bg/--theme-accent (D2).
 */

export const THEME_IDS = ["t1", "t2", "t3", "t4"] as const;

export type ThemeId = (typeof THEME_IDS)[number];

/** Current session theme (stable across same-session navigations). */
export const THEME_STORAGE_KEY = "mar-th";

/** Previous pick, used to avoid two consecutive sessions with the same theme. */
export const THEME_PREV_STORAGE_KEY = "mar-th-prev";

/**
 * Pre-paint inline script (preventing-flash-before-hydration pattern):
 * runs synchronously while the HTML parses, before first paint, and sets
 * `data-theme` on <html> — no flash of the default theme (st-R3).
 *
 * Reads `mar-th`; if absent, picks a random theme excluding the previous one
 * (st-R2), then persists both keys. Wrapped in try/catch so privacy mode
 * (no sessionStorage) degrades to the :root defaults (st-R2 fallback).
 */
export function getThemeInitScript(): string {
  return `(function(){try{var s=window.sessionStorage,ids=${JSON.stringify(
    THEME_IDS
  )},prev=s.getItem(${JSON.stringify(THEME_PREV_STORAGE_KEY)}),cur=s.getItem(${JSON.stringify(
    THEME_STORAGE_KEY
  )}),t;if(cur&&ids.indexOf(cur)>-1){t=cur}else{var pool=prev?ids.filter(function(id){return id!==prev}):ids;t=pool[Math.floor(Math.random()*pool.length)]}s.setItem(${JSON.stringify(
    THEME_STORAGE_KEY
  )},t);s.setItem(${JSON.stringify(THEME_PREV_STORAGE_KEY)},t);document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
}
