/**
 * Single source of truth for contact and navigation data (cc-R8, ft-R6, ds-R8).
 * All CTAs (header, hero, footer, floating widget, cards) must derive their
 * hrefs from this module — never duplicate values inline.
 */

import { OCCASIONS } from "@/lib/products";

// TODO(launch): replace with the real Maranatha WhatsApp number.
// Format: country code (57 for Colombia) + city number, no "+" or spaces.
export const WHATSAPP_NUMBER = "573000000000";

export const WHATSAPP_DEFAULT_MESSAGE = "Hola 👋 Qué deseas comprar hoy!";

/** Builds a wa.me deep link with an optional pre-filled message. */
export function waMeUrl(message: string = WHATSAPP_DEFAULT_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Navigation items. `href` is only set for real destinations; future routes
 * are flagged `future: true` so consumers render them as muted non-links
 * ("próximamente") instead of dead anchors (hdr-R2, ft-R4).
 */
export type NavItem = {
  label: string;
  href?: string;
  future?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Galería", href: "/galeria" },
  { label: "Contacto", href: "/contacto" },
];

/**
 * Desktop navigation (top header, md+): the four primary destinations. The
 * small header logo was removed by user direction — the hero lockup is the
 * brand mark — so "Inicio" is the brand/home entry point.
 */
export const NAV_ITEMS_DESKTOP: NavItem[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Catálogo", href: "/catalogo" },
  { label: "Galería", href: "/galeria" },
];

/**
 * Mobile drawer navigation (id="mobile-nav"): deliberately DIFFERENT set of
 * destinations than the desktop nav (user decision) — the two commerce hubs
 * plus contact.
 */
export const NAV_ITEMS_MOBILE: NavItem[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Domicilios", href: "/domicilios/bogota" },
  { label: "Ocasiones", href: "/ocasiones" },
  { label: "Contacto", href: "/contacto" },
];

/**
 * Taller ecosystem nav — desktop (top header, md+): the workshop world has
 * its own primary destinations. "Inicio" lives in the mobile set as the
 * taller home route (/taller) since the desktop nav drops the redundant brand
 * entry (same pattern as the tienda desktop nav).
 */
export const NAV_ITEMS_TALLER_DESKTOP: NavItem[] = [
  { label: "Talleres", href: "#talleres" },
  { label: "Aprende", href: "#aprende" },
  { label: "Contacto", href: "/contacto" },
];

/**
 * Taller ecosystem nav — mobile drawer: home entry first, then the two taller
 * sections and contact.
 */
export const NAV_ITEMS_TALLER_MOBILE: NavItem[] = [
  { label: "Inicio", href: "/taller" },
  { label: "Talleres", href: "#talleres" },
  { label: "Aprende", href: "#aprende" },
  { label: "Contacto", href: "/contacto" },
];

/**
 * Destination mood per nav route, used by the curtain transition overlay
 * (nav-transition.tsx). Values are mood CSS variables from globals.css. Keys
 * ending in "/" are prefixes that also cover dynamic child routes (e.g.
 * /ocasiones/san-valentin). Taller destinations tint the cover with the
 * workshop moods (eco-E4).
 */
export const NAV_MOOD: Record<string, string> = {
  "#inicio": "var(--mood-hero)",
  "/nosotros": "var(--mood-nosotros)",
  "/catalogo": "var(--mood-catalogo-sage)",
  "/catalogo/": "var(--mood-catalogo-gold)",
  "/galeria": "var(--mood-galeria)",
  "/contacto": "var(--mood-contacto)",
  "/domicilios/": "var(--mood-catalogo-sage)",
  "/ocasiones": "var(--mood-catalogo-gold)",
  "/ocasiones/": "var(--mood-catalogo-gold)",
  "/taller": "var(--mood-taller-hero)",
  "/taller/": "var(--mood-taller-hero)",
  "#talleres": "var(--mood-taller-talleres)",
  "#aprende": "var(--mood-taller-aprende)",
};

/**
 * Resolves the mood variable for a nav href. Exact keys win; otherwise the
 * longest "/"-suffixed prefix is used so dynamic child routes inherit their
 * section mood.
 */
export function resolveNavMood(href: string): string {
  const exact = NAV_MOOD[href];
  if (exact) return exact;
  let best = "";
  for (const key of Object.keys(NAV_MOOD)) {
    if (key.endsWith("/") && href.startsWith(key) && key.length > best.length) {
      best = key;
    }
  }
  return NAV_MOOD[best] ?? NAV_MOOD["#inicio"];
}

/**
 * Occasion label+slug+description triples derived from lib/products.ts
 * OCCASIONS — feeds the /ocasiones hub cards (single source of truth stays in
 * lib/products.ts).
 */
export const OCASION_LINKS: { label: string; slug: string; description: string }[] =
  OCCASIONS.map((occasion) => ({
    label: occasion.label,
    slug: occasion.slug,
    description: occasion.description,
  }));

// TODO(launch): confirm real social handles and business hours.
// WhatsApp is deliberately NOT a social entry here (user direction): the
// floating widget and the page CTAs own the WhatsApp channel — waMeUrl() is
// the single source for the deep link.
export const SOCIALS: { label: string; href: string }[] = [
  { label: "Instagram", href: "https://www.instagram.com/detallesmaranatha" },
  { label: "TikTok", href: "https://www.tiktok.com/@detallesmaranatha" },
];

export const HOURS: { days: string; time: string } = {
  days: "Lunes a sábado",
  time: "9:00 a. m. – 6:00 p. m.",
};

/**
 * Taller workshop seed data (eco-E5): the four workshop cards on /taller.
 * Spanish (Colombia), warm handmade Maranatha voice. Durations/levels feed
 * the badge pills; WhatsApp CTAs pre-fill a "reservar cupo" message.
 */
export type TallerWorkshop = {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
};

export const TALLER_WORKSHOPS: TallerWorkshop[] = [
  {
    id: "ramos-artesanales",
    title: "Taller de ramos artesanales",
    description:
      "Aprendé a armar un ramo de flores de listón paso a paso: el armado del tallo, el atado con listón y cinta, y el toque final que lo hace inolvidable.",
    duration: "2 h",
    level: "Inicial",
  },
  {
    id: "arreglos-limpiapipas",
    title: "Taller de arreglos en limpiapipas",
    description:
      "Descubrí la magia de los bouquets de limpiapipas: pétalos, hojas y composición de un arreglo que no se marchita y queda para siempre.",
    duration: "1.5 h",
    level: "Todos los niveles",
  },
  {
    id: "canastas-de-regalo",
    title: "Taller de canastas de regalo",
    description:
      "Armá tu propia canasta con café Cerquera y detalles hechos a mano: el forrado, el acomodo y la presentación perfecta para sorprender.",
    duration: "2 h",
    level: "Inicial",
  },
  {
    id: "envoltura-floral-y-tarjetas",
    title: "Taller de envoltura floral y tarjetas",
    description:
      "Dale el cierre perfecto a un detalle: envoltura con papel y listones, y tarjetas escritas a mano con mensajes que dicen lo que las palabras no alcanzan.",
    duration: "1.5 h",
    level: "Intermedio",
  },
];

/**
 * Routes that exist at ship time. `domiciliosBogota` points to the
 * `/domicilios/bogota` coverage hub (D7); consumers render the footer link
 * only while it is non-null so the site never publishes a dead link (ft-R3).
 */
export const ROUTES: { domiciliosBogota: string | null } = {
  domiciliosBogota: "/domicilios/bogota",
};
