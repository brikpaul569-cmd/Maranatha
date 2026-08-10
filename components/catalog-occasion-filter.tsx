"use client";

import { useEffect, useRef, useState } from "react";
import type { Occasion } from "@/lib/products";

/**
 * Minimal occasion filter for /catalogo (lote 1). Chips toggle `hidden` on
 * the server-rendered product cards (`[data-occasion]`) — content stays in
 * the DOM/HTML for SEO (cc-R1); this component only adds progressive
 * enhancement. Displays nothing meaningful without JS (all products shown).
 */

type CatalogOccasionFilterProps = {
  occasions: Occasion[];
  children: React.ReactNode;
};

export default function CatalogOccasionFilter({
  occasions,
  children,
}: CatalogOccasionFilterProps) {
  const [active, setActive] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-occasion]");
    if (!cards) return;
    cards.forEach((card) => {
      const cardOccasions = (card.dataset.occasion ?? "").split(" ");
      card.hidden = active !== null && !cardOccasions.includes(active);
    });
  }, [active]);

  const chipClass = (isActive: boolean) =>
    [
      "rounded-full border px-4 py-2 font-sans text-xs font-semibold uppercase tracking-widest",
      "transition-colors motion-reduce:transition-none",
      isActive
        ? "border-mar-brown bg-mar-brown text-mar-card"
        : "border-mar-brown/40 text-mar-brown hover:border-mar-brown hover:bg-mar-brown/5",
    ].join(" ");

  return (
    <div ref={gridRef}>
      <div role="group" aria-label="Filtrar por ocasión" className="flex flex-wrap gap-2">
        <button
          type="button"
          className={chipClass(active === null)}
          aria-pressed={active === null}
          onClick={() => setActive(null)}
        >
          Todas
        </button>
        {occasions.map((occasion) => (
          <button
            key={occasion.slug}
            type="button"
            className={chipClass(active === occasion.slug)}
            aria-pressed={active === occasion.slug}
            onClick={() =>
              setActive((current) =>
                current === occasion.slug ? null : occasion.slug
              )
            }
          >
            {occasion.label}
          </button>
        ))}
      </div>
      {children}
    </div>
  );
}
