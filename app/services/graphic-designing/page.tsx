"use client"

import { useRef, useState } from "react"
import { Reveal, TiltCard, MagneticButton, ScrollProgress } from "@/app/components/motion"

/* Assumes the Sora / Inter font variables (--font-display, --font-body)
   are already applied at the root layout, same as the other pages. */

const stats = [
  { value: "48 hrs", label: "First concepts to review" },
  { value: "2 rounds", label: "Revisions included, standard" },
  { value: "Print + Digital", label: "Delivered ready for both" },
]

const benefits = [
  "One visual identity carried across logo, print, and social — not designed piece by piece",
  "Print files delivered CMYK, with bleed and margins set correctly the first time",
  "Vector source files handed over, so a logo scales from a favicon to a billboard without loss",
  "Turnaround measured in days, without concepts feeling rushed to hit it",
  "Designs built to match brand guidelines you already have, or to help set them",
  "Editable source files, not just flattened exports you can't update later",
]

const features = [
  {
    title: "Logo & brand identity",
    desc: "A mark built to hold up at any size, backed by the color and type system that makes it recognizable.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l2.4 5.5L20 10l-4.5 3.8L16.9 20 12 16.8 7.1 20l1.4-6.2L4 10l5.6-1.5L12 3z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Social media graphics",
    desc: "Post templates and one-off graphics sized correctly for each platform, on-brand without needing a brief every time.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="3" stroke="white" strokeWidth="2" />
        <circle cx="9" cy="9.5" r="1.6" stroke="white" strokeWidth="1.6" />
        <path d="M5 17l4.5-5 3.5 4 2.5-3 3.5 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Print collateral",
    desc: "Business cards, brochures, and flyers set up print-ready, with proofs you can approve before anything goes to press.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="7" width="18" height="12" rx="1.5" stroke="white" strokeWidth="2" />
        <path d="M7 4h10v3H7z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Packaging design",
    desc: "Labels and packaging that hold up on a shelf, with dielines set correctly for your printer or manufacturer.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 8l8-4 8 4-8 4-8-4z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <path d="M4 8v9l8 4 8-4V8M12 12v9" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Marketing & ad creative",
    desc: "Display ads, banners, and campaign creative built to stop a scroll, in the sizes each platform actually needs.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 17l5-5 4 4 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 8h5v5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Presentation & pitch decks",
    desc: "Slide templates that make the content easier to follow, not just a logo pasted onto a stock layout.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="13" rx="1.5" stroke="white" strokeWidth="2" />
        <path d="M9 21h6M12 17v4" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
]

const process = [
  { step: "01", title: "Brief & moodboard", body: "We pin down what the piece needs to do and who it's for, and pull references until a direction feels right." },
  { step: "02", title: "Concepts", body: "Two or three distinct directions, not variations on one idea, so there's a real choice to make." },
  { step: "03", title: "Refinement", body: "The chosen direction developed and tightened, with your feedback built in as we go." },
  { step: "04", title: "Final files & handoff", body: "Print-ready and digital-ready exports delivered, along with the editable source files." },
]

const faqs = [
  { q: "What file formats do we get?", a: "Editable source files (AI, PSD, or Figma, depending on the piece) plus export-ready formats — print PDFs with bleed, and PNG or SVG for digital use." },
  { q: "How many rounds of revisions are included?", a: "Two rounds of feedback are standard. Larger projects like a full brand identity can include more — we'll scope it up front." },
  { q: "Do you design for print and digital, or just one?", a: "Both, usually in the same project — a logo built for a business card needs to also work as a small social avatar, so we design with both in mind from the start." },
  { q: "Can you match our existing brand guidelines?", a: "Yes — send what you have and we'll design inside it. If there isn't a formal guideline yet, we can define one alongside the project." },
  { q: "How fast is turnaround?", a: "First concepts are usually ready within 48 hours of the brief. Full projects with multiple pieces are scoped and scheduled up front." },
]

const relatedLinks = [
  { title: "Web Designing", href: "/services/web-designing" },
  { title: "Content Writing", href: "/services/content-writing" },
  { title: "Social Media Marketing", href: "/services/social-media-marketing" },
  { title: "SEO & Content Marketing", href: "/services/seo-content-marketing" },
]

/* Hero visual: a tilting stack of design assets — a business card, a
   logo badge, and a social square — layered like physical proofs on
   a desk, built with the same cursor-tilt physics as the other
   pages' hero mockups but specific to graphic design output. */
function AssetStackMockup() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ x: 10, y: -8 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: 10 + py * -10, y: -8 + px * 14 })
  }

  function handleLeave() {
    setTilt({ x: 10, y: -8 })
  }

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
        className="pointer-events-none absolute -left-16 -bottom-10 h-56 w-56 rounded-full opacity-45 blur-3xl"
        style={{
          background: "radial-gradient(circle, #C837AB, transparent 70%)",
          transform: `translate(${(tilt.y + 8) * -1.3}px, ${(tilt.x - 10) * 1.3}px)`,
          transition: "transform 0.35s ease-out",
        }}
      />

      <div
        className="relative h-[220px] w-[280px]"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.28s ease-out",
        }}
      >
        {/* Social square, back layer */}
        <div
          className="absolute left-6 top-0 h-32 w-32 rounded-xl bg-gradient-to-br from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] shadow-xl shadow-[#6F1F9E]/20"
          style={{ transform: "translateZ(0px) rotate(-6deg)" }}
        />

        {/* Business card, middle layer */}
        <div
          className="absolute left-24 top-16 h-24 w-40 rounded-lg border border-black/5 bg-white shadow-xl shadow-[#6F1F9E]/20"
          style={{ transform: "translateZ(14px) rotate(4deg)" }}
        >
          <div className="flex h-full flex-col justify-between p-3">
            <span className="h-4 w-4 rounded-full bg-gradient-to-br from-[#8B2FC9] to-[#FF2D95]" />
            <div className="space-y-1">
              <div className="h-1.5 w-3/5 rounded-full bg-neutral-300" />
              <div className="h-1.5 w-2/5 rounded-full bg-neutral-100" />
            </div>
          </div>
        </div>

        {/* Logo badge, front layer */}
        <div
          className="absolute left-2 top-24 flex h-16 w-16 items-center justify-center rounded-full border border-black/5 bg-white shadow-xl shadow-[#6F1F9E]/20"
          style={{ transform: "translateZ(28px) rotate(-4deg)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l2.4 5.5L20 10l-4.5 3.8L16.9 20 12 16.8 7.1 20l1.4-6.2L4 10l5.6-1.5L12 3z" fill="url(#g)" />
            <defs>
              <linearGradient id="g" x1="4" y1="3" x2="20" y2="20">
                <stop stopColor="#8B2FC9" />
                <stop offset="1" stopColor="#FF2D95" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function GraphicDesigningPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="font-sans text-neutral-900">
      <ScrollProgress />

      {/* 1. Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div>
          <p className="text-sm font-medium text-[#C837AB]">Design</p>
          <h1 className="mt-3 font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Graphic design that looks like one brand, everywhere.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
            Logos, print collateral, packaging, and campaign creative, designed from one
            visual system so a business card and a social post look like they came from
            the same place — because they did.
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

        <AssetStackMockup />
      </section>

      {/* 2. Overview */}
      <section className="border-y border-neutral-200 bg-[#FBF7FC] py-20">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-lg leading-relaxed text-neutral-700">
            Most brands don't fall apart from one bad design — they fall apart from
            twenty pieces designed with no system behind them. We build the visual
            identity once — logo, color, type — then apply it consistently across
            everything printed or posted, so every touchpoint reads as the same brand.
          </p>
        </Reveal>
      </section>

      {/* 3. Benefits */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[0.9fr_1.6fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">What you get</h2>
            <p className="mt-4 max-w-sm text-neutral-600">
              Standard on every design project, not priced as extras.
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
            <h2 className="font-display text-3xl font-semibold">What we design</h2>
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
          className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #FF2D95, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">How a design project runs</h2>
            <p className="mt-4 max-w-sm text-neutral-300">Real options first, then refinement.</p>
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
            Ready for a brand that looks finished?
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