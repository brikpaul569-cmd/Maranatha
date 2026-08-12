"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onEntranceReady } from "@/lib/entrance";

gsap.registerPlugin(ScrollTrigger);

/**
 * BearDiagram — the handmade teddy bear as the hero's central visual,
 * overlaid with a technical exploded-view diagram (finelines + callout
 * labels) that progressively draws itself via GSAP.
 *
 * The underlying image (Oso.png, 1152×648 16:9) is the source of truth —
 * the SVG overlay uses the same aspect ratio so callouts land precisely
 * on the bear's parts. Mobile: parallax off, annotations pre-visible;
 * desktop: scroll-triggered draw + stagger.
 *
 * Animation plan (design D3 / hero-R6-BEAR):
 *  - Entrance (after preloader): bear floats in scale 1.08→1 + fade
 *  - Idle float: gentle y-oscillation loop (±12px, 4.8s ease-in-out)
 *  - Scroll parallax: yPercent drift (desktop only, matchMedia)
 *  - Annotation lines: drawSVG-style stroke-dasharray reveal on scroll
 *  - Annotation labels: staggered fade + y from 24px on scroll
 *  - Reduced-motion: no entrance animation, no parallax, lines pre-drawn
 */

type Callout = {
  id: string;
  /** Point on the bear image the line originates from (x, y in viewBox 0 0 1152 648). */
  from: [number, number];
  /** Where the callout box lands (cx, cy in viewBox). */
  box: [number, number];
  text: string;
};

/** Annotation set — positions tuned to a 1152×648 SEATED bear image.
 *  Bear centered horizontally (~576px). Anatomy (from your spec):
 *  - Head/face: upper-center (y ~120-240)
 *  - Ears: top of head (y ~80-130)
 *  - Front paws + flower: center (x ~576, y ~320-400)
 *  - Body/torso: middle (y ~240-450)
 *  - Back feet/soles: bottom (y ~520-620)
 *  - Left sole (viewer's left = bear's RIGHT): x ~400-480, y ~560-600
 *  Adjust `from[]` and `box[]` as we iterate. */
const CALLOUTS: Callout[] = [
  // ── CABEZA / ROSTRO ──
  {
    id: "cabeza-1",
    from: [576, 160],
    box: [780, 80],
    text: "Tela de Peluche Sintético (Marrón Canela, Pelo Corto Mullido)",
  },
  {
    id: "cabeza-2",
    from: [530, 100],
    box: [800, 130],
    text: "Orejas Redondeadas (Tela Exterior Marrón, Interior Naranja Suave/Coral)",
  },
  {
    id: "cabeza-3",
    from: [576, 130],
    box: [300, 40],
    text: "Costura Central Vertical Visible (Cabeza Esférica Articulada)",
  },
  {
    id: "cabeza-4",
    from: [540, 190],
    box: [300, 190],
    text: "Ojos de Seguridad Plástico (Negros, Grandes, Redondos, Brillo Anime/Kawaii)",
  },
  {
    id: "cabeza-5",
    from: [610, 210],
    box: [780, 230],
    text: "Mejillas Rubor Rosa Aterciopelado (Flocado / Bordado Plano)",
  },
  {
    id: "cabeza-6",
    from: [576, 230],
    box: [820, 400],
    text: "Hocico y Sonrisa Bordados (Hilo Marrón Claro/Beige, Definido)",
  },
  // ── CUERPO / PATAS DELANTERAS + FLOR ──
  {
    id: "cuerpo-1",
    from: [576, 340],
    box: [300, 380],
    text: "Relleno Interno Poliéster Hipoalergénico (Media Densidad 'Achuchabilidad')",
  },
  {
    id: "cuerpo-2",
    from: [500, 370],
    box: [200, 520],
    text: "Patas Delanteras Dobladadas al Centro (Sujetan Tallo de la Flor)",
  },
  {
    id: "cuerpo-3",
    from: [530, 360],
    box: [620, 520],
    text: "Tallo de Flor de Chenilla Verde Flexible (Pipe Cleaner, 2 Hojas Tela)",
  },
  // ── LA FLOR (en las manos) ──
  {
    id: "flor-1",
    from: [550, 350],
    box: [380, 580],
    text: "Flor 5 Pétalos Terciopelo Púrpura Vibrante",
  },
  {
    id: "flor-2",
    from: [570, 330],
    box: [640, 480],
    text: "Estambre Amarillo Textura Granulada",
  },
  // ── PATAS TRASERAS / SUELAS ──
  {
    id: "pata-1",
    from: [440, 580],
    box: [200, 580],
    text: "Suela Pata Izquierda (Espectador) con 'Maranatha' Bordado Script (Hilo Marrón Oscuro)",
  },
  {
    id: "pata-2",
    from: [420, 610],
    box: [180, 630],
    text: "Suelas Redondeadas Tela Plana Naranja Claro/Coral (Diferente al Peluche)",
  },
  {
    id: "pata-3",
    from: [650, 580],
    box: [780, 540],
    text: "Costura de Seguridad Trasera (Reforzada, Oculta)",
  },
];

/** A single callout line + label, rendered inside the SVG overlay. */
function AnnotationLine({ c }: { c: Callout }) {
  const lineId = `line-${c.id}`;
  const bx = c.box[0];
  const by = c.box[1];

  // Simple elbow line from `from` → `box`
  const [fx, fy] = c.from;
  const midY = fy + (by - fy) / 2;

  return (
    <g data-annotation={c.id} data-line={lineId}>
      {/* Drawn line — stroke-dasharray reveals the path */}
      <path
        d={`M ${fx} ${fy} C ${fx} ${midY}, ${bx} ${midY}, ${bx} ${by - 32}`}
        fill="none"
        stroke="var(--color-mar-brown)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="500"
        strokeDashoffset="500"
      />
      {/* Callout box with label */}
      <foreignObject x={bx - 100} y={by - 40} width={220} height={90}>
        <div className="rounded-md bg-white/90 px-2.5 py-1.5 text-[11px] font-medium text-mar-brown shadow ring-1 ring-black/5 backdrop-blur-sm">
          <span className="block font-semibold text-[10px] uppercase tracking-wider text-mar-gold">
            • {c.id.split("-")[0]}
          </span>
          <span className="mt-0.5 block">{c.text}</span>
        </div>
      </foreignObject>
    </g>
  );
}

type BearDiagramProps = {
  /** Optional className for the root container (e.g. margin/width overrides). */
  className?: string;
};

export default function BearDiagram({ className = "" }: BearDiagramProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const imgWrap = imageRef.current;
    if (!root || !imgWrap) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Reduced-motion: everything starts visible and static
      root.querySelectorAll<SVGSVGElement>("[data-line] path").forEach((p) => {
        p.style.strokeDasharray = "none";
        p.style.strokeDashoffset = "0";
      });
      return;
    }

    const ctx = gsap.context(() => {
      // 1) Entrance: bear settles in after the ready-gate (hero-R6-BEAR-1)
      const disposeEntrance = onEntranceReady(() => {
        gsap.fromTo(
          imgWrap,
          { scale: 1.08, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out" }
        );

        // 2) Idle float loop (always on, subtle)
        gsap.to(imgWrap, {
          y: "+=12",
          repeat: -1,
          yoyo: true,
          duration: 4.8,
          ease: "sine.inOut",
        });
      });

      // 3) Annotation reveal on scroll (desktop only)
      const mm = gsap.matchMedia();
      const lines = root.querySelectorAll<SVGPathElement>("[data-line] path");
      const boxes = root.querySelectorAll<HTMLElement>("[data-annotation]");

      mm.add("(min-width: 768px)", () => {
        if (lines.length > 0) {
          gsap.fromTo(
            Array.from(lines),
            { strokeDashoffset: 500, strokeDasharray: 500 },
            {
              strokeDashoffset: 0,
              duration: 1,
              ease: "power2.out",
              stagger: { each: 0.08, grid: "auto" },
              scrollTrigger: {
                trigger: root,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        if (boxes.length > 0) {
          gsap.fromTo(
            Array.from(boxes),
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: { each: 0.06, grid: "auto" },
              scrollTrigger: {
                trigger: root,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Scroll parallax (desktop only)
        const speed = Number(imgWrap.dataset.parallax) || 0.12;
        gsap.fromTo(
          imgWrap,
          { yPercent: -20 * speed },
          {
            yPercent: 20 * speed,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      return () => {
        disposeEntrance();
        mm.revert();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className={
        "relative mx-auto w-full max-w-5xl overflow-hidden " +
        className
      }
    >
      {/* Bear image — transparent BG (Photoroom cutout) */}
      <div
        ref={imageRef}
        data-parallax={0.12}
        className="relative aspect-[16/9] w-full"
      >
        <Image
          src="/placeholders/Oso-Photoroom.png"
          alt="Osito de peluche artesanal Maranatha sosteniendo una flor de terciopelo púrpura — diagrama de desglose técnico"
          fill
          sizes="(min-width: 768px) 48rem, 100vw"
          className="object-contain"
          loading="eager"
          priority
        />
      </div>

      {/* Technical diagram overlay (SVG on top of image) */}
      <svg
        className="absolute inset-0 -z-10 h-full w-full"
        viewBox="0 0 1152 648"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Background veil for text contrast on the bear image */}
        <rect
          x="0"
          y="0"
          width="1152"
          height="648"
          fill="var(--color-mar-cream)"
          opacity="0.04"
        />

        {CALLOUTS.map((c) => (
          <AnnotationLine key={c.id} c={c} />
        ))}

        {/* Header label: diagram title */}
        <foreignObject x={32} y={16} width={520} height={40}>
          <div className="rounded-md bg-white/85 px-3 py-1 text-[11px] font-medium text-mar-brown shadow ring-1 ring-black/5">
            DIAGRAMA DE DESGLOSE DE PRODUCTO: OSO DE PELUCHE MARANATHA
          </div>
        </foreignObject>

        {/* FICHA TÉCNICA table — bottom-right */}
        <foreignObject x={820} y={560} width={300} height={72}>
          <div className="rounded-md bg-white/90 px-2 py-1.5 text-[10px] text-mar-brown shadow ring-1 ring-black/5">
            <div className="font-semibold">FICHA TÉCNICA DE CONSTRUCCIÓN</div>
            <div className="mt-0.5 space-y-0.5">
              <div>Técnica: Cosido y Ensamblado a Mano</div>
              <div>Composición: 100% Poliéster</div>
            </div>
          </div>
        </foreignObject>

        {/* Scale label — bottom-left */}
        <foreignObject x={32} y={608} width={160} height={32}>
          <div className="rounded-md bg-white/85 px-2 py-0.5 text-[10px] text-mar-brown shadow ring-1 ring-black/5">
            ESCALA 1:1
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

export type { Callout };
