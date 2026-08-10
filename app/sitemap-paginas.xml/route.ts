import { NextResponse } from "next/server";
import { SEO_BASE_URL } from "@/lib/seo";
import { OCCASIONS } from "@/lib/products";

/** Paginas estáticas y ocasiones sitemap (Brief 03 §2). */
export async function GET() {
  const lastmod = new Date().toISOString();
  const staticUrls = [
    { loc: `${SEO_BASE_URL}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${SEO_BASE_URL}/catalogo`, priority: "0.8", changefreq: "daily" },
    { loc: `${SEO_BASE_URL}/nosotros`, priority: "0.5", changefreq: "monthly" },
    { loc: `${SEO_BASE_URL}/galeria`, priority: "0.5", changefreq: "monthly" },
    { loc: `${SEO_BASE_URL}/contacto`, priority: "0.5", changefreq: "monthly" },
  ];
  const urls = [
    ...staticUrls,
    ...OCCASIONS.map((o) => ({
      loc: `${SEO_BASE_URL}/ocasiones/${o.slug}`,
      priority: "0.7",
      changefreq: "weekly",
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
