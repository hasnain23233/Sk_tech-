"use client"

import { useMemo, useState } from "react"

/* ---------------------------------------------------------------- */
/* Data                                                               */
/* ---------------------------------------------------------------- */

const featured = [
  {
    client: "Boutique fashion retailer, UK",
    category: "Shopify Development",
    result: "3.2x",
    metric: "organic traffic in 6 months",
    detail: "Rebuilt their Shopify store and rebuilt SEO from the ground up around actual buyer intent.",
  },
  {
    client: "Healthcare clinic network, Pakistan",
    category: "Pay-Per-Click Advertising",
    result: "4x",
    metric: "qualified leads from paid search",
    detail: "Restructured Google Ads campaigns and landing pages around each clinic's specialty.",
  },
  {
    client: "B2B SaaS startup, UK",
    category: "Social Media Marketing",
    result: "58%",
    metric: "lower cost per lead",
    detail: "Replaced a scattershot social strategy with a focused content and PPC funnel.",
  },
]

const categories = [
  "All",
  "Web Development",
  "Web Designing",
  "Shopify Development",
  "Application Development",
  "Social Media Marketing",
  "SEO & Content Marketing",
  "Graphic Designing",
  "Content Writing",
  "Pay-Per-Click Advertising",
]

const portfolio = [
  {
    title: "Marbleworth Estates",
    client: "Real Estate",
    category: "Web Development",
    blurb: "A listings platform with map search, saved properties, and agent dashboards built on a headless CMS.",
    tag: "6-week build",
  },
  {
    title: "Linen & Co.",
    client: "Retail",
    category: "Web Designing",
    blurb: "Full visual identity and site redesign for a homeware brand moving from wholesale to direct-to-consumer.",
    tag: "Brand + web",
  },
  {
    title: "Verde Apothecary",
    client: "E-commerce",
    category: "Shopify Development",
    blurb: "Migrated from a legacy cart to Shopify Plus with custom subscription logic and bundle pricing.",
    tag: "Platform migration",
  },
  {
    title: "Fielder Health",
    client: "Healthcare",
    category: "Application Development",
    blurb: "Patient intake and appointment app used across a nine-clinic network, replacing paper forms.",
    tag: "iOS + Android",
  },
  {
    title: "Northbound Coffee",
    client: "Hospitality",
    category: "Social Media Marketing",
    blurb: "Grew a single-location roaster's Instagram following 4x and turned it into a wholesale lead channel.",
    tag: "12-month retainer",
  },
  {
    title: "Ridgeline Tutors",
    client: "Education",
    category: "SEO & Content Marketing",
    blurb: "Built a content and backlink strategy that took an unranked tutoring site to page one for 40+ terms.",
    tag: "Organic growth",
  },
  {
    title: "Solace Legal",
    client: "Professional Services",
    category: "Graphic Designing",
    blurb: "New brand mark, stationery, and pitch-deck system for a boutique employment law firm.",
    tag: "Identity system",
  },
  {
    title: "Kettlebound",
    client: "Startups",
    category: "Content Writing",
    blurb: "Ongoing blog and email content for a fitness-equipment startup raising its first seed round.",
    tag: "Editorial calendar",
  },
  {
    title: "Havenly Interiors",
    client: "Real Estate",
    category: "Pay-Per-Click Advertising",
    blurb: "Google and Meta campaigns for an interior design studio, rebuilt around cost-per-consultation.",
    tag: "Paid media",
  },
  {
    title: "Portside Insurance",
    client: "Professional Services",
    category: "Web Development",
    blurb: "Quote-and-buy insurance flow with real-time pricing, replacing a 12-step PDF-based process.",
    tag: "Product build",
  },
  {
    title: "Amara Skincare",
    client: "E-commerce",
    category: "Shopify Development",
    blurb: "Launch site and first-year growth plan for a DTC skincare line, from zero to first 10,000 orders.",
    tag: "0 to launch",
  },
  {
    title: "Bright Path Academy",
    client: "Education",
    category: "Web Designing",
    blurb: "Admissions-focused redesign for a private school, cutting form abandonment by half.",
    tag: "Conversion redesign",
  },
]

/* ---------------------------------------------------------------- */
/* Decorative thumbnail — abstract, generated per project so nothing */
/* relies on stock or client imagery.                                */
/* ---------------------------------------------------------------- */

const palettes = [
  ["#8B2FC9", "#FF2D95"],
  ["#C837AB", "#6F1F9E"],
  ["#FF2D95", "#8B2FC9"],
  ["#6F1F9E", "#C837AB"],
]

function ProjectThumb({ seed }: { seed: number }) {
  const [from, to] = palettes[seed % palettes.length]
  const shapes = seed % 3

  return (
    <div
      className="relative h-44 w-full overflow-hidden rounded-t-2xl"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div
        className="absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl"
        style={{ background: "white" }}
      />
      <svg className="absolute inset-0 h-full w-full opacity-90" viewBox="0 0 300 176" fill="none">
        {shapes === 0 && (
          <>
            <circle cx="230" cy="40" r="46" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" />
            <circle cx="230" cy="40" r="70" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
            <rect x="24" y="104" width="120" height="14" rx="7" fill="white" fillOpacity="0.25" />
            <rect x="24" y="128" width="80" height="14" rx="7" fill="white" fillOpacity="0.18" />
          </>
        )}
        {shapes === 1 && (
          <>
            <rect x="30" y="30" width="60" height="60" rx="12" fill="white" fillOpacity="0.22" />
            <rect x="100" y="60" width="60" height="60" rx="12" fill="white" fillOpacity="0.16" />
            <rect x="170" y="20" width="60" height="60" rx="12" fill="white" fillOpacity="0.28" />
          </>
        )}
        {shapes === 2 && (
          <>
            <path d="M10 140 C 80 160, 150 100, 210 110 S 280 80, 300 60" stroke="white" strokeOpacity="0.4" strokeWidth="2.5" fill="none" />
            <path d="M10 160 C 80 180, 150 130, 210 140 S 280 110, 300 90" stroke="white" strokeOpacity="0.22" strokeWidth="2.5" fill="none" />
            <circle cx="60" cy="46" r="8" fill="white" fillOpacity="0.35" />
            <circle cx="90" cy="30" r="4" fill="white" fillOpacity="0.35" />
          </>
        )}
      </svg>
    </div>
  )
}

/* ---------------------------------------------------------------- */

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = useMemo(
    () => (activeCategory === "All" ? portfolio : portfolio.filter((p) => p.category === activeCategory)),
    [activeCategory]
  )

  return (
    <div className="text-neutral-900">
      <style jsx global>{`
        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        .card-in {
          animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-20 lg:pt-28">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#C837AB]">Portfolio</p>
        <h1 className="mt-4 max-w-2xl font-display text-[2.5rem] font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Work across nine services, nine ways to grow.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
          Every project below started the same way — a business that needed a site, a
          campaign, or both, and a straight answer about what would actually move the
          number they cared about.
        </p>

        <div className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-neutral-200 pt-8">
          <div>
            <p className="font-display text-3xl font-semibold">120+</p>
            <p className="mt-1 text-sm text-neutral-500">Projects delivered</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold">8</p>
            <p className="mt-1 text-sm text-neutral-500">Industries served</p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold">15+</p>
            <p className="mt-1 text-sm text-neutral-500">Years in business</p>
          </div>
        </div>
      </section>

      {/* Featured case studies */}
      <section className="bg-[#FBF7FC] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="font-display text-2xl font-semibold">Featured results</h2>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {featured.map((c) => (
              <div
                key={c.client}
                className="rounded-2xl border border-neutral-200 bg-white p-7 transition-shadow duration-300 hover:shadow-xl hover:shadow-neutral-900/10"
              >
                <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                  {c.category}
                </span>
                <p className="mt-5 font-display text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#8B2FC9] to-[#FF2D95]">
                  {c.result}
                </p>
                <p className="mt-1 text-sm font-medium text-neutral-500">{c.metric}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">{c.detail}</p>
                <p className="mt-5 border-t border-neutral-100 pt-4 text-sm font-medium text-neutral-400">{c.client}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filterable grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 className="font-display text-2xl font-semibold">All projects</h2>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] text-white shadow-md shadow-[#C837AB]/25"
                      : "border border-neutral-200 text-neutral-600 hover:border-[#C837AB] hover:text-[#C837AB]"
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          <div key={activeCategory} className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <a
                href="#"
                key={p.title}
                className="card-in group overflow-hidden rounded-2xl border border-neutral-200 transition-shadow duration-300 hover:shadow-xl hover:shadow-neutral-900/10"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="overflow-hidden">
                  <div className="transition-transform duration-500 group-hover:scale-[1.06]">
                    <ProjectThumb seed={i} />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
                      {p.category}
                    </span>
                    <span className="text-xs font-medium text-neutral-400">{p.tag}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm font-medium text-neutral-400">{p.client}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">{p.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#8B2FC9] transition-transform duration-200 group-hover:translate-x-1">
                    View case study
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-16 text-center text-neutral-500">No projects in this category yet.</p>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
              See your project here next.
            </h2>
            <p className="mt-2 max-w-md text-[15px] text-white/80">
              Tell us what you're building and we'll send a fixed quote within two business days.
            </p>
          </div>
          <a
            href="/contact"
            className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#8B2FC9] transition-transform hover:scale-[1.03]"
          >
            Start a project
          </a>
        </div>
      </section>
    </div>
  )
}