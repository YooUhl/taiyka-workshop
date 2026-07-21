import type { Metadata } from "next";
import Link from "next/link";
import EmailCaptureForm from "@/components/EmailCaptureForm";
import { FREE_N8N_PACK_COPY, FREE_N8N_PACK_TICKER } from "@/lib/copy/free-n8n-pack";
import { withLang } from "@/lib/lang-utils";
import { Ticker } from "@/components/site/Ticker";
import { TopBar } from "@/components/site/TopBar";

type Lang = "fr" | "en";

type SearchParams = { lang?: string; from?: string };

function resolveLang(value: string | undefined): Lang {
  return value === "en" ? "en" : "fr";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const lang = resolveLang(sp?.lang);

  // No brand suffix here — the root layout's title template appends it.
  const title =
    lang === "fr"
      ? "Pack n8n gratuit — 5 workflows à importer"
      : "Free n8n pack — 5 workflows to import";

  const description =
    lang === "fr"
      ? "5 workflows n8n que j'utilise vraiment dans mon business. Gratuits, .json à importer, ZIP livré en moins de 2 minutes."
      : "5 n8n workflows I actually use in my business. Free, .json ready to import, ZIP delivered in under 2 minutes.";

  return {
    title,
    description,
    alternates: {
      canonical: "/free-n8n-pack",
      languages: {
        "fr-FR": "/free-n8n-pack",
        "en-US": "/free-n8n-pack?lang=en",
      },
    },
    openGraph: {
      title,
      description,
      images: ["/og/free-n8n-pack.png"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/free-n8n-pack.png"],
    },
  };
}

export default async function FreeN8nPackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const lang = resolveLang(sp?.lang);
  const fromQcm = sp?.from === "qcm-result";
  const copy = FREE_N8N_PACK_COPY[lang];

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name:
      lang === "fr"
        ? "5 workflows n8n pour entrepreneurs IA"
        : "5 n8n workflows for AI entrepreneurs",
    description: copy.subHero,
    programmingLanguage: "JSON",
    inLanguage: lang === "fr" ? "fr-FR" : "en-US",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };

  const backHref = withLang(fromQcm ? "/qcm/resultat/pas-pret" : "/", lang);
  // TopBar renders its own "← " glyph — strip the one baked into the copy string.
  const backLabel = (fromQcm ? copy.backFromQcm : copy.backHome).replace(/^←\s*/, "");
  const heroKicker = fromQcm ? copy.kickerFromQcm : copy.kicker;

  return (
    <main className="relative flex-1 w-full flex flex-col z-10 paper-grid">
      <Ticker items={FREE_N8N_PACK_TICKER[lang]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />

      <TopBar
        backHref={backHref}
        backLabel={backLabel}
        status={copy.statusPill}
        langSwitchHref={copy.langSwitchHref}
        langSwitchLabel={copy.langSwitchLabel}
        langSwitchAria={`Switch language to ${copy.langSwitchLabel}`}
      />

      <div
        className="relative mx-auto w-full max-w-3xl px-6 md:px-10 py-12 md:py-20 flex flex-col flex-1 text-center"
        style={{ opacity: 0, animation: "qcm-fade-in 400ms ease-out forwards" }}
      >
        {/* Kicker */}
        <span className="kicker kicker-accent self-center">{heroKicker}</span>

        {/* H1 */}
        <h1 className="display-xl display-caps max-sm:text-4xl! break-words mt-5 mb-10 md:mb-12 text-balance">
          {copy.h1Line1}{" "}
          <span className="text-primary">{copy.h1Line1Gradient}</span>{" "}
          <span className="text-muted-foreground">{copy.h1Line2}</span>
        </h1>

        {/* Sub-hero */}
        <p className="text-[1.0625rem] md:text-[1.25rem] leading-[1.65] text-foreground text-balance max-w-[58ch] mx-auto mb-12 md:mb-16">
          {copy.subHero}
        </p>

        <div className="hairline mb-12 md:mb-16" />

        {/* Value bullets — left-aligned numbered list (matches site rhythm) */}
        <div className="flex flex-col items-center gap-6 mb-12 md:mb-16">
          <span className="kicker">{copy.bulletsKicker}</span>
          <ul className="flex flex-col gap-4 max-w-[58ch] w-full text-left">
            {copy.bullets.map((b, i) => (
              <li
                key={i}
                className="flex flex-row items-start gap-3 text-[1rem] md:text-[1.0625rem] leading-[1.6] text-foreground"
              >
                <span
                  aria-hidden
                  className="font-mono-hud text-[10px] tabular-nums tracking-[0.18em] uppercase text-muted-foreground/80 pt-[0.45rem] min-w-[1.5rem]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  className="text-primary pt-[0.05rem]"
                >
                  ›
                </span>
                <span className="flex-1">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hairline mb-12 md:mb-16" />

        {/* CTA — the conversion point. Blue-edged panel so the eye lands here. */}
        <div className="card-line card-line-accent flex flex-col items-center gap-6 px-6 py-10 md:px-10 md:py-12 mb-8">
          <span className="kicker kicker-accent">{copy.formKicker}</span>
          <p className="text-[1rem] md:text-[1.0625rem] leading-[1.6] text-foreground max-w-[50ch]">
            {copy.formIntro}
          </p>
          <div className="w-full max-w-md text-left">
            <EmailCaptureForm
              lang={lang}
              source="landing-free-n8n-pack"
              productSlug="free-n8n-pack"
              compact
            />
          </div>
          <p className="text-xs text-muted-foreground">{copy.reassurance}</p>
        </div>

        <div className="hairline mb-12 md:mb-16" />

        {/* Upsell — always visible (no state coordination with form) */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <span className="kicker">{copy.upsellKicker}</span>
          <div className="flex flex-col items-center gap-3 max-w-[50ch]">
            <Link
              href={withLang(copy.upsellPrimaryHref, lang)}
              className="inline-flex items-center min-h-[44px] text-[1rem] md:text-[1.0625rem] text-foreground hover:text-primary transition-colors"
            >
              {copy.upsellPrimary}
            </Link>
            <Link
              href={withLang(copy.upsellSecondaryHref, lang)}
              className="inline-flex items-center min-h-[44px] text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {copy.upsellSecondary}
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-12 border-t border-border text-xs text-muted-foreground flex flex-wrap justify-center gap-y-2 gap-x-4">
          <span>© {new Date().getFullYear()} · @manu_ai.to</span>
        </footer>
      </div>
    </main>
  );
}
