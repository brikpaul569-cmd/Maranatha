"use client";

import ProductBreakdownDiagram from "@/components/product-breakdown-diagram";
import type { ProductPart, TechnicalInfo } from "@/components/product-breakdown-diagram";

/**
 * ConejitoDiagram — canasta temática "Conejito" (arreglo con peluche + flores).
 * Reutiliza ProductBreakdownDiagram: solo cambian los datos, cero lógica de render.
 *
 * Placeholder visual: Oso-Photoroom.png (hasta tener foto real del conejito).
 */

const COLORS = {
  TELA: "#8B5A2B",
  OREJAS_LARGAS: "#EA5809",
  OJOS: "#2563EB",
  HOCICO: "#EC4899",
  MEJILLAS: "#F472B6",
  RELLENO: "#16A34A",
  BRAZOS: "#7C3AED",
  PATA_DELANT_DER: "#EA5809",
  PATA_DELANT_IZQ: "#EA5809",
  PATA_TRAS_DER: "#EA5809",
  PATA_TRAS_IZQ: "#EA5809",
  FLOR_CENTRO: "#7C3AED",
  FLOR_PETALOS: "#A855F7",
  FLOR_TALLO: "#16A34A",
  LAZO: "#F43F5E",
  ZANAHORIA: "#FB923C",
  ESCALA: "#656565",
  COSTURA: "#656565",
};

const CONEJITO_PARTS: ProductPart[] = [
  // ── LEFT COLUMN (top → bottom) ──────────────────────────────────
  {
    id: "l1-orejas",
    name: "OREJAS LARGAS",
    color: COLORS.OREJAS_LARGAS,
    description: "Tela Exterior Marrón, Interior Rosa Suave (Alambre Interno para Pose)",
    point: [480, 80],
    side: "left",
    box: [40, 60],
  },
  {
    id: "l2-ojos",
    name: "OJOS",
    color: COLORS.OJOS,
    description: "Ojos de Seguridad Plástico (Negros, Brillantes, Forma Almendra)",
    point: [520, 160],
    side: "left",
    box: [40, 135],
  },
  {
    id: "l3-cuerpo",
    name: "CUERPO/RELLENO",
    color: COLORS.RELLENO,
    description: "Relleno Poliéster Hipoalergénico (Media Densidad, Forma Redondeada)",
    point: [576, 300],
    side: "left",
    box: [40, 275],
  },
  {
    id: "l4-pata-delant-izq",
    name: "PATA DELANT. IZQ",
    color: COLORS.PATA_DELANT_IZQ,
    description: "Pata Delantera Izquierda (Sujeta Zanahoria de Tela)",
    point: [460, 380],
    side: "left",
    box: [40, 340],
  },
  {
    id: "l5-pata-tras-izq",
    name: "PATA TRASERA IZQ",
    color: COLORS.PATA_TRAS_IZQ,
    description: "Pata Trasera Izquierda (Suela Rosa Bordada 'Maranatha')",
    point: [430, 540],
    side: "left",
    box: [40, 500],
  },
  {
    id: "l6-escala",
    name: "ESCALA",
    color: COLORS.ESCALA,
    description: "ESCALA 1:1",
    point: [30, 615],
    side: "left",
    // Sin box → auto ancla en esquina inferior-izquierda
  },

  // ── RIGHT COLUMN (top → bottom) ─────────────────────────────────
  {
    id: "r1-tela",
    name: "TELA",
    color: COLORS.TELA,
    description: "Peluche Sintético Marrón Claro (Pelo Corto, Tacto Sedoso)",
    point: [600, 90],
    side: "right",
    box: [870, 70],
  },
  {
    id: "r2-mejillas",
    name: "MEJILLAS",
    color: COLORS.MEJILLAS,
    description: "Rubor Rosa Flocado (Simula Mejillas Sonrojadas)",
    point: [620, 180],
    side: "right",
    box: [870, 150],
  },
  {
    id: "r3-hocico",
    name: "HOCICO",
    color: COLORS.HOCICO,
    description: "Hocico y Sonrisa Bordados (Hilo Rosa Oscuro, Nariz Triangular)",
    point: [576, 210],
    side: "right",
    box: [870, 190],
  },
  {
    id: "r4-zanahoria",
    name: "ZANAHORIA",
    color: COLORS.ZANAHORIA,
    description: "Zanahoria de Tela Naranja (Relleno Suave, Tallo Verde Fieltro)",
    point: [550, 370],
    side: "right",
    box: [870, 270],
  },
  {
    id: "r5-lazo",
    name: "LAZO DECORATIVO",
    color: COLORS.LAZO,
    description: "Lazo de Tela Rosa (Detalle en Cuello, Nudo Doble)",
    point: [576, 280],
    side: "right",
    box: [870, 230],
  },
  {
    id: "r6-flor-centro",
    name: "FLOR - CENTRO",
    color: COLORS.FLOR_CENTRO,
    description: "Flor Central de Listón (Rosa Palo, 5 Pétalos, Botón Dorado)",
    point: [650, 320],
    side: "right",
    box: [870, 310],
  },
  {
    id: "r7-flor-petalos",
    name: "FLOR - PÉTALOS",
    color: COLORS.FLOR_PETALOS,
    description: "Pétalos de Listón (Tonalidades Rosa/Lila, Corte Térmico)",
    point: [670, 340],
    side: "right",
    box: [870, 350],
  },
  {
    id: "r8-flor-tallo",
    name: "FLOR - TALLO",
    color: COLORS.FLOR_TALLO,
    description: "Tallo de Alambre Forrado Verde (2 Hojas de Tela)",
    point: [650, 380],
    side: "right",
    box: [870, 390],
  },
  {
    id: "r9-pata-delant-der",
    name: "PATA DELANT. DER",
    color: COLORS.PATA_DELANT_DER,
    description: "Pata Delantera Derecha (Sujeta Tallo Flor Central)",
    point: [680, 380],
    side: "right",
    box: [870, 340],
  },
  {
    id: "r10-pata-tras-der",
    name: "PATA TRASERA DER",
    color: COLORS.PATA_TRAS_DER,
    description: "Pata Trasera Derecha (Suela Rosa, Igual a Izquierda)",
    point: [700, 540],
    side: "right",
    box: [870, 500],
  },
  {
    id: "r11-costura",
    name: "COSTURA",
    color: COLORS.COSTURA,
    description: "Costura de Seguridad Trasera (Reforzada, Oculta bajo Cola)",
    point: [650, 500],
    side: "right",
    box: [870, 470],
  },
];

const CONEJITO_TECH_INFO: TechnicalInfo = {
  technique: "Cosido y Ensamblado a Mano + Alambrado Interno en Orejas",
  composition: "100% Poliéster + Alambre Recubierto (Orejas) + Fieltro (Accesorios)",
};

type ConejitoDiagramProps = {
  className?: string;
};

export default function ConejitoDiagram({ className = "" }: ConejitoDiagramProps) {
  return (
    <ProductBreakdownDiagram
      imageSrc="/placeholders/Oso-Photoroom.png"
      imageAlt="Canasta temática conejito Maranatha — peluche con orejas alambradas, zanahoria y flores de listón"
      imageWidth={1152}
      imageHeight={648}
      headerLabel="DIAGRAMA DE DESGLOSE DE PRODUCTO"
      title="CANASTA CONEJITO MARANATHA"
      subtitle="Orejas Alambradas + Accesorios de Tela"
      parts={CONEJITO_PARTS}
      technicalInfo={CONEJITO_TECH_INFO}
      className={className}
    />
  );
}
