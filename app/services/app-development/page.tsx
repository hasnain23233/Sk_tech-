"use client"

import { useRef, useState } from "react"
import { Reveal, TiltCard, MagneticButton, ScrollProgress } from "@/app/components/motion"

/* Assumes the Sora / Inter font variables (--font-display, --font-body)
   are already applied at the root layout, same as the other pages. */

const stats = [
  { value: "iOS · Android", label: "One build, both stores" },
  { value: "8–12 wks", label: "Typical MVP, idea to store" },
  { value: "React Native · Flutter", label: "Cross-platform by default" },
]

const benefits = [
  "One codebase for iOS and Android, unless native performance genuinely needs two",
  "Backend and database sized for launch day, not rebuilt after it",
  "Push notifications, offline mode, and background sync built in where the product needs them",
  "App Store and Google Play submission handled, including the parts nobody warns you about",
  "Code you own outright, with documentation, not locked to us to maintain",
  "Post-launch support for OS updates, bug fixes, and new features",
]

const features = [
  {
    title: "Native iOS & Android",
    desc: "Swift and Kotlin builds when a feature needs the full native platform — camera, sensors, deep OS integration.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="2" width="12" height="20" rx="2.5" stroke="white" strokeWidth="2" />
        <path d="M10 19h4" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Cross-platform apps",
    desc: "React Native or Flutter, one codebase shipping to both stores, for most products that don't need native-only features.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M8 6L2 12l6 6M16 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "MVP development",
    desc: "The smallest real version of the product, built fast enough to get in front of users and learn from them.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Enterprise applications",
    desc: "Internal tools and line-of-business apps built around existing systems, permissions, and real workflows.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="white" strokeWidth="2" />
        <path d="M3 10h18M9 4v6" stroke="white" strokeWidth="2" />
      </svg>
    ),
  },
  {
    title: "Backend & APIs",
    desc: "Node.js or Python services behind the app, sized to handle real traffic and built to add features onto later.",
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
    title: "Deployment & maintenance",
    desc: "Store submission, crash monitoring, and OS-update fixes, so the app keeps working after it ships.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="white" strokeWidth="2" />
        <path d="M12 7v5l3.5 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const process = [
  { step: "01", title: "Discovery & scoping", body: "We define what the app needs to do first, what it can wait on, and what platform choice actually fits the goal." },
  { step: "02", title: "UX & prototyping", body: "Screens and flows mapped and clickable before development starts, so the build follows a tested structure." },
  { step: "03", title: "Development & testing", body: "Sprints with builds you can install and test on a real device throughout, not just at the end." },
  { step: "04", title: "Launch & support", body: "Store submission handled, then monitoring and fixes as real users and OS updates arrive." },
]

const faqs = [
  { q: "Native or cross-platform — which do we need?", a: "Cross-platform (React Native or Flutter) covers most apps well and ships to both stores from one codebase. Native makes sense when a feature needs deep OS or hardware access." },
  { q: "How long does an app take to build?", a: "A focused MVP typically runs 8–12 weeks. Larger apps with multiple user roles or complex backend logic are scoped per project." },
  { q: "Who owns the code once it's built?", a: "You do, outright, with documentation handed over — not locked to us for future changes." },
  { q: "Do you handle App Store and Google Play submission?", a: "Yes, including developer accounts, store listings, and the review process on both sides." },
  { q: "What happens after launch?", a: "We offer ongoing support for OS updates, bug fixes, and new features — on retainer or as one-off work, depending on what you need." },
]

const relatedLinks = [
  { title: "Web Development", href: "/services/web-development" },
  { title: "UI/UX Design", href: "/services/ui-ux-design" },
  { title: "Shopify Development", href: "/services/shopify-development" },
  { title: "SEO Optimization", href: "/services/seo-optimization" },
]

/* Hero visual: a tilting phone frame with an app screen and a
   notification badge — an app-specific moment, built with the same
   cursor-tilt physics as the other service pages' hero mockups. */
function AppScreenMockup() {
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
        className="pointer-events-none absolute -right-14 -bottom-14 h-56 w-56 rounded-full opacity-45 blur-3xl"
        style={{
          background: "radial-gradient(circle, #C837AB, transparent 70%)",
          transform: `translate(${(tilt.y + 10) * -1.2}px, ${(tilt.x - 10) * 1.2}px)`,
          transition: "transform 0.35s ease-out",
        }}
      />

      <div
        className="relative"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.28s ease-out",
        }}
      >
        <div className="h-[300px] w-[164px] overflow-hidden rounded-[26px] border-4 border-[#1B1023]/90 bg-white shadow-2xl shadow-[#6F1F9E]/20">
          <div className="mx-auto mt-1.5 h-1 w-10 rounded-full bg-neutral-200" />
          <div className="space-y-3 px-3.5 pt-4">
            <div className="h-20 rounded-xl bg-gradient-to-br from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] opacity-90" />
            <div className="h-2 w-3/4 rounded-full bg-neutral-200" />
            <div className="h-2 w-1/2 rounded-full bg-neutral-100" />
            <div className="flex gap-2 pt-1">
              <div className="h-10 flex-1 rounded-lg bg-neutral-100" />
              <div className="h-10 flex-1 rounded-lg bg-neutral-100" />
            </div>
            <div className="h-2 w-2/3 rounded-full bg-neutral-100" />
            <div className="h-2 w-5/6 rounded-full bg-neutral-100" />
          </div>
        </div>

        <div
          className="absolute -right-6 -top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xl shadow-[#6F1F9E]/15"
          style={{ transform: "translateZ(24px)" }}
        >
          <span className="relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" stroke="#8B2FC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.7 21a2 2 0 01-3.4 0" stroke="#8B2FC9" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF2D95] text-[9px] font-bold text-white">
              2
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ApplicationDevelopmentPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="font-sans text-neutral-900">
      <ScrollProgress />

      {/* 1. Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div>
          <p className="text-sm font-medium text-[#C837AB]">Development</p>
          <h1 className="mt-3 font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Applications built for real users, on day one.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-neutral-600">
            Custom mobile and web applications for iOS, Android, and beyond — from a
            focused MVP to an enterprise tool, backed by a server that can actually
            handle the traffic you're hoping for.
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

        <AppScreenMockup />
      </section>

      {/* 2. Overview */}
      <section className="border-y border-neutral-200 bg-[#FBF7FC] py-20">
        <Reveal className="mx-auto max-w-3xl px-6 text-center">
          <p className="text-lg leading-relaxed text-neutral-700">
            An app succeeds or fails on the parts a website doesn't have to worry about —
            store approval, offline behavior, notification permissions, and a backend that
            holds up under real usage. We build cross-platform apps with React Native or
            Flutter by default, go fully native when a feature needs it, and stay on
            after launch to keep the thing running.
          </p>
        </Reveal>
      </section>

      {/* 3. Benefits */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[0.9fr_1.6fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">What you get</h2>
            <p className="mt-4 max-w-sm text-neutral-600">
              Standard on every app we build, not sold back as extras.
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
          className="pointer-events-none absolute -left-20 -top-10 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #8B2FC9, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">How a build runs</h2>
            <p className="mt-4 max-w-sm text-neutral-300">Idea to store, in four stages.</p>
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
            Have an app idea worth building properly?
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