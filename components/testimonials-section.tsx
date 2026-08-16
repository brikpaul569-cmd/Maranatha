"use client";

import Section from "@/components/ui/section";
import Eyebrow from "@/components/ui/eyebrow";
import SplitText from "@/components/split-text";
import Reveal from "@/components/reveal";
import PawPrints from "@/components/paw-prints";

// TODO: replace placeholder testimonials with real customer reviews (PROJECT-BRIEF §roadmap item 6).

type Testimonial = {
  quote: string;
  author: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "El arreglo llegó perfecto y el mensaje manuscrito fue un detalle hermoso.",
    author: "Mariana R. — Cumpleaños, Bogotá",
  },
  {
    quote: "Flores fresquísimas y el envío en menos de 2 horas.",
    author: "Camilo T. — Aniversario, Bogotá",
  },
  {
    quote: "El taller de arreglos fue una experiencia inolvidable.",
    author: "Luisa M. — Taller, Bogotá",
  },
];

/**
 * Home "Testimonios" section (prueba social): social proof with soft floating
 * glass cards in the collage language — rounded, softly shadowed, no hard
 * boxes. Reveals each card with a staggered fade+rise; heading splits by
 * words. SSG-safe: plain string literals in the markup.
 */
export default function TestimonialsSection() {
  return (
    <Section
      mood="nosotros"
      sheet={false}
      className="relative overflow-hidden bg-[var(--section-mood)]"
    >
      <div className="max-w-2xl">
        <Eyebrow>Testimonios</Eyebrow>
        <SplitText
          as="h2"
          by="words"
          stagger={0.05}
          className="mt-3 font-display text-3xl leading-tight text-mar-brown md:text-5xl"
        >
          Lo que dicen nuestros clientes
        </SplitText>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {TESTIMONIALS.map((testimonial, index) => (
          <Reveal key={testimonial.author} delay={index * 0.12}>
            <article className="glass-card rounded-[var(--card-radius)] p-6 shadow-[var(--card-shadow)] md:p-8">
              <p className="text-base leading-relaxed text-mar-brown/80">
                {testimonial.quote}
              </p>
              <div
                role="img"
                aria-label="5 de 5 estrellas"
                className="mt-4 text-mar-gold"
              >
                ★★★★★
              </div>
              <p className="mt-3 font-futura text-sm font-semibold uppercase tracking-widest text-mar-brown">
                {testimonial.author}
              </p>
            </article>
          </Reveal>
        ))}
      </div>

      <PawPrints className="bottom-10 left-6 md:bottom-12 md:left-10" />
    </Section>
  );
}
