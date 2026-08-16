import type { Metadata } from "next";
import Link from "next/link";
import { OCASION_LINKS } from "@/lib/constants";
import Reveal from "@/components/reveal";
import Button from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import Section from "@/components/ui/section";
import Watermark from "@/components/watermark";

/**
 * Ocasiones hub (static, SSG-friendly — no client hooks). Lightweight index of
 * every occasion taxonomy from lib/products.ts, linking to the per-occasion
 * pages. Mood: catalogo-gold.
 */

export const metadata: Metadata = {
  title: "Ocasiones",
  description:
    "Ideas de regalo para cada ocasión en Bogotá: San Valentín, cumpleaños, Amor y Amistad, Día de la Madre, aniversarios y más. Arreglos florales hechos a mano por Detalles Maranatha, con domicilio el mismo día.",
};

export default function OcasionesPage() {
  return (
    <main>
      <Section
        mood="catalogo-gold"
        className="relative bg-[var(--section-mood)]"
        sheet={false}
      >
        <Watermark
          doodle="flower"
          className="right-8 top-6 w-20 md:w-24"
        />
        <Watermark
          doodle="gift"
          className="bottom-8 left-6 w-16 md:w-20"
          opacity={0.12}
        />

        <Link
          href="/catalogo"
          className="font-sans text-sm font-semibold uppercase tracking-widest text-mar-brown/70 transition-colors hover:text-mar-brown"
        >
          ← Todo el catálogo
        </Link>

        <div className="mt-6 max-w-2xl">
          <Reveal>
            <Eyebrow>Ideas para regalar</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-mar-brown">
              Ocasiones
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 font-sans text-base text-mar-brown/80 md:text-lg">
              Cada ocasión merece un detalle hecho a mano. Elige la tuya y
              descubre los arreglos que Detalles Maranatha prepara para
              celebrarla, con entrega a domicilio en Bogotá el mismo día.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OCASION_LINKS.map((occasion, index) => (
            <Reveal key={occasion.slug} delay={(index % 3) * 0.08} y={24}>
              <Link
                href={`/ocasiones/${occasion.slug}`}
                className="group flex h-full flex-col gap-3 glass-surface p-6 transition-transform duration-300 motion-reduce:transition-none motion-safe:hover:-translate-y-1"
              >
                <span aria-hidden className="size-2 rounded-full bg-mar-gold" />
                <h2 className="font-display text-xl text-mar-brown">
                  {occasion.label}
                </h2>
                <p className="font-sans text-sm text-mar-brown/80 line-clamp-3">
                  {occasion.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 font-futura text-xs font-semibold uppercase tracking-widest text-mar-brown/70 transition-colors group-hover:text-mar-gold">
                  Ver detalles
                  <span aria-hidden>→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-14 flex flex-wrap gap-3">
          <Button href="/catalogo">Explorar todo el catálogo</Button>
        </Reveal>
      </Section>
    </main>
  );
}
