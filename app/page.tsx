import FloatingCollage from "@/components/floating-collage";
import Reveal from "@/components/reveal";

// TODO: replace with the real Maranatha WhatsApp number before launch.
const WHATSAPP_URL = "https://wa.me/573000000000";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-mar-cream px-6 text-center">
      <FloatingCollage
        className="absolute inset-0"
        items={[
          {
            src: "/placeholders/flower.svg",
            alt: "Arreglo floral en tonos rosados",
            className: "left-[4%] top-[16%] w-[45%] max-w-lg",
            speed: 1.2,
            priority: true,
          },
          {
            src: "/placeholders/ribbon.svg",
            alt: "Cinta dorada para detalles",
            className: "right-[6%] top-[10%] w-[28%] max-w-xs",
            speed: -0.6,
          },
          {
            src: "/placeholders/gift.svg",
            alt: "Detalle de regalo en verde salvia",
            className: "right-[14%] bottom-[6%] w-[34%] max-w-sm",
            speed: 0.7,
          },
        ]}
      />

      <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8">
        <Reveal>
          <h1 className="font-display text-[clamp(3rem,12vw,9rem)] leading-[0.95] tracking-tight text-mar-brown">
            Detalles que dicen lo que las palabras no alcanzan
          </h1>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="font-sans text-sm uppercase tracking-[0.35em] text-mar-brown/80">
            Arreglos florales artesanales hechos a mano en Bogotá
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-mar-brown px-8 py-4 text-sm font-semibold uppercase tracking-widest text-mar-card transition-colors hover:bg-mar-brown/90"
          >
            Pedir por WhatsApp
          </a>
        </Reveal>
      </div>
    </main>
  );
}
