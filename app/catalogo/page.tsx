import type { Metadata } from "next";
import { OCCASIONS, PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/product-card";
import CategoryFilter from "@/components/category-filter";
import CatalogOccasionFilter from "@/components/catalog-occasion-filter";
import Section from "@/components/ui/section";
import Eyebrow from "@/components/ui/eyebrow";
import Reveal from "@/components/reveal";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Catálogo de arreglos florales artesanales de Detalles Maranatha en Bogotá: flores de listón, bouquets de limpiapipas, arreglos con peluche y canastas de café. Pide por WhatsApp.",
};

export default function CatalogoPage() {
  return (
    <main>
      <Section mood="catalogo-sage" className="bg-[var(--section-mood)]">
        <div className="max-w-2xl">
          <Reveal>
            <Eyebrow>Detalles para cada ocasión</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-4 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-mar-brown">
              Catálogo
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 font-sans text-base text-mar-brown/80 md:text-lg">
              Arreglos florales y detalles hechos a mano en Bogotá. Elige una
              categoría o una ocasión, o explora todo el catálogo: cada precio
              está a la vista y puedes pedir por WhatsApp con un solo clic.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <CategoryFilter />
          </Reveal>
        </div>

        <div className="mt-10">
          <CatalogOccasionFilter occasions={OCCASIONS}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {PRODUCTS.map((product, index) => (
                <Reveal key={product.slug} delay={(index % 4) * 0.08} y={24}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </CatalogOccasionFilter>
        </div>
      </Section>
    </main>
  );
}
