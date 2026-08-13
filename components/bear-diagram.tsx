"use client";

import ProductBreakdownDiagram from "@/components/product-breakdown-diagram";
import type { ProductPart, TechnicalInfo } from "@/components/product-breakdown-diagram";

/**
 * BearDiagram — the handmade teddy bear (seated, facing front) displayed in
 * /taller as a technical "scroll reveal" breakdown.
 *
 * This is a thin data wrapper around the generic `ProductBreakdownDiagram`
 * component: a sticky subject crop on the left and scroll-reveal cards on
 * the right, one per part, plus the construction tech card.
 *
 * Image: Oso-Photoroom.png — 1152×648 (16:9, transparent BG).
 */

/* ── Part colors (category badge dots) ──────────────────────────────── */
const COLORS = {
  TELA: "#8B5A2B",
  OREJAS: "#EA5809",
  OJOS: "#2563EB",
  HOCICO: "#656565",
  MEJILLAS: "#EC4899",
  RELLENO: "#16A34A",
  BRAZOS: "#7C3AED",
  PATA_DER: "#EA5809",
  PATA_IZQ: "#EA5809",
  PETALOS: "#7C3AED",
  ESTAMBRE: "#CA8A04",
  TALLO: "#16A34A",
  COSTURA: "#656565",
  ESCALA: "#656565",
};

/* ── Bear callout data (storytelling order) ────────────────────────── */
const BEAR_PARTS: ProductPart[] = [
  {
    id: "ojos",
    name: "OJOS",
    color: COLORS.OJOS,
    description:
      "Ojos de Seguridad Plástico (Negros, Grandes, Redondos, Brillo Anime/Kawaii)",
  },
  {
    id: "orejas",
    name: "OREJAS",
    color: COLORS.OREJAS,
    description:
      "Orejas Redondeadas (Tela Exterior Marrón, Interior Naranja Suave/Coral)",
  },
  {
    id: "mejillas",
    name: "MEJILLAS",
    color: COLORS.MEJILLAS,
    description: "Rubor Rosa Aterciopelado (Flocado / Bordado Plano)",
  },
  {
    id: "hocico",
    name: "HOCICO/SONRISA",
    color: COLORS.HOCICO,
    description:
      "Hocico y Sonrisa Bordados (Hilo Marrón Claro/Beige, Definido)",
  },
  {
    id: "cuerpo",
    name: "CUERPO/RELLENO",
    color: COLORS.RELLENO,
    description:
      "Relleno Interno Poliéster Hipoalergénico (Media Densidad 'Achuchabilidad')",
  },
  {
    id: "brazos",
    name: "BRAZOS",
    color: COLORS.BRAZOS,
    description:
      "Patas Delanteras Dobladas al Centro (Sujetan Tallo de la Flor)",
  },
  {
    id: "tela",
    name: "TELA",
    color: COLORS.TELA,
    description: "Tela de Peluche Sintético (Marrón Canela Pelo Corto Mullido)",
  },
  {
    id: "flor-petalos",
    name: "FLOR - PÉTALOS",
    color: COLORS.PETALOS,
    description: "Pétalos Terciopelo Púrpura (5 Unidades, Corte Láser)",
  },
  {
    id: "flor-estambre",
    name: "FLOR - ESTAMBRE",
    color: COLORS.ESTAMBRE,
    description: "Estambre Amarillo Textura Granulada",
  },
  {
    id: "flor-tallo",
    name: "FLOR - TALLO",
    color: COLORS.TALLO,
    description:
      "Tallo de Flor de Chenilla Verde Flexible (Pipe Cleaner, 2 Hojas Tela)",
  },
  {
    id: "pata-izquierda",
    name: "PATA IZQUIERDA",
    color: COLORS.PATA_IZQ,
    description:
      "Suela Pata Izquierda (Espectador) con 'Maranatha' Bordado Script (Hilo Marrón Oscuro)",
  },
  {
    id: "pata-derecha",
    name: "PATA DERECHA",
    color: COLORS.PATA_DER,
    description:
      "Suelas Redondeadas Tela Plana Naranja Claro/Coral (Diferente al Peluche)",
  },
  {
    id: "costura",
    name: "COSTURA",
    color: COLORS.COSTURA,
    description: "Costura de Seguridad Trasera (Reforzada, Oculta)",
  },
  {
    id: "escala",
    name: "ESCALA",
    color: COLORS.ESCALA,
    description: "ESCALA 1:1",
  },
];

const BEAR_TECH_INFO: TechnicalInfo = {
  technique: "Cosido y Ensamblado a Mano",
  composition: "100% Poliéster",
};

type BearDiagramProps = {
  className?: string;
};

export default function BearDiagram({ className = "" }: BearDiagramProps) {
  return (
    <ProductBreakdownDiagram
      imageSrc="/placeholders/Oso-Photoroom.png"
      imageAlt="Osito de peluche artesanal Maranatha sosteniendo una flor de terciopelo púrpura — diagrama de desglose técnico"
      imageWidth={1152}
      imageHeight={648}
      headerLabel="DIAGRAMA DE DESGLOSE DE PRODUCTO"
      title="OSO DE PELUCHE MARANATHA"
      subtitle="Cabeza Esférica Articulada"
      parts={BEAR_PARTS}
      technicalInfo={BEAR_TECH_INFO}
      // Measured from Oso-Photoroom.png: visible subject x 409..671, y 126..442.
      imageSubject={{ cx: 540, cy: 284, width: 262, height: 316 }}
      className={className}
    />
  );
}
