import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import CatalogGridTransition from "@/components/catalog-grid-transition";
import Eyebrow from "@/components/ui/eyebrow";
import Section from "@/components/ui/section";
import {
  CATEGORIES,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/products";

type CategoryPageProps = {
  params: Promise<{ categoria: string }>;
};

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ categoria: category.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categoria } = await params;
  const category = getCategoryBySlug(categoria);
  if (!category) return {};
  return {
    title: category.metaTitle,
    description: category.metaDescription,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoria } = await params;
  const category = getCategoryBySlug(categoria);
  if (!category) notFound();

  const products = getProductsByCategory(category.slug);

  return (
    <main>
      <Section
        mood={category.mood}
        className="relative overflow-hidden bg-[var(--section-mood)]"
        sheet={false}
      >
        <Link
          href="/catalogo"
          className="font-sans text-sm font-semibold uppercase tracking-widest text-mar-brown/70 transition-colors hover:text-mar-brown"
        >
          ← Todo el catálogo
        </Link>

        <Reveal className="mt-6 max-w-2xl">
          <Eyebrow>Catálogo</Eyebrow>
          <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight text-mar-brown md:text-6xl">
            {category.label}
          </h1>
          <p className="mt-4 font-sans text-lg text-mar-brown/80">
            {category.description}
          </p>
        </Reveal>

        <CatalogGridTransition>
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product, index) => (
              <Reveal key={product.slug} delay={(index % 4) * 0.08} y={24}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </CatalogGridTransition>
      </Section>
    </main>
  );
}
