import type { Metadata } from "next";
import Image from "next/image";
import Section from "@/components/ui/section";
import Eyebrow from "@/components/ui/eyebrow";
import Button from "@/components/ui/button";
import Watermark from "@/components/watermark";
import BearDiagram from "@/components/bear-diagram";
import { TALLER_WORKSHOPS, waMeUrl } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Talleres",
  description:
    "Talleres de Detalles Maranatha en Bogotá: aprendé a hacer flores de listón, bouquets de limpiapipas, canastas de regalo y envolturas florales hechas a mano. Reservá tu cupo por WhatsApp.",
};

/**
 * Taller home (eco-E5): the workshop ecosystem's landing page — server
 * component, fully static, all text SSR-safe. A different world from the
 * tienda: pastel lavender/mint/peach bands, borderless floating cards and
 * frame-less text, but the same Maranatha brand, WhatsApp CTAs and warm
 * handmade voice.
 */

const LEARN_CHIPS: { label: string; message: string }[] = [
  {
    label: "Flores de listón",
    message: "Hola 👋 Quiero aprender a hacer flores de listón",
  },
  {
    label: "Bouquets de limpiapipas",
    message: "Hola 👋 Quiero aprender a hacer bouquets de limpiapipas",
  },
  {
    label: "Canastas de regalo",
    message: "Hola 👋 Quiero aprender a armar canastas de regalo",
  },
  {
    label: "Envolturas y tarjetas",
    message: "Hola 👋 Quiero aprender envoltura floral y tarjetas",
  },
];

export default function TallerPage() {
  return (
    <main>
      {/* Hero — pastel lavender, floating motifs, no frames (eco-E5) */}
      <Section
        mood="taller-hero"
        className="relative overflow-hidden bg-[var(--section-mood)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 top-20 w-40 rotate-12 md:w-60"
        >
          <Image
            src="/placeholders/flower.svg"
            alt=""
            width={400}
            height={400}
            loading="lazy"
            className="h-auto w-full object-contain drop-shadow-[0_20px_32px_rgba(93,72,128,0.35)]"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute -left-8 bottom-14 w-32 -rotate-6 md:w-44"
        >
          <Image
            src="/placeholders/ribbon.svg"
            alt=""
            width={400}
            height={400}
            loading="lazy"
            className="h-auto w-full object-contain drop-shadow-[0_20px_32px_rgba(93,72,128,0.35)]"
          />
        </div>

        <div className="relative flex min-h-[72vh] flex-col justify-center py-16 md:min-h-[80vh]">
          <Eyebrow>Detalles Maranatha · Taller</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,6.5vw,5rem)] leading-[0.95] tracking-tight text-mar-brown">
            Aprendé a hacer{" "}
            <span className="text-mar-gold">los detalles</span> con tus manos
          </h1>
          <p className="mt-6 max-w-xl font-sans text-base text-mar-brown/80 md:text-lg">
            En el taller de Detalles Maranatha te enseñamos el oficio: flores
            de listón, bouquets de limpiapipas, canastas de regalo y envolturas
            hechas a mano, paso a paso y sin experiencia previa.
          </p>

          {/* Diagrama técnico del osito artesanal — producto estrella del taller */}
          <div className="mt-10 flex justify-center">
            <BearDiagram className="w-full max-w-3xl" />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#talleres">Ver los talleres</Button>
            <Button
              variant="whatsapp"
              message="Hola 👋 Quiero inscribirme a un taller de Detalles Maranatha"
            >
              Inscribirme por WhatsApp
            </Button>
          </div>
        </div>
      </Section>

      {/* Zona de talleres — mint band, floating borderless cards */}
      <Section
        mood="taller-talleres"
        id="talleres"
        sheet={false}
        className="relative scroll-mt-20 bg-[var(--section-mood)]"
      >
        <Watermark
          src="/placeholders/gift.svg"
          className="right-8 top-8 w-16 md:w-20"
          opacity={0.12}
        />

        <div className="max-w-2xl">
          <Eyebrow>Zona de talleres</Eyebrow>
          <h2 className="mt-4 font-display text-2xl text-mar-brown md:text-3xl">
            Talleres para aprender el oficio
          </h2>
          <p className="mt-4 font-sans text-base text-mar-brown/80">
            Cupos limitados, materiales incluidos y grupos pequeños. Elegí tu
            taller, reservá el cupo por WhatsApp y salí con tu detalle hecho a
            mano.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TALLER_WORKSHOPS.map((workshop) => (
            <article
              key={workshop.id}
              className="flex h-full flex-col gap-4 rounded-3xl bg-[var(--taller-card-bg)] p-7 shadow-[0_18px_40px_-18px_rgba(93,72,128,0.45)] backdrop-blur-sm transition-transform duration-300 motion-reduce:transition-none motion-safe:hover:-translate-y-1"
            >
              <h3 className="font-display text-lg text-mar-brown">
                {workshop.title}
              </h3>
              <p className="flex-1 font-sans text-sm text-mar-brown/80">
                {workshop.description}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-mar-pink-light px-3 py-1 font-futura text-[11px] font-semibold uppercase tracking-widest text-mar-brown/75">
                  {workshop.duration}
                </span>
                <span className="rounded-full bg-mar-sage/40 px-3 py-1 font-futura text-[11px] font-semibold uppercase tracking-widest text-mar-brown/75">
                  {workshop.level}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Aprende el oficio — peach band, frame-less text + floating chips */}
      <Section
        mood="taller-aprende"
        id="aprende"
        sheet={false}
        className="relative scroll-mt-20 bg-[var(--section-mood)]"
      >
        <Watermark
          src="/placeholders/flower.svg"
          className="bottom-8 right-8 w-16 md:w-20"
          opacity={0.12}
        />

        <div className="max-w-2xl">
          <Eyebrow>Aprende el oficio</Eyebrow>
          <h2 className="mt-4 font-display text-2xl text-mar-brown md:text-3xl">
            El detalle se aprende haciendo
          </h2>
          <p className="mt-4 font-sans text-base text-mar-brown/80">
            En Maranatha creemos que un detalle dice lo que las palabras no
            alcanzan, y ese oficio se aprende con las manos. Te acompañamos en
            cada paso: desde el primer pétalo hasta el listón final, en un
            ambiente pequeño, pastel y sin prisa.
          </p>
          <p className="mt-3 font-sans text-base text-mar-brown/80">
            Escribinos por WhatsApp y te contamos fechas, horarios y cómo
            reservar tu cupo.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {LEARN_CHIPS.map((chip) => (
            <a
              key={chip.label}
              href={waMeUrl(chip.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[var(--taller-card-bg)] px-5 py-2.5 font-futura text-sm font-semibold text-mar-brown/90 shadow-[0_12px_28px_-14px_rgba(93,72,128,0.5)] backdrop-blur-sm transition-transform duration-300 motion-reduce:transition-none motion-safe:hover:-translate-y-0.5"
            >
              {chip.label}
            </a>
          ))}
        </div>
      </Section>
    </main>
  );
}
