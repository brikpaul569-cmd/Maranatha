import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import Button from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import Section from "@/components/ui/section";
import Watermark from "@/components/watermark";
import PhotoFrame from "@/components/photo-frame";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Detalles Maranatha: flores de listón, bouquets de limpiapipas, arreglos con peluche y canastas de café hechos a mano en Bogotá. Domicilios el mismo día y pedidos por WhatsApp.",
};

const VALUES = [
  {
    title: "Hecho a mano",
    description:
      "Cada flor y cada arreglo se elaboran a mano con listón, limpiapipas y materiales cuidados por nuestras artesanas.",
  },
  {
    title: "Domicilios en Bogotá",
    description:
      "Entrega el mismo día en Bogotá. Coordinamos fecha, hora y zona directamente por WhatsApp.",
  },
  {
    title: "Pedidos por WhatsApp",
    description:
      "El pedido se hace en un chat, sin formularios ni trámites: nos cuentas el detalle y lo armamos a tu gusto.",
  },
  {
    title: "Atención personalizada",
    description:
      "Te asesoramos para elegir el regalo ideal según la ocasión, el presupuesto y a quién va dirigido.",
  },
];

const HOW_WE_WORK = [
  "Elaboramos todo a mano, con listón, limpiapipas y materiales cuidados.",
  "Entregamos el mismo día en Bogotá, coordinado directamente por WhatsApp.",
  "Ajustamos cada detalle a la ocasión y al gusto de quien lo recibe.",
];

export default function NosotrosPage() {
  return (
    <main>
      <Section
        mood="nosotros"
        className="relative bg-[var(--section-mood)]"
        sheet={false}
      >
        <Watermark
          doodle="flower"
          className="right-8 top-6 w-20 md:w-24"
        />
        <Watermark
          doodle="bear"
          className="bottom-8 left-6 w-16 md:w-20"
          opacity={0.12}
        />

        {/* Header */}
        <div className="max-w-3xl">
          <Reveal>
            <Eyebrow>Detalles Maranatha</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-mar-brown">
              Nosotros
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 font-sans text-base text-mar-brown/80 md:text-lg">
              Detalles Maranatha nació como un emprendimiento familiar en
              Bogotá con una idea sencilla: los mejores regalos son los que se
              hacen a mano. Elaboramos flores de listón, bouquets de
              limpiapipas, arreglos con peluche y canastas de café (nuestra
              marca propia, Café Cerquera) pensando en cada ocasión: San
              Valentín, cumpleaños, el Día de la Madre, aniversarios o un
              simple «gracias».
            </p>
          </Reveal>
        </div>

        {/* Banda 1 — zigzag: photo left, story right */}
        <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-center md:gap-12">
          <Reveal className="md:order-1">
            <PhotoFrame
              src="/maranatha.jpeg"
              alt="Logotipo de Detalles Maranatha"
              rotate="-rotate-3"
              caption="Nuestra esencia, hecha a mano"
            />
          </Reveal>
          <div className="md:order-2">
            <Reveal>
              <p className="font-sans text-base text-mar-brown/80 md:text-lg">
                Nuestras rosas de satín no se marchitan: quedan como recuerdo
                permanente de un momento especial. Trabajamos de forma
                artesanal, con atención a los detalles, y coordinamos la
                entrega el mismo día en Bogotá a través de WhatsApp para que el
                regalo llegue a tiempo y sin complicaciones.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Banda 2 — zigzag invertido: story left, motif card right */}
        <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-center md:gap-12">
          <div className="md:order-2">
            <Reveal>
              <p className="font-sans text-base text-mar-brown/80 md:text-lg">
                Creemos que quien recibe un detalle hecho a mano siente que
                alguien pensó en él. Por eso cada pedido es una oportunidad de
                consentir a alguien: nos cuentas a quién va dirigido y lo
                armamos a tu gusto.
              </p>
            </Reveal>
            <Reveal delay={0.05} className="mt-8">
              <h3 className="font-display text-xl text-mar-brown">
                Cómo trabajamos
              </h3>
              <ul className="mt-4 space-y-3">
                {HOW_WE_WORK.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-mar-gold"
                    />
                    <span className="font-sans text-base text-mar-brown/80">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal className="md:order-1">
            <PhotoFrame
              src="/placeholders/flower.svg"
              alt=""
              rotate="rotate-2"
              caption="Arte floral con intención"
              fit="contain"
            />
          </Reveal>
        </div>

        {/* VALUES */}
        <Reveal delay={0.1} className="mt-20">
          <h2 className="font-display text-2xl text-mar-brown md:text-3xl">
            Lo que nos hace distintos
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, index) => (
            <Reveal key={value.title} delay={(index % 4) * 0.08} y={24}>
              <div
                className={`flex h-full flex-col gap-3 glass-surface p-6 transition-transform duration-300 motion-reduce:transition-none motion-safe:hover:-translate-y-1 ${
                  index % 2 === 0 ? "md:rotate-1" : "md:-rotate-1"
                }`}
              >
                <span aria-hidden className="size-2 rounded-full bg-mar-gold" />
                <h3 className="font-display text-xl text-mar-brown">
                  {value.title}
                </h3>
                <p className="font-sans text-sm text-mar-brown/80">
                  {value.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={0.1} className="mt-20 flex flex-wrap gap-3">
          <Button variant="ghost" href="/catalogo">
            Ver catálogo
          </Button>
        </Reveal>
      </Section>
    </main>
  );
}
