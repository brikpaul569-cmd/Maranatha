import type { CSSProperties, ReactNode } from "react";

/**
 * Section shell (ds-R3). Applies a mood via `--section-mood` on the section
 * container; children consume it as `bg-[var(--section-mood)]` (hero-R5).
 * Default padding + max-width follow the ~60% negative-space rule.
 */

export type SectionMood =
  | "hero"
  | "nosotros"
  | "catalogo-sage"
  | "catalogo-gold"
  | "galeria"
  | "contacto";

export type SectionProps = {
  children: ReactNode;
  mood?: SectionMood;
  id?: string;
  className?: string;
  innerClassName?: string;
};

const MOOD_VARS: Record<SectionMood, string> = {
  hero: "var(--mood-hero)",
  nosotros: "var(--mood-nosotros)",
  "catalogo-sage": "var(--mood-catalogo-sage)",
  "catalogo-gold": "var(--mood-catalogo-gold)",
  galeria: "var(--mood-galeria)",
  contacto: "var(--mood-contacto)",
};

export default function Section({
  children,
  mood,
  id,
  className = "",
  innerClassName = "",
}: SectionProps) {
  const style = mood
    ? ({ "--section-mood": MOOD_VARS[mood] } as CSSProperties)
    : undefined;

  /**
   * Parchment sheet (user direction): every non-hero section renders as a
   * separate frosted-paper leaf (see `.sheet-parchment` in globals.css).
   * Skipped on `hero` so the full-bleed parallax layers keep the raw mood
   * background. Sheets carry their own vertical rhythm so each reads as a
   * divided page, like the COSECHAS reference.
   */
  const sheet = mood !== "hero" ? "sheet-parchment my-4 md:my-8" : "";

  return (
    <section id={id} style={style} className={className}>
      <div
        className={`${sheet ? sheet + " " : ""}mx-auto w-full max-w-6xl px-6 py-16 md:px-10 md:py-20 ${innerClassName}`}
      >
        {children}
      </div>
    </section>
  );
}
