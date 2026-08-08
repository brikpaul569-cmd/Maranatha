# Spec — `home-hero-fase-1` (Fase 1: Home + Hero + Design System)

## Purpose

Delta specs for the first change of Detalles Maranatha. `openspec/specs/` is empty, so every capability is NEW and defined as a full spec. Scope per proposal: session themes, preloader, header, footer, hero, and design-system primitives, within the locked SSG/SEO, mobile-first, <1.5 MB budget. Domain specs live under `specs/`; the cross-cutting requirements below apply to every capability.

## Capability Specs

| Domain | Spec file | Requirements | Scenarios |
|--------|-----------|--------------|-----------|
| session-themes | `specs/session-themes/spec.md` | 6 | 7 |
| preloader | `specs/preloader/spec.md` | 8 | 9 |
| site-header | `specs/site-header/spec.md` | 7 | 9 |
| site-footer | `specs/site-footer/spec.md` | 6 | 7 |
| hero-home | `specs/hero-home/spec.md` | 9 | 13 |
| design-system | `specs/design-system/spec.md` | 9 | 12 |
| **Total (capabilities)** | | **45** | **57** |

## Cross-Cutting Requirements (apply to every capability)

### Requirement: Server-rendered content (SEO)

All text, headings, prices, and links MUST be server-rendered HTML present without JS. GSAP MUST run only inside `"use client"` components, and animation MUST NOT hide content that must be indexed.

#### Scenario: No-JS content availability

- GIVEN a client with JS disabled
- WHEN any page renders
- THEN all content, links, and CTAs are present and functional in the static DOM

### Requirement: Motion constraints

Animations MUST animate only `transform`/`opacity` (plus SVG `stroke-*` properties for the preloader draw) to hold CLS < 0.05. Transition durations MUST NOT exceed 0.8s; the preloader MUST NOT exceed 1.5s. Parallax and micro-parallax MUST be gated behind `gsap.matchMedia()` at min-width 768px and disabled on mobile.

#### Scenario: Mobile parallax off

- GIVEN a mobile viewport (< 768px)
- WHEN the page loads
- THEN no parallax or micro-parallax is registered

### Requirement: Reduced-motion

Under `prefers-reduced-motion: reduce`, all animations and transitions MUST be skipped or instant.

#### Scenario: Static instant rendering

- GIVEN `prefers-reduced-motion: reduce`
- WHEN the page loads
- THEN all content is visible immediately with no animation

### Requirement: Performance budget (mobile)

Home MUST meet: LCP < 2.0s, INP < 150ms, CLS < 0.05, Lighthouse ≥ 90, < 1.5 MB transferred on initial load. Only the hero image MAY use `priority`.

#### Scenario: Lighthouse audit

- GIVEN a mobile Lighthouse run on home
- WHEN the audit completes
- THEN Performance/A11y/Best Practices/SEO score ≥ 90 and the CWV budgets hold

### Requirement: Open-source GSAP only

Implementers MUST use GSAP core + ScrollTrigger + Flip + split-type. Club GreenSock premium plugins (SplitText, DrawSVGPlugin) MUST NOT be used even though their files ship in the npm dist.

#### Scenario: Premium plugin absence

- GIVEN the implementation
- WHEN auditing imports
- THEN no premium plugin is imported; split-type and `stroke-dashoffset` are used instead

### Requirement: Tailwind v4 tokens and next/font

Styling MUST use Tailwind v4 CSS-first tokens mapped via `@theme inline` (`--color-mar-*`, `--color-mood-*`). Fonts MUST load via `next/font` only (no external `<link>`).

#### Scenario: Token usage

- GIVEN any new component
- WHEN it uses brand colors or moods
- THEN it references the token variables, not hardcoded hex values

### Requirement: Next.js 16.3 documentation

Implementers MUST consult `node_modules/next/dist/docs/` before writing code, because Next.js 16.3 contains breaking changes vs. training data (AGENTS.md enforced).

#### Scenario: Pre-code check

- GIVEN a task touching Next.js APIs (layout, routing, fonts, metadata)
- WHEN implementation begins
- THEN the relevant 16.3 doc is read first

### Requirement: Inline SVG icons only

All icons MUST be inline SVG components; no icon library (lucide-react excluded) MAY be added.

#### Scenario: Dependency audit

- GIVEN the final `package.json`
- WHEN auditing dependencies
- THEN no icon library is present

### Requirement: Single source of truth for contact data

The WhatsApp number/URL and nav/footer config MUST live in `lib/constants.ts`. The placeholder number `573000000000` MUST carry a TODO launch blocker.

#### Scenario: Constant consumption

- GIVEN any CTA (header, hero, footer, widget)
- WHEN it renders
- THEN its href is derived from the shared constant
