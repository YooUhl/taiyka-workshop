import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import EmailCaptureForm from "@/components/EmailCaptureForm";

type Lang = "fr" | "en";

type ParsedCopy = {
  h1Line1: string;
  h1Line2: string;
  subHero: string;
  bullets: string[];
};

function readCopy(lang: Lang): ParsedCopy {
  const file = path.join(
    process.cwd(),
    "..",
    "products",
    "free-n8n-pack",
    "copy",
    `sales-${lang}.md`
  );

  let raw = "";
  try {
    raw = fs.readFileSync(file, "utf8");
  } catch {
    // Fallback if file missing — still render the page.
    return {
      h1Line1:
        lang === "fr"
          ? "5 workflows n8n que j'utilise vraiment dans mon business."
          : "5 n8n workflows I actually use in my business.",
      h1Line2: lang === "fr" ? "Gratuits. À toi." : "Free. Yours.",
      subHero:
        lang === "fr"
          ? "Pas de théorie. Juste 5 fichiers .json à importer dans ton n8n."
          : "No theory. Just 5 .json files to import into your n8n.",
      bullets: [],
    };
  }

  // H1 block: between "## H1 (hero)" and the next "## "
  const h1Match = raw.match(/##\s*H1[^\n]*\n([\s\S]*?)(?=\n##\s)/);
  let h1Line1 = "";
  let h1Line2 = "";
  if (h1Match) {
    const lines = h1Match[1]
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    h1Line1 = lines[0]?.replace(/^\*\*|\*\*$/g, "").replace(/\*\*/g, "") ?? "";
    h1Line2 = lines[1] ?? "";
  }

  // Sub-hero: between "## Sub-hero" and next "## "
  const subMatch = raw.match(/##\s*Sub-hero\s*\n([\s\S]*?)(?=\n##\s)/);
  const subHero = subMatch
    ? subMatch[1]
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join(" ")
    : "";

  // Bullets: section starting with "## Bullets" (FR) or "## Value bullets" (EN)
  const bulletsMatch = raw.match(
    /##\s*(?:Bullets[^\n]*|Value bullets[^\n]*)\n([\s\S]*?)(?=\n##\s)/i
  );
  const bullets: string[] = [];
  if (bulletsMatch) {
    const lines = bulletsMatch[1].split("\n");
    for (const line of lines) {
      const m = line.match(/^\s*-\s+(.+)$/);
      if (m) bullets.push(m[1].trim());
    }
  }

  return { h1Line1, h1Line2, subHero, bullets };
}

const T = {
  fr: {
    formNote: "ZIP en moins de 2 minutes. Pas de spam, jamais.",
    socialProof: "Rejoins les entrepreneurs qui automatisent déjà leur business.",
    langSwitch: "EN",
    langSwitchHref: "/free-n8n-pack?lang=en",
    backHome: "← Accueil",
  },
  en: {
    formNote: "ZIP arrives in under 2 minutes. No spam, ever.",
    socialProof: "Join the entrepreneurs already automating their business.",
    langSwitch: "FR",
    langSwitchHref: "/free-n8n-pack?lang=fr",
    backHome: "← Home",
  },
} as const;

export default async function FreeN8nPackPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const sp = await searchParams;
  const lang: Lang = sp?.lang === "en" ? "en" : "fr";
  const copy = readCopy(lang);
  const t = T[lang];

  return (
    <main className="flex-1 w-full px-6 py-12 md:py-20">
      <div className="mx-auto w-full max-w-2xl flex flex-col items-center gap-10">
        {/* Top bar */}
        <div className="w-full flex items-center justify-between text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            {t.backHome}
          </Link>
          <Link
            href={t.langSwitchHref}
            className="rounded-md border border-border px-2.5 py-1 hover:border-[#00a6ff] hover:text-foreground transition-colors"
          >
            {t.langSwitch}
          </Link>
        </div>

        {/* Hero */}
        <header className="flex flex-col items-center text-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00a6ff]/30 bg-[#00a6ff]/10 px-3 py-1 text-xs font-medium text-[#00e5ff]">
            🎁 {lang === "fr" ? "Gratuit" : "Free"}
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            <span className="text-gradient-hero">{copy.h1Line1}</span>
            {copy.h1Line2 && (
              <>
                <br />
                <span className="text-foreground">{copy.h1Line2}</span>
              </>
            )}
          </h1>
          {copy.subHero && (
            <p className="text-base md:text-lg text-muted-foreground max-w-xl">
              {copy.subHero}
            </p>
          )}
        </header>

        {/* Value bullets */}
        {copy.bullets.length > 0 && (
          <ul className="w-full flex flex-col gap-3">
            {copy.bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-border bg-card/40 px-4 py-3 text-sm md:text-base text-foreground"
              >
                <span className="mt-0.5 text-[#00e5ff]">›</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Form card */}
        <section className="w-full rounded-2xl border border-border bg-card/60 p-6 md:p-8 shadow-glow">
          <EmailCaptureForm
            lang={lang}
            source="landing-free-n8n-pack"
            productSlug="free-n8n-pack"
          />
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {t.formNote}
          </p>
        </section>

        {/* Social proof */}
        <p className="text-xs text-muted-foreground text-center">
          {t.socialProof}
        </p>

        <footer className="text-xs text-muted-foreground pt-2">
          © {new Date().getFullYear()} Taiyka · @manu_ai.to
        </footer>
      </div>
    </main>
  );
}
