# Site Footer Specification

## Purpose

Global footer with social links (Instagram, TikTok, WhatsApp), business hours, a Bogotá delivery-coverage link, a mini-sitemap of real routes, and a legal line (copyright + "hecho a mano"). All content server-rendered; contact data comes from the single source of truth.

## Requirements

### Requirement: Social links

The footer MUST render Instagram, TikTok, and WhatsApp links with inline SVG icons, opening in a new tab with `rel="noopener noreferrer"`.

#### Scenario: External social link

- GIVEN the footer renders
- WHEN a social link is activated
- THEN a new tab opens the profile/chat with no referrer leak

### Requirement: Business hours

The footer MUST display business attention hours as server-rendered text.

#### Scenario: Hours visible

- GIVEN any client state
- WHEN the footer renders
- THEN the hours text is present in the initial DOM

### Requirement: Bogotá delivery-coverage link

The footer MUST link to the Bogotá coverage hub `/domicilios/bogota`; the site MUST NOT ship a dead link — if the route is unavailable at ship time, the link MUST be suppressed.

#### Scenario: Coverage navigation

- GIVEN the coverage route exists
- WHEN the coverage link is activated
- THEN it navigates to `/domicilios/bogota`

#### Scenario: No dead coverage link

- GIVEN the route does not exist yet
- WHEN the footer would render the link
- THEN the link is suppressed or blocks shipping (no href to a non-existent route)

### Requirement: Mini-sitemap of real routes

The footer mini-sitemap MUST link only to existing routes; future routes MUST be muted non-links, consistent with the header.

#### Scenario: Sitemap link integrity

- GIVEN the footer DOM
- WHEN inspecting sitemap anchors
- THEN every anchor resolves to a real route and future routes are non-interactive

### Requirement: Legal line

The footer MUST end with a legal line containing the copyright (© year · Detalles Maranatha) and a "hecho a mano" tagline.

#### Scenario: Legal line present

- GIVEN the footer renders
- THEN the legal line exists in the server-rendered DOM

### Requirement: Single source of truth for contact data

Social handles, hours, and the WhatsApp number MUST be read from `lib/constants.ts`; the footer MUST NOT duplicate them inline.

#### Scenario: Constant-driven footer

- GIVEN contact data changes in `lib/constants.ts`
- WHEN the footer re-renders
- THEN the updated values appear without code duplication
