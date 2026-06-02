import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS } from "../_data";
import { TopBar, Hero, ProjectCard, Footer } from "../_components";

export const metadata: Metadata = {
  title: "My Tools, Yoan Uhila",
  description:
    "Tools built and operated by Yoan Uhila.",
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

const ownItems = PROJECTS.filter((p) => p.group === "own").map((p, i) => ({
  p,
  position: i + 1,
}));

export default function OwnBuildsPage() {
  return (
    <div className="min-h-screen bg-[#e8f0fb] text-[#0A1628] antialiased">
      <header>
        <TopBar />
      </header>
      <main>
        <Hero
          title="My Tools"
          meta="Internal tools and infrastructure"
          compact
        />
        <div className="mx-auto max-w-3xl px-5 md:px-6 py-16 md:py-20">
          <Link
            href="/manu-uhila-work-87k9"
            className="inline-flex items-center gap-2 py-3 -my-3 px-1 -mx-1 text-sm text-slate-500 hover:text-[#0077cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e8f0fb] focus-visible:rounded-sm transition-colors motion-reduce:transition-none mb-10"
          >
            ← Back to portfolio
          </Link>

          <p className="text-sm md:text-base text-slate-600 italic leading-relaxed mb-12 max-w-2xl">
            A selection of some tools I built for personal use, not delivered.
          </p>

          <section aria-labelledby="active-tools-heading">
            <h2 id="active-tools-heading" className="sr-only">
              Active tools
            </h2>
            <ol className="list-none space-y-12 md:space-y-16">
              {ownItems.map(({ p, position }) => (
                <li key={p.title}>
                  <ProjectCard p={p} position={position} />
                </li>
              ))}
            </ol>
          </section>

          <div className="mt-16 md:mt-20 pt-8 border-t border-slate-200">
            <Link
              href="/manu-uhila-work-87k9/client-projects"
              className="group inline-flex items-center gap-2 py-3 -my-3 px-1 -mx-1 text-sm text-slate-600 hover:text-[#0077cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e8f0fb] focus-visible:rounded-sm transition-colors motion-reduce:transition-none"
            >
              Also see <span className="font-semibold text-[#0A1628] group-hover:text-[#0077cc] transition-colors motion-reduce:transition-none">Client Projects</span>
              <span aria-hidden>→</span>
            </Link>
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
}
