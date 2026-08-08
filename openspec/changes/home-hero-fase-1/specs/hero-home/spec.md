# Hero Home Specification

## Purpose

The 3-second "wow" hero: headline revealed by lines with initial blur via split-type; collage entrance with dominant scale 1.08→1 (≤0.8s) and satellite stagger (50-80ms); `--mood-hero` applied through the Section shell; desktop-only mouse micro-parallax via `gsap.matchMedia()`; WhatsApp CTA. The headline is server-rendered and MUST never be hidden by JS.

## Requirements

### Requirement: Server-rendered headline

The H1 MUST be real server-rendered HTML in the initial DOM; the reveal MUST only animate it and MUST NEVER leave it invisible without JS.

#### Scenario: No-JS headline

- GIVEN a JS-disabled client
- WHEN home renders
- THEN the full headline text is visible in the DOM

#### Scenario: Post-reveal visibility

- GIVEN the reveal animation runs
- WHEN it completes
- THEN the headline remains fully visible

### Requirement: SplitType line reveal with blur

The headline reveal MUST split text into lines with the open-source `split-type` package and animate lines rising from below with initial blur, in ≤ 0.8s; premium SplitText MUST NOT be used.

#### Scenario: Happy path — cinematic reveal

- GIVEN a JS-enabled viewport without reduced motion
- WHEN the hero entrance starts
- THEN lines rise from below with initial blur and settle within 0.8s

### Requirement: Collage entrance choreography

The dominant collage image MUST enter with scale 1.08 → 1 plus fade in ≤ 0.8s; satellites MUST enter with a 50-80ms stagger.

#### Scenario: Happy path — entrance

- GIVEN the hero loads
- WHEN the entrance runs
- THEN the dominant image settles at scale 1 and satellites follow 50-80ms apart

### Requirement: Composition rules

The collage MUST use 3-5 images max (desktop) with an unbalanced composition (~55-60% dominant width, distinct z-index, ≥60% negative space) and MUST NOT obstruct the CTA; mobile MUST use 2-3 images with a full-width dominant.

#### Scenario: Desktop composition

- GIVEN a desktop viewport
- WHEN the hero renders
- THEN the composition follows the rules and the CTA hit area is never overlapped

#### Scenario: Mobile composition

- GIVEN a mobile viewport (320-768px)
- WHEN the hero renders
- THEN 2-3 images max with a full-width dominant

### Requirement: Section mood via Section shell

The hero MUST apply `--mood-hero` through the design-system Section shell (CSS variable on the section container), not a hardcoded color class.

#### Scenario: Mood resolves

- GIVEN the hero renders via the Section shell
- WHEN the mood variable changes (e.g., session theme)
- THEN the hero background resolves to `--mood-hero`

### Requirement: Desktop-only mouse micro-parallax

Mouse micro-parallax on the collage MUST be gated by `gsap.matchMedia()` (min-width 768px) and MUST be absent on mobile.

#### Scenario: Desktop parallax

- GIVEN a ≥768px viewport with a pointer
- WHEN the cursor moves over the hero
- THEN collage layers shift subtly opposite the cursor

#### Scenario: Mobile parallax off

- GIVEN a mobile viewport
- WHEN the page renders
- THEN no micro-parallax is registered

### Requirement: WhatsApp CTA

The hero MUST include the WhatsApp CTA rendered from the design-system Button using the shared constant.

#### Scenario: CTA present

- GIVEN the hero renders
- THEN the CTA is present with the wa.me URL from `lib/constants.ts`

### Requirement: Reduced-motion

Under `prefers-reduced-motion: reduce`, reveal, entrance, and parallax MUST be skipped and content MUST be fully visible instantly.

#### Scenario: Static hero

- GIVEN `prefers-reduced-motion: reduce`
- WHEN home loads
- THEN headline, collage, and CTA are visible with no animation

### Requirement: Entrance sequencing after preloader

The hero entrance MUST start once, after the preloader exits (when the preloader runs), and MUST also run when the preloader is skipped.

#### Scenario: Preloader-then-hero

- GIVEN the preloader runs
- WHEN it exits
- THEN the hero entrance begins exactly once

#### Scenario: Skipped preloader

- GIVEN the preloader is skipped (repeated session or reduced motion)
- WHEN the hero is ready
- THEN the entrance still runs once
