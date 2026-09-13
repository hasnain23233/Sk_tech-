"use client"

import React, { useEffect, useRef, useState, ReactNode } from "react"
import Link from "next/link"
import { Bricolage_Grotesque, Manrope } from "next/font/google"
import { FaArrowRight, FaPaintBrush, FaLayerGroup } from "react-icons/fa"

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] })
const body = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700", "800"] })

/* ─────────────────────────────────────────
   Brand tokens — same system as the home / portfolio / contact / app-dev /
   content-writing pages
   purple #8B2FC9   pink #FF2D95   ink #1B1023   paper #FBF7FC   muted #6b6560
───────────────────────────────────────── */
const GRAD = "linear-gradient(135deg,#8B2FC9,#FF2D95)"
const GRAD_SOFT = "linear-gradient(135deg,rgba(139,47,201,0.12),rgba(255,45,149,0.12))"
const DISPLAY = "var(--font-display)"

/* ─────────────────────────────────────────
   Shared motion primitives (ported from the other pages, kept local
   since this page previously imported an unshared module)
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
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
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
  { num: "01", title: "Brief & moodboard", desc: "We pin down what the piece needs to do and who it's for, and pull references until a direction feels right." },
  { num: "02", title: "Concepts", desc: "Two or three distinct directions, not variations on one idea, so there's a real choice to make." },
  { num: "03", title: "Refinement", desc: "The chosen direction developed and tightened, with your feedback built in as we go." },
  { num: "04", title: "Final files & handoff", desc: "Print-ready and digital-ready exports delivered, along with the editable source files." },
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

/* ─────────────────────────────────────────
   Hero visual — the tilting stack of design assets, now set inside the same
   layered-composition frame as the other service pages' heroes
───────────────────────────────────────── */
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
  function handleLeave() { setTilt({ x: 10, y: -8 }) }

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className="relative flex h-full items-center justify-center" style={{ perspective: "1100px" }}>
      <div
        className="relative h-[220px] w-[280px]"
        style={{ transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 0.28s ease-out" }}
      >
        {/* Social square, back layer */}
        <div
          className="absolute left-6 top-0 h-32 w-32 rounded-xl"
          style={{ background: GRAD, transform: "translateZ(0px) rotate(-6deg)", boxShadow: "0 20px 45px rgba(111,31,158,0.2)" }}
        />

        {/* Business card, middle layer */}
        <div
          className="absolute left-24 top-16 h-24 w-40 rounded-lg bg-white"
          style={{ transform: "translateZ(14px) rotate(4deg)", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 20px 45px rgba(111,31,158,0.2)" }}
        >
          <div className="flex h-full flex-col justify-between p-3">
            <span className="h-4 w-4 rounded-full" style={{ background: GRAD }} />
            <div className="space-y-1">
              <div className="h-1.5 w-3/5 rounded-full bg-neutral-300" />
              <div className="h-1.5 w-2/5 rounded-full bg-neutral-100" />
            </div>
          </div>
        </div>

        {/* Logo badge, front layer */}
        <div
          className="absolute left-2 top-24 flex h-16 w-16 items-center justify-center rounded-full bg-white"
          style={{ transform: "translateZ(28px) rotate(-4deg)", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 20px 45px rgba(111,31,158,0.2)" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l2.4 5.5L20 10l-4.5 3.8L16.9 20 12 16.8 7.1 20l1.4-6.2L4 10l5.6-1.5L12 3z" fill="url(#gdgrad)" />
            <defs>
              <linearGradient id="gdgrad" x1="4" y1="3" x2="20" y2="20">
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

/* ─────────────────────────────────────────
   Hero — same layered composition language as the other pages, built around
   the asset-stack mockup plus a real photo card for a more grounded feel
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
              <FaPaintBrush size={11} /> One visual identity, every touchpoint
            </span>
          </div>

          <h1
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", color: "#1B1023", fontFamily: DISPLAY }}
            className="text-4xl sm:text-5xl md:text-[54px] font-bold leading-[1.05] tracking-tight mb-7"
          >
            Graphic design that looks like <GradWord>one brand, everywhere.</GradWord>
          </h1>

          <p
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", color: "#6b6560" }}
            className="text-base md:text-lg leading-relaxed mb-10 max-w-xl"
          >
            Logos, print collateral, packaging, and campaign creative, designed from one visual system so a business card and a social post look like they came from the same place — because they did.
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

        {/* Layered composition — asset-stack mockup plus a real photo card,
            mirroring the home/portfolio/contact/app-dev/content-writing hero pattern */}
        <div
          className="relative hidden lg:block h-[440px]"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s" }}
        >
          <div className="absolute inset-0 rounded-[28px]" style={{ background: "#FBF7FC" }} />
          <AssetStackMockup />

          {/* floating photo card — real campaign creative, not another mockup */}
          <div
            className="absolute right-0 top-4 rounded-2xl overflow-hidden w-40"
            style={{ background: "#fff", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=400&q=80"
              alt="Finished social campaign creative"
              className="w-full h-24 object-cover"
              loading="lazy"
            />
            <div className="px-3 py-2.5">
              <p className="text-[11px] font-bold" style={{ color: "#1B1023" }}>On-brand</p>
              <p className="text-[10px]" style={{ color: "#6b6560" }}>Every platform</p>
            </div>
          </div>

          {/* floating turnaround card */}
          <div
            className="absolute left-2 bottom-4 rounded-2xl px-5 py-4 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GRAD, color: "#fff" }}>
              <FaLayerGroup size={13} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: "#1B1023", fontFamily: DISPLAY }}>Print + Digital</p>
              <p className="text-[11px] font-medium" style={{ color: "#6b6560" }}>delivered ready for both</p>
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
export default function GraphicDesigningPage() {
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

      {/* OVERVIEW — two-column section with a real photo, instead of a plain centered quote */}
      <section className="py-20" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <Reveal>
            <div className="rounded-[24px] overflow-hidden" style={{ boxShadow: "0 20px 45px rgba(27,16,35,0.14)" }}>
              <img
                src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80"
                alt="Designers reviewing campaign creative together"
                className="w-full h-[280px] object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <SectionMark>Why it works</SectionMark>
            <p className="text-lg leading-relaxed" style={{ color: "#1B1023" }}>
              Most brands don&apos;t fall apart from one bad design — they fall apart from twenty pieces designed with no system behind them. We build the visual identity once — logo, color, type — then apply it consistently across everything printed or posted, so every touchpoint reads as the same brand.
            </p>
          </Reveal>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.6fr]">
          <Reveal>
            <SectionMark>What you get</SectionMark>
            <h2 className="text-3xl md:text-[38px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>Standard on every design project.</h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>Not priced as extras.</p>
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
            <SectionMark>What we design</SectionMark>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>Six kinds of design, one system.</h2>
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
        <div aria-hidden className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full opacity-25 blur-3xl" style={{ background: "radial-gradient(circle,#FF2D95,transparent 70%)" }} />
        <div aria-hidden className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full opacity-20 blur-3xl" style={{ background: "radial-gradient(circle,#8B2FC9,transparent 70%)" }} />
        <div className="relative w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-14 max-w-sm">
            <p className="text-sm font-semibold mb-4" style={{ color: "#FF87BE", fontFamily: DISPLAY }}>How we work</p>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1] text-white" style={{ fontFamily: DISPLAY }}>How a design project runs.</h2>
            <p className="mt-4" style={{ color: "rgba(255,255,255,0.6)" }}>Real options first, then refinement.</p>
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
            Ready for a brand that looks finished?
          </h2>
          <Link href="/contact" className="shrink-0 inline-flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ background: "#ffffff", color: "#8B2FC9", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", fontFamily: DISPLAY }}>
            Get in touch <FaArrowRight size={13} />
          </Link>
        </div>
      </section>
    </main>
  )
}