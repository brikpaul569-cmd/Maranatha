"use client";

import { useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onEntranceReady } from "@/lib/entrance";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────────────────────────── */
/*  Types                                                                  */
/* ────────────────────────────────────────────────────────────────────── */

export type ProductPart = {
  id: string;
  /** Short uppercase label shown as the category badge. */
  name: string;
  /** Hex color for the circular bullet dot. */
  color: string;
  /** 1–3 lines describing the part. */
  description: string;
  /** Target point on the image in viewBox pixels (x, y). Values are
   *  measured directly on the source photo, which occupies the top
   *  `imageHeight` rows of the viewBox, so points map 1:1. */
  point: [number, number];
  /** Which column the callout card appears in. */
  side: "left" | "right";
  /** Optional manual override for the callout box position (x, y in viewBox). */
  box?: [number, number];
};

export type TechnicalInfo = {
  technique: string;
  composition: string;
};

export type ProductBreakdownDiagramProps = {
  /** Image source path. */
  imageSrc: string;
  /** Alt text for the product image. */
  imageAlt: string;
  /** Width of the image in pixels (used as SVG viewBox width). */
  imageWidth: number;
  /** Height of the image in pixels (used as SVG viewBox height). */
  imageHeight: number;
  /** Small uppercase label above the title. */
  headerLabel: string;
  /** Large bold title. */
  title: string;
  /** Optional italic subtitle. */
  subtitle?: string;
  /** All callout items with leader lines. */
  parts: ProductPart[];
  /** Optional technical info card rendered bottom-right. */
  technicalInfo?: TechnicalInfo;
  /** Optional CSS class appended to the root container. */
  className?: string;
};

/* ────────────────────────────────────────────────────────────────────── */
/*  Layout constants                                                      */
/* ────────────────────────────────────────────────────────────────────── */

const CARD_WIDTH = 200;
const CARD_HEIGHT = 72;
const COLUMN_INSET = 20;
const TOP_OFFSET = 88;
const BOTTOM_PADDING = 60;

/* ────────────────────────────────────────────────────────────────────── */
/*  Positioning helper                                                    */
/* ────────────────────────────────────────────────────────────────────── */

type ResolvedPart = ProductPart & {
  point: [number, number];
  bx: number;
  by: number;
  bw: number;
  bh: number;
};

/**
 * Resolve the box position for every part:
 * - Parts with a `box` override use it directly.
 * - Parts named "ESCALA" are fixed at bottom-left (no leader line).
 * - Remaining parts auto-distribute evenly within their side column.
 */
function useResolvedParts(
  parts: ProductPart[],
  imageWidth: number,
  imageHeight: number,
): ResolvedPart[] {
  return useMemo(() => {
    const leftAuto: ProductPart[] = [];
    const rightAuto: ProductPart[] = [];
    const result: ResolvedPart[] = [];

    // Pass 1 — separate by side and detect overrides / fixed
    for (const p of parts) {
      if (p.box) {
        result.push({
          ...p,
          point: p.point,
          bx: p.box[0],
          by: p.box[1],
          bw: CARD_WIDTH,
          bh: CARD_HEIGHT,
        });
        continue;
      }

      if (p.name === "ESCALA") {
        // Fixed at bottom-left, small card, no leader line
        result.push({
          ...p,
          point: p.point,
          bx: COLUMN_INSET,
          by: imageHeight - 42,
          bw: 120,
          bh: 32,
        });
        continue;
      }

      if (p.side === "left") leftAuto.push(p);
      else rightAuto.push(p);
    }

    // Pass 2 — auto-distribute each column by target y-coordinate
    const distribute = (
      column: ProductPart[],
      startX: number,
    ): ResolvedPart[] => {
      const sorted = [...column].sort(
        (a, b) => a.point[1] - b.point[1],
      );
      const available = imageHeight - TOP_OFFSET - BOTTOM_PADDING;
      const step = column.length <= 1 ? 0 : available / (column.length - 1);

      return sorted.map((p, i) => ({
        ...p,
        point: p.point,
        bx: startX,
        by: TOP_OFFSET + step * i,
        bw: CARD_WIDTH,
        bh: CARD_HEIGHT,
      }));
    };

    const leftX = COLUMN_INSET;
    const rightX = imageWidth - CARD_WIDTH - COLUMN_INSET;

    result.push(...distribute(leftAuto, leftX));
    result.push(...distribute(rightAuto, rightX));

    return result;
  }, [parts, imageWidth, imageHeight]);
}

/**
 * Compute the exit point on the nearest edge of a box toward an external
 * target point.  Leader lines start from here, not from the box center.
 */
function nearestEdge(
  bx: number, by: number, bw: number, bh: number,
  tx: number, ty: number,
): [number, number] {
  const cx = Math.max(bx, Math.min(tx, bx + bw));
  const cy = Math.max(by, Math.min(ty, by + bh));
  if (cx === tx && cy === ty) return [bx + bw / 2, by + bh / 2];
  return [cx, cy];
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Annotation (single callout with leader line)                          */
/* ────────────────────────────────────────────────────────────────────── */

type AnnotationProps = { c: ResolvedPart };

function AnnotationLine({ c }: AnnotationProps) {
  const [tx, ty] = c.point;
  const { bx, by, bw, bh } = c;

  // Skip leader line for the scale card
  const isScale = c.name === "ESCALA";

  // Leader line: from nearest edge of box → exact target point, drawn as
  // a single 90° elbow (vertical channel first, then horizontal).
  const [lx, ly] = nearestEdge(bx, by, bw, bh, tx, ty);
  const lineLen = Math.abs(tx - lx) + Math.abs(ty - ly);

  return (
    <g
      data-annotation={c.id}
      data-line={isScale ? undefined : `line-${c.id}`}
      data-category={c.name}
    >
      {!isScale && (
        <path
          d={`M ${lx} ${ly} L ${lx} ${ty} L ${tx} ${ty}`}
          fill="none"
          stroke="var(--color-mar-brown)"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray={lineLen + 50}
          strokeDashoffset={lineLen + 50}
          opacity={0.7}
        />
      )}

      {/* Callout box */}
      <foreignObject x={bx} y={by} width={bw} height={bh}>
        <div
          className="rounded-md bg-white/90 px-2.5 py-1.5 text-[10px] font-medium text-mar-brown shadow ring-1 ring-black/5 backdrop-blur-sm"
          style={{ fontSize: "10px" }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: c.color }}
            />
            <span className="font-semibold uppercase text-mar-gold">
              {c.name}
            </span>
          </div>
          <p className="mt-0.5 line-clamp-3 leading-tight">
            {c.description}
          </p>
        </div>
      </foreignObject>
    </g>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Header card (top center)                                              */
/* ────────────────────────────────────────────────────────────────────── */

function HeaderCard({
  headerLabel,
  title,
  subtitle,
  imageWidth,
}: {
  headerLabel: string;
  title: string;
  subtitle?: string;
  imageWidth: number;
}) {
  const w = Math.min(512, imageWidth - 32);
  const x = (imageWidth - w) / 2;

  return (
    <foreignObject x={x} y={8} width={w} height={subtitle ? 56 : 48}>
      <div className="rounded-md bg-white/90 px-3 py-1.5 text-center shadow ring-1 ring-black/5">
        <div className="font-futura text-[10px] uppercase tracking-widest text-mar-brown/70">
          {headerLabel}
        </div>
        <div className="font-display text-[13px] font-bold uppercase text-mar-brown">
          {title}
        </div>
        {subtitle && (
          <div className="mt-0.5 font-sans text-[9px] italic text-mar-brown/60">
            {subtitle}
          </div>
        )}
      </div>
    </foreignObject>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Technical info card (bottom-right)                                    */
/* ────────────────────────────────────────────────────────────────────── */

function TechInfoCard({
  info,
  imageWidth,
  imageHeight,
}: {
  info: TechnicalInfo;
  imageWidth: number;
  imageHeight: number;
}) {
  const w = 280;
  const h = 68;
  const x = imageWidth - w - 20;
  const y = imageHeight - h - 20;

  return (
    <foreignObject x={x} y={y} width={w} height={h}>
      <div className="rounded-md bg-white/90 px-2.5 py-1.5 text-[10px] text-mar-brown shadow ring-1 ring-black/5">
        <div className="font-futura text-[9px] uppercase tracking-widest text-mar-gold">
          FICHA TÉCNICA DE CONSTRUCCIÓN
        </div>
        <div className="mt-0.5 space-y-0.5">
          <div>• Técnica: {info.technique}</div>
          <div>• Composición: {info.composition}</div>
        </div>
      </div>
    </foreignObject>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Mobile header (HTML, no SVG foreignObject)                            */
/* ────────────────────────────────────────────────────────────────────── */

function MobileHeader({
  headerLabel,
  title,
  subtitle,
}: {
  headerLabel: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mt-4 rounded-md bg-white/90 px-3 py-1.5 text-center shadow ring-1 ring-black/5">
      <div className="font-futura text-[10px] uppercase tracking-widest text-mar-brown/70">
        {headerLabel}
      </div>
      <div className="font-display text-[13px] font-bold uppercase text-mar-brown">
        {title}
      </div>
      {subtitle && (
        <div className="mt-0.5 font-sans text-[9px] italic text-mar-brown/60">
          {subtitle}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Mobile list (fallback)                                              */
/* ────────────────────────────────────────────────────────────────────── */

function MobileList({
  resolvedParts,
  info,
}: {
  resolvedParts: ResolvedPart[];
  info?: TechnicalInfo;
}) {
  // Left column parts first, then right column, in their resolved order
  const left = resolvedParts.filter((p) => p.side === "left");
  const right = resolvedParts.filter((p) => p.side === "right");
  const allParts = [...left, ...right];

  return (
    <div className="mt-4 flex flex-col gap-3">
      {allParts.map((p) => (
        <div
          key={p.id}
          className="rounded-md bg-white/90 px-3 py-2 shadow ring-1 ring-black/5"
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="font-futura text-[10px] font-semibold uppercase tracking-widest text-mar-gold">
              {p.name}
            </span>
          </div>
          <p className="mt-1 font-sans text-[11px] text-mar-brown/80">
            {p.description}
          </p>
        </div>
      ))}

      {info && (
        <div className="rounded-md bg-white/90 px-3 py-2 shadow ring-1 ring-black/5">
          <div className="font-futura text-[10px] uppercase tracking-widest text-mar-gold">
            FICHA TÉCNICA DE CONSTRUCCIÓN
          </div>
          <div className="mt-1 space-y-1 font-sans text-[11px] text-mar-brown/80">
            <div>• Técnica: {info.technique}</div>
            <div>• Composición: {info.composition}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Main component                                                        */
/* ────────────────────────────────────────────────────────────────────── */

export default function ProductBreakdownDiagram({
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  headerLabel,
  title,
  subtitle,
  parts,
  technicalInfo,
  className = "",
}: ProductBreakdownDiagramProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const resolvedParts = useResolvedParts(parts, imageWidth, imageHeight);

  useEffect(() => {
    const root = rootRef.current;
    const imgWrap = imageRef.current;
    if (!root || !imgWrap) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.querySelectorAll<SVGPathElement>("[data-line] path").forEach((p) => {
        p.style.strokeDasharray = "none";
        p.style.strokeDashoffset = "0";
      });
      return;
    }

    const ctx = gsap.context(() => {
      const disposeEntrance = onEntranceReady(() => {
        gsap.fromTo(
          imgWrap,
          { scale: 1.08, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out" },
        );
        gsap.to(imgWrap, {
          y: "+=12",
          repeat: -1,
          yoyo: true,
          duration: 4.8,
          ease: "sine.inOut",
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const paths = Array.from(
          root.querySelectorAll<SVGPathElement>("[data-line] path"),
        );

        paths.forEach((p) => {
          const len = p.getTotalLength ? p.getTotalLength() + 50 : 250;
          gsap.fromTo(
            p,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: root,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        const boxes = root.querySelectorAll<HTMLElement>("[data-annotation]");
        gsap.fromTo(
          Array.from(boxes),
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            stagger: { each: 0.04, grid: "auto" },
            scrollTrigger: {
              trigger: root,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        );

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
          },
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
        "relative mx-auto w-full overflow-hidden" +
        (className ? ` ${className}` : "")
      }
    >
      {/* ── Image group: the SVG overlay lives INSIDE this transformed
            container, so lines/callouts inherit the entrance/float/parallax
            transforms and stay glued to the image at any rendered size. ── */}
      <div
        ref={imageRef}
        data-parallax={0.12}
        className="relative w-full"
        style={{ aspectRatio: `${imageWidth / imageHeight}` }}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 768px) 48rem, 100vw"
          className="object-contain"
          loading="eager"
          priority
        />

        {/* ── SVG overlay with lines + callout boxes ── */}
        <svg
          className="absolute inset-0 z-10 hidden h-full w-full md:block"
          viewBox={`0 0 ${imageWidth} ${imageHeight}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <HeaderCard
            headerLabel={headerLabel}
            title={title}
            subtitle={subtitle}
            imageWidth={imageWidth}
          />

          {resolvedParts.map((c) => (
            <AnnotationLine key={c.id} c={c} />
          ))}

          {technicalInfo && (
            <TechInfoCard info={technicalInfo} imageWidth={imageWidth} imageHeight={imageHeight} />
          )}
        </svg>
      </div>

      {/* ── Mobile: header + stacked callout list, no SVG lines ── */}
      <div className="md:hidden">
        <MobileHeader
          headerLabel={headerLabel}
          title={title}
          subtitle={subtitle}
        />
        <MobileList
          resolvedParts={resolvedParts}
          info={technicalInfo}
        />
      </div>
    </div>
  );
}
