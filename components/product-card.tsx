import Image from "next/image";
import Link from "next/link";
import { getCategoryBySlug, type Product } from "@/lib/products";

/**
 * Product card (catalog + related products): lazy `next/image` in a 4/5
 * frame, category label, display name, visible price (cc-R8). The whole card
 * links to `/producto/[slug]` via `next/link`. The per-card WhatsApp CTA was
 * removed (user direction): the floating WhatsApp widget is the single
 * standardized WhatsApp channel on every view. Unavailable products are
 * dimmed with a badge.
 *
 * `data-occasion` exposes the product's occasion slugs for the progressive
 * occasion filter on /catalogo (CatalogOccasionFilter toggles `hidden` on
 * these cards); content stays in the HTML without JS (cc-R1).
 */

export type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const category = getCategoryBySlug(product.category);
  const image = product.images[0];
  const priceLine = product.priceNote
    ? `${product.priceLabel} · ${product.priceNote}`
    : product.priceLabel;

  return (
    <article
      data-occasion={product.occasion.join(" ")}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-mar-card shadow-sm"
    >
      <Link
        href={`/producto/${product.slug}`}
        className="flex flex-1 flex-col"
        aria-label={`Ver ${product.name}`}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-mar-pink-light">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-105 ${
              product.available ? "" : "opacity-50"
            }`}
            loading="lazy"
          />
          {!product.available && (
            <span className="absolute left-3 top-3 rounded-full bg-mar-brown px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-widest text-mar-card">
              No disponible
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          {category && (
            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-mar-brown/50">
              {category.label}
            </p>
          )}
          <h3 className="font-display text-xl text-mar-brown">{product.name}</h3>
          <p className="mt-auto font-sans text-base font-semibold text-mar-brown">
            {priceLine}
          </p>
        </div>
      </Link>
    </article>
  );
}
