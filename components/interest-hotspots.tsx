/**
 * InterestHotspots — interactive bear-plush construction explorer.
 *
 * Layout: max-w-7xl centered, 12-col grid on desktop.
 * Left (col-span-7): image with object-contain inside an aspect-[4/5]
 * frame.  Clickable numbered hotspots render on top via absolute
 * positioning with top/left percentage strings.
 * Right (col-span-5): numbered list + dynamic detail panel with fadeIn.
 *
 * Edit mode: pass `isEditing={true}` and click the image to get
 * { top, left } percentages printed to console for quick remapping.
 */

"use client";

import { useState } from "react";
import Image from "next/image";

interface Hotspot {
  /** Numeric / sequential identifier shown on the marker. */
  id: number;
  /** Title displayed in the list and detail panel. */
  title: string;
  /** Vertical position as a percentage string (CSS top, relative to container). */
  top: string;
  /** Horizontal position as a percentage string (CSS left, relative to container). */
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
 * relative to the image container (aspect-ratio 4:5 with
 * object-contain).  Fine-tune with `isEditing` if needed.
 *
 * Y-values were remapped from the original 16:9 coordinate space
 * into the 4:5 container (letterboxing ≈ 34 % top + bottom).
 */
const bearHotspots: Hotspot[] = [
  {
    id: 1,
    title: "Ojos",
    top: "50%",
    left: "40%",
    description:
      "Los dos ojos del osito están tejidos a mano con hilo de colores suaves. Expresan ternura y vida en cada detalle.",
    category: "Características",
    color: "#fff",
  },
  {
    id: 2,
    title: "Orejas",
    top: "43%",
    left: "25%",
    description:
      "Las orejas redondeadas captan cada movimiento y son suave al tacto, perfectas para acurrucar.",
    category: "Características",
    color: "#fff",
  },
  {
    id: 3,
    title: "Nariz/Hocico",
    top: "54%",
    left: "48%",
    description:
      "El hocico de goma negra es el centro de expresión del oso, con un tacto húmedo al besar.",
    category: "Características",
    color: "#fff",
  },
  {
    id: 4,
    title: "Boca",
    top: "58%",
    left: "48%",
    description:
      "Una sonrisa sutil bordada que da vida al rostro del osito.",
    category: "Características",
    color: "#fff",
  },
  {
    id: 5,
    title: "Patas Delanteras",
    top: "65%",
    left: "35%",
    description:
      "Las patas delanteriores están rellenas con espuma de alta densidad y se mueven con suavidad.",
    category: "Estructura",
    color: "#a9c4a0",
  },
  {
    id: 6,
    title: "Panza",
    top: "71%",
    left: "50%",
    description:
      "La panza del osito tiene un tejido sedoso de tono crema que contrasta con el pelaje marrón.",
    category: "Estructura",
    color: "#a9c4a0",
  },
  {
    id: 7,
    title: "Patas Traseras",
    top: "79%",
    left: "30%",
    description:
      "Las patas traseras sostienen al oso con firmeza, cosidas a mano con refuerzo doble.",
    category: "Estructura",
    color: "#a9c4a0",
  },
  {
    id: 8,
    title: "Flor",
    top: "54%",
    left: "65%",
    description:
      "Una flor de terciopelo púrpura sostenida en las patas delanteras del oso, clave del detalle Maranatha.",
    category: "Flores",
    color: "#f7c9d6",
  },
  {
    id: 9,
    title: "Tallo",
    top: "63%",
    left: "55%",
    description:
      "El tallo verde conecta la flor al oso, con venas dibujadas a mano.",
    category: "Flores",
    color: "#a9c4a0",
  },
  {
    id: 10,
    title: "Firma 'Narantha'",
    top: "81%",
    left: "45%",
    description:
      "La firma 'Narantha' bordada en la panza, distintivo de autenticidad de cada pieza.",
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
  /** When true, clicking the image prints {top, left} percentages to console. */
  isEditing?: boolean;
}

export default function InterestHotspots({
  hotspots = bearHotspots,
  imageSrc = "/placeholders/Oso-Photoroom.png",
  imageAlt = "Osito de peluche artesanal Maranatha sentado sosteniendo una flor de terciopelo púrpura",
  isEditing = false,
}: InterestHotspotsProps) {
  const [activeSpot, setActiveSpot] = useState<Hotspot | null>(null);

  const handleImageClick = (
    e: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (!isEditing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    console.log(
      "[InterestHotspots] Click position:",
      JSON.stringify({ top: `${y.toFixed(1)}%`, left: `${x.toFixed(1)}%` }),
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        {/* ── Left: large image with hotspots ── */}
        <div
          className="relative col-span-1 lg:col-span-7 aspect-[4/5] w-full"
          onClick={handleImageClick}
          style={isEditing ? { cursor: "crosshair" } : undefined}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-contain image-rendering-optimize"
            priority={false}
          />
          {/* Clickable numbered markers positioned via data top/left */}
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
                top: spot.top,
                left: spot.left,
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

        {/* ── Right: numbered list + detail panel ── */}
        <div className="col-span-1 lg:col-span-5 bg-mar-card p-8">
          <h3 className="font-futura mb-6 text-xs uppercase tracking-widest text-mar-gold">
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
    </div>
  );
}
