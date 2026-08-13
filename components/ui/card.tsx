import Image from "next/image";
import Link from "next/link";

/**
 * Card primitive: lazy `next/image` + title + price, all server-rendered.
 * `titleHref` links the title to an internal page. Defaults preserve the
 * original placeholder API.
 */

export type CardProps = {
  src: string;
  alt: string;
  title: string;
  price?: string;
  /** Optional internal route for the title link. */
  titleHref?: string;
  className?: string;
};

export default function Card({
  src,
  alt,
  title,
  price = "Precio",
  titleHref,
  className = "",
}: CardProps) {
  return (
    <article
      className={`group flex flex-col overflow-hidden glass-card ${className}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <h3 className="font-display text-xl text-mar-brown">
          {titleHref ? (
            <Link
              href={titleHref}
              className="transition-colors motion-safe:hover:text-mar-brown/70"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <p className="font-sans text-sm text-mar-brown/70">{price}</p>
      </div>
    </article>
  );
}
