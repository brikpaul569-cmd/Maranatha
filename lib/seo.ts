/**
 * Structured-data + SEO constants (Brief 03 §4). All values are derived from
 * existing sources so this module never invents business facts:
 *   - lib/constants.ts  → WHATSAPP_NUMBER, SOCIALS, HOURS, BASE_URL (prod)
 *   - lib/zones.ts      → ZONES / HUB_ZONE  (area served)
 *
 * BASE_URL is the production origin. In dev it stays production because schema
 * and sitemap absolute URLs are only consumed by crawlers on the deployed site.
 */

import { HOURS, SOCIALS, WHATSAPP_NUMBER } from "./constants";
import { HUB_ZONE, ZONES } from "./zones";

export const SEO_BASE_URL = "https://www.detallesmaranatha.com";

const TELEPHONE = `+${WHATSAPP_NUMBER}`; // e.g. +573000000000

/**
 * LocalBusiness JSON-LD injected sitewide via <Script> in the root layout so
 * Google associates every page with the same business entity. No street
 * address exists in the briefs, so we omit addressLocality-only (no
 * streetAddress) — Google accepts a LocalBusiness with a country+city.
 * openingHoursSpecification is derived from HOURS (days "Lunes a sábado",
 * time "9:00 a. m. – 6:00 p. m.").
 */
const DAYS: string[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function to24h(t: string): string {
  // "9:00 a. m." → "09:00"; "6:00 p. m." → "18:00"
  const m = /(\d{1,2}):(\d{2})\s*([ap])\.\s*m\./i.exec(t);
  if (!m) return t;
  let h = parseInt(m[1], 10);
  if (m[3].toLowerCase() === "p") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

/* eslint-disable @typescript-eslint/no-explicit-any -- JSON-LD is untyped */
export const LOCALBUSINESS_SCHEMA: any = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Detalles Maranatha",
  url: SEO_BASE_URL,
  image: `${SEO_BASE_URL}/maranatha.jpeg`,
  telephone: TELEPHONE,
  priceCurrency: "COP",
  address: {
    "@type": "PostalAddress",
    addressCountry: "CO",
    addressRegion: "Cundinamarca",
    addressLocality: "Bogotá",
  },
  areaServed: [HUB_ZONE.name, ...ZONES.filter((z) => z.slug !== "bogota").map((z) => z.name)],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: DAYS,
      opens: to24h(HOURS.time.split("–")[0]),
      closes: to24h(HOURS.time.split("–")[1]),
    },
  ],
  sameAs: SOCIALS.map((s) => s.href),
};
/* eslint-enable @typescript-eslint/no-explicit-any */
