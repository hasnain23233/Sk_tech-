"use client"

import { useEffect, useRef, useState } from "react"
import { Sora, Inter } from "next/font/google"

const sora = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] })
const inter = Inter({ subsets: ["latin"], variable: "--font-body" })

const industries = [
  "E-commerce",
  "Healthcare",
  "Real Estate",
  "Hospitality",
  "Education",
  "Professional Services",
  "Startups",
  "Retail",
]

const serviceGroups = [
  {
    label: "Build",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h16M4 12h10M4 18h16" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    items: ["Web Development", "Web Designing", "Shopify Development", "Application Development"],
  },
  {
    label: "Grow",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 17l5-5 4 4 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    items: ["SEO & Content Marketing", "Social Media Marketing", "Pay-Per-Click Advertising"],
  },
  {
    label: "Create",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l2.4 5.5L20 10l-4.5 3.8L16.9 20 12 16.8 7.1 20l1.4-6.2L4 10l5.6-1.5L12 3z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
    items: ["Graphic Designing", "Content Writing"],
  },
]

const process = [
  { step: "01", title: "Discover", body: "We learn your business, your customers, and what's actually stopping growth right now." },
  { step: "02", title: "Design & build", body: "Websites, apps, and creative that look considered and load fast, built on solid foundations." },
  { step: "03", title: "Launch", body: "SEO, social, and paid campaigns go live with tracking in place from day one." },
  { step: "04", title: "Grow", body: "We read the numbers monthly and adjust the plan, so spend keeps turning into results." },
]

const caseStudies = [
  {
    client: "Boutique fashion retailer, UK",
    result: "3.2x",
    metric: "organic traffic in 6 months",
    detail: "Rebuilt their Shopify store and rebuilt SEO from the ground up around actual buyer intent.",
  },
  {
    client: "Healthcare clinic network, Pakistan",
    result: "4x",
    metric: "qualified leads from paid search",
    detail: "Restructured Google Ads campaigns and landing pages around each clinic's specialty.",
  },
  {
    client: "B2B SaaS startup, UK",
    result: "58%",
    metric: "lower cost per lead",
    detail: "Replaced a scattershot social strategy with a focused content and PPC funnel.",
  },
]

const testimonials = [
  {
    quote: "They rebuilt our site in six weeks and our bounce rate dropped almost immediately. First agency that actually explained what they were doing.",
    author: "Operations Lead, retail client",
  },
  {
    quote: "We'd worked with three agencies before SK Techs. This is the first one where design and marketing weren't fighting each other.",
    author: "Founder, hospitality client",
  },
  {
    quote: "Monthly reports are in plain language. I can tell my board what happened without translating anything.",
    author: "Marketing Manager, healthcare client",
  },
]

const differentiators = [
  "One team across design, development, and marketing — no handoffs between agencies.",
  "Every campaign is reported in plain numbers: traffic, leads, cost per result.",
  "Direct access to the people doing the work, not just an account manager.",
  "15 years running the same playbook for businesses in Pakistan, the UK, and beyond.",
]

const faqs = [
  {
    q: "How long does a typical website project take?",
    a: "A standard business website runs 3–5 weeks from kickoff to launch. Larger builds with custom features or e-commerce typically take 6–10 weeks, depending on scope.",
  },
  {
    q: "Do you work with businesses outside Pakistan and the UK?",
    a: "Yes. Most of our work is remote and we run projects for clients across time zones, with weekly check-ins scheduled around your hours.",
  },
  {
    q: "Can you just run marketing for a site you didn't build?",
    a: "Often, yes. We'll audit the existing site first so campaigns aren't sending traffic to pages that won't convert.",
  },
  {
    q: "How do you report on results?",
    a: "You get a monthly report in plain language: traffic, leads, cost per result, and what we're changing next. No jargon-only dashboards.",
  },
  {
    q: "What does a project cost?",
    a: "It depends on scope — a landing page and a multi-market e-commerce build aren't priced the same way. Tell us what you need and we'll send a fixed quote within two business days.",
  },
]

/* ---------------------------------------------------------------- */
/* Small interaction helpers — scroll reveal, count-up, 3D tilt,     */
/* magnetic buttons, scroll progress. No extra dependencies.         */
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

function Reveal({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const [ref, inView] = useInView(0.3)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0px)" : "translateY(18px)",
        transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)",
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
    const duration = 1300
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

function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [style, setStyle] = useState<React.CSSProperties>({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
    transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
  })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setStyle({
      transform: `perspective(900px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateZ(6px)`,
      transition: "transform 0.12s ease-out",
    })
  }

  function handleLeave() {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
      transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transformStyle: "preserve-3d", willChange: "transform", ...style }}
      className={className}
    >
      {children}
    </div>
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

/* A genuine 3D isometric bar chart, built from stacked CSS faces
   rather than a flat SVG, that tilts toward the cursor. */
function Hero3DChart() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ x: 18, y: -18 })

  const bars = [
    { h: 62, shade: 0.5 },
    { h: 92, shade: 0.6 },
    { h: 78, shade: 0.68 },
    { h: 124, shade: 0.8 },
    { h: 158, shade: 1 },
  ]

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: 18 + py * -14, y: -18 + px * 20 })
  }

  function handleLeave() {
    setTilt({ x: 18, y: -18 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative flex h-[380px] items-end justify-center overflow-hidden rounded-3xl bg-[#FBF7FC] px-10 pb-14 pt-16"
      style={{ perspective: "1100px" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 rounded-full opacity-50 blur-3xl"
        style={{
          background: "radial-gradient(circle, #FF2D95, transparent 70%)",
          transform: `translate(${(tilt.y + 18) * 1.4}px, ${(tilt.x - 18) * -1.4}px)`,
          transition: "transform 0.35s ease-out",
        }}
      />
      <div
        className="flex items-end gap-4"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: "transform 0.28s ease-out",
        }}
      >
        {bars.map((b, i) => (
          <div
            key={i}
            className="chart-bar"
            style={{
              width: 32,
              height: b.h,
              transformStyle: "preserve-3d",
              position: "relative",
              animationDelay: `${i * 0.18}s`,
            }}
          >
            <div
              className="absolute inset-0 rounded-[3px]"
              style={{
                background: `linear-gradient(180deg, #FF2D95, #C837AB 55%, #8B2FC9)`,
                opacity: 0.45 + b.shade * 0.4,
              }}
            />
            <div
              className="absolute left-0 top-0 h-[10px] w-full"
              style={{
                background: "#F6D3EC",
                transform: "rotateX(90deg) translateZ(5px)",
                transformOrigin: "top",
              }}
            />
            <div
              className="absolute right-0 top-0 h-full w-[10px]"
              style={{
                background: "#6F1F9E",
                transform: "rotateY(90deg) translateZ(5px)",
                transformOrigin: "right",
                opacity: 0.85,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className={`${sora.variable} ${inter.variable} font-sans text-neutral-900`}>
      <ScrollProgress />

      <style jsx global>{`
        @keyframes chartFloat {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-7px);
          }
        }
        .chart-bar {
          animation: chartFloat 3.4s ease-in-out infinite;
        }
        @keyframes heroLine {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0px);
          }
        }
        .hero-line {
          animation: heroLine 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes orbDrift {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          50% {
            transform: translate(30px, -20px) scale(1.08);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .orb {
          animation: orbDrift 12s ease-in-out infinite;
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

      {/* 1. Hero */}
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 pb-20 pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
        <div>
          <h1 className="font-display text-[2.75rem] font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            <span className="hero-line block" style={{ animationDelay: "0s" }}>
              Digital growth,
            </span>
            <span className="hero-line block" style={{ animationDelay: "0.12s" }}>
              built and measured.
            </span>
          </h1>
          <p className="hero-line mt-6 max-w-md text-lg leading-relaxed text-neutral-600" style={{ animationDelay: "0.24s" }}>
            SK Techs designs your website, runs the campaigns that bring people to it, and
            reports back in numbers you can actually use. Since 2011.
          </p>
          <div className="hero-line mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.36s" }}>
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

          <div
            className="hero-line mt-16 grid max-w-md grid-cols-3 gap-6 border-t border-neutral-200 pt-8"
            style={{ animationDelay: "0.48s" }}
          >
            <div>
              <p className="font-display text-3xl font-semibold">
                <Counter value="15+" />
              </p>
              <p className="mt-1 text-sm text-neutral-500">Years running</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold">
                <Counter value="9" />
              </p>
              <p className="mt-1 text-sm text-neutral-500">Services, one team</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold">
                <Counter value="2" />
              </p>
              <p className="mt-1 text-sm text-neutral-500">Countries, one desk away</p>
            </div>
          </div>
        </div>

        <Hero3DChart />
      </section>

      {/* 2. Industries strip */}
      <section className="border-y border-neutral-200 bg-[#FBF7FC] py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-6 text-sm font-medium text-neutral-500">
          {industries.map((ind) => (
            <span key={ind} className="transition-colors duration-200 hover:text-[#C837AB]">
              {ind}
            </span>
          ))}
        </div>
      </section>

      {/* 3. Services */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-[0.9fr_1.6fr]">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">What we do</h2>
            <p className="mt-4 max-w-sm text-neutral-600">
              Most agencies do one thing well. We keep design, development, and marketing
              under one roof so they actually work together instead of waiting on each other.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3" style={{ perspective: "1200px" }}>
            {serviceGroups.map((group) => (
              <TiltCard
                key={group.label}
                className="rounded-2xl border border-neutral-200 p-6 hover:shadow-xl hover:shadow-neutral-900/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B2FC9] to-[#FF2D95]">
                  {group.icon}
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{group.label}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="text-[15px] leading-snug text-neutral-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Process */}
      <section className="bg-[#FBF7FC] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">How a project runs</h2>
          </Reveal>
          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((p) => (
              <div key={p.step} className="group">
                <span className="font-display text-sm font-semibold text-[#C837AB] transition-transform duration-300 group-hover:translate-x-1 inline-block">
                  {p.step}
                </span>
                <h3 className="mt-3 font-display text-xl font-semibold">{p.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-600">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Case studies */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">Recent results</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3" style={{ perspective: "1200px" }}>
            {caseStudies.map((c) => (
              <TiltCard key={c.client} className="rounded-2xl border border-neutral-200 p-7 hover:shadow-xl hover:shadow-neutral-900/10">
                <p className="font-display text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#8B2FC9] to-[#FF2D95]">
                  <Counter value={c.result} />
                </p>
                <p className="mt-1 text-sm font-medium text-neutral-500">{c.metric}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-neutral-600">{c.detail}</p>
                <p className="mt-5 border-t border-neutral-100 pt-4 text-sm font-medium text-neutral-400">{c.client}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Why us — dark panel */}
      <section className="relative overflow-hidden bg-[#1B1023] py-24 text-white">
        <div
          aria-hidden
          className="orb pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #C837AB, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="orb pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #FF2D95, transparent 70%)", animationDelay: "3s" }}
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">Why businesses stay with us</h2>
            <p className="mt-4 max-w-sm text-neutral-300">
              We've been doing this since 2011, mostly for businesses who tried a few
              agencies before us.
            </p>
          </Reveal>
          <ul className="space-y-6">
            {differentiators.map((d) => (
              <li key={d} className="group flex gap-4 border-b border-white/10 pb-6 last:border-0">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gradient-to-r from-[#C837AB] to-[#FF2D95] transition-transform duration-300 group-hover:scale-150" />
                <p className="text-[15px] leading-relaxed text-neutral-200">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="bg-[#FBF7FC] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold">What clients say</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3" style={{ perspective: "1200px" }}>
            {testimonials.map((t) => (
              <TiltCard key={t.author} className="rounded-2xl bg-white p-7 shadow-sm shadow-neutral-900/5 hover:shadow-xl hover:shadow-neutral-900/10">
                <p className="text-[15px] leading-relaxed text-neutral-700">"{t.quote}"</p>
                <p className="mt-5 text-sm font-medium text-neutral-400">{t.author}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Contact strip */}
      <section className="border-y border-neutral-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:grid-cols-3">
          <div>
            <p className="font-display text-sm font-semibold">Office</p>
            <p className="mt-2 text-[15px] text-neutral-600">
              PAK Arab Society, Gulberg
              <br />
              Lahore, Pakistan
            </p>
          </div>
          <div>
            <p className="font-display text-sm font-semibold">Call us</p>
            <p className="mt-2 text-[15px] text-neutral-600">
              Pakistan: +92 336 8007788
              <br />
              UK: +44 7708 568160
            </p>
          </div>
          <div>
            <p className="font-display text-sm font-semibold">Email</p>
            <p className="mt-2 text-[15px] text-neutral-600">info@sktechs.com</p>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
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

      {/* 10. Final CTA */}
      <section className="bg-gradient-to-r from-[#8B2FC9] via-[#C837AB] to-[#FF2D95] py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
          <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            Ready to build your brand's voice?
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