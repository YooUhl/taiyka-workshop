import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

// Inter is a variable font — one woff2 covers weights 400-900 (incl. 500).
const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// JetBrains Mono renders above the fold on the hub, so preload it.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-hud",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "L'Atelier — Systèmes d'automatisation IA pour entrepreneurs",
    template: "%s — L'Atelier",
  },
  description:
    "Workflows n8n, agents IA, et systèmes d'automatisation pour entrepreneurs francophones. Par Manu (@manu_ai.to).",
  keywords: [
    "n8n",
    "AI automation",
    "Claude",
    "agent IA",
    "automatisation",
    "entrepreneur",
    "L'Atelier",
    "manu_ai.to",
  ],
  authors: [{ name: "Manu", url: "https://instagram.com/manu_ai.to" }],
  creator: "Manu",
  alternates: {
    canonical: SITE,
    languages: {
      "fr-FR": "/",
      "en-US": "/?lang=en",
      "x-default": "/",
    },
  },
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: SITE,
    siteName: "L'Atelier",
    title: "L'Atelier — Systèmes d'automatisation IA pour entrepreneurs",
    description:
      "Workflows n8n, agents IA, et systèmes d'automatisation pour entrepreneurs francophones.",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "L'Atelier",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "L'Atelier — Systèmes d'automatisation IA",
    description:
      "Workflows n8n, agents IA, et systèmes d'automatisation pour entrepreneurs.",
    images: ["/og/home.png"],
    // twitter.creator omitted: @manu_ai.to is an IG/TikTok handle, not a valid X username.
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1628",
};

// Inline script: sync <html lang> with ?lang= query so SR pronunciation matches content.
// Root layouts in Next 16 cannot read searchParams directly, so we patch on the client.
const langSyncScript = `(function(){try{var p=new URLSearchParams(window.location.search);var l=p.get('lang')==='en'?'en':'fr';document.documentElement.lang=l;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Script id="lang-sync" strategy="beforeInteractive">
          {langSyncScript}
        </Script>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-navy"
        >
          Aller au contenu / Skip to content
        </a>
        <div id="main-content" tabIndex={-1}>{children}</div>
      </body>
    </html>
  );
}
