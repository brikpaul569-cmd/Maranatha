# Tasks: Fase 1 — Home + Hero + Design System (`home-hero-fase-1`)

Spec refs: cc = cross-cutting (`spec.md`), st = session-themes, pre = preloader, hdr = site-header, ft = site-footer, hero = hero-home, ds = design-system (all under `specs/{domain}/spec.md`).

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~1000–1150 (WU1 ≈200, WU2 ≈225, WU3 ≈340, WU4 ≈325) |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR 1 → PR 2 → PR 3 → PR 4 (dependency order) |
| Delivery strategy | ask-on-risk |
| Chain strategy | pending |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: pending
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Focused test command | Runtime harness | Rollback boundary |
|------|------|-----------|----------------------|-----------------|-------------------|
| 1 | Theme foundation: constants + pre-paint + CSS vars | PR 1 | `npm run lint && npm run build` | dev — no theme flash; persists across nav | rm theme-*, lib/{constants,theme}.ts; revert globals/layout |
| 2 | Primitives: icons, button, section, eyebrow, card | PR 2 | `npm run lint && npm run build` | dev — render each primitive | rm components/ui/* (no consumers yet) |
| 3 | Preloader + entrance + hero | PR 3 | `npm run lint && npm run build` | dev — ≤1.5s, skip, once/session; reveal once; reduced-motion instant | rm preloader/hero/split-reveal/entrance; revert collage/page |
| 4 | Header + footer + widget + Lenis anchors | PR 4 | `npm run lint && npm run build` | dev — drawer a11y, smooth anchors, no dead links, thumb-zone | rm site-*, floating-whatsapp, lib/lenis; revert smooth-scroll/layout |

Ordering note: exploration listed primitives last, but hero (Section/Button), header (Button/icons), and footer (icons) consume `ui/*` — primitives move before consumers so each PR stays dependency-safe.

## Phase 0: Prerequisite — git init (user decision, not an implementation task)

- [x] 0.1 Ask user to approve `git init` + baseline commit (PROJECT-BRIEF §12) before apply; never create the repo silently
- [x] 0.2 On approval only: init repo, baseline commit, then start Phase 1 — repo initialized; baseline commit `ed4a9b4` exists

## Phase 1: Foundation (WU1 → PR 1)

- [x] 1.1 `npm i split-type` — cc-R5 (open-source GSAP only)
- [x] 1.2 Create `lib/constants.ts`: WHATSAPP_NUMBER + TODO(launch), waMeUrl(), default message, NAV_ITEMS, SOCIALS, HOURS, ROUTES.domiciliosBogota=null — cc-R8, ft-R6, ds-R8
- [x] 1.3 Create `lib/theme.ts`: theme ids, storage keys, getThemeInitScript() — st-R3
- [x] 1.4 Create `components/theme-init.tsx` (server inline `<script>`) — st-R3
- [x] 1.5 Create `components/theme-provider.tsx` (client re-apply, dev StrictMode) — st-R3/R4
- [x] 1.6 `app/globals.css`: `[data-theme=t1..t4]` blocks, `:focus-visible`, `--section-mood` — st-R1/R2, ds-R10
- [x] 1.7 `app/layout.tsx`: `suppressHydrationWarning`, render ThemeInit + ThemeProvider — st-R3
- [x] 1.8 Verify WU1: lint + build (fallback `build:webpack`); manual — no flash, persistence, reduced-motion instant — relaunch 2026-08-08: lint exit 0; build:webpack exit 0 (TS passed, 4 static pages); runtime attempt 2 settled passed

## Phase 2: Design-system primitives (WU2 → PR 2)

- [x] 2.1 Create `components/ui/icons.tsx`: inline SVGs (WhatsApp, Instagram, TikTok, menu, close) — ds-R6
- [x] 2.2 Create `components/ui/button.tsx`: primary/whatsapp/ghost; `<a>`|`<button>`; WA via waMeUrl() — ds-R1, hero-R8, hdr-R3
- [x] 2.3 Create `components/ui/section.tsx`: mood → `--section-mood`; default padding + max-w — ds-R3, hero-R5
- [x] 2.4 Create `components/ui/eyebrow.tsx`: sans, uppercase, tracking-[0.35em] — ds-R4
- [x] 2.5 Create `components/ui/card.tsx`: lazy image + title + "Precio al WhatsApp" + mini-CTA — ds-R2
- [x] 2.6 Verify WU2: lint + build; manual — a/button switch, mood resolves, no icon lib in package.json — 2026-08-08: lint exit 0; build:webpack exit 0; deps audit clean (no icon lib)

## Phase 3: Preloader + entrance + hero (WU3 → PR 3)

- [ ] 3.1 Create `lib/entrance.ts`: signalEntranceReady() (fired flag), onEntranceReady() (immediate-if-fired, 1.8s fallback, unsubscribe) — hero-R9, pre-R6
- [ ] 3.2 Create `components/preloader.tsx`: session gate, stroke-dashoffset draw ≤1.5s, visible skip, signal, post-hydration overlay, `var(--theme-bg)` — pre-R1–R8
- [ ] 3.3 Create `components/split-reveal.tsx`: SplitType lines + blur ≤0.8s; reduced-motion → no split; ctx.revert() + split.revert() — hero-R2/R8, cc-R2
- [ ] 3.4 Rework `components/floating-collage.tsx`: entrance scale 1.08→1 + 50–80ms stagger; `priority`→`preload` (read `next/dist/docs/02-components/image.md` first); parallax ≥768px — hero-R3/R6
- [ ] 3.5 Create `components/hero-home.tsx`: Section(mood-hero) + SplitReveal H1 + collage + WA CTA; onEntranceReady subscriber — hero-R1–R9
- [ ] 3.6 `app/page.tsx`: render HeroHome; remove hardcoded WHATSAPP_URL — hero-R1/R8, cc-R8
- [ ] 3.7 Verify WU3: lint + build; manual — once/session, skip, ≤1.5s, entrance once (both paths), reduced-motion instant, no-JS headline, mobile no parallax

## Phase 4: Header + footer + floating widget (WU4 → PR 4)

- [ ] 4.1 Create `lib/lenis.ts`: setLenis/clearLenis/scrollToHash(hash, offset) + native fallback — ds-R9, hdr-R5
- [ ] 4.2 Modify `components/smooth-scroll.tsx`: register instance via lib/lenis — ds-R9
- [ ] 4.3 Create `components/site-header.tsx`: semi-fixed (transform/opacity ≤0.8s); Inicio + WA CTA only; "próximamente" muted non-links; drawer (aria-expanded, inert, focus trap, ESC, focus return); Lenis anchors — hdr-R1–R7
- [ ] 4.4 Create `components/site-footer.tsx`: socials (noopener), hours, conditional coverage link (D7), mini-sitemap, legal line — ft-R1–R6
- [ ] 4.5 Create `components/floating-whatsapp.tsx`: thumb-zone mobile / bottom-right desktop; default message — ds-R5
- [ ] 4.6 `app/layout.tsx`: add Preloader, Header, Footer, FloatingWhatsApp — integration
- [ ] 4.7 Verify WU4: lint + build; manual — drawer a11y, Lenis + native fallback, no dead links, coverage link absent, thumb-zone widget

## Phase 5: Whole-change verification

- [ ] 5.1 Full `npm run lint` + `npm run build` green (fallback `build:webpack`)
- [ ] 5.2 Lighthouse mobile ≥90; LCP <2.0s; CLS <0.05; home <1.5MB
- [ ] 5.3 No-JS pass (headline, CTAs, native anchors, no overlay); premium-plugin audit; reduced-motion sweep
- [ ] 5.4 Confirm TODO(launch) placeholder documented; get real WhatsApp number from user
