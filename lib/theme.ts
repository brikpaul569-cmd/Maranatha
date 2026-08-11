/**
 * Theme + ecosystem mechanism (st-R1–R6, eco-E1–E6).
 *
 * Two independent axes live on <html>:
 *
 * 1. Session themes: curated themes applied via CSS custom properties on
 *    <html data-theme="tN">. Purely decorative and session-scoped; content,
 *    links, and SSR markup never depend on the active theme. Palettes come
 *    from PROJECT-BRIEF-02 §4 (t1..t4); the CSS values live in app/globals.css
 *    as `[data-theme="t1..t4"]` blocks overriding --theme-bg/--theme-accent
 *    (D2).
 *
 * 2. Theme mode (restored dark/light, user decision): `data-theme-mode`
 *    "light"|"dark" on <html>, driven by the sun/moon toggle. Applies to BOTH
 *    ecosystems — an in-place palette flip (color transitions only, no
 *    navigation, no curtain). Persisted in localStorage
 *    (`maranatha-theme-mode`) with a prefers-color-scheme fallback; applied
 *    pre-paint via getThemeModeInitScript().
 *
 * 3. Ecosystem: `data-ecosystem` "tienda"|"taller" on <html>, driven by the
 *    round scissors toggle. It swaps the WHOLE site between the pastel shop
 *    ("tienda") and a completely different pastel workshop world ("taller")
 *    behind the curtain transition. The choice lives in localStorage
 *    (`maranatha-ecosystem`), is applied pre-paint via getEcosystemInitScript(),
 *    and the taller palettes live in app/globals.css as
 *    `:root[data-ecosystem="taller"]` / `:root[data-ecosystem="taller"][data-theme-mode="dark"]`
 *    blocks (they sit after the session-theme blocks so the ecosystem wins
 *    over decorative session tints).
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

/** localStorage key for the persisted dark/light mode (both ecosystems). */
export const THEME_MODE_STORAGE_KEY = "maranatha-theme-mode";

/** Window event name dispatched when the theme mode changes (toggles sync). */
export const THEME_MODE_CHANGE_EVENT = "maranatha:theme-mode-change";

/**
 * Reads the stored theme mode (validated); falls back to the OS preference
 * when absent or unavailable.
 */
export function readThemeMode(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(THEME_MODE_STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Pre-paint inline script (preventing-flash-before-hydration pattern): reads
 * `maranatha-theme-mode` and sets `data-theme-mode` on <html> before first
 * paint — no flash of the wrong mode. Falls back to prefers-color-scheme;
 * wrapped in try/catch so privacy mode (no localStorage) degrades to the
 * :root defaults.
 */
export function getThemeModeInitScript(): string {
  return `(function(){try{var m=localStorage.getItem(${JSON.stringify(
    THEME_MODE_STORAGE_KEY
  )});if(m!=="dark"&&m!=="light"){m=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme-mode",m)}catch(e){document.documentElement.setAttribute("data-theme-mode","light")}})()`;
}

/**
 * Ecosystem (eco-E1–E6): "tienda" is the existing pastel shop (default); the
 * round scissors toggle switches to "taller", a pastel flower-workshop world
 * (see the taller palettes in app/globals.css).
 */
export const ECOSYSTEMS = ["tienda", "taller"] as const;

export type Ecosystem = (typeof ECOSYSTEMS)[number];

/** localStorage key for the persisted ecosystem choice. */
export const ECOSYSTEM_STORAGE_KEY = "maranatha-ecosystem";

/** Window event name dispatched when the ecosystem changes (header + toggles). */
export const ECOSYSTEM_CHANGE_EVENT = "maranatha:ecosystem-change";

/** Reads the stored ecosystem (validated); "tienda" when absent/unavailable. */
export function readEcosystem(): Ecosystem {
  if (typeof window === "undefined") return "tienda";
  const stored = window.localStorage.getItem(ECOSYSTEM_STORAGE_KEY);
  return stored === "taller" ? "taller" : "tienda";
}

/**
 * Pre-paint inline script (preventing-flash-before-hydration pattern): reads
 * `maranatha-ecosystem` and sets `data-ecosystem` on <html> before first
 * paint — no flash of the wrong ecosystem (eco-E3). Wrapped in try/catch so
 * privacy mode (no localStorage) degrades to the default "tienda".
 */
export function getEcosystemInitScript(): string {
  return `(function(){try{var e=localStorage.getItem(${JSON.stringify(
    ECOSYSTEM_STORAGE_KEY
  )});if(e!=="tienda"&&e!=="taller"){e="tienda"}document.documentElement.setAttribute("data-ecosystem",e)}catch(err){document.documentElement.setAttribute("data-ecosystem","tienda")}})()`;
}
