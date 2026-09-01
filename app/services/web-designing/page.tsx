"use client"

import { useRef, useState } from "react"
import { Reveal, TiltCard, MagneticButton, ScrollProgress } from "@/app/components/motion"

/* Assumes the Sora / Inter font variables (--font-display, --font-body)
   are already applied at the root layout, same as the other pages. */

const stats = [
  { value: "3–5 days", label: "First concepts to review" },
  { value: "2 rounds", label: "Revisions included, standard" },
  { value: "Figma", label: "Source files, yours to keep" },
]

const benefits = [
  "Layouts built pixel by pixel, not pulled from a page-builder kit",
  "One visual system — color, type, spacing — carried across every page",
  "Every screen designed mobile-first, then scaled up, not the other way round",
  "Contrast and type sizes checked against accessibility guidelines by default",
  "Design files developers can build from directly, with states and spacing specified",
  "A style guide left behind, so future pages stay on-brand without us",
]

const features = [
  {
    title: "Custom UI design",
    desc: "Every screen designed for your product and your users, not adapted from a theme.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2" />
        <path d="M3 9h18" stroke="white" strokeWidth="2" />
        <circle cx="6.5" cy="6.5" r="0.8" fill="white" />
      </svg>
    ),
  },
  {
    title: "Brand identity",
    desc: "Logo, color, and type decisions made together, so the site looks like one brand, not a stack of pages.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="8" r="4" stroke="white" strokeWidth="2" />
        <circle cx="15" cy="15" r="4" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Wireframing & prototyping",
    desc: "Low-fidelity flows first, so structure and navigation are settled before a single pixel is styled.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="7" height="14" rx="1.2" stroke="white" strokeWidth="2" />
        <rect x="14" y="5" width="7" height="14" rx="1.2" stroke="white" strokeWidth="2" strokeDasharray="3 2" />
      </svg>
    ),
  },
  {
    title: "Landing pages",
    desc: "Single-purpose pages designed around one action, built to test and iterate on quickly.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 19V9l8-5 8 5v10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 19v-6h6v6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Design systems",
    desc: "Reusable components and tokens, so new pages get built in hours instead of designed from scratch.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="6" height="6" rx="1" stroke="white" strokeWidth="2" />
        <rect x="14" y="4" width="6" height="6" rx="1" stroke="white" strokeWidth="2" />
        <rect x="4" y="14" width="6" height="6" rx="1" stroke="white" strokeWidth="2" />
        <rect x="14" y="14" width="6" height="6" rx="1" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Redesigns",
    desc: "A visual refresh of an existing site — new look, same content, no backend rebuild required.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 12a9 9 0 0115.4-6.4M21 12a9 9 0 01-15.4 6.4" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 3v4h-4M6 21v-4h4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const process = [
  { step: "01", title: "Discovery & moodboarding", body: "We learn the brand, the audience, and pull references until a direction feels right, before anything is drawn." },
  { step: "02", title: "Wireframes", body: "Structure and flow first, in low fidelity, so layout decisions get made before styling starts." },
  { step: "03", title: "Visual design", body: "Full-fidelity screens in your brand's color and type, reviewed page by page as we go." },
  { step: "04", title: "Handoff & support", body: "Developer-ready files with a style guide attached, plus support through build and launch." },
]

const faqs = [
  { q: "What's the difference between web design and web development?", a: "Design is how the site looks and how people move through it — layout, color, type, UX. Development is the code that makes it work. We can do either on its own or both together." },
  { q: "Do I get the source files?", a: "Yes. You keep the Figma files and any style guide we produce, whether or not we also build the site." },
  { q: "How many rounds of revisions are included?", a: "Two rounds of feedback are standard on most projects. Larger engagements can include more — we'll scope it up front." },
  { q: "Can you redesign our site without touching the backend?", a: "Often, yes. A visual refresh can sit on top of your existing CMS or codebase without a full rebuild." },
  { q: "Do you design for existing brand guidelines?", a: "Yes — send what you have and we'll design inside it. If there isn't one yet, we can define one as part of the project." },
]

const relatedLinks = [
  { title: "Web Development", href: "/services/web-development" },
  { title: "UI/UX Design", href: "/services/ui-ux-design" },
  { title: "Graphic Designing", href: "/services/graphic-designing" },
  { title: "SEO Optimization", href: "/services/seo-optimization" },
]

/* Hero visual: a tilting browser frame showing a laid-out page next to
   a floating swatch-and-type stack — a design-tool moment distinct
   from the code-editor mockup used on the web-development page, but
   built with the same cursor-tilt physics for family resemblance. */
function DesignCanvasMockup() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ x: 10, y: 12 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: 10 + py * -10, y: 12 + px * 14 })
  }

  function handleLeave() {
    setTilt({ x: 10, y: 12 })
  }

  const swatches = ["#8B2FC9", "#C837AB", "#FF2D95", "#F6D3EC"]

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
        className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 rounded-full opacity-45 blur-3xl"
        style={{
          background: "radial-gradient(circle, #FF2D95, transparent 70%)",
          transform: `translate(${(tilt.y - 12) * 1.3}px, ${(tilt.x - 10) * -1.3}px)`,
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
            <span className="ml-3 text-[11px] font-medium text-neutral-400">homepage — v3</span>
          </div>
          <div className="space-y-3 px-5 py-6">
            <div className="h-16 rounded-lg bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] opacity-90" />
            <div className="h-2.5 w-3/4 rounded-full bg-neutral-200" />
            <div className="h-2.5 w-1/2 rounded-full bg-neutral-100" />
            <div className="flex gap-3 pt-2">
              <div className="h-14 flex-1 rounded-lg bg-neutral-100" />
              <div className="h-14 flex-1 rounded-lg bg-neutral-100" />
              <div className="h-14 flex-1 rounded-lg bg-neutral-100" />
            </div>
          </div>
        </div>

        <div
          className="absolute -right-6 -bottom-6 flex items-center gap-2 rounded-xl border border-black/5 bg-white px-3 py-2.5 shadow-xl shadow-[#6F1F9E]/15"
          style={{ transform: "translateZ(24px)" }}
        >
          {swatches.map((c) => (
            <span key={c} className="h-5 w-5 rounded-full border border-black/5" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function WebDesigningPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="font-sans text-neutral-900">
      <ScrollProgress />

      {/* 1. Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div>
          <p className="text-sm font-medium text-[#C837AB]">Design</p>
          <h1 className="mt-3 font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Web designing, built to be looked at and used.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
            We design websites people trust on sight and know how to use immediately —
            custom layouts, a consistent visual system, and screens developers can build
            from without guesswork.
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

        <DesignCanvasMockup />
      </section>

      {/* 2. Overview */}
      <section className="border-y border-neutral-200 bg-[#FBF7FC] py-20">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-lg leading-relaxed text-neutral-700">
            Design is the first impression and the last word on whether someone stays.
            We design every screen around your brand and your users — not a theme —
            balancing how it looks with how well it actually works, from the first
            wireframe through to files your developers can build from directly.
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
          className="pointer-events-none absolute -left-20 -top-10 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #C837AB, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">How a design project runs</h2>
            <p className="mt-4 max-w-sm text-neutral-300">Structure before style, every time.</p>
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
            Ready for a site that looks as good as it works?
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