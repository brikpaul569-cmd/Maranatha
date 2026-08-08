import { HOURS, NAV_ITEMS, ROUTES, SOCIALS } from "@/lib/constants";
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/ui/icons";

/**
 * Global footer (ft-R1–R6; design D7). Server component — everything renders
 * in the initial HTML (ft-R2, cc-R1). All contact data comes from
 * `lib/constants.ts` (ft-R6): social handles, hours, WhatsApp number. The
 * Bogotá coverage link is suppressed while `ROUTES.domiciliosBogota` is null
 * (D7) so the site never publishes a dead link (ft-R3).
 */

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
  WhatsApp: WhatsAppIcon,
} as const;

export default function SiteFooter() {
  const coverageHref = ROUTES.domiciliosBogota;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-mar-brown/10 bg-[var(--theme-bg)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand + business hours (ft-R2) */}
          <div>
            <p className="font-display text-xl text-mar-brown">
              Detalles Maranatha
            </p>
            <p className="mt-3 font-sans text-sm text-mar-brown/70">
              {HOURS.days} · {HOURS.time}
            </p>
          </div>

          {/* Mini-sitemap — only real routes link (ft-R4) */}
          <nav aria-label="Mapa del sitio" className="flex flex-col gap-3">
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-mar-brown/60">
              Explora
            </p>
            {NAV_ITEMS.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-sans text-sm text-mar-brown/80 transition-colors hover:text-mar-brown"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  key={item.label}
                  className="flex items-center gap-2 font-sans text-sm text-mar-brown/40"
                  aria-disabled="true"
                >
                  {item.label}
                  <span className="rounded-full border border-mar-brown/15 px-2 py-0.5 text-[10px] uppercase tracking-widest text-mar-brown/40">
                    próximamente
                  </span>
                </span>
              )
            )}
          </nav>

          {/* Social links — new tab, no referrer leak (ft-R1) */}
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-mar-brown/60">
              Síguenos
            </p>
            <div className="mt-4 flex gap-3">
              {SOCIALS.map((social) => {
                const Icon = SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS];
                if (!Icon) return null;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-mar-brown/15 text-mar-brown/70 transition-colors hover:border-mar-brown hover:text-mar-brown"
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legal line (ft-R5) + conditional coverage link (ft-R3/D7) */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-mar-brown/10 pt-6 sm:flex-row">
          <p className="font-sans text-xs text-mar-brown/60">
            © {year} Detalles Maranatha · Hecho a mano
          </p>
          {coverageHref && (
            <a
              href={coverageHref}
              className="font-sans text-xs text-mar-brown/70 underline underline-offset-4 hover:text-mar-brown"
            >
              Domicilios en Bogotá
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
