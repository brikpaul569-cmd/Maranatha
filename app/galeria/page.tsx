import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/ui/section";
import Watermark from "@/components/watermark";
import Eyebrow from "@/components/ui/eyebrow";
import Button from "@/components/ui/button";
import ParallaxFloat from "@/components/parallax-float";

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
      <Section
        mood="galeria"
        className="relative bg-[var(--section-mood)]"
        sheet={false}
      >
        <Watermark
          src="/placeholders/ribbon.svg"
          className="right-8 top-6 w-20 md:w-24"
        />
        <Watermark
          src="/placeholders/flower.svg"
          className="bottom-8 left-6 w-16 md:w-20"
          opacity={0.12}
        />

        {/* Texto sobre fondo: sin cajas, sin animación, texto directo al fondo. */}
        <div className="max-w-2xl">
          <Eyebrow>Nuestros detalles</Eyebrow>

          <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-mar-brown">
            Galería
          </h1>

          <p className="mt-6 max-w-xl font-sans text-base text-mar-brown/80 md:text-lg">
            Cada arreglo de Detalles Maranatha se hace a mano en Bogotá:
            flores de listón que no se marchitan, bouquets de limpiapipas,
            arreglos con peluche y canastas de café Cerquera. Pronto
            publicaremos la galería completa con nuestros trabajos reales.
            Mientras tanto, explora las categorías y pide el tuyo por
            WhatsApp.
          </p>
        </div>

        {/* Grid de galería: items sin bordes, sin fondo de caja, sin sombra.
            El texto del caption flota sobre el fondo con efecto espejo/cristal. */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {GALLERY_ITEMS.map((item, index) => (
            <ParallaxFloat
              key={item.caption}
              speed={(index % 3) * 0.1 + 0.15}
              float
            >
              <Link
                href={item.href}
                className="group block overflow-hidden transition-transform duration-300 motion-safe:hover:-translate-y-1"
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
            </ParallaxFloat>
          ))}
        </div>

        <ParallaxFloat className="mt-14" speed={0.2} float>
          <Button href="/catalogo">Ver catálogo completo</Button>
        </ParallaxFloat>
      </Section>
    </main>
  );
}
