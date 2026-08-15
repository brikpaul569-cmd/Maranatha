import type { ReactNode } from "react";
import BearDoodle from "@/components/ui/bear-doodle";

export type ScrapbookIconName =
  | "plush"
  | "stitch"
  | "fill"
  | "smile"
  | "flower"
  | "pin";

export type ScrapbookFeature = {
  id: string;
  label: string;
  text: string;
  icon: ScrapbookIconName;
};

export type ScrapbookInfographicProps = {
  title: string;
  illustration: ReactNode;
  features: ScrapbookFeature[];
  footer: string;
  className?: string;
};

/** Shared attributes for the doodle icons — thin hand-drawn strokes,
 *  no solid fill, color inherited from the current text color. */
const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function ScrapbookIcon({ name }: { name: ScrapbookIconName }) {
  switch (name) {
    case "plush":
      return <BearDoodle className="h-6 w-6" />;
    case "stitch":
      return (
        <svg {...STROKE} className="h-6 w-6">
          <path d="M 6.5 17.5 L 16 8" />
          <circle cx="17.2" cy="6.8" r="1.4" />
          <path d="M 17.2 6.8 C 20 4.8 22.5 8 19.6 10.5 C 18 11.9 18.6 13.7 20 15" />
          <path d="M 8.3 14.2 C 10 12.6 11.8 12.7 13.5 11.2" strokeDasharray="2 2" />
        </svg>
      );
    case "fill":
      return (
        <svg {...STROKE} className="h-6 w-6">
          <path d="M 7 16.6 A 3 3 0 0 1 7.4 10.2 A 4.4 4.4 0 0 1 15.2 8.8 A 3.6 3.6 0 0 1 17 14 A 3.2 3.2 0 0 1 14.6 16.6 Z" />
        </svg>
      );
    case "smile":
      return (
        <svg {...STROKE} className="h-6 w-6">
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="9.1" cy="10.2" r="0.9" />
          <circle cx="14.9" cy="10.2" r="0.9" />
          <path d="M 9.2 13.9 Q 12 16.3 14.8 13.9" />
        </svg>
      );
    case "flower":
      return (
        <svg {...STROKE} className="h-6 w-6">
          <g>
            <ellipse cx="12" cy="7.6" rx="1.9" ry="3.2" />
            <g transform="rotate(60 12 12)">
              <ellipse cx="12" cy="7.6" rx="1.9" ry="3.2" />
            </g>
            <g transform="rotate(120 12 12)">
              <ellipse cx="12" cy="7.6" rx="1.9" ry="3.2" />
            </g>
            <g transform="rotate(180 12 12)">
              <ellipse cx="12" cy="7.6" rx="1.9" ry="3.2" />
            </g>
            <g transform="rotate(240 12 12)">
              <ellipse cx="12" cy="7.6" rx="1.9" ry="3.2" />
            </g>
            <g transform="rotate(300 12 12)">
              <ellipse cx="12" cy="7.6" rx="1.9" ry="3.2" />
            </g>
          </g>
          <circle cx="12" cy="12" r="1.8" />
          <path d="M 12 15.4 C 12.3 17 13.2 18.2 13.5 21" />
          <ellipse cx="14.4" cy="17.6" rx="1.5" ry="2.9" transform="rotate(-30 14.4 17.6)" />
        </svg>
      );
    case "pin":
      return (
        <svg {...STROKE} className="h-6 w-6">
          <path d="M 12 21.5 C 8 16.2 6 13.4 6 10.2 a 6 6 0 0 1 12 0 C 18 13.4 16 16.2 12 21.5 Z" />
          <path d="M 12 11.6 C 11.1 10.9 9.6 9.9 9.6 8.7 a 1.7 1.7 0 0 1 2.4 -1.6 1.7 1.7 0 0 1 2.4 1.6 C 14.4 9.9 12.9 10.9 12 11.6 Z" />
        </svg>
      );
  }
}

function FeatureBox({ feature }: { feature: ScrapbookFeature }) {
  return (
    <div className="text-center">
      <div className="mx-auto inline-flex items-center justify-center text-mar-brown">
        <ScrapbookIcon name={feature.icon} />
      </div>
      <h3 className="mt-3 font-futura text-[11px] font-semibold uppercase tracking-widest text-mar-brown">
        {feature.label}
      </h3>
      <p className="mt-1.5 font-sans text-sm leading-snug text-mar-brown/75">
        {feature.text}
      </p>
    </div>
  );
}

export default function ScrapbookInfographic({
  title,
  illustration,
  features,
  footer,
  className = "",
}: ScrapbookInfographicProps) {
  const left = features.slice(0, 3);
  const right = features.slice(3, 6);

  return (
    <div className={"relative px-6 py-12 md:px-10 md:py-16 " + className}>
      <header className="relative text-center">
        <p className="font-futura text-[10px] uppercase tracking-[0.3em] text-mar-gold">
          Nuestra infografía
        </p>
        <h2 className="mt-3 font-script text-4xl text-mar-brown md:text-6xl">
          {title}
        </h2>
      </header>

      <div className="mt-10 grid items-center gap-10 md:mt-14 md:grid-cols-[1fr_auto_1fr] md:gap-8">
        <div className="order-2 mt-6 grid grid-cols-2 gap-x-6 gap-y-8 md:order-none md:mt-0 md:w-44 md:grid-cols-1 md:gap-y-10">
          {left.map((feature) => (
            <FeatureBox key={feature.id} feature={feature} />
          ))}
        </div>

        <div className="order-1 mx-auto max-w-full md:order-none">
          {illustration}
        </div>

        <div className="order-3 mt-6 grid grid-cols-2 gap-x-6 gap-y-8 md:order-none md:mt-0 md:w-44 md:grid-cols-1 md:gap-y-10">
          {right.map((feature) => (
            <FeatureBox key={feature.id} feature={feature} />
          ))}
        </div>
      </div>

      <footer className="mt-12 flex flex-col items-center gap-4 text-center md:mt-16">
        <div aria-hidden className="flex items-center gap-3 text-[#D9A94E]">
          <span className="h-px w-12 bg-[#D9A94E]/60" />
          <span className="text-sm">✦</span>
          <span className="h-px w-12 bg-[#D9A94E]/60" />
        </div>
        <p className="font-futura text-[10px] uppercase tracking-[0.3em] text-mar-brown/70 md:text-xs">
          {footer}
        </p>
      </footer>
    </div>
  );
}
