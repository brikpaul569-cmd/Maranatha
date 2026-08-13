import type { Metadata } from "next";
import { OCCASIONS, PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/product-card";
import CategoryFilter from "@/components/category-filter";
import CatalogOccasionFilter from "@/components/catalog-occasion-filter";
import Section from "@/components/ui/section";
import Watermark from "@/components/watermark";
import Eyebrow from "@/components/ui/eyebrow";
import GlassSurface from "@/components/glass-surface";
import ParallaxFloat from "@/components/parallax-float";
import SplitText from "@/components/split-text";

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
          src="/placeholders/gift.svg"
          className="left-8 top-6 w-16 md:w-20"
        />
        <Watermark
          src="/placeholders/flower.svg"
          className="bottom-8 right-8 w-20 md:w-24"
          opacity={0.12}
        />

        {/* Texto flotante sobre fondo: sin cajas contenedoras, espejo/cristal
            sutil detrás del texto, parallax + SplitText reveal al hacer scroll. */}
        <div className="max-w-2xl">
          <ParallaxFloat speed={0.15} float>
            <Eyebrow>Detalles para cada ocasión</Eyebrow>
          </ParallaxFloat>

          <GlassSurface className="mt-4">
            <ParallaxFloat speed={0.5} float>
              <SplitText
                as="h1"
                by="chars"
                stagger={0.05}
                className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-mar-brown"
              >
                Catálogo
              </SplitText>
            </ParallaxFloat>
          </GlassSurface>

          <GlassSurface className="mt-6 max-w-xl">
            <ParallaxFloat speed={0.2} float>
              <SplitText
                as="p"
                by="words"
                stagger={0.04}
                className="font-sans text-base text-mar-brown/80 md:text-lg"
              >
                Arreglos florales y detalles hechos a mano en Bogotá. Elige una
                categoría o una ocasión, o explora todo el catálogo: cada precio
                está a la vista y puedes pedir por WhatsApp con un solo clic.
              </SplitText>
            </ParallaxFloat>
          </GlassSurface>

          <ParallaxFloat className="mt-8" speed={0.05} float>
            <CategoryFilter />
          </ParallaxFloat>
        </div>

        {/* Grid de productos: cada card flota con parallax diferenciado,
            sin bordes, sin sombras, sin fondo de caja. */}
        <div className="mt-10">
          <CatalogOccasionFilter occasions={OCCASIONS}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {PRODUCTS.map((product, index) => (
                <ParallaxFloat
                  key={product.slug}
                  speed={(index % 4) * 0.1 + 0.15}
                  float
                >
                  <ProductCard product={product} />
                </ParallaxFloat>
              ))}
            </div>
          </CatalogOccasionFilter>
        </div>
      </Section>
    </main>
  );
}
