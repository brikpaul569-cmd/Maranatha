"use client";

import Image from "next/image";
import Section from "@/components/ui/section";
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
 * Brand lockup (user direction): image logo + script wordmark "Maranatha"
 * side-by-side at the top-left, aligned with the fixed header; the
 * char-assembly tagline (SplitReveal mode="chars" — letters scatter and
 * assemble into place) stays centered in the remaining viewport, set in the
 * Anton condensed display face — stamped signage at 0.9 leading, with the
 * payoff line as the single gold accent moment (San Rita / F37stout
 * adaptation).
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

      <div className="relative z-10 flex min-h-screen flex-col gap-5 px-6 pt-20 md:pt-24">
        {/* Brand lockup: image logo + script wordmark side-by-side, aligned
            with the fixed-header logo (user direction). */}
        <div className="flex items-center gap-3 self-start text-left">
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
        </div>
      </div>
    </Section>
  );
}
