/**
 * Single source for the teddy-bear doodle: a hand-drawn, stroke-only SVG
 * (face, ears, eyes, mouth) shared by the scrapbook infographic and the
 * preloader exit. Stroke-only so it can be stroke-drawn (dash offset) on cue.
 */
export default function BearDoodle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <circle cx="12" cy="11.5" r="7.5" />
      <circle cx="6.8" cy="5.4" r="2.9" />
      <circle cx="17.2" cy="5.4" r="2.9" />
      <circle cx="9.7" cy="10" r="0.9" />
      <circle cx="14.3" cy="10" r="0.9" />
      <path d="M 10.3 13.6 Q 12 15.5 13.7 13.6" />
    </svg>
  );
}
