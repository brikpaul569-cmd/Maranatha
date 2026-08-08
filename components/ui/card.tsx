import Image from "next/image";
import Button from "./button";

/**
 * Card primitive (ds-R2): lazy `next/image` + title + price placeholder
 * ("Precio al WhatsApp") + WhatsApp mini-CTA, all server-rendered (cc-R1).
 * The mini-CTA deep-links via the shared constant through the Button
 * primitive's whatsapp variant (ds-R8).
 */

export type CardProps = {
  src: string;
  alt: string;
  title: string;
  price?: string;
  className?: string;
};

export default function Card({
  src,
  alt,
  title,
  price = "Precio al WhatsApp",
  className = "",
}: CardProps) {
  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-2xl bg-mar-card shadow-sm ${className}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-3 p-5">
        <h3 className="font-display text-xl text-mar-brown">{title}</h3>
        <p className="font-sans text-sm text-mar-brown/70">{price}</p>
        <Button variant="whatsapp" className="mt-auto px-5 py-2.5 text-xs">
          Pedir por WhatsApp
        </Button>
      </div>
    </article>
  );
}
