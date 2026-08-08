# Proposal: Fase 1 — Home + Hero + Design System (`home-hero-fase-1`)

## Intent

First change (`openspec/specs/` empty). Ships PROJECT-BRIEF.md §12 Fase 1: GSAP hero, preloader, header, footer, design-system primitives. Today's home is hero-only, hardcoded WhatsApp placeholder, no nav/theme. Goal: premium 3s impression (briefs 04/05) within locked SSG-SEO, mobile-first, <1.5MB budget. Inputs: exploration #304; decisions user-approved.

## Scope

### In Scope
- Install `split-type` (~3KB, open-source; premium plugins excluded)
- `lib/constants.ts`: WhatsApp placeholder `573000000000` (TODO) + nav config, single source of truth
- Session-theme provider (minimal): random rotation, no consecutive repeat, sessionStorage, CSS vars on `<html>`, decorative
- Preloader: session-gated, ≤1.5s, SVG stroke draw (`stroke-dashoffset`), skip, theme background
- Hero: SplitType line reveal + blur; collage entrance scale 1.08→1, 50-80ms stagger; `--mood-hero` via Section shell; desktop micro-parallax; WhatsApp CTA
- Header: semi-fixed scroll transition; real destinations only (Inicio anchor + WhatsApp CTA); future items muted "próximamente" (no dead links); mobile drawer (aria-expanded, ESC, focus)
- Footer: IG/TikTok/WhatsApp, hours, Bogotá coverage link, mini-sitemap, legal line
- Primitives: Button (incl. WhatsApp CTA), Card, Section shell, Eyebrow, FloatingWhatsApp (thumb-zone)
- Inline SVG icons (no lucide-react); Lenis `scrollTo` anchors

### Out of Scope
- Page transitions; theme picker; catalog/products; LocalBusiness schema; real WhatsApp number (documented placeholder)

## Capabilities

### New Capabilities
- `session-themes`: provider, rotation, pre-paint
- `preloader`: gating, stroke draw, skip, reduced-motion
- `site-header`: nav, drawer, a11y, Lenis anchors
- `site-footer`: socials, hours, coverage link, legal
- `hero-home`: SplitType reveal, collage entrance, mood shell, micro-parallax, CTA
- `design-system`: Button/Card/Section/Eyebrow/FloatingWhatsApp + WhatsApp constants

### Modified Capabilities
None (first change).

## Approach

Exploration §7, options A–E. GSAP in "use client" only; content server-rendered, never JS-hidden. SSR-safe SplitType wrapper; hero entrance follows preloader exit. Theme pre-paint via inline script. `gsap.matchMedia()` ≥768px; reduced-motion instant; transform/opacity only.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `package.json` | Modified | add `split-type` |
| `lib/constants.ts` | New | WhatsApp URL, nav config |
| `app/layout.tsx`, `app/page.tsx` | Modified | wire ThemeProvider/Preloader/Header/Footer/FloatingWhatsApp; Hero |
| `components/{preloader,theme-provider,header,footer,hero}.tsx`, `ui/*`, `icons/*` | New | blocks, primitives, inline SVGs |
| `components/{smooth-scroll,floating-collage,reveal}.tsx` | Modified | `lenis.scrollTo`, entrance, split-reveal |
| `app/globals.css` | Modified | focus styles |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| LCP > 2.0s (preloader+GSAP+theme) | Med | hero priority; ~3KB lib; inline script; Lighthouse |
| Premium plugin trap (SplitText/DrawSVGPlugin in dist) | Low | locked: SplitType + `stroke-dashoffset` only |
| Next.js 16.3 breaking changes | Med | consult Next 16.3 docs before code |
| WhatsApp placeholder ships | High | single constant + TODO; launch blocker |
| Exceeds 400-line PR budget | High | forecast chained PRs in sdd-tasks |

## Rollback Plan

Remove new components from layout/page; delete `components/{preloader,theme-provider,header,footer,hero,ui,icons}/*` + `lib/constants.ts`; `npm uninstall split-type`. Home returns to hero-only. No migration.

## Dependencies

- `split-type` (npm, MIT, ~3KB); existing gsap 3.15, lenis 1.3.26, next 16.3

## Success Criteria

- [ ] lint + build green
- [ ] Lighthouse mobile ≥90; LCP <2.0s; CLS <0.05; home <1.5MB
- [ ] Preloader once/session, ≤1.5s, skip works; reduced-motion instant
- [ ] No dead links; drawer a11y; headline SSR-visible
