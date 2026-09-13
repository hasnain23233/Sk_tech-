"use client"

import React, { useEffect, useRef, useState, ReactNode } from "react"
import Link from "next/link"
import { Bricolage_Grotesque, Manrope } from "next/font/google"
import { FaArrowRight, FaBullseye, FaChartLine } from "react-icons/fa"

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] })
const body = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700", "800"] })

/* ─────────────────────────────────────────
   Brand tokens — same system as the home / portfolio / contact / content-writing pages
   purple #8B2FC9   pink #FF2D95   ink #1B1023   paper #FBF7FC   muted #6b6560
───────────────────────────────────────── */
const GRAD = "linear-gradient(135deg,#8B2FC9,#FF2D95)"
const GRAD_SOFT = "linear-gradient(135deg,rgba(139,47,201,0.12),rgba(255,45,149,0.12))"
const DISPLAY = "var(--font-display)"

/* ─────────────────────────────────────────
   Shared motion primitives (ported from the other pages, kept local
   so this page matches the content-writing page exactly)
───────────────────────────────────────── */
function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.12) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
      className={className}
    >
      {children}
    </div>
  )
}

function useMagnetic(strength = 0.25) {
  const ref = useRef<HTMLAnchorElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left - r.width / 2) * strength
    const y = (e.clientY - r.top - r.height / 2) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = "translate(0,0)" }
  return { ref, onMove, onLeave }
}

function MagneticLink({ href, children, variant = "solid" }: { href: string; children: ReactNode; variant?: "solid" | "outline" | "ghost" | "onDark" }) {
  const { ref, onMove, onLeave } = useMagnetic(0.25)
  const styles: Record<string, React.CSSProperties> = {
    solid: { background: GRAD, color: "#fff", boxShadow: "0 10px 30px rgba(139,47,201,0.35)" },
    outline: { background: "rgba(139,47,201,0.05)", border: "1px solid rgba(139,47,201,0.25)", color: "#8B2FC9" },
    ghost: { color: "#1B1023", border: "1px solid rgba(139,47,201,0.18)" },
    onDark: { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff" },
  }
  return (
    <Link
      href={href}
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-flex items-center justify-center gap-2 font-bold text-sm px-8 py-4 rounded-xl"
      style={{ ...styles[variant], transition: "transform 0.15s ease-out", fontFamily: DISPLAY }}
    >
      {children}
    </Link>
  )
}

function GradWord({ children }: { children: ReactNode }) {
  return <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{children}</span>
}

function SectionMark({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: GRAD }} />
      <span className="text-[14px] font-semibold" style={{ color: "#8B2FC9", fontFamily: DISPLAY }}>{children}</span>
    </div>
  )
}

/* Thin gradient bar pinned to the top of the viewport, filling with scroll depth. */
function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = h.scrollTop
      const max = h.scrollHeight - h.clientHeight
      setPct(max > 0 ? (scrolled / max) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    onScroll()
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[60]" style={{ background: "rgba(139,47,201,0.08)" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: GRAD, transition: "width 0.1s linear" }} />
    </div>
  )
}

/* Subtle cursor-tilt wrapper used for the feature cards. */
function TiltCard({ children, className = "", style = {} }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateY(-2px)`
  }
  const onLeave = () => { if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0) rotateX(0) translateY(0)" }
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={className} style={{ transition: "transform 0.2s ease-out, box-shadow 0.2s ease-out", willChange: "transform", ...style }}>
      {children}
    </div>
  )
}

const pageCSS = `
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
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
  { num: "01", title: "Audit", desc: "We review current accounts, spend history, and conversion tracking, and find out where budget is actually going." },
  { num: "02", title: "Strategy & structure", desc: "Campaigns rebuilt or launched around real buyer intent, with budget mapped to what's winnable first." },
  { num: "03", title: "Launch & testing", desc: "Ads go live, copy and creative are tested against each other, and bids get tuned against early data." },
  { num: "04", title: "Optimize & report", desc: "Monthly numbers reviewed together, and spend shifted toward what's actually producing leads." },
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

/* ─────────────────────────────────────────
   Hero visual — a tilting search-results mockup with an "Ad" badge on the
   top results, set inside the same layered-composition frame used by the
   content-writing / SEO / portfolio / contact heroes.
───────────────────────────────────────── */
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
  function handleLeave() { setTilt({ x: 10, y: -10 }) }

  const results = [{ ad: true }, { ad: true }, { ad: false }]

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className="relative flex h-full items-center justify-center" style={{ perspective: "1100px" }}>
      <div
        className="relative w-full max-w-sm"
        style={{ transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 0.28s ease-out" }}
      >
        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 30px 70px rgba(27,16,35,0.22)", border: "1px solid rgba(139,47,201,0.15)" }}>
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
                    <span className="rounded-[4px] px-1.5 py-[1px] text-[9px] font-semibold" style={{ background: "rgba(139,47,201,0.1)", color: "#8B2FC9" }}>
                      Ad
                    </span>
                  )}
                  <div className="h-2 w-2/5 rounded-full" style={{ background: r.ad ? "#8B2FC9" : "#d4d4d4" }} />
                </div>
                <div className="mt-2 h-1.5 w-4/5 rounded-full bg-neutral-100" />
                <div className="mt-1.5 h-1.5 w-3/5 rounded-full bg-neutral-100" />
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute -left-6 -bottom-6 flex items-center gap-2 rounded-xl bg-white px-3 py-2"
          style={{ transform: "translateZ(24px)", boxShadow: "0 14px 30px rgba(111,31,158,0.2)" }}
        >
          <FaBullseye size={13} style={{ color: "#8B2FC9" }} />
          <span className="text-[11px] font-semibold text-neutral-700">Bid managed weekly</span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Hero — same layered composition language as the other pages, built around
   the ad-auction mockup plus a real photo card for a more grounded, human feel
───────────────────────────────────────── */
function Hero({ visible }: { visible: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = sectionRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative pt-28 md:pt-36 pb-20 overflow-hidden"
      style={{ ["--mx" as string]: "15%", ["--my" as string]: "10%" }}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-[background] duration-300"
        style={{
          backgroundImage:
            "radial-gradient(650px circle at var(--mx) var(--my),rgba(139,47,201,0.13) 0%,transparent 60%),radial-gradient(ellipse 55% 45% at 88% 15%,rgba(255,45,149,0.08) 0%,transparent 55%)",
        }}
      />

      <div className="relative z-10 w-11/12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
        <div>
          <div
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
            className="inline-flex items-center gap-2 mb-7"
          >
            <span className="inline-flex items-center gap-2" style={{ color: "#8B2FC9", background: "rgba(139,47,201,0.08)", border: "1px solid rgba(139,47,201,0.25)", borderRadius: 999, padding: "8px 16px", fontFamily: DISPLAY, fontWeight: 600, fontSize: 13 }}>
              <FaBullseye size={11} /> Paid campaigns, run and reported on
            </span>
          </div>

          <h1
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", color: "#1B1023", fontFamily: DISPLAY }}
            className="text-4xl sm:text-5xl md:text-[58px] font-bold leading-[1.05] tracking-tight mb-7"
          >
            Paid search that <GradWord>pays for itself.</GradWord>
          </h1>

          <p
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", color: "#6b6560" }}
            className="text-base md:text-lg leading-relaxed mb-10 max-w-xl"
          >
            Campaigns built around cost per lead and return on spend, bids managed by a person watching the auction, and landing pages that match what the ad promised.
          </p>

          <div
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s" }}
            className="flex flex-wrap gap-4 mb-14"
          >
            <MagneticLink href="/contact" variant="solid">Start a project <FaArrowRight size={12} /></MagneticLink>
            <MagneticLink href="/portfolio" variant="outline">See our work</MagneticLink>
          </div>

          <div
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s", borderTop: "1px solid rgba(139,47,201,0.14)" }}
            className="grid grid-cols-3 gap-6 max-w-lg pt-8"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-bold text-lg sm:text-xl" style={{ color: "#1B1023", fontFamily: DISPLAY }}>{s.value}</p>
                <p className="mt-1 text-sm" style={{ color: "#6b6560" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Layered composition — ad-auction mockup plus a real photo card, mirroring
            the home/portfolio/contact/content-writing hero pattern */}
        <div
          className="relative hidden lg:block h-[440px]"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s" }}
        >
          <div className="absolute inset-0 rounded-[28px]" style={{ background: "#FBF7FC" }} />
          <AdAuctionMockup />

          {/* floating photo card — a real image, not another mockup */}
          <div
            className="absolute right-0 top-2 rounded-2xl overflow-hidden w-40"
            style={{ background: "#fff", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80"
              alt="Analyst reviewing ad campaign performance"
              className="w-full h-24 object-cover"
              loading="lazy"
            />
            <div className="px-3 py-2.5">
              <p className="text-[11px] font-bold" style={{ color: "#1B1023" }}>Bids reviewed</p>
              <p className="text-[10px]" style={{ color: "#6b6560" }}>Every week, by a person</p>
            </div>
          </div>

          {/* floating ROAS card */}
          <div
            className="absolute left-2 bottom-4 rounded-2xl px-5 py-4 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GRAD, color: "#fff" }}>
              <FaChartLine size={13} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: "#1B1023", fontFamily: DISPLAY }}>ROAS 4.2x</p>
              <p className="text-[11px] font-medium" style={{ color: "#6b6560" }}>tracked, not estimated</p>
            </div>
          </div>

          <div className="absolute -z-10 -bottom-10 -right-10 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(139,47,201,0.16) 0%,transparent 70%)" }} />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   FAQ item — same accordion pattern used across the other pages
───────────────────────────────────────── */
function FAQItem({ item, isOpen, onToggle }: { item: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(139,47,201,0.12)" }}>
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen}>
        <span className="font-bold text-[17px]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>{item.q}</span>
        <span
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: isOpen ? GRAD : "rgba(139,47,201,0.08)", color: isOpen ? "#fff" : "#8B2FC9", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease, background 0.3s ease, color 0.3s ease" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
        <div className="overflow-hidden">
          <p className="pb-6 pr-10 text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>{item.a}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function PayPerClickPage() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t) }, [])

  return (
    <main
      className={`${display.variable} ${body.variable} font-sans min-h-screen overflow-x-hidden`}
      style={{ background: "linear-gradient(160deg,#ffffff 0%,#FBF7FC 50%,#ffffff 100%)", fontFamily: "var(--font-body)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: pageCSS }} />
      <ScrollProgress />

      <Hero visible={heroVisible} />

      {/* OVERVIEW — two-column section with a real photo */}
      <section className="py-20" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <Reveal>
            <div className="rounded-[24px] overflow-hidden" style={{ boxShadow: "0 20px 45px rgba(27,16,35,0.14)" }}>
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                alt="Marketing team reviewing campaign performance on a dashboard"
                className="w-full h-[280px] object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <SectionMark>Why it works</SectionMark>
            <p className="text-lg leading-relaxed" style={{ color: "#1B1023" }}>
              PPC fails when accounts run on autopilot or a click lands on a page that has nothing to do with the ad. We start from a target cost per lead, build campaigns and landing pages around real buyer intent, and check bids against the auction every week instead of setting them once and walking away. It&apos;s faster to switch on than SEO, and it stops the moment you stop paying — the two work best run together.
            </p>
          </Reveal>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.6fr]">
          <Reveal>
            <SectionMark>What you get</SectionMark>
            <h2 className="text-3xl md:text-[38px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>Standard on every account we run.</h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>Not billed as extras.</p>
          </Reveal>
          <Reveal delay={80}>
            <ul className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              {benefits.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#FF2D95" }} />
                  <p className="text-[15px] leading-relaxed" style={{ color: "#1B1023" }}>{b}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-12 max-w-xl">
            <SectionMark>What we run</SectionMark>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>Six parts of paid search, one team.</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 40}>
                <TiltCard className="rounded-2xl p-7 h-full" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 10px 26px rgba(27,16,35,0.05)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: GRAD }}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-[17px] mb-2" style={{ color: "#1B1023", fontFamily: DISPLAY }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{f.desc}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — dark section, same numbered pattern as the other pages */}
      <section className="relative overflow-hidden py-24" style={{ background: "#1B1023" }}>
        <div aria-hidden className="pointer-events-none absolute -left-20 -top-10 h-72 w-72 rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(circle,#8B2FC9,transparent 70%)" }} />
        <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle,#FF2D95,transparent 70%)" }} />
        <div className="relative w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-14 max-w-sm">
            <p className="text-sm font-semibold mb-4" style={{ color: "#FF87BE", fontFamily: DISPLAY }}>How we work</p>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1] text-white" style={{ fontFamily: DISPLAY }}>How an account gets run.</h2>
            <p className="mt-4" style={{ color: "rgba(255,255,255,0.6)" }}>Structure first, spend follows the data.</p>
          </Reveal>

          <Reveal delay={80}>
            <div className="relative">
              <div className="hidden lg:block absolute top-[26px] left-[12%] right-[12%] h-px" style={{ background: "linear-gradient(90deg,#8B2FC9,#FF2D95)" }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {process.map((p) => (
                  <div key={p.num} className="relative">
                    <span className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold mb-4" style={{ background: GRAD, color: "#fff", fontFamily: DISPLAY }}>{p.num}</span>
                    <h3 className="font-bold text-[18px] text-white mb-2" style={{ fontFamily: DISPLAY }}>{p.title}</h3>
                    <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-2xl mx-auto">
          <Reveal className="mb-8">
            <SectionMark>Questions, answered</SectionMark>
            <h2 className="text-3xl md:text-[38px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>Questions, answered.</h2>
          </Reveal>
          <div style={{ borderTop: "1px solid rgba(139,47,201,0.12)" }}>
            {faqs.map((f, i) => (
              <FAQItem key={f.q} item={f} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* RELATED SERVICES */}
      <section className="py-16" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <p className="text-sm font-bold" style={{ color: "#8B2FC9", fontFamily: DISPLAY }}>Related services</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {relatedLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-200"
                style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.18)", color: "#1B1023" }}
              >
                {l.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA — same gradient band as the other pages */}
      <section className="py-24 md:py-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1B1023 0%,#8B2FC9 60%,#FF2D95 100%)" }}>
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 65%)", transform: "translate(30%,-30%)" }} />
        <div className="relative z-10 w-11/12 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
          <h2 className="text-2xl md:text-[34px] font-bold text-white leading-tight" style={{ fontFamily: DISPLAY }}>
            Ready to turn ad spend into pipeline?
          </h2>
          <Link href="/contact" className="shrink-0 inline-flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ background: "#ffffff", color: "#8B2FC9", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", fontFamily: DISPLAY }}>
            Get in touch <FaArrowRight size={13} />
          </Link>
        </div>
      </section>
    </main>
  )
}