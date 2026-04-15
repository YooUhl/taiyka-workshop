import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
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
        url: "/og-image.svg",
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
    images: ["/og-image.svg"],
    creator: "@manu_ai.to",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
