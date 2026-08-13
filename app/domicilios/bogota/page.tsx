import type { Metadata } from "next";
import Link from "next/link";
import { HOURS } from "@/lib/constants";
import { getFeaturedProducts, PRODUCTS } from "@/lib/products";
import { HUB_ZONE, ZONES } from "@/lib/zones";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import Eyebrow from "@/components/ui/eyebrow";
import Section from "@/components/ui/section";

/**
 * Bogotá coverage hub (Brief 03 §1.2). Central node for the /domicilios tree:
 * links every non-hub zone, carries the primary LocalBusiness-candidate copy
 * and same-day delivery info, and previews products that cover "bogota".
 * SSG; the footer link points here via ROUTES.domiciliosBogota.
 */

export const metadata: Metadata = {
  title: "Domicilios en Bogotá · Envío de flores y detalles el mismo día",
  description:
    "Entrega de arreglos florales y detalles a domicilio el mismo día en Bogotá: Norte, Centro, Sur y Soacha. Tiempo estimado 45–90 minutos, con confirmación por WhatsApp. Pide tu detalle hecho a mano hoy.",
};

export default function DomiciliosBogotaPage() {
  const zones = ZONES.filter((zone) => zone.slug !== HUB_ZONE.slug);

  let zoneProducts = PRODUCTS.filter((product) =>
    product.coverage.includes(HUB_ZONE.slug)
  );
  if (zoneProducts.length === 0) {
    zoneProducts = getFeaturedProducts();
  }
  const products = zoneProducts.slice(0, 8);

  return (
    <main>
      <Section mood="catalogo-sage" className="bg-[var(--section-mood)]">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Entrega el mismo día</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-mar-brown">
              Domicilios en {HUB_ZONE.name}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 font-sans text-base text-mar-brown/80 md:text-lg">
              {HUB_ZONE.tagline}
            </p>
          </Reveal>
          {HUB_ZONE.description.map((paragraph, index) => (
            <Reveal key={paragraph} delay={0.1 + index * 0.05}>
              <p className="mt-4 font-sans text-base text-mar-brown/80 md:text-lg">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2} className="mt-10">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-6 glass-surface p-6 md:p-8">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.35em] text-mar-brown/60">
                Entrega estimada
              </p>
              <p className="mt-1 font-display text-2xl text-mar-brown">
                {HUB_ZONE.deliveryTime}
              </p>
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.35em] text-mar-brown/60">
                Horario de atención
              </p>
              <p className="mt-1 font-sans text-base font-semibold text-mar-brown">
                {HOURS.days} · {HOURS.time}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <h2 className="font-display text-3xl text-mar-brown md:text-4xl">
              Zonas de cobertura
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {zones.map((zone, index) => (
              <Reveal
                key={zone.slug}
                delay={(index % 2) * 0.08}
                y={24}
                className="h-full"
              >
                <Link
                  href={`/domicilios/${zone.slug}`}
                  className="group flex h-full flex-col gap-2 glass-surface p-6 transition-transform duration-300 motion-reduce:transition-none motion-safe:hover:-translate-y-1"
                >
                  <h3 className="font-display text-2xl text-mar-brown">
                    {zone.name}
                  </h3>
                  <p className="font-sans text-sm text-mar-brown/70">
                    {zone.tagline}
                  </p>
                  <p className="mt-auto pt-4 font-sans text-sm text-mar-brown/80">
                    Entrega estimada:{" "}
                    <span className="font-semibold">{zone.deliveryTime}</span>
                  </p>
                  <span className="mt-2 font-sans text-sm font-semibold uppercase tracking-widest text-mar-gold transition-colors motion-safe:group-hover:text-mar-brown">
                    Ver esta zona →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <h2 className="font-display text-3xl text-mar-brown md:text-4xl">
              Barrios que cubrimos
            </h2>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-2">
            {HUB_ZONE.neighborhoods.map((neighborhood) => (
              <span
                key={neighborhood}
                className="rounded-full bg-mar-card px-4 py-1.5 font-sans text-sm text-mar-brown/80"
              >
                {neighborhood}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <h2 className="font-display text-3xl text-mar-brown md:text-4xl">
              Productos que llegan a tu zona
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
