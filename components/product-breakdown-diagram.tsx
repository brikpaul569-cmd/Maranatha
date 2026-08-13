"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
  /** Optional position for on-image annotation (percentage 0-100, relative to imageSubject crop). */
  annotation?: { x: number; y: number };
};

export type TechnicalInfo = {
  technique: string;
  composition: string;
};

/**
 * The visible product region inside the source image, in source pixels.
 * Used to crop the image so the subject fills the portrait reveal card.
 */
export type ImageSubject = {
  /** Horizontal center of the visible product content (source px). */
  cx: number;
  /** Vertical center of the visible product content (source px). */
  cy: number;
  /** Width of the visible product content (source px). */
  width: number;
  /** Height of the visible product content (source px). */
  height: number;
};

export type ProductBreakdownDiagramProps = {
  /** Image source path (served from public/). */
  imageSrc: string;
  /** Alt text for the product image. */
  imageAlt: string;
  /** Width of the image in pixels. */
  imageWidth: number;
  /** Height of the image in pixels. */
  imageHeight: number;
  /** Small uppercase label above the title. */
  headerLabel: string;
  /** Large bold title. */
  title: string;
  /** Optional italic subtitle. */
  subtitle?: string;
  /** All reveal items, one card per part. */
  parts: ProductPart[];
  /** Optional technical info rendered as the final card. */
  technicalInfo?: TechnicalInfo;
  /**
   * Optional visible product region (source px). When provided the image is
   * cropped to the subject inside a portrait card matching the subject's
   * aspect ratio. When omitted the image renders 1:1 in a 16:9 frame.
   */
  imageSubject?: ImageSubject;
  /** Optional CSS class appended to the root container. */
  className?: string;
};

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
  imageSubject,
  className = "",
}: ProductBreakdownDiagramProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-reveal-card]", root);

      // Hide before reveal — only when motion is allowed (reduced-motion
      // users skip this whole setup and keep the cards visible).
      gsap.set(cards, { autoAlpha: 0, y: 24 });

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 25%",
              // Animate in on enter, reverse on leave — never stick frozen.
              toggleActions: "play none none reverse",
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  // ── Subject crop ──────────────────────────────────────────────────────
  // The subject is a small portrait region inside a 16:9 source image. The
  // portrait card matches the subject's aspect ratio, and the inner image
  // layer is widened to `imageWidth / subject.width` (≈439.7%) of the card so
  // the subject fills it exactly. The layer keeps the image's own aspect
  // ratio, then translates so the subject's top-left corner lands on the
  // card's top-left corner. Percentages in `translate` resolve against the
  // enlarged layer box, which is what maps them to the exact subject window.
  const subjectAspect = imageSubject
    ? `${imageSubject.width} / ${imageSubject.height}`
    : undefined;
  const subjectWidth = imageSubject
    ? `min(100%, calc(70vh * ${imageSubject.width} / ${imageSubject.height}))`
    : undefined;
  const cropLayerStyle: CSSProperties | undefined = imageSubject
    ? {
        width: `${(imageWidth / imageSubject.width) * 100}%`,
        aspectRatio: `${imageWidth} / ${imageHeight}`,
        transform: `translate(${
          -((imageSubject.cx - imageSubject.width / 2) / imageWidth) * 100
        }%, ${-((imageSubject.cy - imageSubject.height / 2) / imageHeight) * 100}%)`,
      }
    : undefined;

  // Desktop card max-width is 400px (grid minmax). The crop layer scales the
  // image by (imageWidth / subject.width), so the rendered image is wider than
  // the card — sizes must reflect that to prevent next/image from serving a
  // too-small optimized source that gets upscaled (pixelation).
  const desktopImageWidth = imageSubject
    ? Math.round((imageWidth / imageSubject.width) * 400)
    : 400;
  const imageSizes = `(min-width: 1024px) ${desktopImageWidth}px, 90vw`;

  return (
    <div
      ref={rootRef}
      className={"mx-auto w-full" + (className ? ` ${className}` : "")}
    >
      {/* Header block */}
      <header className="mb-10 text-center md:mb-16">
        <p className="font-futura text-xs uppercase tracking-widest text-mar-brown/70">
          {headerLabel}
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold uppercase text-mar-brown md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 font-sans text-base italic text-mar-brown/60">
            {subtitle}
          </p>
        )}
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:gap-16">
        {/* Image column — sticky on desktop, large in flow on mobile */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          {imageSubject ? (
            <div
              className="relative mx-auto overflow-hidden"
              style={{ width: subjectWidth, aspectRatio: subjectAspect }}
            >
              <div
                aria-hidden
                className="absolute left-0 top-0"
                style={cropLayerStyle}
              >
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  sizes={imageSizes}
                  className="image-rendering-optimize"
                />
              </div>
              {parts.some((p) => p.annotation) && (
                <div className="pointer-events-none absolute inset-0">
                  {parts.map((part, index) => {
                    if (!part.annotation) return null;
                    return (
                      <div
                        key={part.id}
                        className="annotation-dot"
                        style={{
                          left: `${part.annotation.x}%`,
                          top: `${part.annotation.y}%`,
                          backgroundColor: part.color,
                        }}
                      >
                        <span className="annotation-number">{index + 1}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="relative mx-auto aspect-[16/9] w-full overflow-hidden">
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes={imageSizes}
                className="object-contain"
              />
            </div>
          )}
        </div>

        {/* Cards column — scroll-reveal cards, one per part + tech card */}
        <div className="space-y-[40vh] lg:space-y-[50vh]">
          {parts.map((part, index) => (
            <article
              key={part.id}
              data-reveal-card
              className="p-6"
            >
              <div className="flex items-center gap-2">
                {part.annotation && (
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white"
                    style={{ backgroundColor: part.color }}
                  >
                    {index + 1}
                  </span>
                )}
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: part.color }}
                />
                <h3 className="font-futura text-xs uppercase tracking-widest text-mar-gold">
                  {part.name}
                </h3>
              </div>
              <p className="mt-2 font-sans text-lg text-mar-brown/80">
                {part.description}
              </p>
            </article>
          ))}

          {technicalInfo && (
            <article
              data-reveal-card
              className="p-6"
            >
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-mar-gold" />
                <h3 className="font-futura text-xs uppercase tracking-widest text-mar-gold">
                  FICHA TÉCNICA DE CONSTRUCCIÓN
                </h3>
              </div>
              <p className="mt-2 font-sans text-lg text-mar-brown/80">
                • Técnica: {technicalInfo.technique}
                <br />
                • Composición: {technicalInfo.composition}
              </p>
            </article>
          )}
        </div>
      </div>
    </div>
  );
}
