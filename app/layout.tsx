import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Script from "next/script";
import { LOCALBUSINESS_SCHEMA } from "@/lib/seo";
import SmoothScroll from "@/components/smooth-scroll";
import ThemeInit from "@/components/theme-init";
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
      className={`${display.variable} ${sans.variable} h-full antialiased`}
    >
        <head>
          {/* Pre-paint theme script (D2): sets <html data-theme> before first
            paint so the session theme applies with no flash (st-R3). */}
          <ThemeInit />
          {/* Sitewide LocalBusiness JSON-LD (Brief 03 §4) so every page is
              associated with the Detalles Maranatha entity by crawlers. */}
          <Script
            id="ld-localbusiness"
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
