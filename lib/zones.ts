/**
 * Bogotá delivery zones (Brief 03 §1.1). Data is created now for Lote 3
 * (the `/domicilios/[ciudad]` pages), but the coverage field is required on
 * every product from day one (Brief 03 §1.3), so zones are the single source
 * for zone slugs and copy. Only zones with real coverage exist — no
 * bogota-occidente until coverage is confirmed.
 */

export type ZoneSlug =
  | "bogota"
  | "bogota-norte"
  | "bogota-centro"
  | "bogota-sur"
  | "bogota-soacha";

export type Zone = {
  slug: ZoneSlug;
  name: string;
  tagline: string;
  /** 2–3 unique paragraphs mentioning real localities/neighborhoods. */
  description: string[];
  neighborhoods: string[];
  deliveryTime: string;
  /** Pre-filled WhatsApp message that names the zone. */
  whatsappMessage: string;
};

export const ZONES: Zone[] = [
  {
    slug: "bogota",
    name: "Bogotá",
    tagline: "Domicilios en toda la ciudad",
    description: [
      "Cubrimos toda Bogotá con domicilios el mismo día: desde Usaquén y Suba en el norte, pasando por Chapinero y Teusaquillo en el centro, hasta Bosa y Kennedy en el sur.",
      "Cada pedido sale de nuestro taller con empaque artesanal y se confirma por WhatsApp con foto antes de despachar. Los tiempos reales dependen de la zona y del tráfico del momento, pero apuntamos siempre a la ventana de entrega estimada.",
      "Si tu barrio no aparece en la lista de cobertura, escríbenos igual: en muchos casos coordinamos puntos de entrega cercanos.",
    ],
    neighborhoods: [
      "Usaquén",
      "Suba",
      "Chapinero",
      "Teusaquillo",
      "Bosa",
      "Kennedy",
      "Ciudad Bolívar",
    ],
    deliveryTime: "45–90 min",
    whatsappMessage:
      "Hola 👋 Quiero un detalle para envío en Bogotá. ¿Cuál sería el tiempo de entrega?",
  },
  {
    slug: "bogota-norte",
    name: "Bogotá – Norte",
    tagline: "Usaquén, Chicó, Cedritos y alrededores",
    description: [
      "Domicilios ágiles en el norte de Bogotá: Usaquén, Santa Bárbara, Chicó, Cedritos y alrededores. Es una de las rutas más rápidas de nuestro taller por la cercanía a la Autopista Norte.",
      "Hacemos entregas en barrios como Toberín, La Calleja, El Country y el sector de Unicentro, con confirmación por WhatsApp al salir el domiciliario.",
    ],
    neighborhoods: [
      "Usaquén",
      "Santa Bárbara",
      "El Chicó",
      "Cedritos",
      "Toberín",
      "La Calleja",
      "El Country",
      "Unicentro",
    ],
    deliveryTime: "45–75 min",
    whatsappMessage:
      "Hola 👋 Quiero un detalle para envío en Bogotá – Norte. ¿Están entregando hoy?",
  },
  {
    slug: "bogota-centro",
    name: "Bogotá – Centro",
    tagline: "Chapinero, Teusaquillo y La Candelaria",
    description: [
      "Atendemos el centro de Bogotá: Chapinero, Teusaquillo, Galerías, Palermo y hasta La Candelaria. Ideal si el detalle va para una oficina o un negocio en el centro.",
      "En sectores como Quinta Camacho, el barrio La Soledad, el Parkway y Los Mártires coordinamos entregas a mano en porterías y recepciones de edificios.",
    ],
    neighborhoods: [
      "Chapinero",
      "Teusaquillo",
      "Galerías",
      "Palermo",
      "La Candelaria",
      "Quinta Camacho",
      "La Soledad",
      "Los Mártires",
    ],
    deliveryTime: "40–70 min",
    whatsappMessage:
      "Hola 👋 Quiero un detalle para envío en Bogotá – Centro. ¿Tienen disponibilidad hoy?",
  },
  {
    slug: "bogota-sur",
    name: "Bogotá – Sur",
    tagline: "Bosa, Kennedy, Tunjuelito y Ciudad Bolívar",
    description: [
      "Cobertura en el sur de Bogotá: Bosa, Kennedy, Tunjuelito, Rafael Uribe Uribe y Ciudad Bolívar. Coordinamos la ruta del sur con ventanas de entrega claras para que recibas el detalle sin sorpresas.",
      "Atendemos barrios como El Tintal, Madelena, Quiroga, Patio Bonito y el sector de la Avenida Boyacá sur, con envíos desde nuestro taller.",
    ],
    neighborhoods: [
      "Bosa",
      "Kennedy",
      "Tunjuelito",
      "Rafael Uribe Uribe",
      "Ciudad Bolívar",
      "El Tintal",
      "Madelena",
      "Quiroga",
      "Patio Bonito",
    ],
    deliveryTime: "60–90 min",
    whatsappMessage:
      "Hola 👋 Quiero un detalle para envío en Bogotá – Sur. ¿Cuál es el tiempo de entrega?",
  },
  {
    slug: "bogota-soacha",
    name: "Soacha",
    tagline: "Ciudad Verde, Compartir, San Mateo y Terreros",
    description: [
      "Llevamos tus detalles hasta Soacha: Ciudad Verde, Compartir, San Mateo, Terreros y El Nogal. Es la extensión natural de nuestra ruta del sur de Bogotá.",
      "Los domicilios a Soacha se despachan en turnos específicos de la tarde para aprovechar la salida por la Autopista Sur; confirma el horario por WhatsApp al hacer tu pedido.",
    ],
    neighborhoods: [
      "Ciudad Verde",
      "Compartir",
      "San Mateo",
      "Terreros",
      "El Nogal",
      "La Despensa",
      "Quintas de la Laguna",
    ],
    deliveryTime: "60–90 min",
    whatsappMessage:
      "Hola 👋 Quiero un detalle para envío en Soacha. ¿Cuál es el horario de entrega?",
  },
];

/** Returns a zone by slug, or undefined. */
export function getZoneBySlug(slug: string): Zone | undefined {
  return ZONES.find((zone) => zone.slug === slug);
}

/** The city-level hub that links to every other zone (Brief 03 §1.2). */
export const HUB_ZONE: Zone = ZONES.find((zone) => zone.slug === "bogota")!;
