/**
 * InterestHotspots — interactive image with invisible clickable hotspots
 * and a numbered side-list selector.
 *
 * Left column: image (next/image `fill`) with invisible hotspots that
 * fade in on hover.  Clicking any hotspot (image or list) sets activeSpot.
 *
 * Right column: a numbered list of all hotspots (always visible) acting
 * as the primary selector, plus a detail panel that renders the active
 * hotspot's category, title, and description with a fade-in transition.
 *
 * The data shape is an extensible array of objects so consumers can pass
 * their own hotspots without touching the component.
 */

"use client";

import { useState } from "react";
import Image from "next/image";

interface Hotspot {
  /** Numeric / sequential identifier shown on the marker. */
  id: number;
  /** Horizontal position as a percentage 0–100 (relative to image width). */
  x: number;
  /** Vertical position as a percentage 0–100 (relative to image height). */
  y: number;
  /** Short title displayed in the detail panel. */
  title: string;
  /** Longer description shown in the panel body. */
  description: string;
  /** Category tag (flores, detalles, estructura, …). */
  category: string;
  /** Optional dot colour; falls back to gold when omitted. */
  color?: string;
}

/**
 * Default hotspots — coordinates map to the BearDiagram subject area
 * (image 1152×648, subject cx 540 / cy 284 / w 262 / h 316).
 * Values are normalised to 0–100 % across the full image so they
 * stay correct when the image scales responsively.
 */
const DEFAULT_HOTSPOTS: Hotspot[] = [
  {
    id: 1,
    x: 84,
    y: 38,
    title: "Rosas Satinadas Clásicas",
    description:
      "Nuestras rosas de seda clásicas en tonos pastel, perfectas para ocasiones formales. Cada rama se selecciona a mano y se combina con cintas de organza brillante.",
    category: "Flores",
    color: "#d9a94e",
  },
  {
    id: 2,
    x: 33,
    y: 50,
    title: "Cinta de Organza",
    description:
      "Cinta de organza brillante que añade un toque elegante a cada arreglo. Disponible en varios colores para combinar con tu paleta.",
    category: "Detalles",
    color: "#f7c9d6",
  },
  {
    id: 3,
    x: 28,
    y: 84,
    title: "Base de Espuma Floral",
    description:
      "Espuma floral de alta densidad que mantiene las flores frescas y permite una disposición precisa de cada elemento.",
    category: "Estructura",
    color: "#a9c4a0",
  },
  {
    id: 4,
    x: 72,
    y: 84,
    title: "Bandeja de Presentación",
    description:
      "Bandeja de cartón reciclado con acabado mate, diseñada para proteger el arreglo durante el transporte y la presentación.",
    category: "Empaque",
    color: "#8a6e45",
  },
  {
    id: 5,
    x: 52,
    y: 24,
    title: "Peluche de Calidad",
    description:
      "Osito de peluche de algodón 100 % con detalles bordados, el acompañante perfecto para los arreglos de flores.",
    category: "Complementos",
    color: "#a74c3f",
  },
];

interface InterestHotspotsProps {
  /** Custom hotspots; defaults to maranatha bear labels. */
  hotspots?: Hotspot[];
  /** Image source (defaults to the bear placeholder). */
  imageSrc?: string;
  /** Alt text for the image. */
  imageAlt?: string;
}

export default function InterestHotspots({
  hotspots = DEFAULT_HOTSPOTS,
  imageSrc = "/placeholders/Oso-Photoroom.png",
  imageAlt = "Osito de peluche artesanal Maranatha sosteniendo una flor de terciopelo púrpura",
}: InterestHotspotsProps) {
  const [activeSpot, setActiveSpot] = useState<Hotspot | null>(null);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      {/* ── Left: image with numbered hotspots always visible ── */}
      <div className="relative aspect-[3/2] w-full max-h-[600px] overflow-hidden lg:max-h-[700px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover image-rendering-optimize"
          priority={false}
        />
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            onClick={() => setActiveSpot(spot)}
            aria-label={`Ver detalles de ${spot.title}`}
            className={
              activeSpot?.id === spot.id
                ? "annotation-dot scale-125 cursor-pointer opacity-100 ring-2 ring-white ring-offset-2"
                : "annotation-dot cursor-pointer opacity-100 hover:scale-110"
            }
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              ...(spot.color ? { backgroundColor: spot.color } : {}),
            }}
          >
            <span
              className={
                activeSpot?.id === spot.id
                  ? "annotation-number opacity-100"
                  : "annotation-number opacity-70"
              }
            >
              {spot.id}
            </span>
          </button>
        ))}
      </div>

      {/* ── Right: numbered list selector + detail panel ── */}
      <div className="bg-mar-card p-8">
        <h3 className="font-futura text-xs uppercase tracking-widest text-mar-gold mb-6">
          Puntos de Interés
        </h3>

        <ul className="space-y-2">
          {hotspots.map((spot) => (
            <li key={spot.id}>
              <button
                type="button"
                onClick={() => setActiveSpot(spot)}
                className={
                  activeSpot?.id === spot.id
                    ? "flex w-full items-center gap-3 rounded-lg bg-mar-gold/10 px-4 py-3 text-left"
                    : "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left hover:bg-mar-gold/5"
                }
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{
                    backgroundColor: spot.color || "#d9a94e",
                  }}
                >
                  {spot.id}
                </span>
                <span className="font-medium text-mar-brown">
                  {spot.title}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* ── Detail panel ── */}
        <div className="mt-6 min-h-[160px]">
          {activeSpot ? (
            <div key={activeSpot.id} className="animate-fadeIn">
              <span className="font-futura text-xs uppercase tracking-widest text-mar-gold">
                {activeSpot.category}
              </span>
              <h3 className="mt-2 text-xl font-bold text-mar-brown">
                {activeSpot.title}
              </h3>
              <p className="mt-3 text-mar-text/80 leading-relaxed">
                {activeSpot.description}
              </p>
            </div>
          ) : (
            <div className="flex min-h-[120px] items-center justify-center text-center">
              <p className="text-sm text-mar-text/60">
                Selecciona un número para ver detalles del punto de
                interés.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
