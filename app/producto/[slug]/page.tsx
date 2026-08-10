import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/product-card";
import Reveal from "@/components/reveal";
import Button from "@/components/ui/button";
import Eyebrow from "@/components/ui/eyebrow";
import Section from "@/components/ui/section";
import { waMeUrl } from "@/lib/constants";
import {
  OCCASIONS,
  PRODUCTS,
  getCategoryBySlug,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/products";
import { getZoneBySlug } from "@/lib/zones";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

/** SSG for every product in the catalog; unknown slugs 404 (dynamicParams). */
export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const mood = category?.mood ?? "catalogo-sage";
  const occasionLabels = product.occasion
    .map((occasionSlug) => OCCASIONS.find((o) => o.slug === occasionSlug)?.label)
    .filter((label): label is string => Boolean(label));
  const zoneNames = product.coverage
    .map((zoneSlug) => getZoneBySlug(zoneSlug)?.name)
    .filter((name): name is string => Boolean(name));
  const mainImage = product.images[0];

  const message = `Hola 👋 Me interesa: ${product.name} (${product.priceLabel}). ¿Está disponible?`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => image.src),
    description: product.description,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "COP",
      availability: product.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug && p.available)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Section
        mood={mood}
        className="relative overflow-hidden bg-[var(--section-mood)]"
      >
        <nav
          aria-label="Ruta de página"
          className="flex flex-wrap items-center gap-2 font-sans text-sm text-mar-brown/70"
        >
          <Link href="/catalogo" className="transition-colors hover:text-mar-brown">
            Catálogo
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/catalogo/${product.category}`}
            className="transition-colors hover:text-mar-brown"
          >
            {category?.label ?? product.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-mar-brown">{product.name}</span>
        </nav>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-mar-card shadow-sm">
            <Image
              src={mainImage.src}
              alt={mainImage.alt}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
              preload
            />
          </div>

          <div className="flex flex-col items-start gap-6">
            <Eyebrow>{category?.label ?? "Catálogo"}</Eyebrow>
            <h1 className="font-display text-4xl leading-tight tracking-tight text-mar-brown md:text-5xl">
              {product.name}
            </h1>

            <p className="font-display text-3xl text-mar-brown">
              {product.priceLabel}
            </p>

            <p className="font-sans text-mar-brown/80">{product.description}</p>

            {occasionLabels.length > 0 && (
              <ul className="flex flex-wrap gap-2" aria-label="Ocasiones">
                {occasionLabels.map((label) => (
                  <li
                    key={label}
                    className="rounded-full bg-mar-card/70 px-3 py-1 font-sans text-xs font-semibold uppercase tracking-widest text-mar-brown"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            )}

            {zoneNames.length > 0 && (
              <p className="font-sans text-sm text-mar-brown/70">
                Domicilio disponible en: {zoneNames.join(", ")}
              </p>
            )}

            {!product.available && (
              <p className="font-sans text-sm font-semibold text-mar-brown">
                Temporalmente agotado — escríbenos para avisarte cuando vuelva.
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <Button variant="whatsapp" href={waMeUrl(message)}>
                Pedir por WhatsApp
              </Button>
              <Button variant="ghost" href="/catalogo">
                Ver catálogo
              </Button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <Reveal className="mt-20">
            <h2 className="font-display text-2xl text-mar-brown md:text-3xl">
              También te puede gustar
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {related.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </Reveal>
        )}
      </Section>
    </>
  );
}
