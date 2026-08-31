"use client"

import { useEffect, useRef, useState } from "react"
import { Sora, Inter } from "next/font/google"

const sora = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] })
const inter = Inter({ subsets: ["latin"], variable: "--font-body" })

/* ---------------------------------------------------------------- */
/* Content                                                            */
/* ---------------------------------------------------------------- */

const milestones = [
  {
    year: "2011",
    title: "Two people, one client",
    body: "Started in Lahore building websites for a handful of local shops, one project at a time.",
  },
  {
    year: "2014",
    title: "Clients started asking for traffic, not just sites",
    body: "Added SEO and paid search so the websites we built actually had people arriving on them.",
  },
  {
    year: "2017",
    title: "Opened a UK desk",
    body: "Took on our first UK retail client and set up a second desk to work their hours properly.",
  },
  {
    year: "2020",
    title: "Became a full team",
    body: "Design, development, content, and paid media working from the same brief instead of four separate ones.",
  },
  {
    year: "2025",
    title: "300+ projects in, still the same desk",
    body: "Same founders, same two offices, more people — the handoffs we started out avoiding are still gone.",
  },
]

const teams = [
  {
    label: "Build",
    role: "Design and development",
    body: "The people who turn a brief into a site or app that loads fast and holds up after launch. They stay on a project through QA, not just the handoff.",
  },
  {
    label: "Grow",
    role: "SEO and paid media",
    body: "The people who read the analytics every week and adjust spend accordingly, rather than setting a campaign live and checking back at the end of the month.",
  },
  {
    label: "Create",
    role: "Content and design",
    body: "The people writing the pages and designing the graphics that Build ships and Grow promotes — briefed once, not three times.",
  },
]

const principles = [
  {
    title: "We scope before we quote",
    detail: "A fixed price for a defined set of deliverables. If the scope changes mid-project, you see the new number before we start, not after.",
  },
  {
    title: "One lead across every discipline",
    detail: "The same person who agreed your brief is the one your developer and your copywriter both report to — you're not repeating context three times.",
  },
  {
    title: "Reports are numbers, not screenshots",
    detail: "Traffic, leads, and cost per result each month, plus one paragraph on what we're changing next. No dashboard tour required.",
  },
  {
    title: "We stay on after launch",
    detail: "Most of our clients started with a website and stayed on for the marketing — the two teams already know each other's work.",
  },
]

const offices = [
  {
    city: "Lahore",
    country: "Pakistan",
    timeZone: "Asia/Karachi",
    detail: "PAK Arab Society, Gulberg",
    note: "Development and design team",
  },
  {
    city: "Remote desk",
    country: "United Kingdom",
    timeZone: "Europe/London",
    detail: "Working UK hours",
    note: "Client strategy and accounts",
  },
]

/* ---------------------------------------------------------------- */
/* Helpers                                                            */
/* ---------------------------------------------------------------- */

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.unobserve(el)
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView(0.3)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(14px)",
        transition: "opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  )
}

function Counter({ value }: { value: string }) {
  const match = value.match(/^([\d.]+)(.*)$/)
  const numeric = match ? parseFloat(match[1]) : 0
  const suffix = match ? match[2] : ""
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0
  const [ref, inView] = useInView(0.6)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf: number
    let start: number | null = null
    const duration = 1100
    function tick(ts: number) {
      if (start === null) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(eased * numeric)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, numeric])

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}

function MagneticButton({
  children,
  className = "",
  href,
  strength = 14,
}: {
  children: React.ReactNode
  className?: string
  href: string
  strength?: number
}) {
  const ref = useRef<HTMLAnchorElement | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [resting, setResting] = useState(true)

  function handleMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setResting(false)
    setPos({ x: x * strength, y: y * strength })
  }

  function handleLeave() {
    setResting(true)
    setPos({ x: 0, y: 0 })
  }

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: resting ? "transform 0.5s cubic-bezier(0.22,1,0.36,1)" : "transform 0.08s linear",
        display: "inline-block",
      }}
      className={className}
    >
      {children}
    </a>
  )
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement
      const scrollTop = doc.scrollTop || document.body.scrollTop
      const scrollHeight = doc.scrollHeight - doc.clientHeight
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed left-0 top-0 z-50 h-[3px] w-full bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95]"
        style={{ width: `${progress}%`, transition: "width 0.1s linear" }}
      />
    </div>
  )
}

/* Cursor-following glow, scoped to the hero only. This is the hero's
   one interactive gesture — everything else in the section stays flat
   and quiet on purpose. */
function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [pos, setPos] = useState({ x: 50, y: 40 })
  const [active, setActive] = useState(false)

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className="absolute inset-0"
      style={{
        background: `radial-gradient(480px circle at ${pos.x}% ${pos.y}%, rgba(200,55,171,0.14), transparent 70%)`,
        opacity: active ? 1 : 0,
        transition: "opacity 0.4s ease, background 0.05s linear",
      }}
    />
  )
}

function TimezoneClock({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  if (!now) return <span className="tabular-nums">--:--:--</span>

  return (
    <span className="tabular-nums">
      {now.toLocaleTimeString("en-US", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
  )
}

/* ---------------------------------------------------------------- */
/* Page                                                               */
/* ---------------------------------------------------------------- */

export default function AboutPage() {
  const [activeMilestone, setActiveMilestone] = useState(milestones.length - 1)
  const [openTeam, setOpenTeam] = useState(0)
  const [openPrinciple, setOpenPrinciple] = useState<number | null>(null)
  const [activeOffice, setActiveOffice] = useState(0)

  return (
    <div className={`${sora.variable} ${inter.variable} font-sans text-neutral-900`}>
      <ScrollProgress />

      <style jsx global>{`
        @keyframes heroLine {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        .hero-line {
          animation: heroLine 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      {/* 1. Hero — deliberately plain: one line of type, one gesture */}
      <section className="relative overflow-hidden border-b border-neutral-200">
        <CursorGlow />
        <div className="relative mx-auto max-w-3xl px-6 py-32 text-center sm:py-40">
          <p className="hero-line font-display text-sm font-medium text-[#C837AB]" style={{ animationDelay: "0s" }}>
            About SK Techs
          </p>
          <h1
            className="hero-line mt-5 font-display text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl"
            style={{ animationDelay: "0.1s" }}
          >
            Two founders, one desk, since 2011.
          </h1>
          <p className="hero-line mx-auto mt-6 max-w-md text-lg leading-relaxed text-neutral-600" style={{ animationDelay: "0.2s" }}>
            We still run the same way we started: build the thing, then run the
            marketing for it ourselves, so nothing gets lost between agencies.
          </p>
          <a
            href="#story"
            className="hero-line mt-10 inline-flex items-center gap-2 text-sm font-semibold text-neutral-800 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-[#C837AB]"
            style={{ animationDelay: "0.3s" }}
          >
            Read the story
          </a>
        </div>
      </section>

      {/* 2. Timeline — click a year to scrub through it */}
      <section id="story" className="bg-[#FBF7FC] py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">How we got here</h2>
          </Reveal>

          <Reveal className="mt-10">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Company timeline">
              {milestones.map((m, i) => (
                <button
                  key={m.year}
                  role="tab"
                  aria-selected={activeMilestone === i}
                  onClick={() => setActiveMilestone(i)}
                  className="rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200"
                  style={{
                    background: activeMilestone === i ? "#1B1023" : "transparent",
                    color: activeMilestone === i ? "white" : "#57534E",
                    border: activeMilestone === i ? "1px solid #1B1023" : "1px solid #E7E5E4",
                  }}
                >
                  {m.year}
                </button>
              ))}
            </div>

            <div className="relative mt-8 min-h-[140px]">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className="absolute inset-0"
                  style={{
                    opacity: activeMilestone === i ? 1 : 0,
                    transform: activeMilestone === i ? "translateY(0px)" : "translateY(8px)",
                    pointerEvents: activeMilestone === i ? "auto" : "none",
                    transition: "opacity 0.35s ease, transform 0.35s ease",
                  }}
                >
                  <h3 className="font-display text-2xl font-semibold">{m.title}</h3>
                  <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-neutral-600">{m.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Teams — click to expand, one open at a time */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">Who does the work</h2>
            <p className="mt-3 max-w-md text-neutral-600">
              Three groups, one project lead — nobody hears about your brief secondhand.
            </p>
          </Reveal>

          <div className="mt-10 divide-y divide-neutral-200 border-t border-neutral-200">
            {teams.map((t, i) => {
              const open = openTeam === i
              return (
                <div key={t.label}>
                  <button
                    onClick={() => setOpenTeam(open ? -1 : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={open}
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="font-display text-2xl font-semibold" style={{ color: open ? "#C837AB" : "#171412" }}>
                        {t.label}
                      </span>
                      <span className="text-sm text-neutral-500">{t.role}</span>
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 12 12"
                      fill="none"
                      className="shrink-0"
                      style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
                    >
                      <path d="M6 1v10M1 6h10" stroke="#171412" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: open ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.35s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-lg pb-6 text-[15px] leading-relaxed text-neutral-600">{t.body}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Principles — dark panel, click a card to see why it matters */}
      <section className="bg-[#1B1023] py-24 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">How we work with clients</h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {principles.map((p, i) => {
              const open = openPrinciple === i
              return (
                <button
                  key={p.title}
                  onClick={() => setOpenPrinciple(open ? null : i)}
                  className="rounded-2xl border p-6 text-left transition-colors duration-200"
                  style={{
                    borderColor: open ? "#C837AB" : "rgba(255,255,255,0.14)",
                    background: open ? "rgba(200,55,171,0.08)" : "transparent",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                    <span
                      className="mt-1 shrink-0 text-xl leading-none text-[#C837AB]"
                      style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.3s ease", display: "inline-block" }}
                    >
                      +
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: open ? "1fr" : "0fr",
                      transition: "grid-template-rows 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-3 text-[15px] leading-relaxed text-neutral-300">{p.detail}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. Offices — switch between desks, clock ticks live */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">Where we work</h2>
          </Reveal>

          <Reveal className="mt-10">
            <div className="flex gap-2">
              {offices.map((o, i) => (
                <button
                  key={o.city}
                  onClick={() => setActiveOffice(i)}
                  className="flex-1 rounded-xl border px-5 py-4 text-left transition-colors duration-200"
                  style={{
                    borderColor: activeOffice === i ? "#8B2FC9" : "#E7E5E4",
                    background: activeOffice === i ? "#FBF7FC" : "white",
                  }}
                >
                  <p className="font-display text-base font-semibold">{o.city}</p>
                  <p className="text-sm text-neutral-500">{o.country}</p>
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-baseline justify-between rounded-xl border border-neutral-200 p-6">
              <div>
                <p className="text-sm text-neutral-500">{offices[activeOffice].detail}</p>
                <p className="mt-1 text-sm font-medium text-neutral-800">{offices[activeOffice].note}</p>
              </div>
              <p className="font-display text-2xl font-semibold text-[#C837AB]">
                <TimezoneClock timeZone={offices[activeOffice].timeZone} />
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. Final CTA */}
      <section className="bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Want to work with the same desk twice?
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