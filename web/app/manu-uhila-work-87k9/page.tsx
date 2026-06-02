import type { Metadata } from "next";
import Link from "next/link";
import { TopBar, Hero, Footer } from "./_components";

export const metadata: Metadata = {
  title: "Yoan Uhila, Portfolio",
  description:
    "Yoan Uhila's portfolio. Selected systems shipped across automation, internal tools, and full-stack web apps.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: null,
  },
};

function NavTile({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative block aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-[#0A1628] via-[#0a1c3a] to-[#00A6FF] hover:to-[#00E5FF] transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e8f0fb] shadow-md hover:shadow-xl"
    >
      <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
        <span className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight transition-transform motion-reduce:transition-none motion-reduce:transform-none group-hover:scale-105">
          {label}
        </span>
      </div>
    </Link>
  );
}

export default function ManuUhilaWorkPage() {
  return (
    <div className="min-h-screen bg-[#e8f0fb] text-[#0A1628] antialiased">
      <header>
        <TopBar />
      </header>
      <main>
        <Hero title="AI Automation Developer" />
        <div className="mx-auto max-w-3xl px-5 md:px-6 py-16 md:py-20">
        <section
          aria-labelledby="activity-heading"
          className="mb-12 md:mb-16 border-y-2 border-slate-300 py-10"
        >
          <h2
            id="activity-heading"
            className="text-sm md:text-base font-semibold uppercase tracking-[0.22em] text-slate-600 mb-6 text-center"
          >
            What I do
          </h2>
          <p className="text-[15px] md:text-base text-slate-700 leading-relaxed max-w-2xl mx-auto text-center">
            I build AI-powered automations and software systems for businesses.
            The work covers operational automations, internal tools, full-stack
            web applications, and AI agents.
          </p>
        </section>

        <section aria-labelledby="presence-heading" className="mb-16 md:mb-20">
          <h2
            id="presence-heading"
            className="text-sm md:text-base font-semibold uppercase tracking-[0.22em] text-slate-600 mb-8 text-center"
          >
            Online presence
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-5 md:gap-8">
            <a
              href="https://www.instagram.com/manu_ai.to/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white border border-slate-200 hover:border-[#00A6FF]/40 hover:shadow-md rounded-xl p-6 md:p-7 transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e8f0fb] sm:min-w-[260px]"
            >
              <span className="text-[#0077cc] shrink-0">
                <svg
                  aria-hidden
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={32}
                  height={32}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Instagram
                </span>
                <span className="text-base md:text-lg font-semibold text-[#0A1628] truncate group-hover:text-[#0077cc] transition-colors">
                  @manu_ai.to
                </span>
              </div>
            </a>
            <a
              href="https://www.tiktok.com/@manu_ai.to"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-white border border-slate-200 hover:border-[#00A6FF]/40 hover:shadow-md rounded-xl p-6 md:p-7 transition-all motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e8f0fb] sm:min-w-[260px]"
            >
              <span className="text-[#0077cc] shrink-0">
                <svg
                  aria-hidden
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={32}
                  height={32}
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.07A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.45a8.16 8.16 0 0 0 4.77 1.52V6.55a4.85 4.85 0 0 1-1.84.14Z" />
                </svg>
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  TikTok
                </span>
                <span className="text-base md:text-lg font-semibold text-[#0A1628] truncate group-hover:text-[#0077cc] transition-colors">
                  @manu_ai.to
                </span>
              </div>
            </a>
          </div>
        </section>

        <section aria-labelledby="explore-heading">
          <h2
            id="explore-heading"
            className="text-sm md:text-base font-semibold uppercase tracking-[0.22em] text-slate-600 mb-8 text-center"
          >
            Explore the work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <NavTile
              href="/manu-uhila-work-87k9/client-projects"
              label="Client Projects"
            />
            <NavTile
              href="/manu-uhila-work-87k9/own-builds"
              label="My Tools"
            />
          </div>
        </section>

          <Footer />
        </div>
      </main>
    </div>
  );
}
