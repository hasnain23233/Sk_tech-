"use client"

import { useRef, useState } from "react"
import { Reveal, TiltCard, MagneticButton, ScrollProgress } from "@/app/components/motion"

/* Assumes the Sora / Inter font variables (--font-display, --font-body)
   are already applied at the root layout, same as the other pages. */

const stats = [
  { value: "3–6 mo", label: "To first meaningful ranking shift" },
  { value: "Monthly", label: "Content published, on a calendar" },
  { value: "Rankings · Traffic · Leads", label: "What the report actually tracks" },
]

const benefits = [
  "Keyword research built around what buyers actually search, not just search volume",
  "Technical issues fixed first — speed, crawl errors, broken structure — before content is asked to work harder",
  "A content calendar tied to real search demand, not a generic monthly theme",
  "Links earned through outreach and genuinely useful content, never bought in bulk",
  "Local listings and map-pack visibility handled for businesses that serve a specific area",
  "Reporting on rankings, traffic, and leads — not just how many keywords 'moved'",
]

const features = [
  {
    title: "Keyword research & strategy",
    desc: "Terms mapped to buyer intent and search volume, prioritized by what's actually winnable first.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="10.5" cy="10.5" r="6.5" stroke="white" strokeWidth="2" />
        <path d="M20 20l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "On-page & technical SEO",
    desc: "Page structure, site speed, and crawlability fixed so search engines can actually find and rank the content.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="white" strokeWidth="2" />
        <path d="M12 7v5l3.5 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Content writing",
    desc: "Blog posts and landing pages written to answer what people are actually searching for, not to hit a word count.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 19V6a2 2 0 012-2h8l6 6v9a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 13h8M8 17h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Link building",
    desc: "Outreach to relevant sites and genuinely useful content that earns links, no link farms or bulk buys.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 15l6-6M8 9l1.5-1.5a3.5 3.5 0 015 5L13 14M16 15l-1.5 1.5a3.5 3.5 0 01-5-5L11 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Local SEO",
    desc: "Google Business Profile, citations, and reviews managed for map-pack visibility in the areas you serve.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="12" cy="9" r="2.4" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Analytics & reporting",
    desc: "Monthly reports on rankings, traffic, and the leads or sales SEO actually produced.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 20V10M11 20V4M18 20v-7" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

const process = [
  { step: "01", title: "Audit", body: "We review your current rankings, technical health, and content, and find out what's actually holding you back." },
  { step: "02", title: "Strategy & keyword mapping", body: "Keywords prioritized and mapped to pages, with a content calendar built to fill the real gaps." },
  { step: "03", title: "Content & technical execution", body: "Pages fixed, content published, and links earned, on a schedule you can see." },
  { step: "04", title: "Reporting & iteration", body: "Monthly numbers reviewed together, and the plan adjusted by what's actually moving." },
]

const faqs = [
  { q: "How long does SEO take to show results?", a: "Most sites see meaningful movement in 3–6 months, depending on competition and how much technical work is needed up front. SEO compounds — it's slower to start than paid ads, and cheaper to sustain." },
  { q: "Do you write the content, or just optimize what's there?", a: "Both. We write new content mapped to keyword gaps, and optimize what already exists on the site." },
  { q: "Is your link building safe for our site?", a: "Yes — outreach and content-based link earning only. We don't touch link farms, PBNs, or bulk-bought links, which put sites at risk of penalties." },
  { q: "Can you guarantee a #1 ranking?", a: "No one honestly can — search algorithms aren't something any agency controls. What we commit to is the work that moves rankings: technical fixes, content, and links, tracked openly." },
  { q: "How is SEO different from paid ads?", a: "Paid ads stop the moment you stop paying. SEO takes longer to build but keeps working after the initial push — the two work well run together." },
]

const relatedLinks = [
  { title: "Pay Per Click", href: "/services/pay-per-click" },
  { title: "Social Media Marketing", href: "/services/social-media-marketing" },
  { title: "Content Writing", href: "/services/content-writing" },
  { title: "Web Development", href: "/services/web-development" },
]

/* Hero visual: a tilting search-results mockup with one result boxed
   off as the #1 spot, and a small upward trend line floating beside
   it — built with the same cursor-tilt physics as the other pages'
   hero mockups, but specific to ranking movement. */
function SearchRankMockup() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ x: 10, y: -10 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: 10 + py * -10, y: -10 + px * 14 })
  }

  function handleLeave() {
    setTilt({ x: 10, y: -10 })
  }

  const results = [
    { highlight: true },
    { highlight: false },
    { highlight: false },
  ]

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative flex h-[380px] items-center justify-center overflow-hidden rounded-3xl bg-[#FBF7FC] px-8"
      style={{ perspective: "1100px" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-14 -bottom-10 h-56 w-56 rounded-full opacity-45 blur-3xl"
        style={{
          background: "radial-gradient(circle, #8B2FC9, transparent 70%)",
          transform: `translate(${(tilt.y + 10) * -1.2}px, ${(tilt.x - 10) * 1.2}px)`,
          transition: "transform 0.35s ease-out",
        }}
      />

      <div
        className="relative w-full max-w-sm"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.28s ease-out",
        }}
      >
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl shadow-[#6F1F9E]/15">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-4 py-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="10.5" cy="10.5" r="6.5" stroke="#8B2FC9" strokeWidth="2" />
              <path d="M20 20l-5-5" stroke="#8B2FC9" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="h-2 w-32 rounded-full bg-neutral-100" />
          </div>
          <div className="space-y-3 px-4 py-5">
            {results.map((r, i) => (
              <div
                key={i}
                className={`rounded-lg p-2.5 ${r.highlight ? "border-2 border-[#FF2D95]/70 bg-[#FDF0F8]" : ""}`}
              >
                <div className={`h-2 rounded-full ${r.highlight ? "w-3/5 bg-[#8B2FC9]" : "w-2/5 bg-neutral-300"}`} />
                <div className="mt-2 h-1.5 w-4/5 rounded-full bg-neutral-100" />
                <div className="mt-1.5 h-1.5 w-3/5 rounded-full bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute -left-6 -top-6 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-xl shadow-[#6F1F9E]/15"
          style={{ transform: "translateZ(24px)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 17l5-5 4 4 7-8" stroke="#FF2D95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 8h5v5" stroke="#FF2D95" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[11px] font-semibold text-neutral-700">#1 spot</span>
        </div>
      </div>
    </div>
  )
}

export default function SeoContentMarketingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="font-sans text-neutral-900">
      <ScrollProgress />

      {/* 1. Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div>
          <p className="text-sm font-medium text-[#C837AB]">Marketing</p>
          <h1 className="mt-3 font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            SEO and content that earn the ranking, not rent it.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
            Technical fixes, keyword strategy, and content built around what people
            actually search for — reported on in rankings, traffic, and leads, not
            keyword counts.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton
              href="/contact"
              className="rounded-full bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#C837AB]/25"
            >
              Start a project
            </MagneticButton>
            <a
              href="/portfolio"
              className="text-sm font-semibold text-neutral-800 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-[#C837AB]"
            >
              See our work
            </a>
          </div>

          <div className="mt-16 grid max-w-lg grid-cols-3 gap-6 border-t border-neutral-200 pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-display text-xl font-semibold sm:text-2xl">{s.value}</p>
                <p className="mt-1 text-sm text-neutral-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <SearchRankMockup />
      </section>

      {/* 2. Overview */}
      <section className="border-y border-neutral-200 bg-[#FBF7FC] py-20">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-lg leading-relaxed text-neutral-700">
            SEO fails when the technical foundation is ignored or when content is written
            for a keyword count instead of a person searching. We fix the site first —
            speed, structure, crawlability — then build content around real search demand
            and earn links the slow, honest way. It takes longer than paid ads to build,
            and keeps working long after the campaign ends.
          </p>
        </Reveal>
      </section>

      {/* 3. Benefits */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[0.9fr_1.6fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">What you get</h2>
            <p className="mt-4 max-w-sm text-neutral-600">
              Built into every engagement, not billed as extras.
            </p>
          </Reveal>
          <ul className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#C837AB] to-[#FF2D95]" />
                <p className="text-[15px] leading-relaxed text-neutral-700">{b}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Features */}
      <section className="bg-[#FBF7FC] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">What we run</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: "1200px" }}>
            {features.map((f) => (
              <TiltCard
                key={f.title}
                className="rounded-2xl border border-neutral-200 bg-white p-6 hover:shadow-xl hover:shadow-neutral-900/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B2FC9] to-[#FF2D95]">
                  {f.icon}
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{f.desc}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Process */}
      <section className="relative overflow-hidden bg-[#1B1023] py-24 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-20 -top-10 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #C837AB, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">How the work runs</h2>
            <p className="mt-4 max-w-sm text-neutral-300">Foundation first, content on top.</p>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.step} className="group">
                <span className="font-display text-sm font-semibold text-[#FF83C4] transition-transform duration-300 group-hover:translate-x-1 inline-block">
                  {p.step}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-300">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">Questions, answered</h2>
          </Reveal>
          <div className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={openFaq === i}
                >
                  <span className="font-display text-[17px] font-medium">{f.q}</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="shrink-0"
                    style={{
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <path d="M2.5 4.5L6 8l3.5-3.5" stroke="#171512" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <div
                  style={{
                    display: "grid",
                    gridTemplateRows: openFaq === i ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.35s cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-10 text-[15px] leading-relaxed text-neutral-600">{f.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Related services */}
      <section className="border-t border-neutral-200 bg-[#FBF7FC] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="font-display text-sm font-semibold text-neutral-500">Related services</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-[#C837AB] hover:text-[#8B2FC9]"
              >
                {l.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Ready to rank for what your customers are actually searching?
          </h2>
          <MagneticButton
            href="/contact"
            className="shrink-0 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#8B2FC9]"
          >
            Get in touch
          </MagneticButton>
        </div>
      </section>
    </div>
  )
}