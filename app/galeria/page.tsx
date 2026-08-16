import type { Metadata } from "next";
import Section from "@/components/ui/section";
import Watermark from "@/components/watermark";
import Eyebrow from "@/components/ui/eyebrow";
import Button from "@/components/ui/button";
import ParallaxFloat from "@/components/parallax-float";
import CascadeReveal from "@/components/cascade-reveal";
import DetailClip from "@/components/detail-clip";
import GalleryLightbox from "@/components/gallery-lightbox";

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
          doodle="flower"
          className="right-8 top-6 w-20 md:w-24"
        />
        <Watermark
          doodle="gift"
          className="bottom-8 left-6 w-16 md:w-20"
          opacity={0.12}
        />

        {/* Texto sobre fondo: sin cajas, sin animación, texto directo al fondo. */}
        <div className="max-w-2xl">
          <Eyebrow>Nuestros detalles</Eyebrow>

           <h1 className="mt-4 inline-flex flex-wrap items-center gap-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-mar-brown">
             Galería <DetailClip variant="gift" />
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
            Revelación en cascada al hacer scroll, caption directo al fondo.
            Cada item abre el lightbox con transición compartida (GSAP Flip). */}
        <CascadeReveal>
          <GalleryLightbox items={GALLERY_ITEMS} />
        </CascadeReveal>

        <ParallaxFloat className="mt-14" speed={0.2} float>
          <Button href="/catalogo" magnetic>Ver catálogo completo</Button>
        </ParallaxFloat>
      </Section>
    </main>
  );
}
