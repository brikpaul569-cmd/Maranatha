import type { Metadata } from "next";
import { OCCASIONS, PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/product-card";
import CategoryFilter from "@/components/category-filter";
import CatalogOccasionFilter from "@/components/catalog-occasion-filter";
import DetailClip from "@/components/detail-clip";
import Section from "@/components/ui/section";
import Watermark from "@/components/watermark";
import Eyebrow from "@/components/ui/eyebrow";
import ParallaxFloat from "@/components/parallax-float";
import CascadeReveal from "@/components/cascade-reveal";
import CatalogGridTransition from "@/components/catalog-grid-transition";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Catálogo de arreglos florales artesanales de Detalles Maranatha en Bogotá: flores de listón, bouquets de limpiapipas, arreglos con peluche y canastas de café. Pide por WhatsApp.",
};

export default function CatalogoPage() {
  return (
    <main>
      <Section
        mood="catalogo-sage"
        className="relative bg-[var(--section-mood)]"
        sheet={false}
      >
        <Watermark
          doodle="leaf"
          className="left-8 top-6 w-16 md:w-20"
        />
        <Watermark
          doodle="flower"
          className="bottom-8 right-8 w-20 md:w-24"
          opacity={0.12}
        />

        {/* Texto sobre fondo: sin cajas, sin animación, texto directo al fondo. */}
        <div className="max-w-2xl">
          <Eyebrow>Detalles para cada ocasión</Eyebrow>

          <h1 className="mt-4 inline-flex flex-wrap items-center gap-2 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-mar-brown">
            Catálogo <DetailClip variant="leaf" />
          </h1>

          <p className="mt-6 max-w-xl font-sans text-base text-mar-brown/80 md:text-lg">
            Arreglos florales y detalles hechos a mano en Bogotá. Elige una
            categoría o una ocasión, o explora todo el catálogo: cada precio
            está a la vista y puedes pedir por WhatsApp con un solo clic.
          </p>

          <ParallaxFloat className="mt-8" speed={0.05} float>
            <CategoryFilter />
          </ParallaxFloat>
        </div>

        {/* Grid de productos: revelación en cascada al hacer scroll,
            sin bordes, sin sombras, sin fondo de caja. */}
        <div className="mt-10">
          <CatalogOccasionFilter occasions={OCCASIONS}>
            <CascadeReveal>
              <CatalogGridTransition>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {PRODUCTS.map((product) => (
                    <div key={product.slug} data-cascade>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </CatalogGridTransition>
            </CascadeReveal>
          </CatalogOccasionFilter>
        </div>
      </Section>
    </main>
  );
}
