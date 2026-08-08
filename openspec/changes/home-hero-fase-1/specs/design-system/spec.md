# Design System Specification

## Purpose

SSR-safe primitives and shared constants: Button (variants incl. WhatsApp CTA with wa.me deep link), Card (image + title + price placeholder + WhatsApp mini-CTA), Section shell (mood via CSS variables), Eyebrow, FloatingWhatsApp widget (mobile thumb-zone), inline SVG icons (no icon library), Lenis `scrollTo` anchor support, and global focus-visible styles.

## Requirements

### Requirement: Button primitive with variants

The Button MUST support primary and WhatsApp-CTA variants, render as an `<a>` for href-based actions (SSR-safe) and as a `<button>` otherwise; the WhatsApp variant MUST deep-link via `wa.me` with a pre-filled message.

#### Scenario: WhatsApp CTA deep link

- GIVEN a WhatsApp-CTA Button with a message
- WHEN it is activated
- THEN `wa.me` opens with the pre-filled message

#### Scenario: Non-link button

- GIVEN a Button without href
- WHEN it renders
- THEN it renders as a `<button>` element

### Requirement: Card primitive

The Card MUST provide the anatomy: image, title, price placeholder, and WhatsApp mini-CTA, all server-rendered.

#### Scenario: Card renders

- GIVEN a Card renders
- WHEN inspecting its DOM
- THEN image, title, price placeholder, and mini-CTA are present in the server HTML

### Requirement: Section shell with mood

The Section shell MUST apply a mood via CSS variable (`--mood-*`) on its container and follow the negative-space rule (~60% air).

#### Scenario: Mood applied

- GIVEN a Section with a mood prop
- WHEN it renders
- THEN the container resolves the matching `--mood-*` variable without hardcoded colors

### Requirement: Eyebrow primitive

The Eyebrow MUST render small sans-serif uppercase UI labels with wide letter-spacing.

#### Scenario: Eyebrow renders

- GIVEN an Eyebrow renders
- THEN it uses the sans font, uppercase text, and wide tracking

### Requirement: FloatingWhatsApp widget

The FloatingWhatsApp widget MUST be global, sit in the thumb-zone at the bottom on mobile and fixed bottom-right on desktop, and MUST deep-link with the default message "Hola 👋 Qué deseas comprar hoy!".

#### Scenario: Mobile thumb-zone

- GIVEN a mobile viewport
- WHEN the page renders
- THEN the widget is at the bottom thumb-zone, reachable one-handed

#### Scenario: Desktop position

- GIVEN a desktop viewport
- WHEN the page renders
- THEN the widget is fixed bottom-right

### Requirement: Inline SVG icons only

All icons MUST be inline SVG components from an icons module; no icon library (lucide-react) MAY be added.

#### Scenario: Dependency audit

- GIVEN the final `package.json`
- WHEN auditing dependencies
- THEN no icon library is present and icons are inline SVGs

### Requirement: WhatsApp constants single source

The WhatsApp number/URL and nav/footer config MUST live in `lib/constants.ts`; the placeholder number `573000000000` MUST carry a TODO launch blocker; all consumers MUST use the constant.

#### Scenario: Constant-driven CTA

- GIVEN any CTA renders
- WHEN inspecting its href
- THEN it derives from the shared constant and the placeholder is flagged TODO

### Requirement: Lenis scrollTo anchor support

The SmoothScroll module MUST expose a `scrollTo` API consumed by header/footer anchors; native anchors MUST remain functional without Lenis.

#### Scenario: Shared scrollTo

- GIVEN a header or footer anchor
- WHEN it is activated with Lenis active
- THEN the shared Lenis instance scrolls to the target

### Requirement: Reduced-motion and focus visibility

All primitive hover/entrance effects MUST be instant or disabled under `prefers-reduced-motion`, and interactive primitives MUST show a visible focus ring (global `:focus-visible` styles in `app/globals.css`).

#### Scenario: Reduced-motion primitives

- GIVEN `prefers-reduced-motion: reduce`
- WHEN hovering or activating a Button or Card
- THEN no motion occurs

#### Scenario: Keyboard focus

- GIVEN keyboard navigation
- WHEN focus lands on an interactive primitive
- THEN a visible focus ring is shown
