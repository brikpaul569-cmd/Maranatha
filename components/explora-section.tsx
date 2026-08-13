import Section from "@/components/ui/section";
import Eyebrow from "@/components/ui/eyebrow";
import Watermark from "@/components/watermark";

/**
 * Home "Explora" section (user direction): a different rhythm from the hero —
 * no animated headline; a content-forward category sheet with Anthropic-style
 * watermark motifs on the pastel background. SSG-safe: every link is a real
 * route (hdr-R2) and the section renders without JS.
 */

const EXPLORA_ITEMS = [
  {
    title: "Catálogo",
    text: "Mira los arreglos por categoría y encuentra el detalle perfecto para tu ocasión.",
    href: "/catalogo",
  },
  {
    title: "Galería",
    text: "Inspírate con nuestros últimos trabajos y estilos artesanales.",
    href: "/galeria",
  },
];

export default function ExploraSection() {
  return (
    <Section mood="nosotros" id="explora" className="relative">
      {/* Anthropic-style motif watermarks (user direction). */}
      <Watermark
        src="/placeholders/flower.svg"
        className="right-6 top-8 w-20 md:w-28"
      />
      <Watermark
        src="/placeholders/ribbon.svg"
        className="bottom-8 left-6 w-16 md:w-24"
        opacity={0.12}
      />
      <Watermark
        src="/placeholders/gift.svg"
        className="bottom-10 right-10 hidden w-16 md:block"
        opacity={0.1}
      />

      <div className="relative">
        <Eyebrow>Explora</Eyebrow>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-mar-brown md:text-5xl">
          Un detalle para cada momento
        </h2>
        <p className="mt-4 max-w-xl text-mar-brown/70">
          Arreglos florales, regalos y detalles artesanales hechos a mano en
          Bogotá. Elegí tu camino y pedí el tuyo por WhatsApp.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {EXPLORA_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="theme-card group glass-surface p-7 transition-transform duration-300 motion-safe:hover:-translate-y-1"
            >
              <h3 className="font-futura text-sm font-semibold uppercase tracking-widest text-mar-brown">
                {item.title}
              </h3>
              <p className="mt-2 text-mar-brown/70">{item.text}</p>
              <span className="mt-4 inline-block font-futura text-xs font-semibold uppercase tracking-widest text-mar-gold">
                Ver →
              </span>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}
