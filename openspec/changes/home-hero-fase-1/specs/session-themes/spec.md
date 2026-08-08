# Session Themes Specification

## Purpose

Purely decorative per-session visual themes for Detalles Maranatha. A curated set of themes rotates randomly per session (never repeating consecutively), persists in `sessionStorage` only, and is applied via CSS custom properties on the `<html>` element before first paint. Theme state MUST never affect content, links, or indexing.

## Requirements

### Requirement: Curated theme set

The system MUST define 4-6 curated themes, each expressed as a set of CSS custom-property values applied on `<html>`, overriding brand/background tokens without altering layout.

#### Scenario: Happy path — theme applies

- GIVEN a defined theme set of 4-6 entries
- WHEN a theme is applied
- THEN the corresponding variables resolve on `<html>` and the layout is unchanged

#### Scenario: No-theme fallback

- GIVEN no theme applied (e.g., JS disabled)
- WHEN the page renders
- THEN the `:root` defaults render and all content is visible

### Requirement: Random rotation without consecutive repeat

The system MUST select a theme at random, excluding the theme recorded in `sessionStorage` from the previous session, so two consecutive sessions never show the same theme.

#### Scenario: New session

- GIVEN the previous session saved theme T1
- WHEN a new session selects a theme
- THEN the selected theme is not T1 and T1 is replaced in `sessionStorage`

### Requirement: Pre-paint application

The theme MUST be selected and applied before first paint (inline script) to avoid a flash of the default theme, without blocking content render.

#### Scenario: No theme flash

- GIVEN a fresh session load
- WHEN the page begins rendering
- THEN theme variables are set on `<html>` before first paint and no flash of another theme is visible

### Requirement: Session-scoped persistence

The theme MUST persist in `sessionStorage`, remain stable across same-session navigations, and MUST NOT use `localStorage`.

#### Scenario: Same-session navigation

- GIVEN a multi-route session
- WHEN the user navigates within the site
- THEN the theme stays constant until the session ends

### Requirement: Purely decorative

The theme MUST NOT gate, hide, or alter any content or links, and MUST have no effect on server-rendered markup or indexing.

#### Scenario: Crawler render

- GIVEN an indexing crawler or JS-disabled client
- WHEN the page renders
- THEN content is identical regardless of theme

### Requirement: Reduced-motion tolerance

Theme application MUST be instantaneous (no animated color transition).

#### Scenario: Reduced motion

- GIVEN `prefers-reduced-motion: reduce`
- WHEN a session theme applies
- THEN it applies instantly with no animation
