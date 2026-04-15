import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { tierLabel, type Lang, type Product } from "@/lib/products";

type Props = {
  product: Product;
  lang: Lang;
};

const T = {
  comingSoon: { fr: "Bientôt disponible", en: "Coming soon" },
  ctaFree: { fr: "Récupérer le pack", en: "Get the pack" },
  ctaBuy: { fr: "Acheter", en: "Buy now" },
  status: {
    ready: { fr: "Disponible", en: "Available" },
    draft: { fr: "En préparation", en: "In progress" },
  },
};

function CoverSvg({ svg }: { svg: string }) {
  // Inline raw SVG. Strip the XML prolog if present.
  const cleaned = svg.replace(/<\?xml[^>]*\?>\s*/i, "");
  return (
    <div
      className="w-full aspect-square overflow-hidden bg-secondary/40"
      // SVG comes from local repo files (build-time read) — safe to inline.
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
}

function CoverPlaceholder() {
  return (
    <div className="w-full aspect-square bg-gradient-hero opacity-30" />
  );
}

export function ProductCard({ product, lang }: Props) {
  const isReady = product.status === "ready";
  const name = product.name[lang];
  const hero = product.hero[lang];
  const subhero = product.subhero[lang];
  const bullets = product.bullets[lang];

  const ctaLabel =
    product.tier === 0 ? T.ctaFree[lang] : T.ctaBuy[lang];

  return (
    <Card
      className={cn(
        "bg-card/80 border-border flex flex-col h-full",
        !isReady && "opacity-60"
      )}
    >
      {product.coverSvg ? (
        <CoverSvg svg={product.coverSvg} />
      ) : (
        <CoverPlaceholder />
      )}

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
        <CardTitle className="text-lg mt-2">{name}</CardTitle>
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
            <Link
              href={product.ctaHref}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "w-full"
              )}
            >
              {ctaLabel}
            </Link>
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
