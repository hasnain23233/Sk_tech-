"use client"

import { useRef, useState } from "react"
import { Reveal, TiltCard, MagneticButton, ScrollProgress } from "@/app/components/motion"

/* Assumes the Sora / Inter font variables (--font-display, --font-body)
   are already applied at the root layout, same as the other pages. */

const stats = [
  { value: "24–48 hrs", label: "To first optimized campaign live" },
  { value: "Weekly", label: "Bids and budgets reviewed" },
  { value: "Cost/lead · ROAS", label: "What the report actually tracks" },
]

const benefits = [
  "Campaigns built around cost per lead and return on ad spend, not just clicks",
  "Negative keywords maintained weekly so budget stops leaking to irrelevant searches",
  "Landing pages matched to ad intent, never just pointed at the homepage",
  "Bids managed by a person watching auction data, not left on full autopilot",
  "Google, Bing, and paid social run from one coordinated budget, not siloed accounts",
  "Reporting on cost per lead and return on spend, not just impressions and clicks",
]

const features = [
  {
    title: "Campaign strategy & structure",
    desc: "Accounts built around how buyers actually search, structured so budget goes to the terms that convert.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Bid & budget management",
    desc: "Bids adjusted against real auction data every week, so spend follows what's converting, not a set-and-forget rule.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 20V10M11 20V4M18 20v-7" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Ad copy & creative testing",
    desc: "Headlines and creative tested against each other on a schedule, with losers cut and budget moved to what works.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 19V6a2 2 0 012-2h8l6 6v9a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 13h8M8 17h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Landing page optimization",
    desc: "Pages built to match what the ad promised, so the click doesn't land somewhere that makes the visitor start over.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" stroke="white" strokeWidth="2" />
        <path d="M12 7v5l3 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Conversion tracking & attribution",
    desc: "Every lead and sale tied back to the campaign, keyword, and ad that produced it, so decisions rest on real numbers.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 15l6-6M8 9l1.5-1.5a3.5 3.5 0 015 5L13 14M16 15l-1.5 1.5a3.5 3.5 0 01-5-5L11 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Analytics & reporting",
    desc: "Monthly reports on cost per lead, return on spend, and the revenue PPC actually produced.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 17l5-5 4 4 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 8h5v5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const process = [
  { step: "01", title: "Audit", body: "We review current accounts, spend history, and conversion tracking, and find out where budget is actually going." },
  { step: "02", title: "Strategy & campaign structure", body: "Campaigns rebuilt or launched around real buyer intent, with budget mapped to what's winnable first." },
  { step: "03", title: "Launch & testing", body: "Ads go live, copy and creative are tested against each other, and bids get tuned against early data." },
  { step: "04", title: "Optimization & reporting", body: "Monthly numbers reviewed together, and spend shifted toward what's actually producing leads." },
]

const faqs = [
  { q: "How fast do PPC campaigns show results?", a: "Ads can go live within 24–48 hours, but the first two to three weeks are spent gathering data. Meaningful optimization — cutting waste, scaling what converts — usually starts around week three or four." },
  { q: "Which platforms do you run?", a: "Google Ads and Microsoft (Bing) Ads for search intent, plus Meta, LinkedIn, or other paid social when it fits the buyer. We recommend based on where your customers actually are, not a default package." },
  { q: "How do you decide how much to spend?", a: "We start from a target cost per lead and work backward to a budget that can realistically hit it, based on your industry's auction data. We're direct if a budget is too small to compete." },
  { q: "Do you write the ad copy too?", a: "Yes. Copy and creative are part of the campaign build, and we test variations against each other rather than running with one ad indefinitely." },
  { q: "What's the difference between PPC and SEO?", a: "PPC stops the moment you stop paying, but it's fast — you can be visible tomorrow. SEO takes longer to build but keeps working after the push. Most accounts run both, feeding data back and forth between them." },
]

const relatedLinks = [
  { title: "SEO & Content Marketing", href: "/services/seo-content-marketing" },
  { title: "Social Media Marketing", href: "/services/social-media-marketing" },
  { title: "Content Writing", href: "/services/content-writing" },
  { title: "Web Development", href: "/services/web-development" },
]

/* Hero visual: a tilting search-ad mockup with an "Ad" badge on the
   top result and a small floating CPC/ROAS stat card beside it —
   same cursor-tilt physics as the SEO page's hero, but specific to
   a paid placement rather than an organic ranking. */
function AdAuctionMockup() {
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
    { ad: true },
    { ad: true },
    { ad: false },
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
              <div key={i} className="rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  {r.ad && (
                    <span className="rounded-[4px] bg-[#8B2FC9]/10 px-1.5 py-[1px] text-[9px] font-semibold text-[#8B2FC9]">
                      Ad
                    </span>
                  )}
                  <div className={`h-2 rounded-full ${r.ad ? "w-2/5 bg-[#8B2FC9]" : "w-2/5 bg-neutral-300"}`} />
                </div>
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
          <span className="text-[11px] font-semibold text-neutral-700">ROAS 4.2x</span>
        </div>
      </div>
    </div>
  )
}

export default function PayPerClickPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="font-sans text-neutral-900">
      <ScrollProgress />

      {/* 1. Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div>
          <p className="text-sm font-medium text-[#C837AB]">Marketing</p>
          <h1 className="mt-3 font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Paid search that pays for itself, not just for clicks.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
            Campaigns built around cost per lead and return on spend, bids managed
            by a person watching the auction, and landing pages that match what
            the ad promised.
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

        <AdAuctionMockup />
      </section>

      {/* 2. Overview */}
      <section className="border-y border-neutral-200 bg-[#FBF7FC] py-20">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-lg leading-relaxed text-neutral-700">
            PPC fails when accounts run on autopilot or when a click lands on a
            page that has nothing to do with the ad. We start from a target cost
            per lead, build campaigns and landing pages around real buyer intent,
            and check bids against the auction every week instead of setting them
            once and walking away. It's faster to switch on than SEO, and it stops
            the moment you stop paying — the two work best run together.
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
            <p className="mt-4 max-w-sm text-neutral-300">Structure first, spend follows the data.</p>
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
            Ready to turn ad spend into pipeline?
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