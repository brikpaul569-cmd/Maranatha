import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { waMeUrl } from "@/lib/constants";
import { PRODUCTS } from "@/lib/products";
import { ZONES, getZoneBySlug } from "@/lib/zones";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import Button from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import Section from "@/components/ui/section";

/**
 * Generic delivery-zone page (Brief 03 §1.1/§1.3). SSG over ZONES; the "bogota"
 * hub has its own static page, so this route only serves the sub-zones
 * (bogota-norte/centro/sur/soacha). Products shown are those whose coverage
 * includes the zone slug, falling back to "bogota" coverage if the list is
 * empty so the section never renders blank.
 */

type ZonePageProps = {
  params: Promise<{ ciudad: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return ZONES.filter((zone) => zone.slug !== "bogota").map((zone) => ({
    ciudad: zone.slug,
  }));
}

export async function generateMetadata({
  params,
}: ZonePageProps): Promise<Metadata> {
  const { ciudad } = await params;
  const zone = getZoneBySlug(ciudad);
  if (!zone) return {};
  return {
    title: `Domicilios en ${zone.name}`,
    description: `Envío de flores y detalles a domicilio el mismo día en ${zone.name}: ${zone.tagline}. Tiempo estimado de entrega ${zone.deliveryTime}. Barrios: ${zone.neighborhoods.join(", ")}. Pide por WhatsApp.`,
  };
}

export default async function ZonePage({ params }: ZonePageProps) {
  const { ciudad } = await params;
  const zone = getZoneBySlug(ciudad);
  if (!zone) notFound();

  let zoneProducts = PRODUCTS.filter((product) =>
    product.coverage.includes(zone.slug)
  );
  if (zoneProducts.length === 0) {
    zoneProducts = PRODUCTS.filter((product) =>
      product.coverage.includes("bogota")
    );
  }
  const products = zoneProducts.slice(0, 8);

  return (
    <main>
      <Section
        mood="catalogo-sage"
        className="relative overflow-hidden bg-[var(--section-mood)]"
      >
        <Link
          href="/domicilios/bogota"
          className="font-sans text-sm font-semibold uppercase tracking-widest text-mar-brown/70 transition-colors hover:text-mar-brown"
        >
          ← Ver todas las zonas
        </Link>

        <Reveal className="mt-6 max-w-2xl">
          <Eyebrow>Domicilios en Bogotá</Eyebrow>
          <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight text-mar-brown md:text-6xl">
            {zone.name}
          </h1>
          <p className="mt-4 font-sans text-lg text-mar-brown/80">
            {zone.tagline}
          </p>
          {zone.description.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-4 font-sans text-base text-mar-brown/80 md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-6 rounded-2xl bg-mar-card p-6 shadow-sm md:p-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.35em] text-mar-brown/60">
                Entrega estimada
              </p>
              <p className="mt-1 font-display text-2xl text-mar-brown">
                {zone.deliveryTime}
              </p>
            </div>
            <Button
              variant="whatsapp"
              href={waMeUrl(zone.whatsappMessage)}
              className="ml-auto"
            >
              Pedir por WhatsApp
            </Button>
          </div>
        </Reveal>

        <div className="mt-14">
          <Reveal>
            <h2 className="font-display text-3xl text-mar-brown md:text-4xl">
              Barrios y sectores
            </h2>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-2">
            {zone.neighborhoods.map((neighborhood) => (
              <span
                key={neighborhood}
                className="rounded-full bg-mar-card px-4 py-1.5 font-sans text-sm text-mar-brown/80"
              >
                {neighborhood}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <Reveal>
            <h2 className="font-display text-3xl text-mar-brown md:text-4xl">
              Productos que llegan a {zone.name}
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product, index) => (
              <Reveal key={product.slug} delay={(index % 4) * 0.08} y={24}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
    </main>
  );
}
