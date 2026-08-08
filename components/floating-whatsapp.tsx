import { waMeUrl } from "@/lib/constants";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Floating WhatsApp widget (ds-R5). Server component; href derives from the
 * shared `waMeUrl()` with the default message (cc-R8). Mobile: full-width
 * thumb-zone bar (`inset-x-4 bottom-4`, 56px tall — thumb-friendly). Desktop:
 * round button `bottom-6 right-6`. Hover feedback is CSS transform-only and
 * disabled under prefers-reduced-motion (ds-R10).
 */
export default function FloatingWhatsApp() {
  return (
    <a
      href={waMeUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed inset-x-4 bottom-4 z-40 flex h-14 items-center justify-center rounded-full bg-mar-gold text-mar-brown shadow-lg transition-transform duration-300 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 md:inset-x-auto md:right-6 md:size-14"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
