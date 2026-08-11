"use client";

import Image from "next/image";
import Section from "@/components/ui/section";
import Button from "@/components/ui/button";
import SplitReveal from "@/components/split-reveal";
import FloatingCollage, { type CollageItem } from "@/components/floating-collage";

/**
 * Home hero (hero-R1–R9; design D3; user art-direction update).
 *
 * Client component: GSAP-driven entrance only. All text is server-rendered
 * HTML (hero-R1) — the SplitReveal H1 is never hidden without JS, the collage
 * is purely decorative and the CTA is a real link (cc-R8). Mood is applied
 * through the Section shell (`--section-mood`, hero-R5).
 *
 * Clean lockup (user direction): brand image logo first, the script wordmark
 * "Maranatha" right below it, then the brutal char-assembly tagline
 * (SplitReveal mode="chars" — letters scatter and assemble into place) and the
 * single WhatsApp CTA.
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

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        {/* Brand lockup: image logo + script wordmark right below (user direction). */}
        <Image
          src="/maranatha.jpeg"
          alt=""
          width={160}
          height={160}
          sizes="(min-width: 768px) 160px, 128px"
          preload
          className="size-32 rounded-full object-cover shadow-2xl ring-4 ring-white/70 md:size-40"
          aria-hidden
        />

        <span className="font-script text-4xl leading-none text-mar-brown md:text-5xl">
          Maranatha
        </span>

        <SplitReveal
          mode="chars"
          className="mt-1 max-w-4xl font-display text-[clamp(2.4rem,8.5vw,6rem)] leading-[0.95] tracking-tight text-mar-brown"
        >
          Detalles que dicen lo que las palabras no alcanzan
        </SplitReveal>

        <Button variant="whatsapp" className="mt-3">
          Pedir por WhatsApp
        </Button>
      </div>
    </Section>
  );
}
