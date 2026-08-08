import type { ReactNode } from "react";

/**
 * Eyebrow primitive (ds-R4): small sans-serif uppercase label with wide
 * letter-spacing.
 */

export type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

export default function Eyebrow({ children, className = "" }: EyebrowProps) {
  return (
    <span
      className={`font-sans text-xs font-semibold uppercase tracking-[0.35em] text-mar-brown/70 ${className}`}
    >
      {children}
    </span>
  );
}
