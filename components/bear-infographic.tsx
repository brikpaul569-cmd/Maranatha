import Image from "next/image";
import ScrapbookInfographic from "@/components/scrapbook-infographic";
import type { ScrapbookFeature } from "@/components/scrapbook-infographic";

/** Bear features — first 3 fill the left column, last 3 the right one.
 *  The ScrapbookInfographic layout assigns columns by array order. */
const FEATURES: ScrapbookFeature[] = [
  {
    id: "tela-hipoalergenica",
    label: "Tela Hipoalergénica",
    text: "Peluche sintético marrón canela, suave al tacto y seguro para niños",
    icon: "plush",
  },
  {
    id: "bordado-a-mano",
    label: "Bordado a Mano",
    text: "Costuras reforzadas y ensamblado 100% artesanal",
    icon: "stitch",
  },
  {
    id: "relleno-premium",
    label: "Relleno Premium",
    text: "Poliéster hipoalergénico de media densidad, suave y abrazable",
    icon: "fill",
  },
  {
    id: "ojos-de-seguridad",
    label: "Ojos de Seguridad",
    text: "Ojos de seguridad y sonrisa bordada con cariño",
    icon: "smile",
  },
  {
    id: "flor-de-terciopelo",
    label: "Flor de Terciopelo",
    text: "Flor púrpura de 5 pétalos cosida a su patita",
    icon: "flower",
  },
  {
    id: "hecho-en-bogota",
    label: "Hecho en Bogotá",
    text: "Con 'Maranatha' bordado en la suela",
    icon: "pin",
  },
];

/** Central image: the real product cutout (Oso-Photoroom.png) shown as-is,
 *  transparent and frameless so it blends with the page background in every
 *  theme. The frame's transparent air is cropped away with object-cover so
 *  the teddy is the protagonist — the product itself is never cropped. */
function BearPhoto() {
  return (
    <div className="mx-auto aspect-[17/22] w-full max-w-[320px] md:w-[500px] md:max-w-full">
      <Image
        src="/placeholders/Oso-Photoroom.png"
        alt="Oso de peluche artesanal Maranatha"
        width={1152}
        height={648}
        sizes="(min-width: 768px) 500px, 320px"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

export default function BearInfographic() {
  return (
    <ScrapbookInfographic
      title="Detalle del Oso de Peluche"
      illustration={<BearPhoto />}
      features={FEATURES}
      footer="Detalles Maranatha · Hecho a Mano en Bogotá"
    />
  );
}
