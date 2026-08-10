/**
 * Single source of truth for contact and navigation data (cc-R8, ft-R6, ds-R8).
 * All CTAs (header, hero, footer, floating widget, cards) must derive their
 * hrefs from this module — never duplicate values inline.
 */

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

// TODO(launch): confirm real social handles and business hours.
export const SOCIALS: { label: string; href: string }[] = [
  { label: "Instagram", href: "https://www.instagram.com/detallesmaranatha" },
  { label: "TikTok", href: "https://www.tiktok.com/@detallesmaranatha" },
  { label: "WhatsApp", href: waMeUrl() },
];

export const HOURS: { days: string; time: string } = {
  days: "Lunes a sábado",
  time: "9:00 a. m. – 6:00 p. m.",
};

/**
 * Routes that exist at ship time. `domiciliosBogota` points to the
 * `/domicilios/bogota` coverage hub (D7); consumers render the footer link
 * only while it is non-null so the site never publishes a dead link (ft-R3).
 */
export const ROUTES: { domiciliosBogota: string | null } = {
  domiciliosBogota: "/domicilios/bogota",
};
