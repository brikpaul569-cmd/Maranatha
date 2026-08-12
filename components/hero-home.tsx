"use client";

import Image from "next/image";
import Section from "@/components/ui/section";
import SplitReveal from "@/components/split-reveal";
import Button from "@/components/ui/button";
import Reveal from "@/components/reveal";
import FloatingCollage, { type CollageItem } from "@/components/floating-collage";

/**
 * Home hero (hero-R1–R9; design D3; user art-direction update).
 *
 * Client component: GSAP-driven entrance only. All text is server-rendered
 * HTML (hero-R1) — the SplitReveal H1 is never hidden without JS, the collage
 * is purely decorative and the CTA is a real link (cc-R8). Mood is applied
 * through the Section shell (`--section-mood`, hero-R5).
 *
 * Brand lockup (user direction): image logo + script wordmark "Maranatha"
 * side-by-side at the top-left, raised to the top of the viewport (the
 * Section shell's vertical padding is disabled for the hero so the lockup
 * sits near the top edge). The char-assembly tagline
 * (SplitReveal mode="chars" — letters scatter and assemble into place)
 * stays centered in the remaining viewport, set in the Anton condensed
 * display face — stamped signage at 0.9 leading, with the payoff line as
 * the single gold accent moment (San Rita / F37stout adaptation). A real
 * catalog CTA (server-rendered `<a>`, cc-R8) sits below the tagline.
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
      innerClassName="py-0! px-0! md:px-0!"
    >
      <FloatingCollage className="absolute inset-0" items={COLLAGE_ITEMS} />

      <div className="relative z-10 flex min-h-screen flex-col gap-5 px-6 pt-6 md:pt-8">
        {/* Brand lockup (user direction): image logo + script wordmark
            top-left, raised to the top of the viewport. */}
        <div className="flex items-center gap-3">
          <Image
            src="/maranatha.jpeg"
            alt=""
            width={160}
            height={160}
            sizes="(min-width: 768px) 80px, 64px"
            preload
            className="size-16 rounded-full object-cover shadow-2xl ring-4 ring-white/70 md:size-20"
            aria-hidden
          />

          <span className="font-script text-4xl leading-none text-mar-brown md:text-5xl">
            Maranatha
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <SplitReveal
            mode="chars"
            className="mt-1 font-stout text-[clamp(2.2rem,8vw,6rem)] uppercase leading-[0.9] tracking-normal text-mar-brown"
          >
            <span className="hero-line block">Detalles</span>
            <span className="hero-line block">que dicen lo que</span>
            <span className="hero-line block text-mar-gold">
              las palabras{" "}
              <span className="whitespace-nowrap">no alcanzan</span>
            </span>
          </SplitReveal>

          <Reveal delay={0.9} y={16} className="mt-8 md:mt-10">
            <Button href="/catalogo" className="px-8 py-4 md:text-base">
              Ver catálogo
            </Button>
          </Reveal>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center md:bottom-6"
        >
          <span className="scroll-cue flex flex-col items-center gap-1.5 text-mar-brown/60">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
            <span className="font-futura text-[10px] font-semibold uppercase tracking-[0.3em]">
              Scroll
            </span>
          </span>
        </div>
      </div>
    </Section>
  );
}
