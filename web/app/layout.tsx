import type { Metadata } from "next";
import { Inter, JetBrains_Mono, VT323 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-hud",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const vt323 = VT323({
  variable: "--font-display-hud",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiyka.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Taiyka — AI Automation Systems for Entrepreneurs",
    template: "%s — Taiyka",
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
    "Taiyka",
    "manu_ai.to",
  ],
  authors: [{ name: "Manu — Taiyka", url: "https://instagram.com/manu_ai.to" }],
  creator: "Manu — Taiyka",
  alternates: {
    canonical: SITE,
    languages: {
      "fr-FR": "/",
      "en-US": "/?lang=en",
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
    siteName: "Taiyka",
    title: "Taiyka — AI Automation Systems for Entrepreneurs",
    description:
      "Workflows n8n, agents IA, et systèmes d'automatisation pour entrepreneurs francophones.",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "Taiyka — AI Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taiyka — AI Automation Systems",
    description:
      "Workflows n8n, agents IA, et systèmes d'automatisation pour entrepreneurs.",
    images: ["/og/home.png"],
    creator: "@manu_ai.to",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Inline script: sync <html lang> with ?lang= query so SR pronunciation matches content.
// Root layouts in Next 16 cannot read searchParams directly, so we patch on the client.
const langSyncScript = `(function(){try{var p=new URLSearchParams(window.location.search);var l=p.get('lang')==='en'?'en':'fr';document.documentElement.lang=l;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable} ${vt323.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-navy"
        >
          Skip to content
        </a>
        <div id="main-content" className="contents">{children}</div>
        <script dangerouslySetInnerHTML={{ __html: langSyncScript }} />
      </body>
    </html>
  );
}
