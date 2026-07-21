import Link from "next/link";

// On-brand 404 — mirrors the /qcm hero language: kicker, display-caps heading,
// hairline, solid square CTA. Server component, no client JS.
export default function NotFound() {
  return (
    <main className="relative flex-1 w-full z-10 bg-obsidian">
      <div className="relative mx-auto w-full max-w-3xl px-6 md:px-10 py-16 md:py-24 text-center">
        <span className="kicker kicker-accent">404</span>

        <h1 className="display-lg display-caps mt-5 mb-6 text-balance text-foreground">
          Cette page existe pas.
        </h1>

        <p className="mb-12 text-[1.0625rem] md:text-[1.125rem] leading-[1.65] text-muted-foreground text-balance">
          Le lien est mort ou la page a bougé.
        </p>

        <div className="hairline mb-12" />

        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-none bg-primary text-[#06131f] h-14 px-7 font-semibold hover:bg-[#33b8ff] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f14]"
        >
          Retour à l&rsquo;accueil
        </Link>
      </div>
    </main>
  );
}
