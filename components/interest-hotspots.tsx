/**
 * InterestHotspots — clean image with a side-panel of numbered
 * construction steps.
 *
 * Left column: image (next/image `fill`) — no overlays, no markers.
 *
 * Right column: numbered list acting as the sole selector.  Clicking
 * a number shows the detail panel (category, title, description)
 * with a fade-in transition.
 *
 * The data structure is an extensible array of objects so consumers
 * can pass their own hotspots without touching the component.
 */

"use client";

import { useState } from "react";
import Image from "next/image";

interface Hotspot {
  /** Numeric / sequential identifier shown on the marker. */
  id: number;
  /** Title displayed in the list and detail panel. */
  title: string;
  /** Vertical position as a percentage string (CSS top). */
  top: string;
  /** Horizontal position as a percentage string (CSS left). */
  left: string;
  /** Longer description shown in the detail panel body. */
  description: string;
  /** Category tag. */
  category: string;
  /** Dot colour (hex string). Falls back to gold. */
  color?: string;
}

/**
 * Bear anatomy hotspots — coordinates are percentage top/left
 * relative to the image container, estimated from a standard
 * seated bear-plush silhouette.
 */
const bearHotspots: Hotspot[] = [
  {
    id: 1,
    title: "Ojos",
    top: "28%",
    left: "40%",
    description:
      "Los dos ojos del osito están tejidos a mano con hilo de colores suaves. Expresan ternura y vida en cada detalle.",
    category: "Características",
    color: "#fff",
  },
  {
    id: 2,
    title: "Orejas",
    top: "15%",
    left: "25%",
    description:
      "Las orejas redondeadas captan cada movimiento y son suave al tacto, perfectas para acurrucar.",
    category: "Características",
    color: "#fff",
  },
  {
    id: 3,
    title: "Nariz/Hocico",
    top: "35%",
    left: "48%",
    description:
      "El hocico de goma negra es el centro de expresión del oso, con un tacto húmedo al besar.",
    category: "Características",
    color: "#fff",
  },
  {
    id: 4,
    title: "Boca",
    top: "42%",
    left: "48%",
    description:
      "Una sonrisa sutil bordada que da vida al rostro del osito.",
    category: "Características",
    color: "#fff",
  },
  {
    id: 5,
    title: "Patas Delanteras",
    top: "55%",
    left: "35%",
    description:
      "Las patas delanteriores están rellenas con espuma de alta densidad y se mueven con suavidad.",
    category: "Estructura",
    color: "#a9c4a0",
  },
  {
    id: 6,
    title: "Panza",
    top: "65%",
    left: "50%",
    description:
      "La panza del osito tiene un tejido sedoso de tono crema que contrasta con el pelaje marrón.",
    category: "Estructura",
    color: "#a9c4a0",
  },
  {
    id: 7,
    title: "Patas Traseras",
    top: "80%",
    left: "30%",
    description:
      "Las patas traseras sostienen al oso con firmeza, cosidas a mano con refuerzo doble.",
    category: "Estructura",
    color: "#a9c4a0",
  },
  {
    id: 8,
    title: "Flor",
    top: "35%",
    left: "65%",
    description:
      "Una flor de terciopelo púrpura sostenida en las patas delanteras del oso, clave del detalle Maranatha.",
    category: "Flores",
    color: "#f7c9d6",
  },
  {
    id: 9,
    title: "Tallo",
    top: "50%",
    left: "55%",
    description:
      "El tallo verde conecta la flor al oso, con venas dibujadas a mano.",
    category: "Flores",
    color: "#a9c4a0",
  },
  {
    id: 10,
    title: "Firma 'Naranatha'",
    top: "82%",
    left: "45%",
    description:
      "La firma 'Naranatha' bordada en la panza, distintivo de autenticidad de cada pieza.",
    category: "Detalles",
    color: "#d9a94e",
  },
];

interface InterestHotspotsProps {
  /** Custom hotspots; defaults to bear anatomy labels. */
  hotspots?: Hotspot[];
  /** Image source (defaults to the bear placeholder). */
  imageSrc?: string;
  /** Alt text for the image. */
  imageAlt?: string;
}

export default function InterestHotspots({
  hotspots = bearHotspots,
  imageSrc = "/placeholders/Oso-Photoroom.png",
  imageAlt = "Osito de peluche artesanal Maranatha sentado sosteniendo una flor de terciopelo púrpura",
}: InterestHotspotsProps) {
  const [activeSpot, setActiveSpot] = useState<Hotspot | null>(null);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
      {/* ── Left: clean image (no overlays) ── */}
      <div className="relative aspect-[3/2] w-full max-h-[600px] overflow-hidden lg:max-h-[700px]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover image-rendering-optimize"
          priority={false}
        />
      </div>

      {/* ── Right: numbered list selector + detail panel ── */}
      <div className="bg-mar-card p-8">
          <h3 className="font-futura text-xs uppercase tracking-widest text-mar-gold mb-6">
          Cómo se construye
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
