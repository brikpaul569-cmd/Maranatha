import type { NextConfig } from "next";

/**
 * Static export configuration for GitHub Pages (repo: brikpaul569-cmd/Maranatha).
 *
 * - output: "export"  → `next build` generates ./out with plain HTML/JS/CSS.
 * - basePath          → GitHub Pages serves project sites under /<repo>/.
 *                       Applied only in production builds so the local dev
 *                       server keeps working at http://localhost:3000/.
 * - trailingSlash     → Required for GitHub Pages: routes render as
 *                       /catalogo/index.html and links point to /catalogo/,
 *                       otherwise GitHub Pages 404s on extensionless links.
 * - images.loader     → GitHub Pages has no Next.js image optimizer, and a
 *                       bare `unoptimized: true` does NOT apply basePath to the
 *                       emitted <img src> (Next.js gotcha). A custom loader
 *                       prefixes every local image src with the basePath in
 *                       production builds; in dev the prefix is empty so
 *                       http://localhost:3000/ keeps working unchanged.
 */
const isProd = process.env.NODE_ENV === "production";
const BASE_PATH = isProd ? "/Maranatha" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
};

export default nextConfig;
