import { NextResponse } from "next/server";
import { SEO_BASE_URL } from "@/lib/seo";
import { ZONES } from "@/lib/zones";

/** Zonas / domicilios sitemap (Brief 03 §2). Hub + sub-zones. */
export async function GET() {
  const lastmod = new Date().toISOString();
  const urls = [
    { loc: `${SEO_BASE_URL}/domicilios/bogota`, priority: "0.9", changefreq: "weekly" },
    ...ZONES.filter((z) => z.slug !== "bogota").map((z) => ({
      loc: `${SEO_BASE_URL}/domicilios/${z.slug}`,
      priority: "0.8",
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
