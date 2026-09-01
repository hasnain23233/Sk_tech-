"use client"

import { useRef, useState } from "react"
import { Reveal, TiltCard, MagneticButton, ScrollProgress } from "@/app/components/motion"

/* Assumes the Sora / Inter font variables (--font-display, --font-body)
   are already applied at the root layout, same as the other pages. */

const stats = [
  { value: "48 hrs", label: "First draft, most pieces" },
  { value: "2 rounds", label: "Revisions included, standard" },
  { value: "SEO-mapped", label: "Every piece tied to a keyword" },
]

const benefits = [
  "Written for the person reading first — search engines follow when the content is actually useful",
  "Keyword research built into the outline, not stuffed into a finished draft afterward",
  "Tone matched to your brand voice, checked against past content so nothing reads off",
  "Every piece fact-checked and edited by a second person before it reaches you",
  "Delivered formatted and ready to publish, with a meta title and description attached",
  "A content calendar that keeps output consistent, not dependent on when inspiration shows up",
]

const features = [
  {
    title: "Blog writing",
    desc: "Posts built around real search demand, researched and structured to actually answer the question in the title.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 19V6a2 2 0 012-2h8l6 6v9a2 2 0 01-2 2H6a2 2 0 01-2-2z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 13h8M8 17h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Website copy",
    desc: "Homepage, about, and service pages written to move someone from reading to acting, not just describing what you do.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2" />
        <path d="M3 9h18" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Email marketing",
    desc: "Newsletters and campaign sequences written to be opened, read, and clicked — not skimmed and deleted.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="white" strokeWidth="2" />
        <path d="M3 6.5l9 6.5 9-6.5" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Product descriptions",
    desc: "Copy written to sell the actual product, not a template swapped in across every listing.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h2l2 11h10l2-8H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="1.4" fill="white" />
        <circle cx="16" cy="20" r="1.4" fill="white" />
      </svg>
    ),
  },
  {
    title: "Case studies & whitepapers",
    desc: "Long-form pieces that make a real result easy to follow, built for readers doing due diligence before they buy.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2" />
        <path d="M7 9h10M7 13h10M7 17h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "SEO content strategy",
    desc: "A content calendar mapped to real keyword gaps, so every piece has a job to do before it's written.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="10.5" cy="10.5" r="6.5" stroke="white" strokeWidth="2" />
        <path d="M20 20l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

const process = [
  { step: "01", title: "Brief & research", body: "We pin down the goal, the audience, and the keyword or angle the piece needs to cover." },
  { step: "02", title: "Outline & approval", body: "A structure signed off before drafting starts, so the direction is agreed early, not after a full draft." },
  { step: "03", title: "Drafting", body: "Written in your brand voice, with sources checked as we go, not bolted on at the end." },
  { step: "04", title: "Edit & deliver", body: "A second editor reviews every piece, then it's delivered formatted and ready to publish." },
]

const faqs = [
  { q: "How do you match our brand voice?", a: "We review existing content and any style guide you have, and write to a short sample for approval before a full project starts." },
  { q: "Is every piece SEO optimized?", a: "Yes — each piece is mapped to a target keyword and search intent before writing starts, with the meta title and description included on delivery." },
  { q: "How many rounds of revisions are included?", a: "Two rounds of feedback are standard on most pieces. Larger projects like whitepapers can include more — we'll scope it up front." },
  { q: "Do you handle publishing and formatting?", a: "We deliver formatted and ready to publish. If you'd like us to publish directly to your CMS, we can do that too." },
  { q: "What's the turnaround time per piece?", a: "A standard blog post is usually a 48-hour first draft. Longer pieces like case studies or whitepapers are scoped per project." },
]

const relatedLinks = [
  { title: "SEO & Content Marketing", href: "/services/seo-content-marketing" },
  { title: "Social Media Marketing", href: "/services/social-media-marketing" },
  { title: "Graphic Designing", href: "/services/graphic-designing" },
  { title: "Web Designing", href: "/services/web-designing" },
]

/* Hero visual: a tilting article mockup with a headline, body lines,
   and a floating "SEO ready" badge — a writing-specific moment,
   built with the same cursor-tilt physics as the other pages' hero
   mockups. */
function ArticleMockup() {
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

  const lines = [
    { w: "88%" }, { w: "62%" }, { w: "94%" }, { w: "40%" }, { w: "76%" }, { w: "55%" },
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
        className="pointer-events-none absolute -right-14 -top-12 h-56 w-56 rounded-full opacity-45 blur-3xl"
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
          <div className="flex items-center gap-1.5 border-b border-neutral-100 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF2D95]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#C837AB]/50" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#8B2FC9]/40" />
            <span className="ml-3 text-[11px] font-medium text-neutral-400">draft.md</span>
          </div>
          <div className="space-y-3 px-5 py-6">
            <div className="h-3.5 w-4/5 rounded-full bg-gradient-to-r from-[#8B2FC9] to-[#FF2D95] opacity-80" />
            <div className="pt-2 space-y-2.5">
              {lines.map((l, i) => (
                <div key={i} className="h-2 rounded-full bg-neutral-100" style={{ width: l.w }} />
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute -left-6 -bottom-6 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-xl shadow-[#6F1F9E]/15"
          style={{ transform: "translateZ(24px)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="#8B2FC9" strokeWidth="2" />
            <path d="M20 20l-5-5" stroke="#8B2FC9" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-[11px] font-semibold text-neutral-700">SEO ready</span>
        </div>
      </div>
    </div>
  )
}

export default function ContentWritingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="font-sans text-neutral-900">
      <ScrollProgress />

      {/* 1. Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div>
          <p className="text-sm font-medium text-[#C837AB]">Content</p>
          <h1 className="mt-3 font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Content written to be read, and found.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
            Blog posts, website copy, email, and product content — researched, written
            in your voice, and mapped to what people are actually searching for before a
            word gets drafted.
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

        <ArticleMockup />
      </section>

      {/* 2. Overview */}
      <section className="border-y border-neutral-200 bg-[#FBF7FC] py-20">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-lg leading-relaxed text-neutral-700">
            Content that's only written for search engines reads like it, and people
            leave. Content that's only written for people misses the traffic that would
            have found it. We write for the person first — clear, useful, in your voice —
            with the keyword research and structure that let search engines find it too.
          </p>
        </Reveal>
      </section>

      {/* 3. Benefits */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[0.9fr_1.6fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">What you get</h2>
            <p className="mt-4 max-w-sm text-neutral-600">
              Standard on every piece we write, not billed as extras.
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
            <h2 className="font-display text-3xl font-semibold">What we write</h2>
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
            <h2 className="font-display text-3xl font-semibold">How a piece gets written</h2>
            <p className="mt-4 max-w-sm text-neutral-300">Structure agreed before a draft exists.</p>
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
            Ready for content that earns its place on the page?
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