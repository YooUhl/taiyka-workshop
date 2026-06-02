import type { Metadata } from "next";
import Link from "next/link";
import { PROJECTS } from "../_data";
import { TopBar, Hero, ProjectCard, Footer } from "../_components";

export const metadata: Metadata = {
  title: "Client Projects, Yoan Uhila",
  description:
    "Client projects shipped or scoped by Yoan Uhila.",
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

const delivered = PROJECTS.filter((p) => p.group === "client").map((p, i) => ({
  p,
  position: i + 1,
}));
const inDelivery = PROJECTS.filter((p) => p.group === "in-delivery").map(
  (p, i) => ({ p, position: delivered.length + i + 1 })
);

export default function ClientProjectsPage() {
  return (
    <div className="min-h-screen bg-[#e8f0fb] text-[#0A1628] antialiased">
      <header>
        <TopBar />
      </header>
      <main>
        <Hero
          title="Client Projects"
          meta="Engagements delivered and in delivery"
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
            A selection of recent client engagements. Some are NDA-protected and
            not shown here.
          </p>

        {delivered.length > 0 && (
          <section aria-labelledby="delivered-heading" className="mb-12 md:mb-16">
            <h2 id="delivered-heading" className="sr-only">
              Delivered projects
            </h2>
            <ol className="list-none space-y-12 md:space-y-16">
              {delivered.map(({ p, position }) => (
                <li key={p.title}>
                  <ProjectCard p={p} position={position} />
                </li>
              ))}
            </ol>
          </section>
        )}

          {inDelivery.length > 0 && (
            <section aria-labelledby="in-delivery-heading">
              <h2 id="in-delivery-heading" className="sr-only">
                Signed, in delivery
              </h2>
              <div className="mb-12 md:mb-16 flex items-center gap-4" aria-hidden>
                <div className="h-px flex-1 bg-slate-300" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                  In delivery
                </span>
                <div className="h-px flex-1 bg-slate-300" />
              </div>
              <ol className="list-none space-y-12 md:space-y-16">
                {inDelivery.map(({ p, position }) => (
                  <li key={p.title}>
                    <ProjectCard p={p} position={position} />
                  </li>
                ))}
              </ol>
            </section>
          )}

          <div className="mt-16 md:mt-20 pt-8 border-t border-slate-200">
            <Link
              href="/manu-uhila-work-87k9/own-builds"
              className="group inline-flex items-center gap-2 py-3 -my-3 px-1 -mx-1 text-sm text-slate-600 hover:text-[#0077cc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077cc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#e8f0fb] focus-visible:rounded-sm transition-colors motion-reduce:transition-none"
            >
              Also see <span className="font-semibold text-[#0A1628] group-hover:text-[#0077cc] transition-colors motion-reduce:transition-none">My Tools</span>
              <span aria-hidden>→</span>
            </Link>
          </div>

          <Footer />
        </div>
      </main>
    </div>
  );
}
