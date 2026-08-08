"use client";

import Section from "@/components/ui/section";
import Eyebrow from "@/components/ui/eyebrow";
import Button from "@/components/ui/button";
import SplitReveal from "@/components/split-reveal";
import FloatingCollage, { type CollageItem } from "@/components/floating-collage";

/**
 * Home hero (hero-R1–R9; design D3).
 *
 * Client component: GSAP-driven entrance only. All text is server-rendered
 * HTML (hero-R1) — the SplitReveal H1 is never hidden without JS, the collage
 * is purely decorative and the CTA is a real link (cc-R8). Mood is applied
 * through the Section shell (`--section-mood`, hero-R5).
 *
 * Composition (hero-R4): 3 images on desktop (dominant ~55% width, unbalanced,
 * ≥60% negative space, CTA unobstructed); 2 images on mobile (full-width
 * dominant; ribbon hidden below 768px).
 */

const COLLAGE_ITEMS: CollageItem[] = [
  {
    src: "/placeholders/flower.svg",
    alt: "Arreglo floral en tonos rosados",
    className:
      "left-0 top-[6%] aspect-square w-full md:left-[4%] md:top-[12%] md:w-[55%]",
    speed: 1.2,
    preload: true,
  },
  {
    src: "/placeholders/ribbon.svg",
    alt: "Cinta dorada para detalles",
    className:
      "right-[5%] top-[10%] hidden aspect-square w-[30%] md:block",
    speed: -0.6,
  },
  {
    src: "/placeholders/gift.svg",
    alt: "Detalle de regalo en verde salvia",
    className: "bottom-[8%] right-[8%] aspect-square w-[34%] md:w-[30%]",
    speed: 0.7,
  },
];

export default function HeroHome() {
  return (
    <Section
      mood="hero"
      id="inicio"
      className="relative overflow-hidden bg-[var(--section-mood)]"
    >
      <FloatingCollage className="absolute inset-0" items={COLLAGE_ITEMS} />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-8 text-center">
        <Eyebrow>Arreglos florales artesanales hechos a mano en Bogotá</Eyebrow>

        <SplitReveal className="max-w-5xl font-display text-[clamp(3rem,12vw,9rem)] leading-[0.95] tracking-tight text-mar-brown">
          Detalles que dicen lo que las palabras no alcanzan
        </SplitReveal>

        <Button variant="whatsapp" className="mt-2">
          Pedir por WhatsApp
        </Button>
      </div>
    </Section>
  );
}
