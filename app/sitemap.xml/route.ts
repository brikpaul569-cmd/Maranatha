import { NextResponse } from "next/server";
import { SEO_BASE_URL } from "@/lib/seo";

/**
 * Sitemap index (Brief 03 §2) served at /sitemap.xml. Next.js' native
 * `app/sitemap.ts` only emits a single flat <urlset>, never a <sitemapindex>,
 * so this custom Route Handler follows the same folder-convention as
 * app/favicon.ico/route.ts → /favicon.ico (verified Next.js pattern):
 * placing route.ts inside a "sitemap.xml" folder serves /sitemap.xml.
 *
 * The three member sitemaps are themselves custom Route Handlers so the brief
 * gets exact, predictable filenames and absolute URLs for crawlers.
 */
export async function GET() {
  const lastmod = new Date().toISOString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SEO_BASE_URL}/sitemap-productos.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
  <sitemap><loc>${SEO_BASE_URL}/sitemap-zonas.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
  <sitemap><loc>${SEO_BASE_URL}/sitemap-paginas.xml</loc><lastmod>${lastmod}</lastmod></sitemap>
</sitemapindex>`;
  return new NextResponse(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
