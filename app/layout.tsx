import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import SmoothScroll from "@/components/smooth-scroll";
import ThemeInit from "@/components/theme-init";
import ThemeProvider from "@/components/theme-provider";
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
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
