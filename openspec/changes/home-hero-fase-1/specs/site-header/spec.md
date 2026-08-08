# Site Header Specification

## Purpose

Semi-fixed global navigation that transitions on scroll (transform/opacity only). Renders only real destinations (Inicio anchor + always-visible WhatsApp CTA); future routes appear muted as "próximamente" non-links (no dead links, no 404s). Mobile navigation collapses into an accessible drawer (aria-expanded, ESC, focus management). Anchor navigation uses the shared Lenis instance.

## Requirements

### Requirement: Semi-fixed header with scroll transition

The header MUST remain semi-fixed and transition its visual state on scroll using only transform/opacity, in ≤ 0.8s, without layout shift.

#### Scenario: Scroll transition

- GIVEN the user scrolls past the header threshold
- WHEN the header state changes
- THEN the transition completes in ≤ 0.8s and CLS stays < 0.05

### Requirement: Real destinations only

The header MUST link only to destinations that exist: Inicio (home/top anchor) and the WhatsApp CTA. Future items (Nosotros, Catálogo, Galería, Contacto) MUST render as muted non-interactive labels marked "próximamente".

#### Scenario: No dead links

- GIVEN the rendered header
- WHEN inspecting nav anchors
- THEN no href points to a non-existent route and future items are non-links

### Requirement: WhatsApp CTA always visible

The header MUST show the WhatsApp CTA at every breakpoint, using the shared constant from `lib/constants.ts`.

#### Scenario: CTA presence

- GIVEN any viewport
- WHEN the page renders
- THEN the CTA is visible and its href derives from the WhatsApp constant

### Requirement: Mobile drawer accessibility

On mobile, nav items MUST collapse into a drawer toggled by a button with `aria-expanded`; ESC MUST close it; focus MUST move into the drawer on open and return to the toggle on close.

#### Scenario: Open/close with focus

- GIVEN a mobile viewport with the drawer closed
- WHEN the toggle is activated
- THEN `aria-expanded` becomes true, the drawer opens, and focus moves into it

#### Scenario: ESC close

- GIVEN the drawer is open
- WHEN the user presses ESC
- THEN the drawer closes and focus returns to the toggle

### Requirement: Lenis anchor scrolling

Anchor navigation MUST scroll via the shared Lenis instance (`lenis.scrollTo`); without Lenis, native anchor behavior MUST still work.

#### Scenario: Smooth scroll

- GIVEN JS and Lenis enabled
- WHEN the Inicio anchor is activated
- THEN the page scrolls smoothly to the target

#### Scenario: No-JS anchor

- GIVEN JS disabled
- WHEN the Inicio anchor is activated
- THEN the browser jumps to the target natively

### Requirement: Semantics and focus visibility

The header MUST use a `<header>` landmark with a labeled `<nav>`, and every interactive control MUST show a visible focus indicator.

#### Scenario: Keyboard navigation

- GIVEN keyboard navigation
- WHEN focus moves to a header control
- THEN a visible focus ring is displayed

### Requirement: Reduced-motion

Under `prefers-reduced-motion: reduce`, header transitions and drawer animations MUST be instant.

#### Scenario: Instant header states

- GIVEN `prefers-reduced-motion: reduce`
- WHEN the header state changes
- THEN no transition animation occurs
