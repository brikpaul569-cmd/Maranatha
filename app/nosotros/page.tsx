import type { Metadata } from "next";
import Reveal from "@/components/reveal";
import Button from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import Section from "@/components/ui/section";

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

export default function NosotrosPage() {
  return (
    <main>
      <Section mood="nosotros" className="bg-[var(--section-mood)]">
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
          <Reveal delay={0.15}>
            <p className="mt-4 font-sans text-base text-mar-brown/80 md:text-lg">
              Nuestras rosas de satín no se marchitan: quedan como recuerdo
              permanente de un momento especial. Trabajamos de forma artesanal,
              con atención a los detalles, y coordinamos la entrega el mismo
              día en Bogotá a través de WhatsApp para que el regalo llegue a
              tiempo y sin complicaciones.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 font-sans text-base text-mar-brown/80 md:text-lg">
              Creemos que un detalle dice lo que las palabras no alcanzan. Por
              eso cada pedido es una oportunidad de consentir a alguien: nos
              cuentas a quién va dirigido y lo armamos a tu gusto.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-20">
          <h2 className="font-display text-2xl text-mar-brown md:text-3xl">
            Lo que nos hace distintos
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, index) => (
            <Reveal key={value.title} delay={(index % 4) * 0.08} y={24}>
              <div className="flex h-full flex-col gap-2 rounded-2xl bg-mar-card p-6 shadow-sm">
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

        <Reveal delay={0.1} className="mt-20 flex flex-wrap gap-3">
          <Button variant="whatsapp" message="Hola 👋 Quiero saber más sobre Detalles Maranatha">
            Escríbenos por WhatsApp
          </Button>
          <Button variant="ghost" href="/catalogo">
            Ver catálogo
          </Button>
        </Reveal>
      </Section>
    </main>
  );
}
