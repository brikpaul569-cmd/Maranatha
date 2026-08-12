import Section from "@/components/ui/section";
import Eyebrow from "@/components/ui/eyebrow";
import Watermark from "@/components/watermark";
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
    <Section mood="contacto" id="aliados" className="relative">
      <Watermark
        src="/placeholders/flower.svg"
        className="right-6 top-8 w-20 md:w-28"
      />
      <Watermark
        src="/placeholders/ribbon.svg"
        className="bottom-8 left-6 w-16 md:w-24"
        opacity={0.12}
      />

      <div className="relative">
        <Eyebrow>Aliados</Eyebrow>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-mar-brown md:text-5xl">
          Marcas que confían en nosotros
        </h2>
        <p className="mt-4 max-w-xl text-mar-brown/70">
          Construimos cada detalle junto a aliados que comparten nuestro
          cuidado por lo hecho a mano y por el planeta.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {ALLY_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="theme-card group rounded-3xl border border-mar-brown/10 bg-mar-card/40 p-7 transition-transform duration-300 motion-safe:hover:-translate-y-1"
              >
                <Icon className="size-6 text-mar-gold" />
                <h3 className="mt-4 font-futura text-sm font-semibold uppercase tracking-widest text-mar-brown">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-mar-brown/70">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
