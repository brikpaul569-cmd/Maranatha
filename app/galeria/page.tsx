import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/reveal";
import Button from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import Section from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Galería de Detalles Maranatha: flores de listón, bouquets de limpiapipas, arreglos con peluche y canastas de café hechos a mano en Bogotá. Mira nuestros detalles y pide el tuyo por WhatsApp.",
};

const GALLERY_ITEMS = [
  {
    src: "/placeholders/flower.svg",
    alt: "Ramo de rosas de listón hecho a mano",
    caption: "Flores de listón",
    href: "/catalogo/flores-liston",
  },
  {
    src: "/placeholders/gift.svg",
    alt: "Canasta con peluche y flores",
    caption: "Arreglos con peluche",
    href: "/catalogo/arreglos-peluche",
  },
  {
    src: "/placeholders/ribbon.svg",
    alt: "Moño dorado de un detalle hecho a mano",
    caption: "Canastas y detalles",
    href: "/catalogo/canastas-detalles",
  },
  {
    src: "/placeholders/flower.svg",
    alt: "Bouquet de limpiapipas colorido",
    caption: "Flores de limpiapipas",
    href: "/catalogo/flores-limpiapipas",
  },
  {
    src: "/placeholders/gift.svg",
    alt: "Canasta de Café Cerquera de regalo",
    caption: "Canastas de café Cerquera",
    href: "/catalogo/canastas-detalles",
  },
  {
    src: "/placeholders/ribbon.svg",
    alt: "Detalle personalizado con moño",
    caption: "Detalles para cada ocasión",
    href: "/catalogo",
  },
];

export default function GaleriaPage() {
  return (
    <main>
      <Section mood="galeria" className="bg-[var(--section-mood)]">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Nuestros detalles</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-mar-brown">
              Galería
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 font-sans text-base text-mar-brown/80 md:text-lg">
              Cada arreglo de Detalles Maranatha se hace a mano en Bogotá:
              flores de listón que no se marchitan, bouquets de limpiapipas,
              arreglos con peluche y canastas de café Cerquera. Pronto
              publicaremos la galería completa con nuestros trabajos reales.
              Mientras tanto, explora las categorías y pide el tuyo por
              WhatsApp.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {GALLERY_ITEMS.map((item, index) => (
            <Reveal key={item.caption} delay={(index % 3) * 0.08} y={24}>
              <Link
                href={item.href}
                className="group block overflow-hidden rounded-2xl bg-mar-card shadow-sm transition-transform duration-300 motion-safe:hover:-translate-y-1"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-mar-pink-light">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <p className="p-4 font-sans text-sm font-semibold uppercase tracking-widest text-mar-brown">
                  {item.caption}
                </p>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-14 flex flex-wrap gap-3">
          <Button href="/catalogo">Ver catálogo completo</Button>
          <Button variant="whatsapp" message="Hola 👋 Quiero ver el catálogo de Detalles Maranatha">
            Pedir por WhatsApp
          </Button>
        </Reveal>
      </Section>
    </main>
  );
}
