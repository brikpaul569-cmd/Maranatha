/**
 * Custom image loader for GitHub Pages static export (repo: brikpaul569-cmd/Maranatha).
 *
 * GitHub Pages serves project sites under /<repo>/, and `basePath` only prefixes
 * URLs Next.js itself generates — a bare `images.unoptimized: true` does NOT
 * apply the basePath to the emitted <img src> (Next.js gotcha). This loader
 * prefixes every local image src with the basePath in production builds; in dev
 * the prefix is empty so http://localhost:3000/ keeps working unchanged.
 *
 * Wired from next.config.ts: images.loader = "custom", images.loaderFile =
 * "./lib/image-loader.ts".
 */

const isProd = process.env.NODE_ENV === "production";
const BASE_PATH = isProd ? "/Maranatha" : "";

type ImageLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function imageLoader({ src }: ImageLoaderProps): string {
  if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("//")) {
    return src;
  }
  return `${BASE_PATH}${src}`;
}
