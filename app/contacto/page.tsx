import type { Metadata } from "next";
import { HOURS, SOCIALS } from "@/lib/constants";
import {
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";
import Reveal from "@/components/reveal";
import Eyebrow from "@/components/ui/eyebrow";
import Section from "@/components/ui/section";
import Watermark from "@/components/watermark";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos por WhatsApp: pedidos de flores de listón, arreglos con peluche y canastas de regalo en Bogotá. Te atendemos de lunes a sábado y coordinamos el domicilio el mismo día.",
};

const SOCIAL_ICONS = {
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
} as const;

export default function ContactoPage() {
  return (
    <main>
      <Section mood="contacto" className="relative bg-[var(--section-mood)]">
        <Watermark
          src="/placeholders/gift.svg"
          className="right-8 top-6 w-20 md:w-24"
        />
        <Watermark
          src="/placeholders/ribbon.svg"
          className="bottom-8 left-6 w-16 md:w-20"
          opacity={0.12}
        />
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Hablemos</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-mar-brown">
              Contacto
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 font-sans text-base text-mar-brown/80 md:text-lg">
              En Detalles Maranatha todo se coordina por WhatsApp: nos cuentas
              qué quieres regalar, a quién va dirigido y para cuándo lo
              necesitas, y lo armamos a tu gusto. Escribinos hoy mismo y te
              respondemos durante nuestro horario de atención.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <div className="flex h-full flex-col gap-2 rounded-2xl bg-mar-card p-6 shadow-sm">
              <h2 className="font-display text-xl text-mar-brown">Horario</h2>
              <p className="font-sans text-sm text-mar-brown/80">
                {HOURS.days}
              </p>
              <p className="font-sans text-sm font-semibold text-mar-brown">
                {HOURS.time}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex h-full flex-col gap-2 rounded-2xl bg-mar-card p-6 shadow-sm">
              <h2 className="flex items-center gap-2 font-display text-xl text-mar-brown">
                <WhatsAppIcon className="size-5 text-mar-gold" />
                WhatsApp
              </h2>
              <p className="font-sans text-sm text-mar-brown/80">
                El canal más rápido para pedir: cuéntanos el detalle y
                coordinamos el domicilio el mismo día en Bogotá.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="flex h-full flex-col gap-2 rounded-2xl bg-mar-card p-6 shadow-sm">
              <h2 className="font-display text-xl text-mar-brown">Redes</h2>
              <p className="font-sans text-sm text-mar-brown/80">
                Síguenos para ver los últimos arreglos, promociones y detalle
                del proceso artesanal.
              </p>
              <div className="mt-auto flex gap-3">
                {SOCIALS.map((social) => {
                  const Icon =
                    SOCIAL_ICONS[social.label as keyof typeof SOCIAL_ICONS];
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
          </Reveal>
        </div>
      </Section>
    </main>
  );
}
