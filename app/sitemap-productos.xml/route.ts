import { NextResponse } from "next/server";
import { SEO_BASE_URL } from "@/lib/seo";
import { CATEGORIES, PRODUCTS } from "@/lib/products";

/** Productos sitemap (Brief 03 §2). */
export async function GET() {
  const lastmod = new Date().toISOString();
  const urls = [
    ...PRODUCTS.map((p) => ({
      loc: `${SEO_BASE_URL}/producto/${p.slug}`,
      priority: "0.7",
      changefreq: "weekly" as const,
    })),
    ...CATEGORIES.map((c) => ({
      loc: `${SEO_BASE_URL}/catalogo/${c.slug}`,
      priority: "0.8",
      changefreq: "daily" as const,
    })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls
    .map((u) => `<url><loc>${u.loc}</loc><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority><lastmod>${lastmod}</lastmod></url>`)
    .join("")}
</urlset>`;
  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
