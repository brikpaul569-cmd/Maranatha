import type { Metadata } from "next";
import { Fraunces, Inter, Jost, Great_Vibes, Anton } from "next/font/google";
import Script from "next/script";
import { getThemeModeInitScript, getEcosystemInitScript, getThemeInitScript } from "@/lib/theme";
import { LOCALBUSINESS_SCHEMA } from "@/lib/seo";
import SmoothScroll from "@/components/smooth-scroll";
import ThemeProvider from "@/components/theme-provider";
import Preloader from "@/components/preloader";
import ScrollProgress from "@/components/scroll-progress";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import FloatingWhatsApp from "@/components/floating-whatsapp";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const futura = Jost({
  subsets: ["latin"],
  variable: "--font-futura",
});

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});

const stout = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-stout",
});

export const metadata: Metadata = {
  title: {
    default: "Detalles Maranatha",
    template: "%s | Detalles Maranatha",
  },
  description:
    "Arreglos florales artesanales hechos a mano en Colombia. Detalles únicos para cada ocasión, con pedidos por WhatsApp.",
  icons: {
    icon: [{ url: "/icon.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${display.variable} ${sans.variable} ${futura.variable} ${script.variable} ${stout.variable} h-full antialiased`}
    >
        <head>
          {/* Pre-paint theme scripts (D2): set <html data-theme>,
              data-theme-mode and data-ecosystem before first paint so the
              session theme, the dark/light mode and the ecosystem
              (tienda/taller) all apply with no flash (st-R3, eco-E3).
              next/script `beforeInteractive` lives here in the root layout —
              the only place the lint rule permits it — and never triggers
              React's "script tag" warning. */}
          <Script
            id="theme-init-session"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: getThemeInitScript() }}
          />
          <Script
            id="theme-init-dark"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{ __html: getThemeModeInitScript() }}
          />
          <Script
            id="theme-init-ecosystem"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: getEcosystemInitScript(),
            }}
          />
          {/* Sitewide LocalBusiness JSON-LD (Brief 03 §4) so every page is
              associated with the Detalles Maranatha entity by crawlers. The
              `type` matters: without it the runtime would inject it as a
              classic <script> and the browser would try to execute JSON. */}
          <Script
            id="ld-localbusiness"
            type="application/ld+json"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(LOCALBUSINESS_SCHEMA),
            }}
          />
        </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ScrollProgress />
          <Preloader />
          <SiteHeader />
          <SmoothScroll id="main-content">{children}</SmoothScroll>
          <SiteFooter />
          <FloatingWhatsApp />
        </ThemeProvider>
      </body>
    </html>
  );
}
