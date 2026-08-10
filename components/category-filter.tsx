import Link from "next/link";
import { getCategories } from "@/lib/products";

/**
 * Category filter pills shared by /catalogo and /catalogo/[categoria]. The
 * active category renders as a solid pill; "Todos" is active on the catalog
 * landing page. Only real routes are linked (no dead anchors).
 */

export type CategoryFilterProps = {
  activeSlug?: string;
};

export default function CategoryFilter({ activeSlug }: CategoryFilterProps) {
  const categories = getCategories();
  const links = [
    { slug: "todos", label: "Todos", href: "/catalogo" },
    ...categories.map((category) => ({
      slug: category.slug,
      label: category.label,
      href: `/catalogo/${category.slug}`,
    })),
  ];

  return (
    <nav aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
      {links.map((link) => {
        const active = link.slug === activeSlug;
        return (
          <Link
            key={link.slug}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "rounded-full bg-mar-brown px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-mar-card"
                : "rounded-full border border-mar-brown/30 px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest text-mar-brown/80 transition-colors hover:border-mar-brown hover:text-mar-brown"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
