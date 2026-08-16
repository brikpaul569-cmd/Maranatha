import Section from "@/components/ui/section";
import Eyebrow from "@/components/ui/eyebrow";
import Watermark from "@/components/watermark";
import PawPrints from "@/components/paw-prints";
import GlassSurface from "@/components/glass-surface";
import ParallaxFloat from "@/components/parallax-float";
import SplitText from "@/components/split-text";
import {
  HandshakeIcon,
  LeafCircleIcon,
  PuzzleIcon,
} from "@/components/ui/icons";

/**
 * Home "Aliados" section (user direction): B2B trust signals from the
 * "Marcas que confían en nosotros" idea — handshake (successful partnerships
 * and loyalty), interlocking puzzle (brands that fit with our values),
 * leaf-in-circle (natural products and eco processes). No invented brand
 * names: allies are described by relationship, never endorsing real companies.
 * SSG-safe: pure static copy, no links or JS.
 *
 * Refactored 2026-08-13: sheet={false}, glass surfaces, parallax + floating,
 * SplitText reveals — no card boxes, no borders, no shadows.
 */

const ALLY_ITEMS: {
  title: string;
  text: string;
  icon: typeof HandshakeIcon;
}[] = [
  {
    title: "Acuerdos y lealtad",
    text: "Asociaciones exitosas y lazos duraderos con clientes y proveedores, como un equipo que crece junto a vos.",
    icon: HandshakeIcon,
  },
  {
    title: "Aliados que encajan",
    text: "Trabajamos con marcas que comparten nuestros valores: el trabajo en equipo da mejores resultados para cada cliente.",
    icon: PuzzleIcon,
  },
  {
    title: "Respeto por el entorno",
    text: "Productos naturales y procesos que cuidan el planeta, con materiales de origen responsable.",
    icon: LeafCircleIcon,
  },
];

export default function AliadosSection() {
  return (
    <Section mood="contacto" id="aliados" className="relative" sheet={false}>
      <Watermark
        src="/placeholders/flower.svg"
        className="right-6 top-8 w-20 md:w-28"
      />
      <Watermark
        src="/placeholders/ribbon.svg"
        className="bottom-8 left-6 w-16 md:w-24"
        opacity={0.12}
      />

      {/* Texto: flota sobre el fondo con espejo/cristal, parallax y SplitText. */}
      <div className="max-w-2xl">
        <ParallaxFloat speed={0.15} float>
          <Eyebrow>Aliados</Eyebrow>
        </ParallaxFloat>

        <GlassSurface className="mt-3">
          <ParallaxFloat speed={0.5} float>
            <SplitText
              as="h2"
              by="chars"
              stagger={0.05}
              className="font-display text-3xl leading-tight text-mar-brown md:text-5xl"
            >
              Marcas que confían en nosotros
            </SplitText>
          </ParallaxFloat>
        </GlassSurface>

        <GlassSurface className="mt-4 max-w-xl">
          <ParallaxFloat speed={0.2} float>
            <SplitText
              as="p"
              by="words"
              stagger={0.04}
              className="text-mar-brown/70"
            >
              Construimos cada detalle junto a aliados que comparten nuestro
              cuidado por lo hecho a mano y por el planeta.
            </SplitText>
          </ParallaxFloat>
        </GlassSurface>
      </div>

      {/* Tarjetas de aliados: sin bordes, sin sombra, sin fondo de caja.
          El efecto espejo/cristal reemplaza el bg-mar-card/40 anterior. */}
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {ALLY_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <ParallaxFloat
              key={item.title}
              speed={(index % 3) * 0.1 + 0.15}
              float
            >
              <div
                className="theme-card group glass-surface p-7 transition-transform duration-300 motion-safe:hover:-translate-y-1"
              >
                <Icon className="size-6 text-mar-gold" />
                <h3 className="mt-4 font-futura text-sm font-semibold uppercase tracking-widest text-mar-brown">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-mar-brown/70">{item.text}</p>
              </div>
            </ParallaxFloat>
          );
        })}
      </div>

      <PawPrints className="bottom-10 left-6 md:bottom-12 md:left-10" />
    </Section>
  );
}
