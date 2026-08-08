# Preloader Specification

## Purpose

A session-gated brand intro: the logo's SVG stroke draws itself with core GSAP (`stroke-dashoffset`), over the session-theme background, with a visible skip control, completing within 1.5s max. It runs at most once per session and is an overlay only — server-rendered content MUST never be hidden permanently.

## Requirements

### Requirement: Session gating

The preloader MUST run at most once per session, flagged in `sessionStorage`; later loads in the same session MUST skip it.

#### Scenario: Repeated session load

- GIVEN a previous load in the same session completed the preloader
- WHEN the page loads again
- THEN the preloader is skipped and content is immediately visible

### Requirement: Duration cap with forced exit

The preloader MUST exit and reveal the site within 1.5s maximum regardless of animation progress.

#### Scenario: Slow or failed draw

- GIVEN the stroke animation is slow or fails
- WHEN 1.5s elapses
- THEN the preloader exits and content is revealed

### Requirement: SVG stroke draw with core GSAP

The logo stroke MUST draw via `stroke-dashoffset`/`stroke-dasharray` animated with core GSAP; DrawSVGPlugin or other premium plugins MUST NOT be used.

#### Scenario: Happy path — draw

- GIVEN a JS-enabled client without reduced motion
- WHEN the preloader runs
- THEN the SVG path draws 0% → 100% using core GSAP only

### Requirement: Skip control

The preloader MUST display a visible skip control that dismisses it immediately.

#### Scenario: User skips

- GIVEN the preloader is visible
- WHEN the user activates skip
- THEN the preloader hides immediately and the site is revealed

### Requirement: Session-theme background

The preloader background MUST use the active session theme's background values.

#### Scenario: Theme-consistent background

- GIVEN a session theme is active
- WHEN the preloader renders
- THEN its background matches the session theme

### Requirement: Content never hidden permanently (SEO)

The preloader MUST be an overlay only: all server-rendered content MUST remain in the DOM beneath it and MUST be visible when it exits. With JS disabled, the overlay MUST NOT render.

#### Scenario: No-JS client

- GIVEN a JS-disabled client
- WHEN home loads
- THEN no preloader overlay exists and hero content is fully visible

#### Scenario: Post-exit visibility

- GIVEN the preloader exits
- WHEN the hero renders
- THEN headline and CTA are visible without further JS execution

### Requirement: Reduced-motion skip

With `prefers-reduced-motion: reduce`, the preloader MUST be skipped or dismissed instantly.

#### Scenario: Reduced motion

- GIVEN `prefers-reduced-motion: reduce`
- WHEN the page loads
- THEN no draw animation runs and content is visible immediately

### Requirement: Performance contribution

The preloader MUST NOT push home beyond the performance budget; it MUST animate only `transform`/`opacity`/`stroke-*` and MUST NOT delay LCP past 2.0s.

#### Scenario: Budget hold

- GIVEN a mobile Lighthouse run
- WHEN home loads with the preloader active
- THEN LCP < 2.0s and CLS < 0.05 hold
