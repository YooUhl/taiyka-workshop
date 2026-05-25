import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  Database,
  FilePen,
  FileText,
  LayoutGrid,
  Search,
  Send,
  Sparkles,
  Telescope,
  Workflow,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tierLabel, type Lang, type Product, type Tier } from "@/lib/products";

type Props = {
  product: Product;
  lang: Lang;
};

const T = {
  comingSoon: { fr: "Bientôt disponible", en: "Coming soon" },
  // Tier 0 (free): explicit "get it" verb
  ctaFree: { fr: "Récupérer le pack", en: "Get the pack" },
  // Tier 1+2: neutral, non-pushy verb (replaces bare "Acheter" / "Buy now")
  ctaView: { fr: "Voir le pack", en: "View the pack" },
  ctaNotify: { fr: "Me prévenir au lancement", en: "Notify me at launch" },
  freeStamp: { fr: "GRATUIT", en: "FREE" },
  status: {
    ready: { fr: "Disponible", en: "Available" },
    draft: { fr: "En préparation", en: "In progress" },
  },
};

const PRODUCT_ICONS: Record<string, LucideIcon> = {
  "free-n8n-pack": Workflow,
  "free-claude-starter": Sparkles,
  "cold-outreach-pack": Send,
  "notion-ai-stack": LayoutGrid,
  "prompt-pack-50": FileText,
  "competitor-intel": Telescope,
  "client-acquisition-bundle": FilePen,
  "ai-agent-playbook": Bot,
  "prospect-audit-funnel": Search,
};

// Detect whether the parsed `price` string represents "free" so we can
// render a localized GRATUIT / FREE label instead of the raw value.
function isFreePrice(price: string): boolean {
  const p = (price ?? "").trim().toLowerCase();
  if (!p) return false;
  return (
    p === "0" ||
    p === "0€" ||
    p === "0 €" ||
    p === "free" ||
    p === "gratuit"
  );
}

function priceLabel(price: string, tier: Tier, lang: Lang): string {
  if (isFreePrice(price) || tier === 0) {
    return T.freeStamp[lang];
  }
  return price;
}

function ProductCover({
  slug,
  tier,
  lang,
}: {
  slug: string;
  tier: Tier;
  lang: Lang;
}) {
  const Icon = PRODUCT_ICONS[slug] ?? Database;
  const isFree = tier === 0;
  const isEntry = tier === 1;
  const isPremium = tier === 2;
  return (
    <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-card/40 via-card/60 to-card/40 flex items-center justify-center">
      {/* HUD corner brackets */}
      <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-[var(--hud-bracket-dim)]" />
      <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-[var(--hud-bracket-dim)]" />
      <span aria-hidden className="pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l border-b border-[var(--hud-bracket-dim)]" />
      <span aria-hidden className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b border-[var(--hud-bracket-dim)]" />
      {/* Faint slug stamp */}
      <span
        aria-hidden
        className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.22em] uppercase text-muted-foreground/40"
      >
        // {slug}
      </span>

      {/* Tier 0: GRATUIT / FREE stamp top-left */}
      {isFree && (
        <span
          aria-hidden
          className="absolute left-3 top-3 font-mono text-[10px] tracking-[0.2em] uppercase px-1.5 py-0.5 border border-dashed border-primary/60 text-primary/90"
        >
          {T.freeStamp[lang]}
        </span>
      )}

      {/* Tier 1: subtle workflow-line decoration behind the icon */}
      {isEntry && (
        <div aria-hidden className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-3 px-10">
          <span className="block h-px bg-primary/15" />
          <span className="block h-px bg-primary/10" />
          <span className="block h-px bg-primary/15" />
          <span className="block h-px bg-primary/10" />
        </div>
      )}

      {/* Tier 2: premium cyan ring container around the icon */}
      {isPremium ? (
        <div className="relative flex items-center justify-center rounded-full ring-1 ring-cyan-400/40 p-4">
          <Icon
            aria-hidden
            className="text-primary opacity-90"
            strokeWidth={1.4}
            size={76}
          />
        </div>
      ) : (
        <Icon
          aria-hidden
          className="relative text-primary opacity-80"
          strokeWidth={1.4}
          size={84}
        />
      )}
    </div>
  );
}

export function ProductCard({ product, lang }: Props) {
  const isReady = product.status === "ready";
  const name = product.name[lang];
  const hero = product.hero[lang];
  const subhero = product.subhero[lang];
  const bullets = product.bullets[lang];

  const isMailto = product.ctaHref.startsWith("mailto:");
  const isExternal =
    product.ctaHref.startsWith("http://") ||
    product.ctaHref.startsWith("https://");

  // CTA verb: never bare "Acheter" / "Buy now".
  // - Notify (mailto): "Me prévenir au lancement" / "Notify me at launch"
  // - Tier 0: "Récupérer le pack" / "Get the pack"
  // - Tier 1+2: "Voir le pack" / "View the pack"
  const ctaLabel = isMailto
    ? T.ctaNotify[lang]
    : product.tier === 0
      ? T.ctaFree[lang]
      : T.ctaView[lang];

  // Price chip: text + colour vary by tier
  const isPremium = product.tier === 2;
  const priceText = priceLabel(product.price, product.tier, lang);
  const priceChipClass = isPremium
    ? "bg-cyan-400/10 text-cyan-300 ring-cyan-400/40"
    : "bg-primary/10 text-primary ring-primary/30";

  return (
    <Card
      className={cn(
        "hover-grow-sm bg-card/80 border-border flex flex-col h-full",
        !isReady && "opacity-60"
      )}
    >
      <div className="relative">
        <ProductCover slug={product.slug} tier={product.tier} lang={lang} />
        {/* Price chip — top-right of the cover */}
        {priceText && (
          <span
            className={cn(
              "absolute top-3 right-3 rounded-full text-xs font-mono px-2.5 py-1 ring-1",
              priceChipClass
            )}
          >
            {priceText}
          </span>
        )}
      </div>

      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant={product.tier === 0 ? "default" : "secondary"}
            className="text-[10px]"
          >
            {tierLabel(product.tier)}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {isReady
              ? T.status.ready[lang]
              : T.status.draft[lang]}
          </span>
        </div>
        {/* Real h3 so heading hierarchy is h1 -> h2 -> h3 (CardTitle is a div). */}
        <h3
          data-slot="card-title"
          className="font-heading text-lg leading-snug font-medium mt-2"
        >
          {name}
        </h3>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        {isReady && hero && (
          <p className="text-sm font-medium text-foreground/90">{hero}</p>
        )}
        {isReady && subhero && (
          <p className="text-xs text-muted-foreground">{subhero}</p>
        )}
        {isReady && bullets.length > 0 && (
          <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
            {bullets.slice(0, 4).map((b, i) => (
              <li key={i} className="leading-snug">
                {b}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-3">
          {isReady ? (
            isMailto || isExternal ? (
              <a
                href={product.ctaHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className={cn(
                  buttonVariants({ variant: isMailto ? "outline" : "default", size: "lg" }),
                  "w-full"
                )}
              >
                {ctaLabel}
              </a>
            ) : (
              <Link
                href={product.ctaHref}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "w-full"
                )}
              >
                {ctaLabel}
              </Link>
            )
          ) : (
            <div className="w-full text-center text-xs py-2 px-3 rounded-lg border border-border bg-secondary/30 text-muted-foreground">
              {T.comingSoon[lang]}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
