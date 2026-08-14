import { HOURS, ROUTES, SOCIALS } from "@/lib/constants";
import {
  BoxCheckIcon,
  InstagramIcon,
  ShieldIcon,
  SproutIcon,
  TikTokIcon,
} from "@/components/ui/icons";

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
} as const;

/**
 * Trust badges (user direction): the footer column that used to repeat the
 * main nav now reassures with brand/eco signals instead — security seal and
 * sustainable packaging/sourcing. Pure static copy, no links.
 */
const TRUST_BADGES: { label: string; icon: typeof ShieldIcon }[] = [
  { label: "Sitio seguro para tus transacciones", icon: ShieldIcon },
  { label: "Empaques 100% amigables con el planeta", icon: BoxCheckIcon },
  { label: "Materiales de origen responsable", icon: SproutIcon },
];

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

          {/* Trust signals (user direction) — replaces the repeated main-nav
              mini-sitemap with brand/eco reassurance, ft-R1. */}
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.35em] text-mar-brown/60">
              Nuestro compromiso
            </p>
            <p className="mt-4 font-display text-lg leading-snug text-mar-brown">
              Un pequeño detalle con mucho cariño.
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {TRUST_BADGES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <li
                    key={badge.label}
                    className="flex items-start gap-2.5 font-sans text-sm text-mar-brown/80"
                  >
                    <Icon className="mt-0.5 size-4 shrink-0 text-mar-gold" />
                    <span>{badge.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

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

        {/* Coming-soon teaser (user direction) — strategic spot above the
            legal line: announces that more modules are coming to the site for
            the Maranatha business. */}
        <div className="mx-auto mt-14 max-w-xl text-center">
          <p className="font-display text-lg text-mar-brown">
            Próximamente: más funcionalidades para Maranatha
          </p>
          <p className="mt-2 font-sans text-sm text-mar-brown/70">
            Nuevos módulos para el sitio web y el negocio están en camino.
            ¡Muy pronto!
          </p>
        </div>

        {/* Legal line (ft-R5) + conditional coverage link (ft-R3/D7) */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-mar-brown/10 pt-6 sm:flex-row">
          <p className="font-sans text-xs text-mar-brown/60">
            © {year} Detalles Maranatha · Todos los derechos reservados
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

        {/* Developer credit (user direction) — short, small, at the very end;
            links to the developer portfolio in a new tab. */}
        <p className="mt-6 text-center font-sans text-xs text-mar-brown/60 sm:text-right">
          Diseñado y desarrollado{" "}
          <a
            href="https://brikpaul569-cmd.github.io/BrikOficial/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-mar-gold underline-offset-4 transition-colors hover:text-mar-brown hover:underline"
          >
            by Brik
          </a>
        </p>
      </div>
    </footer>
  );
}
