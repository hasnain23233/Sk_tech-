"use client"

import { useRef, useState } from "react"
import { Reveal, TiltCard, MagneticButton, ScrollProgress } from "@/app/components/motion"

/* This page assumes the Sora / Inter font variables (--font-display,
   --font-body) are already applied at the root layout, the same way
   the homepage sets them — so no font import is repeated here. */

const stats = [
  { value: "1–2 wks", label: "Landing page, start to launch" },
  { value: "3–6 wks", label: "Full business website" },
  { value: "Next.js · Node", label: "Core stack, adapted to yours" },
]

const benefits = [
  "Lightning-fast load times, tuned against Core Web Vitals",
  "Mobile-first layouts that hold up from a small phone to a 4K display",
  "SEO-friendly structure built in from the first commit, not bolted on after",
  "Infrastructure sized to handle a traffic spike without falling over",
  "Clean, documented code that's yours to keep and extend",
  "Support and maintenance available after launch, not just during it",
]

const features = [
  {
    title: "Custom web apps",
    desc: "React and Next.js applications built to your spec — no page builder, no template ceiling.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M8 6L2 12l6 6M16 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Responsive design",
    desc: "Layouts checked screen by screen so nothing breaks between a phone and a widescreen monitor.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="13" height="9" rx="1.5" stroke="white" strokeWidth="2" />
        <rect x="18" y="4" width="3" height="16" rx="1" stroke="white" strokeWidth="2" />
        <path d="M3 17h13" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "E-commerce",
    desc: "Shopify, WooCommerce, or a fully custom store, wired up with payments, inventory, and checkout flow.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h2l2 11h10l2-8H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="1.4" fill="white" />
        <circle cx="16" cy="20" r="1.4" fill="white" />
      </svg>
    ),
  },
  {
    title: "Backend & APIs",
    desc: "Node.js or Python services behind REST or GraphQL, backed by a database that fits the data.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="6" rx="1.5" stroke="white" strokeWidth="2" />
        <rect x="3" y="14" width="18" height="6" rx="1.5" stroke="white" strokeWidth="2" />
        <circle cx="7" cy="7" r="0.8" fill="white" />
        <circle cx="7" cy="17" r="0.8" fill="white" />
      </svg>
    ),
  },
  {
    title: "Integrations",
    desc: "Your CRM, payment processor, analytics, and any third-party API, connected without duct tape.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="7" cy="7" r="3" stroke="white" strokeWidth="2" />
        <circle cx="17" cy="17" r="3" stroke="white" strokeWidth="2" />
        <path d="M9.5 9.5l5 5" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Performance tuning",
    desc: "Speed audits, image optimization, caching, and a CDN, so the site stays fast as it grows.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="white" strokeWidth="2" />
        <path d="M12 7v5l3.5 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const process = [
  { step: "01", title: "Requirements & planning", body: "We map goals, user flows, and technical requirements before a line of code gets written." },
  { step: "02", title: "Design & prototyping", body: "Wireframes, then high-fidelity mockups, reviewed with you before development starts." },
  { step: "03", title: "Development & testing", body: "Two-week sprints, continuous QA, and your input built into the schedule, not squeezed in at the end." },
  { step: "04", title: "Launch & support", body: "We handle deployment and DNS, then stay on for post-launch fixes and iteration." },
]

const faqs = [
  { q: "How long does a website take to build?", a: "A landing page takes 1–2 weeks. A full business website typically takes 3–6 weeks. Complex web apps are scoped per project." },
  { q: "Do you work with existing websites?", a: "Yes — full redesigns, speed optimization, feature additions, and bug fixes on codebases we didn't originally build." },
  { q: "What tech stack do you use?", a: "Mainly Next.js, React, Tailwind CSS, Node.js, and PostgreSQL or MongoDB. We adapt to your existing stack where one already exists." },
  { q: "Will I be able to edit my website after launch?", a: "Yes. We build in a CMS like Sanity or Contentful, or train your team to manage content independently." },
]

const relatedLinks = [
  { title: "Python Development", href: "/services/python-development" },
  { title: "UI/UX Design", href: "/services/ui-ux-design" },
  { title: "SEO Optimization", href: "/services/seo-optimization" },
  { title: "AI Automation", href: "/services/ai-automation" },
]

/* Hero visual: a tilting editor window with a typing code line and a
   deploy badge — specific to a web-development page, built with the
   same cursor-tilt physics as the homepage's chart so the two hero
   moments feel like siblings without being identical. */
function EditorMockup() {
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
    { w: "72%", tone: 1 },
    { w: "46%", tone: 0.6 },
    { w: "84%", tone: 0.8 },
    { w: "58%", tone: 0.5 },
    { w: "38%", tone: 0.9 },
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
        className="pointer-events-none absolute -left-14 -bottom-14 h-56 w-56 rounded-full opacity-50 blur-3xl"
        style={{
          background: "radial-gradient(circle, #8B2FC9, transparent 70%)",
          transform: `translate(${(tilt.y + 10) * -1.2}px, ${(tilt.x - 10) * 1.2}px)`,
          transition: "transform 0.35s ease-out",
        }}
      />
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-black/5 bg-white shadow-2xl shadow-[#6F1F9E]/15"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.28s ease-out",
        }}
      >
        <div className="flex items-center gap-1.5 border-b border-neutral-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF2D95]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#C837AB]/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#8B2FC9]/40" />
          <span className="ml-3 text-[11px] font-medium text-neutral-400">site.tsx</span>
        </div>
        <div className="space-y-3 px-5 py-6">
          {lines.map((l, i) => (
            <div key={i} className="h-2.5 rounded-full bg-neutral-100" style={{ width: "100%" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: l.w,
                  background: `linear-gradient(90deg, #8B2FC9, #FF2D95)`,
                  opacity: 0.25 + l.tone * 0.35,
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 px-5 py-3">
          <span className="text-[11px] font-medium text-neutral-400">build passing</span>
          <span className="rounded-full bg-gradient-to-r from-[#8B2FC9] to-[#FF2D95] px-3 py-1 text-[11px] font-semibold text-white">
            deployed
          </span>
        </div>
      </div>
    </div>
  )
}

export default function WebDevelopmentPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="font-sans text-neutral-900">
      <ScrollProgress />

      {/* 1. Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div>
          <p className="text-sm font-medium text-[#C837AB]">Development</p>
          <h1 className="mt-3 font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Web development, fast, modern & scalable.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
            We engineer high-performance websites and web applications with modern
            technologies, built to convert visitors, scale with your business, and stand
            out from the competition.
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

        <EditorMockup />
      </section>

      {/* 2. Overview */}
      <section className="border-y border-neutral-200 bg-[#FBF7FC] py-20">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-lg leading-relaxed text-neutral-700">
            Your website is your most powerful sales tool. We build custom sites and web
            applications using Next.js, React, and modern backend technologies — fast,
            accessible, and built to grow with you. From landing pages to complex
            platforms, nothing here comes from a template; every project is custom-crafted.
          </p>
        </Reveal>
      </section>

      {/* 3. Benefits */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[0.9fr_1.6fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">What you get</h2>
            <p className="mt-4 max-w-sm text-neutral-600">
              None of this is an add-on. It's what's built in by default on every site we ship.
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
            <h2 className="font-display text-3xl font-semibold">What we build</h2>
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
            <h2 className="font-display text-3xl font-semibold">How a build runs</h2>
            <p className="mt-4 max-w-sm text-neutral-300">Four stages, the same order, every time.</p>
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
            Ready to build a site that actually converts?
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