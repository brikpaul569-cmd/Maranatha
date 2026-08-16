import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import Button from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import Section from "@/components/ui/section";
import {
  OCCASIONS,
  getProductsByOccasion,
} from "@/lib/products";

type OccasionPageProps = {
  params: Promise<{ ocasion: string }>;
};

/** SSG for every occasion taxonomy page; unknown slugs 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return OCCASIONS.map((occasion) => ({ ocasion: occasion.slug }));
}

export async function generateMetadata({
  params,
}: OccasionPageProps): Promise<Metadata> {
  const { ocasion } = await params;
  const occasion = OCCASIONS.find((o) => o.slug === ocasion);
  if (!occasion) return {};
  return {
    title: occasion.label,
    description: occasion.description,
  };
}

export default async function OccasionPage({ params }: OccasionPageProps) {
  const { ocasion } = await params;
  const occasion = OCCASIONS.find((o) => o.slug === ocasion);
  if (!occasion) notFound();

  const products = getProductsByOccasion(occasion.slug);

  return (
    <Section
      mood="catalogo-sage"
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
        <Eyebrow>Ocasiones</Eyebrow>
        <h1 className="mt-4 font-display text-5xl leading-tight tracking-tight text-mar-brown md:text-6xl">
          {occasion.label}
        </h1>
        <p className="mt-4 font-sans text-lg text-mar-brown/80">
          {occasion.description}
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((product, index) => (
          <Reveal key={product.slug} delay={(index % 4) * 0.08} y={24}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-14">
        <Button variant="ghost" href="/catalogo">
          Explorar todo el catálogo
        </Button>
      </Reveal>
    </Section>
  );
}
