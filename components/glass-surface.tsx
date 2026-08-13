import type { ReactNode } from "react";

/**
 * GlassSurface — subtle mirror/crystal backing for text or content.
 *
 * Provides a barely-there frosted-glass effect (light backdrop-blur + a whisper
 * gradient highlight) so content floats directly on the page background WITHOUT
 * looking boxed. No border, no shadow, no border-radius frame.
 *
 * Adapts to the active theme (light/dark/taller/session) via CSS variables
 * --glass-bg / --glass-highlight defined in globals.css. Pure presentational —
 * no JS, SSR-safe.
 *
 * Brief: efecto espejo/cristal detrás del texto, sin encajonar.
 */
export default function GlassSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass-surface ${className}`.trim()}>
      {children}
    </div>
  );
}
