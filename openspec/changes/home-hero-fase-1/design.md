# Design: Fase 1 — Home + Hero + Design System (`home-hero-fase-1`)

## Technical Approach

SSG home rebuilt around an **event-driven entrance pipeline**: a session-gated preloader (stroke-draw overlay, `sessionStorage`) dispatches a `window` CustomEvent on exit; the hero headline (SplitType line reveal + blur) and collage entrance (scale 1.08→1 + stagger) subscribe and play exactly once — immediately when the preloader is skipped. Session theme applies pre-paint via an inline `<head>` script (Next 16.3 documented pattern) driving `[data-theme]` CSS-variable blocks. Header/footer/CTAs share `lib/constants.ts`. All GSAP lives in `"use client"`; content is server-rendered and never JS-hidden.

APIs verified against `node_modules/next/dist/docs/` (16.3): `next/image` `priority` is **deprecated → use `preload`** (`02-components/image.md`); inline pre-paint script + `suppressHydrationWarning` per `preventing-flash-before-hydration.md`; `Link` hash semantics confirmed (`02-components/link.md`); `next lint` removed (project uses `eslint` directly — OK).

## Architecture Decisions

### D1 — Preloader→hero coordination (hero-home "Entrance sequencing after preloader")

**Choice**: `lib/entrance.ts` — module singleton dispatching `window` CustomEvent `maranatha:entrance`, with a module-level `fired` flag and a subscriber fallback timer.
**Alternatives**: React context/provider tree (crosses RSC boundary, re-render cost for a one-shot signal); DOM attribute + polling (race-prone); callback prop drilling (components in separate subtrees).
**Rationale**: the preloader owns the signal — it dispatches on exit OR immediately on mount when skipped (session-gate hit / reduced-motion). Subscribers get "exactly once" free (`fired` flag + `once`); a 1.8s fallback timer guarantees the entrance even if the preloader crashes. Client-only, SSR-safe.

```
Preloader: mounted → (skip? | draw ≤1.5s | user skip) → signal() → overlay unmount
Hero:      mounted → wait signal → entrance once → done
```

Skipped path: signal fires synchronously from the preloader effect when gated out → hero plays on load (scenario "Skipped preloader").

### D2 — Session-theme pre-paint (session-themes "Pre-paint application")

**Choice**: inline `<script>` in root layout `<head>` (`dangerouslySetInnerHTML`) + `suppressHydrationWarning` on `<html>` — exact pattern from `preventing-flash-before-hydration.md`.
**Alternatives**: external script file (extra request, not guaranteed pre-paint); provider `useEffect` (post-hydration flash — the anti-goal); `next/script beforeInteractive` (heavier).
**Rationale**: runs synchronously during HTML parsing → before first paint; ~0.5KB; `try/catch` around `sessionStorage` (privacy mode). Reads `mar-th`; absent → random pick excluding `mar-th-prev` (no consecutive repeat), sets `data-theme` on `<html>`, persists both. Themes = `[data-theme="t1..t4"]` blocks in `globals.css` overriding `--theme-bg`/`--theme-accent`; preloader background = `var(--theme-bg)` (preloader "Session-theme background"). Documented dev caveat: StrictMode remount clears `<html>` attrs → `theme-provider.tsx` re-applies in `useLayoutEffect` (no-op in prod).

### D3 — Component architecture

**Choice**: flat `components/*` page blocks (existing convention) + `components/ui/*` primitives + `lib/*` logic/constants. Server by default; `"use client"` only where GSAP/interactivity is required:

| File | Boundary | Why |
|---|---|---|
| `site-footer`, `floating-whatsapp`, `ui/{button,card,section,eyebrow,icons}`, `theme-init` | Server | pure markup + constants; CSS-only hover |
| `preloader`, `hero-home`, `split-reveal`, `site-header`, `theme-provider`, `smooth-scroll`, `floating-collage` | Client | GSAP, drawer state, Lenis, event bus |

**Alternatives**: modify `reveal.tsx` to add split mode (proposal's list) — rejected: different trigger (entrance event vs ScrollTrigger) and mechanics (SplitType+blur vs fade); new `split-reveal.tsx` keeps `reveal.tsx`'s scroll semantics intact.

### D4 — SplitType SSR-safe wrapper (hero-home "SplitType line reveal with blur")

**Choice**: `split-reveal.tsx` ("use client"): server renders the plain H1 (SEO, "Server-rendered headline"); `useLayoutEffect` splits with `new SplitType(el, { types: "lines" })` synchronously (no unsplit flash); lines masked (`overflow:hidden`) animate `yPercent` ~110→0 + `opacity` 0→1 + `filter: blur(8px)→0`, stagger 0.06–0.08s, total ≤0.8s, `power4.out`.
**Reduced-motion**: no split — plain text visible instantly ("Static hero"). **Cleanup**: `ctx.revert()` + `split.revert()` (restores DOM). **CLS**: transform/opacity are layout-free; `filter` blur is paint-only (no layout) so CLS < 0.05 holds — it is confined to the entrance and killed by the global reduced-motion override. **No-JS**: never splits; headline visible.

### D5 — Header drawer + Lenis anchors (site-header "Mobile drawer accessibility" / "Lenis anchor scrolling")

**Choice**: breakpoint 768px (matches `gsap.matchMedia` + proposal). Drawer stays mounted (SSR-safe), hidden via class + `inert` when closed; toggle `aria-expanded`/`aria-controls`; open → focus to first focusable, sibling content `inert`, Tab-cycling trap; ESC closes and returns focus to toggle; anchor select closes drawer. Slide via transform/opacity ≤0.3s.
**Lenis API**: `lib/lenis.ts` registry — `setLenis(instance)`, `clearLenis()`, `scrollToHash(hash, offset)` with native `scrollIntoView` fallback. Anchors `preventDefault()` only when Lenis is active → native jump without JS ("No-JS anchor"). Semi-fixed scroll transition: ScrollTrigger class toggle, translateY/opacity only, ≤0.8s.

### D6 — Design-system primitives (design-system spec)

- **Button**: variants `primary` (mar-brown/card), `whatsapp` (mar-gold + WA icon), `ghost` (outline); renders `<a href>` when href given, else `<button>`; WA variant deep-links via `waMeUrl()`. Hover = CSS translate/scale only (INP-safe; magnetic/liquid GSAP deferred — INP <150ms budget).
- **Card**: server anatomy — `next/image` (lazy, `sizes`), title, price placeholder ("Precio al WhatsApp"), WhatsApp mini-CTA ("Card primitive").
- **Section shell**: `mood` prop → `style={{ "--section-mood": "var(--mood-hero)" }}` on container; children use `bg-[var(--section-mood)]`; default padding + max-w for ~60% air ("Section shell with mood"; hero-home "Section mood via Section shell").
- **Eyebrow**: sans, uppercase, `tracking-[0.35em]` ("Eyebrow primitive").
- **FloatingWhatsApp**: server; mobile thumb-zone (`inset-x-4 bottom-4`, 56px target) / `bottom-6 right-6` desktop; pre-filled `WHATSAPP_DEFAULT_MESSAGE` ("FloatingWhatsApp widget").

### D7 — Footer coverage-link gap (site-footer "No dead coverage link")

**Choice**: **suppress** — `ROUTES.domiciliosBogota = null` in `lib/constants.ts` (with TODO); footer renders the link only when truthy.
**Alternatives**: build minimal `/domicilios/bogota` route (out of scope — brief 03 zones are their own phase); muted non-link (misleading — footer entries are expected to link).
**Rationale**: the spec's own "No dead coverage link" scenario names suppression as the compliant outcome; flipping the constant when the route ships is one line with zero markup churn.

### D8 — State/context (avoid over-engineering)

**Choice**: **zero React context**. Entrance = event bus; theme = DOM-level `data-theme` (no React state); drawer = local `useState`; all contact/nav data = `lib/constants.ts` single source.
**Rationale**: one-shot signals and decorative CSS need no provider tree; context would cross the RSC boundary with zero benefit. Every CTA (header, hero, footer, floating, card, button) consumes `WHATSAPP_NUMBER` (placeholder `573000000000` + `TODO(launch)` blocker), `waMeUrl(message?)`, `NAV_ITEMS` (future items flagged → muted "próximamente" non-links), `SOCIALS`, `HOURS`, `ROUTES` ("Single source of truth for contact data").

## Data Flow

```
[theme-init inline script <head>] → sessionStorage(mar-th, mar-th-prev) → <html data-theme>
        → globals.css [data-theme=*] → --theme-bg … → preloader bg / hero bg
[preloader (client)] ──exit/skip──> lib/entrance.signal() ──CustomEvent──> split-reveal + floating-collage entrance
[header anchors] ──lib/lenis.scrollTo()──> Lenis (registered by smooth-scroll)   [no Lenis → native anchor]
[header/footer/floating/cards] ──lib/constants.ts──> wa.me deep links
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `package.json` | Modify | add `split-type` |
| `lib/constants.ts` | Create | WhatsApp number/url builder, message, NAV_ITEMS, SOCIALS, HOURS, ROUTES (single source) |
| `lib/theme.ts` | Create | theme ids, storage keys, `getThemeInitScript()` builder |
| `lib/entrance.ts` | Create | entrance event bus |
| `lib/lenis.ts` | Create | Lenis registry + native fallback |
| `components/theme-init.tsx` | Create | server; inline pre-paint `<script>` |
| `components/theme-provider.tsx` | Create | client; dev StrictMode re-apply |
| `components/preloader.tsx` | Create | client; session gate, stroke-dashoffset draw, skip, signal, overlay mounts post-hydration |
| `components/hero-home.tsx` | Create | client; Section(mood-hero) + SplitReveal + collage + CTA; entrance subscriber |
| `components/split-reveal.tsx` | Create | client; SplitType line reveal with blur |
| `components/site-header.tsx` | Create | client; semi-fixed, drawer a11y, Lenis anchors |
| `components/site-footer.tsx` | Create | server; socials/hours/coverage (conditional)/sitemap/legal |
| `components/floating-whatsapp.tsx` | Create | server; thumb-zone widget |
| `components/ui/{button,card,section,eyebrow,icons}.tsx` | Create | server; primitives + inline SVGs |
| `components/smooth-scroll.tsx` | Modify | register Lenis in `lib/lenis.ts` |
| `components/floating-collage.tsx` | Modify | entrance choreography (scale/stagger); `priority`→`preload` (16.3 deprecation) |
| `app/layout.tsx` | Modify | ThemeInit, ThemeProvider, Preloader, Header, Footer, FloatingWhatsApp; `suppressHydrationWarning` on `<html>` |
| `app/page.tsx` | Modify | HeroHome + constants; remove hardcoded WHATSAPP_URL |
| `app/globals.css` | Modify | `[data-theme]` blocks, `:focus-visible`, `--section-mood` support |

## Interfaces / Contracts

```ts
// lib/entrance.ts (client)
export const ENTRANCE_EVENT = "maranatha:entrance";
export function signalEntranceReady(): void;                 // dispatch once (fired flag)
export function onEntranceReady(cb: () => void): () => void; // immediate if fired; 1.8s fallback; returns unsubscribe

// lib/lenis.ts (client)
export function setLenis(l: Lenis | null): void;
export function scrollToHash(hash: string, offset?: number): void; // lenis.scrollTo || scrollIntoView

// lib/constants.ts
export const WHATSAPP_NUMBER = "573000000000"; // TODO(launch): real number required
export function waMeUrl(message?: string): string; // https://wa.me/{number}?text={enc(message)}
export const WHATSAPP_DEFAULT_MESSAGE = "Hola 👋 Qué deseas comprar hoy!";
export const NAV_ITEMS: { label: string; href?: string; future?: boolean }[];
export const ROUTES = { domiciliosBogota: null as string | null }; // null → footer suppresses link
```

```html
<!-- theme-init.tsx output in <head>: sets data-theme on <html> before paint -->
<script dangerouslySetInnerHTML={{__html: getThemeInitScript()}} /> <!-- <1KB, try/catch sessionStorage -->
```

## Testing Strategy

No test runner installed (`strict_tdd: false`). Verification = lint + build + manual/Lighthouse checklist (verify phase):

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Lint/type | all new files | `npm run lint`; `npm run build` (fallback `build:webpack`) |
| Manual a11y | drawer aria-expanded, ESC, focus return; focus rings | keyboard pass in browser |
| Manual motion | reduced-motion instant; mobile no parallax; preloader ≤1.5s + skip; once/session gating | DevTools emulation |
| Manual SEO | JS-disabled: headline visible, no overlay, native anchors, coverage link absent | DevTools "disable JS" |
| E2E perf | Lighthouse mobile ≥90; LCP <2.0s; CLS <0.05; home <1.5MB | Lighthouse run on `/` |

## Threat Matrix

N/A — no routing, shell, subprocess, VCS/PR automation, executable-file classification, or process-integration boundary. The design adds no routes (coverage link suppressed) and no CLI/shell behavior.

## Migration / Rollout

No migration. Rollout: sessionStorage-keyed behavior degrades gracefully (fresh flag → preloader runs). Rollback per proposal: remove new components from layout/page, delete `components/{preloader,theme-provider,theme-init,hero-home,split-reveal,site-header,site-footer,floating-whatsapp,ui}/*` + `lib/*`, `npm uninstall split-type`.

## Open Questions

- [ ] Real WhatsApp number (launch blocker; placeholder `573000000000` ships with TODO)
- [ ] Exact hex values for the 4 session themes (mechanism designed; palettes chosen at apply from brief 02 §4 / brand tokens)
- [ ] Confirm 4 (vs 6) themes for Fase 1 — mechanism supports any count
