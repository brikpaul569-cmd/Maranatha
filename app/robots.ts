import type { MetadataRoute } from "next";
import { SEO_BASE_URL } from "@/lib/seo";

// Brief 03 §2: sitemap is an index served from /sitemap.xml, which points to
// the per-section sitemaps. robots.txt references that index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SEO_BASE_URL}/sitemap.xml`,
    host: SEO_BASE_URL,
  };
}
