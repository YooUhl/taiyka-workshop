import Link from "next/link";
import { cn } from "@/lib/utils";

type Lang = "fr" | "en";

type HubLink = {
  label: string;
  href: string;
  emoji: string;
  primary?: boolean;
  external?: boolean;
};

const COPY = {
  fr: {
    tagline: "Systèmes d'automatisation IA pour entrepreneurs.",
    langSwitch: "EN",
    langSwitchHref: "/?lang=en",
    links: [
      { label: "Ressources gratuites", href: "/free-n8n-pack", emoji: "🎁", primary: true },
      { label: "Tous les produits", href: "/products", emoji: "📦" },
      { label: "Portfolio", href: "/portfolio", emoji: "💼" },
      {
        label: "Communauté Skool",
        href: "https://skool.com/PASTE_YOUR_SKOOL_LINK",
        emoji: "🚀",
        external: true,
      },
      {
        label: "Instagram",
        href: "https://instagram.com/manu_ai.to",
        emoji: "📸",
        external: true,
      },
      {
        label: "Facebook",
        href: "https://facebook.com/PASTE_YOUR_FB",
        emoji: "📘",
        external: true,
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/in/PASTE_YOUR_LINKEDIN",
        emoji: "💼",
        external: true,
      },
      {
        label: "Contact",
        href: "mailto:manu.uhila@taiyka.com",
        emoji: "✉️",
        external: true,
      },
    ] as HubLink[],
  },
  en: {
    tagline: "AI automation systems for entrepreneurs.",
    langSwitch: "FR",
    langSwitchHref: "/?lang=fr",
    links: [
      { label: "Free resources", href: "/free-n8n-pack", emoji: "🎁", primary: true },
      { label: "All products", href: "/products", emoji: "📦" },
      { label: "Portfolio", href: "/portfolio", emoji: "💼" },
      {
        label: "Skool community",
        href: "https://skool.com/PASTE_YOUR_SKOOL_LINK",
        emoji: "🚀",
        external: true,
      },
      {
        label: "Instagram",
        href: "https://instagram.com/manu_ai.to",
        emoji: "📸",
        external: true,
      },
      {
        label: "Facebook",
        href: "https://facebook.com/PASTE_YOUR_FB",
        emoji: "📘",
        external: true,
      },
      {
        label: "LinkedIn",
        href: "https://linkedin.com/in/PASTE_YOUR_LINKEDIN",
        emoji: "💼",
        external: true,
      },
      {
        label: "Contact",
        href: "mailto:manu.uhila@taiyka.com",
        emoji: "✉️",
        external: true,
      },
    ] as HubLink[],
  },
} as const;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const c = COPY[lang];

  return (
    <main className="flex flex-1 w-full items-center justify-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col items-center gap-10">
        {/* Lang switch */}
        <div className="w-full flex justify-end">
          <Link
            href={c.langSwitchHref}
            className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:border-[#00a6ff] hover:text-foreground transition-colors"
          >
            {c.langSwitch}
          </Link>
        </div>

        {/* Logo + Brand */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-glow blur-2xl scale-150" aria-hidden />
            <div className="relative h-24 w-24 rounded-2xl bg-gradient-hero shadow-[0_0_60px_rgba(0,166,255,0.55)]" />
          </div>
          <h1
            className="text-5xl font-black tracking-tight text-gradient-hero"
            style={{
              filter: "drop-shadow(0 0 24px rgba(0, 166, 255, 0.45))",
            }}
          >
            TAIYKA
          </h1>
          <p className="text-sm md:text-base text-muted-foreground text-center max-w-xs">
            {c.tagline}
          </p>
        </div>

        {/* Link stack */}
        <nav className="w-full flex flex-col gap-3">
          {c.links.map((link) => {
            const base =
              "w-full inline-flex items-center justify-between h-14 rounded-lg border px-5 text-base font-medium transition-all";
            const primary =
              "bg-gradient-hero text-[#0a1628] border-transparent shadow-glow hover:opacity-95 hover:shadow-[0_0_60px_rgba(0,166,255,0.5)]";
            const secondary =
              "bg-secondary/40 text-foreground border-border hover:bg-secondary/70 hover:border-[#00a6ff]/40";

            const className = cn(base, link.primary ? primary : secondary);
            const content = (
              <>
                <span className="flex items-center gap-3">
                  <span className="text-lg">{link.emoji}</span>
                  <span>{link.label}</span>
                </span>
                <span
                  className={cn(
                    "text-sm",
                    link.primary ? "text-[#0a1628]/80" : "text-muted-foreground"
                  )}
                  aria-hidden
                >
                  →
                </span>
              </>
            );

            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {content}
                </a>
              );
            }
            return (
              <Link key={link.label} href={link.href} className={className}>
                {content}
              </Link>
            );
          })}
        </nav>

        <footer className="flex flex-col items-center gap-1 text-xs text-muted-foreground pt-4">
          <span>@manu_ai.to</span>
          <span>© {new Date().getFullYear()} Taiyka. All rights reserved.</span>
        </footer>
      </div>
    </main>
  );
}
