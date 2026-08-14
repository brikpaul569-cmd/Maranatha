"use client";

import Image from "next/image";
import Section from "@/components/ui/section";
import SplitReveal from "@/components/split-reveal";
import Button from "@/components/ui/button";
import Reveal from "@/components/reveal";

/**
 * Home hero (hero-R1–R9; design D3; user art-direction update).
 *
 * Client component: GSAP-driven entrance only. All text is server-rendered
 * HTML (hero-R1). Mood applied via Section shell (`--section-mood`, hero-R5).
 *
 * Brand lockup: image logo + script wordmark top-left, raised to viewport top.
 * Char-assembly tagline (SplitReveal) centered.
 * Real catalog CTA below the tagline.
 */

export default function HeroHome() {
  return (
    <Section
      mood="hero"
      id="inicio"
      className="relative overflow-hidden bg-[var(--section-mood)]"
      innerClassName="py-0! px-0! md:px-0!"
    >
      <div className="relative z-10 flex min-h-screen flex-col gap-5 px-6 pt-6 md:pt-8">
        {/* Brand lockup: centered & stacked on mobile so the script wordmark
            sits below the fixed header (no collision with the dark-mode icon
            or burger menu); top-left row on md+. */}
        <div className="flex flex-col items-center gap-3 md:flex-row md:items-center md:justify-start md:gap-3">
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

          <span className="font-script text-3xl leading-none text-mar-brown md:text-5xl">
            Maranatha
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
          {/* Hero headline */}
          <SplitReveal
            mode="chars"
            className="font-stout text-[clamp(2.2rem,8vw,6rem)] uppercase leading-[0.9] tracking-normal text-mar-brown"
          >
            <span className="hero-line block">Detalles</span>
            <span className="hero-line block">que dicen lo que</span>
            <span className="hero-line block text-mar-gold">
              las palabras{" "}
              <span className="whitespace-nowrap">no alcanzan</span>
            </span>
          </SplitReveal>

          {/* Catalog CTA */}
          <Reveal delay={1.0} y={16} className="mt-4 md:mt-6">
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
