import type { ReactNode } from "react";
import Link from "next/link";
import { waMeUrl } from "@/lib/constants";
import { WhatsAppIcon } from "./icons";

/**
 * Button primitive (ds-R1). Variants: primary (mar-brown/card), whatsapp
 * (mar-gold + WA icon), ghost (outline). Renders a next/link `<Link>` for
 * internal hrefs (so basePath/trailingSlash are applied automatically under
 * static export), a plain `<a>` for external links — including the WhatsApp
 * variant, which deep-links via `waMeUrl(message)` from lib/constants.ts
 * (cc-R8) — and a `<button>` otherwise (ds-R1 "Non-link button").
 *
 * Hover feedback is CSS transform-only (INP-safe) and disabled under
 * prefers-reduced-motion via the motion-safe: variant (ds-R10).
 */

export type ButtonVariant = "primary" | "whatsapp" | "ghost";

export type ButtonProps = {
  variant?: ButtonVariant;
  children: ReactNode;
  className?: string;
  /** Renders an `<a>`; for the whatsapp variant it defaults to waMeUrl(). */
  href?: string;
  /** Pre-filled WhatsApp message (whatsapp variant only). */
  message?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-mar-brown text-mar-card hover:bg-mar-brown/90",
  whatsapp: "bg-mar-gold text-mar-brown hover:bg-mar-gold/90",
  ghost:
    "border border-mar-brown/40 text-mar-brown hover:border-mar-brown hover:bg-mar-brown/5",
};

export default function Button({
  variant = "primary",
  children,
  className = "",
  href,
  message,
  type = "button",
  onClick,
  disabled,
  ...rest
}: ButtonProps) {
  const resolvedHref = href ?? (variant === "whatsapp" ? waMeUrl(message) : undefined);
  const isExternal = resolvedHref?.startsWith("http") ?? false;

  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5",
    "font-futura text-sm font-semibold uppercase tracking-widest",
    "transition-transform duration-300 motion-reduce:transition-none",
    "motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0",
    "disabled:pointer-events-none disabled:opacity-60",
    VARIANT_CLASSES[variant],
    className,
  ].join(" ");

  if (resolvedHref) {
    if (isExternal) {
      return (
        <a
          href={resolvedHref}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {variant === "whatsapp" && <WhatsAppIcon className="size-4 shrink-0" />}
          {children}
        </a>
      );
    }
    return (
      <Link href={resolvedHref} className={classes} {...rest}>
        {variant === "whatsapp" && <WhatsAppIcon className="size-4 shrink-0" />}
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} {...rest}>
      {variant === "whatsapp" && <WhatsAppIcon className="size-4 shrink-0" />}
      {children}
    </button>
  );
}
