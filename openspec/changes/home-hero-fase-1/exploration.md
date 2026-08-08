# Exploration: Fase 1 — Home + Hero + Design System (change: `home-hero-fase-1`)

Scope per PROJECT-BRIEF.md §12 (Fase 1, 1-2 weeks): Home + Hero with full GSAP animation, header/nav, footer, and the base component system (buttons, cards). Art direction: "Collage Flotante" (PROJECT-BRIEF-05). Motion philosophy: PROJECT-BRIEF 04.

## 1. Current State (as-built, verified by reading the repo)

Single-route SSG home. `openspec/changes/` has only `archive/`; `openspec/specs/` is empty — this is the FIRST change. No git repo yet.

| File | What it is today |
|---|---|
| `app/layout.tsx` | Root layout: `next/font` Fraunces (`--font-display`) + Inter (`--font-sans`), `lang="es"`, title template `%s \| Detalles Maranatha`, wraps children in `<SmoothScroll>`. **No header, no footer, no preloader, no theme mechanism.** |
| `app/page.tsx` | Server component. Hero-only: `FloatingCollage` (3 SVG placeholders, speeds 1.2/-0.6/0.7) + giant Fraunces H1 inside `Reveal` + eyebrow + inline WhatsApp CTA `<a>`. Background hardcoded `bg-mar-cream`. `WHATSAPP_URL` is a **placeholder** (`wa.me/573000000000`, TODO comment). |
| `app/globals.css` | Tailwind v4 `@import` + `:root` palette (`--color-mar-*`, 7 tokens) + section moods (`--mood-*`, 6 tokens) + `@theme inline` mapping (`--color-mar-*`, `--color-mood-*`, fonts). Global `prefers-reduced-motion` override (0.01ms). **No component classes, no button/card/section utilities.** |
| `components/smooth-scroll.tsx` | "use client". Lenis + GSAP ScrollTrigger, `gsap.ticker` sync, `respectReducedMotion`, `matchMedia` listener. **No anchor-scroll API** (`lenis.scrollTo`) — needed once a nav exists. |
| `components/reveal.tsx` | "use client". ScrollTrigger fade-up (`autoAlpha` + `y`, once, "top 85%"), reduced-motion guard. **Fade only — no SplitType, no blur, no line masks.** |
| `components/floating-collage.tsx` | "use client". `gsap.matchMedia()` ≥768px scrub parallax (`yPercent` ±20×speed). **Scroll parallax only — no entrance choreography (scale 1.08→1, stagger).** |
| `public/placeholders/*.svg` | 3 flat pastel card SVGs (flower, ribbon, gift) using brand colors — not real photography. Fine for Fase 1 hero composition. |
| `package.json` | next 16.3.0, react 19.2.8, gsap 3.15.0, lenis 1.3.26. **No `split-type`** (verified in node_modules). No icon library. No test framework (`strict_tdd: false`). |
| `tsconfig.json` | strict, `@/*` → `./*`, bundler resolution. `next.config.ts` empty defaults. |

Build/lint are green (per sdd-init observation #301: Turbopack build works now that Smart App Control is disabled; `build:webpack` documented fallback).

## 2. Design Intent (from briefs) for the Fase 1 Scope

### Hero (brief 04 §2.1, brief 05 §3.4 + §4.2)
- **Preloader**: clean brand-color screen; SVG logo stroke draws itself; **max 1.5s with skip option**; background uses the session theme (brief 05 §4.1). Brief 04 shows `drawSVG` syntax, but the locked decision is open-source GSAP only → implement with `stroke-dashoffset`/`stroke-dasharray` (core GSAP), NOT DrawSVGPlugin.
- **Headline**: SplitType split **by lines**, lines rise from below with initial **blur** (cinematic magazine reveal); giant Fraunces `clamp(3rem,12vw,9rem)` + `font-variation-settings` for optical weight; hero mood **rosa pastel `#F7C9D6`** (`--mood-hero` token already exists).
- **Collage**: dominant arrangement enters scale 1.08→1 (fade+scale, **≤0.8s**); satellites stagger 50-80ms; desktop-only optional mouse micro-parallax via `gsap.matchMedia()`.
- **Composition rules**: 3-5 images max, unbalanced (dominant ~55-60% width + edge satellites, distinct z-index), ≥60% air, soft drop-shadows, never obstruct CTA. Mobile: 2-3 images, dominant full-width, parallax off.
- **SEO rule**: giant headline is real server-rendered HTML; reveal only animates, never hides content.

### Header/nav (brief 1 §6, brief 04 §1.1)
- Not fixed or semi-fixed with a transition on scroll. Items: Inicio · Nosotros · Catálogo (submenu by category) · Galería · Contacto + **"Pedir por WhatsApp" CTA always visible**.
- "Diseño invisible": menus simplified until needed (fits a mobile-first drawer). Mobile breakpoint and drawer anatomy are NOT specified in the briefs — open decision.

### Footer (brief 1 §6)
- Social networks (Instagram, TikTok, WhatsApp), business hours, delivery coverage (`/domicilios/...` Bogotá zones per brief 03), mini-site-map. Legal line is NOT specified — open decision.

### Design system (brief 1 §12, brief 04 §1.1 + §2.3)
- **Buttons**: WhatsApp CTA primary (deep-link, pre-filled message per product later); liquid/magnetic hover micro-interaction (desktop only).
- **Cards**: tilt/scale hover + price/name reveal (catalog is Fase 2 — Fase 1 likely defines the primitive + any home cards).
- **Section shells**: mood via CSS variables on the section container (mechanism already tokenized), 60% air, generous negative space.
- **Typography pattern**: serif giant display + small sans UI labels with wide letter-spacing (eyebrow).
- **Session themes** (brief 02 §4): 4-6 curated themes, random per session, never repeat consecutively, `sessionStorage` only, applied via CSS variables on `<html>`, purely decorative. Brief 05 §4.1 makes the **preloader background depend on the session theme** — so at least a minimal theme mechanism is required by the hero.

### WhatsApp CTA behavior (brief 02 §2.4, brief 04 §3)
- Floating widget global, message pre-filled ("Hola 👋 Qué deseas comprar hoy!"), thumb-zone bottom on mobile (one-hand reach). Deep links per product come with Fase 2.

## 3. Gaps: Current vs. Fase 1 Needs

1. **`split-type` not installed** — locked decision requires open-source SplitType (premium SplitText is excluded). New dependency needed.
2. **No preloader** — must be created; stroke draw via `stroke-dashoffset` (core GSAP); ≤1.5s; skip button; session-theme background.
3. **No header/nav** — must be created; needs Lenis anchor integration (`lenis.scrollTo`) which doesn't exist yet; mobile drawer unspecified.
4. **No footer** — must be created; contact data and social handles don't exist anywhere yet.
5. **Design system primitives missing** — no `Button` (page inlines an `<a>`), no `Card`, no `Section` shell, no eyebrow/UI-label primitive. Tailwind v4 `@theme inline` only maps colors/fonts.
6. **Mood tokens defined but unused** — page hardcodes `bg-mar-cream`; hero must apply `--mood-hero` (rosa pastel) via the section-shell mechanism.
7. **WhatsApp number is a placeholder** (`573000000000`) — must be resolved or moved to a config constant before launch; footer/nav/CTA all consume it.
8. **Session-theme mechanism absent** — preloader needs it; no provider exists; "apply before first paint" (brief 03 §3.2) suggests an inline script vs `useEffect` tradeoff.
9. **Reveal primitive insufficient** — no line-mask/blur reveal; hero needs a SplitType-by-lines reveal (new component or enhanced Reveal).
10. **Collage entrance missing** — only scroll parallax; needs scale 1.08→1 + stagger choreography on load.
11. **No icon library** — brief 1 lists Lucide React; footer/nav/CTA could use it or inline SVGs (open decision; every dependency adds weight per brief 03 §3.2).
12. **Accessibility patterns absent** — nav drawer needs `aria-expanded`, focus management, ESC close.
13. **LocalBusiness schema** (brief 02 §3.4) is roadmap Fase 3 — confirm it stays OUT of Fase 1 scope.

## 4. Open Decisions (to resolve in sdd-propose or with the user)

- **Real WhatsApp number** — blocked on business input; TODO in code.
- **Nav link strategy in Fase 1** — only Home exists; Nosotros/Catálogo/Galería/Contacto routes are Fase 2/3. Anchor links to home sections vs. placeholder links vs. shipping dead links.
- **Preloader gating** — every page load vs. once per session (`sessionStorage`); skip button always visible?
- **Theme mechanism scope** — minimal provider (required for preloader) vs. full 4-6 theme rotation in Fase 1; inline pre-paint script vs `useEffect` flash tradeoff.
- **Floating WhatsApp widget** — include in Fase 1 (it's conversion-critical, thumb-zone mobile pattern) or defer.
- **Icon library** — `lucide-react` dependency vs. inline SVGs (weight budget <1.5 MB home).
- **Footer legal line** — briefs silent; propose copyright + "hecho a mano" line.
- **Header mobile breakpoint / drawer anatomy** — briefs silent; propose 768px matchMedia sync.
- **Card anatomy** — catalog is Fase 2; Fase 1 Card primitive scope (image + title + price placeholder + WhatsApp mini-CTA?) needs definition.
- **Page transitions** (brief 05 §4.5) — multi-route concern; confirm deferred beyond Fase 1.

## 5. Tech Constraints (locked — non-negotiable)

- Mobile-first (>80% mobile in Colombia); `gsap.matchMedia()` disables parallax/pinning on mobile.
- `prefers-reduced-motion`: all animations off, transitions instant.
- Animate **only** `transform`/`opacity` (CLS < 0.05); transitions ≤ 0.8s; preloader ≤ 1.5s.
- Performance (mobile): LCP < 2.0s, INP < 150ms, CLS < 0.05, Lighthouse ≥ 90, home < 1.5 MB transferred.
- No heavy hero video on mobile — image/parallax/SVG instead; all media via `next/image` with `priority` only on hero image.
- Content server-rendered; GSAP only in `"use client"`; never hide content behind JS-only animation (SEO).
- Tailwind v4 CSS-first: brand tokens as CSS variables mapped via `@theme inline` (`--color-mar-*`, `--color-mood-*`); fonts via `next/font` only.
- Session themes: `sessionStorage` only, purely decorative.
- Open-source GSAP only: core + ScrollTrigger + Flip + SplitType; NO Club GreenSock premium plugins (DrawSVGPlugin/SplitText excluded even though the .js files ship in the npm dist).
- Next.js 16.3 has breaking changes vs. training data — read `node_modules/next/dist/docs/` before writing code (AGENTS.md enforced).
- Build: `npm run build` (Turbopack) works; `npm run build:webpack` fallback. Lint: `npm run lint`.
- Not a git repo; propose `git init` (roadmap §12) before versioning work.

## 6. Approaches

### A. Hero headline reveal
| Option | Pros | Cons | Effort |
|---|---|---|---|
| **SplitType by lines + mask + blur** (recommended) | Matches briefs exactly; line masks give cinematic rise; SplitType is tiny (~3KB) | New dep; SSR-safe wrapper needed | Med |
| Enhance existing `Reveal` to accept split mode | No new component | Blurs responsibilities; word-level heavier than needed | Med |
| Keep fade-up only | Zero work | Fails the "wow 3 seconds" requirement | Low |

### B. Preloader
| Option | Pros | Cons | Effort |
|---|---|---|---|
| **Session-gated, ≤1.5s, stroke-dashoffset, skip button** (recommended) | Matches briefs; not annoying on repeat; theme bg ready | Complexity of gating + skip | Med |
| Every-load preloader | Simplest | Hurts LCP/perceived performance; briefs say "máx" | Low |

### C. Design system
| Option | Pros | Cons | Effort |
|---|---|---|---|
| **React primitives: Button, Card, Section shell, Eyebrow, FloatingWhatsApp** (recommended) | SSR-safe, reusable across Fase 2/3, Tailwind-composed | More files | Med |
| CSS component classes in `@layer components` | Less JS | Harder to extend per-instance; mixing patterns | Low-Med |

### D. Session theme mechanism
| Option | Pros | Cons | Effort |
|---|---|---|---|
| **Minimal client provider in layout (theme rotation, sessionStorage, CSS vars on `<html>`)** (recommended) | Required by preloader; cheap; brief 02 §4 spec | Small inline script or brief pre-paint flash | Low-Med |
| Defer to later phase | Less scope now | Preloader can't show theme bg; brief 05 §4.1 violated | Low |

### E. Header nav in Fase 1
| Option | Pros | Cons | Effort |
|---|---|---|---|
| **Render only real destinations (Inicio anchor + WhatsApp CTA) + muted placeholders for future routes** (recommended) | No dead links, no 404 risk | Nav looks sparse; needs user sign-off | Med |
| Full nav with all brief items linking to future routes | Matches brief 1 §6 visually | Broken links until Fase 2/3 | Low |

## 7. Recommendation

Fase 1 ships: `split-type` install + a `lib/constants.ts` (WhatsApp URL/number) + **session-theme provider** (minimal) + **Preloader** (session-gated, stroke-dashoffset draw, skip, theme background) + **reworked Hero** (SplitType line reveal with blur, collage entrance scale/stagger, `--mood-hero` applied via Section shell, desktop-only mouse micro-parallax via `matchMedia`, WhatsApp CTA) + **Header** (semi-fixed with scroll transition, mobile drawer, no dead links) + **Footer** (socials, hours, Bogotá coverage, mini-sitemap, legal line) + **design-system primitives** (Button variants, Card, Section shell, Eyebrow, FloatingWhatsApp widget) + accessibility (focus management, aria, ESC close).

Approaches A-E above as recommended; user sign-off needed on the WhatsApp number and the header nav-link strategy (Section 4).

## 8. Risks

- **Review budget**: Fase 1 comfortably exceeds the 400-line PR budget — sdd-tasks MUST forecast chained PRs (delivery strategy is `ask-on-risk`; split into work units: tokens/foundation → preloader+hero → header/footer → DS primitives).
- **WhatsApp number missing** — placeholder in code; cannot ship launch-blocking copy until resolved.
- **LCP risk**: preloader + GSAP bundle + theme script must not delay LCP past 2.0s; hero image `priority`; measure Lighthouse mobile per brief 05 §7.
- **Premium plugin trap**: dist ships SplitText/DrawSVGPlugin .js files; must NOT use them (license + locked decision) — use SplitType + `stroke-dashoffset`.
- **Next.js 16.3 breaking changes** — consult `node_modules/next/dist/docs/` before code; do not rely on training-data APIs.
- **Dead nav links** if Fase 1 routes don't exist — resolve link strategy before building.
- **No git repo** — review/diff workflow blocked until `git init` (propose per roadmap §12).
- **No test framework** — verify phase = lint + build + Lighthouse checks only.

## 9. Ready for Proposal

**Yes.** Orchestrator should tell the user: exploration complete; Fase 1 scope confirmed as Home+Hero+Header+Footer+Design System with `split-type` install and a minimal session-theme provider; two inputs needed before/when writing the proposal — (1) the real WhatsApp number, (2) header nav link strategy for routes that don't exist until Fase 2/3.
