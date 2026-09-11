"use client"

import React, { useEffect, useMemo, useRef, useState, ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bricolage_Grotesque, Manrope } from "next/font/google"
import {
  FaCode, FaSearch, FaHashtag, FaChartLine, FaPaintBrush,
  FaMobileAlt, FaStore, FaPenNib, FaArrowRight, FaMapMarkerAlt,
  FaBriefcase, FaLayerGroup, FaArrowUp, FaTimes, FaQuoteLeft,
} from "react-icons/fa"

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] })
const body = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700", "800"] })

/* ─────────────────────────────────────────
   Brand tokens — same system as the home page
   purple #8B2FC9   pink #FF2D95   ink #1B1023   paper #FBF7FC   muted #6b6560
───────────────────────────────────────── */
const GRAD = "linear-gradient(135deg,#8B2FC9,#FF2D95)"
const GRAD_SOFT = "linear-gradient(135deg,rgba(139,47,201,0.12),rgba(255,45,149,0.12))"
const DISPLAY = "var(--font-display)"

/* ─────────────────────────────────────────
   Shared motion primitives (ported from the home page)
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

function CountUp({ value, start }: { value: string; start: boolean }) {
  const match = value.match(/^([\d.]+)(.*)$/)
  const target = match ? parseFloat(match[1]) : 0
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0
  const suffix = match ? match[2] : ""
  const [dispVal, setDispVal] = useState(0)
  const rafRef = useRef<number>(0)
  const startTs = useRef<number>(0)

  useEffect(() => {
    if (!start) { startTs.current = 0; return }
    const dur = 1200
    const step = (ts: number) => {
      if (!startTs.current) startTs.current = ts
      const p = Math.min((ts - startTs.current) / dur, 1)
      setDispVal((1 - Math.pow(1 - p, 3)) * target)
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, start])

  return <>{(start ? dispVal : 0).toFixed(decimals)}{suffix}</>
}

function useMagnetic(strength = 0.3) {
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

const pageCSS = `
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes wordFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes floatSlow{0%,100%{transform:translateY(0) rotate(var(--rot,0deg))}50%{transform:translateY(-14px) rotate(var(--rot,0deg))}}
@keyframes cardIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes modalIn{from{opacity:0;transform:translateY(24px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes backdropIn{from{opacity:0}to{opacity:1}}
.card-in{animation:cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`

/* ─────────────────────────────────────────
   Data
   Each project carries an `img` (topical stock photo) plus a `lock`
   seed so the same photo is served consistently. Swap `img` for real
   client screenshots when they're available — these are placeholders.
───────────────────────────────────────── */
const heroStats = [
  { value: "120", suffix: "+", label: "Projects delivered", icon: <FaBriefcase size={15} /> },
  { value: "8", suffix: "", label: "Industries served", icon: <FaLayerGroup size={15} /> },
  { value: "15", suffix: "+", label: "Years in business", icon: <FaChartLine size={15} /> },
  { value: "3.2", suffix: "x", label: "Avg. client result", icon: <FaArrowUp size={15} /> },
]

const featured = [
  {
    client: "Boutique fashion retailer",
    region: "UK",
    category: "Shopify Development",
    result: "3.2", suffix: "x",
    metric: "organic traffic in 6 months",
    detail: "Rebuilt their Shopify store and rebuilt SEO from the ground up around actual buyer intent, not keyword volume alone.",
    quote: "They didn't just redesign the store — they figured out why customers were leaving, and fixed that first.",
    quoteAuthor: "Founder & Creative Director",
    img: "https://loremflickr.com/1000/700/fashion,boutique?lock=101",
  },
  {
    client: "Healthcare clinic network",
    region: "Pakistan",
    category: "Pay-Per-Click Advertising",
    result: "4", suffix: "x",
    metric: "qualified leads from paid search",
    detail: "Restructured Google Ads campaigns and landing pages around each clinic's specialty instead of one generic funnel.",
    quote: "Our cost per lead dropped in the first month and kept dropping. That never happens with agencies.",
    quoteAuthor: "Operations Director",
    img: "https://loremflickr.com/1000/700/clinic,healthcare?lock=102",
  },
  {
    client: "B2B SaaS startup",
    region: "UK",
    category: "Social Media Marketing",
    result: "58", suffix: "%",
    metric: "lower cost per lead",
    detail: "Replaced a scattershot social strategy with a focused content and PPC funnel built around one buyer persona.",
    quote: "They forced us to pick one customer to talk to. That single decision changed everything downstream.",
    quoteAuthor: "Head of Growth",
    img: "https://loremflickr.com/1000/700/startup,office?lock=103",
  },
]

const categories = [
  "All",
  "Web Development",
  "Web Designing",
  "Shopify Development",
  "Application Development",
  "Social Media Marketing",
  "SEO & Content Marketing",
  "Graphic Designing",
  "Content Writing",
  "Pay-Per-Click Advertising",
]

const categoryIcon: Record<string, ReactNode> = {
  "Web Development": <FaCode size={12} />,
  "Web Designing": <FaPaintBrush size={12} />,
  "Shopify Development": <FaStore size={12} />,
  "Application Development": <FaMobileAlt size={12} />,
  "Social Media Marketing": <FaHashtag size={12} />,
  "SEO & Content Marketing": <FaSearch size={12} />,
  "Graphic Designing": <FaPaintBrush size={12} />,
  "Content Writing": <FaPenNib size={12} />,
  "Pay-Per-Click Advertising": <FaChartLine size={12} />,
}

const categoryKeyword: Record<string, string> = {
  "Web Development": "webdesign,code",
  "Web Designing": "design,studio",
  "Shopify Development": "ecommerce,shopping",
  "Application Development": "mobileapp,phone",
  "Social Media Marketing": "socialmedia,content",
  "SEO & Content Marketing": "analytics,seo",
  "Graphic Designing": "branding,graphicdesign",
  "Content Writing": "writing,notebook",
  "Pay-Per-Click Advertising": "marketing,advertising",
}

const portfolio = [
  { title: "Marbleworth Estates", client: "Real Estate", category: "Web Development", blurb: "A listings platform with map search, saved properties, and agent dashboards built on a headless CMS.", tag: "6-week build", result: "+41%", metric: "increase in booked viewings" },
  { title: "Linen & Co.", client: "Retail", category: "Web Designing", blurb: "Full visual identity and site redesign for a homeware brand moving from wholesale to direct-to-consumer.", tag: "Brand + web", result: "2.1x", metric: "average order value" },
  { title: "Verde Apothecary", client: "E-commerce", category: "Shopify Development", blurb: "Migrated from a legacy cart to Shopify Plus with custom subscription logic and bundle pricing.", tag: "Platform migration", result: "+67%", metric: "subscription revenue" },
  { title: "Fielder Health", client: "Healthcare", category: "Application Development", blurb: "Patient intake and appointment app used across a nine-clinic network, replacing paper forms.", tag: "iOS + Android", result: "-35%", metric: "front-desk admin time" },
  { title: "Northbound Coffee", client: "Hospitality", category: "Social Media Marketing", blurb: "Grew a single-location roaster's Instagram following 4x and turned it into a wholesale lead channel.", tag: "12-month retainer", result: "4x", metric: "follower growth" },
  { title: "Ridgeline Tutors", client: "Education", category: "SEO & Content Marketing", blurb: "Built a content and backlink strategy that took an unranked tutoring site to page one for 40+ terms.", tag: "Organic growth", result: "40+", metric: "page-one keyword rankings" },
  { title: "Solace Legal", client: "Professional Services", category: "Graphic Designing", blurb: "New brand mark, stationery, and pitch-deck system for a boutique employment law firm.", tag: "Identity system", result: "3", metric: "new client referrals from the pitch deck alone" },
  { title: "Kettlebound", client: "Startups", category: "Content Writing", blurb: "Ongoing blog and email content for a fitness-equipment startup raising its first seed round.", tag: "Editorial calendar", result: "+52%", metric: "email list growth" },
  { title: "Havenly Interiors", client: "Real Estate", category: "Pay-Per-Click Advertising", blurb: "Google and Meta campaigns for an interior design studio, rebuilt around cost-per-consultation.", tag: "Paid media", result: "-44%", metric: "cost per consultation" },
  { title: "Portside Insurance", client: "Professional Services", category: "Web Development", blurb: "Quote-and-buy insurance flow with real-time pricing, replacing a 12-step PDF-based process.", tag: "Product build", result: "9min → 90s", metric: "average time to quote" },
  { title: "Amara Skincare", client: "E-commerce", category: "Shopify Development", blurb: "Launch site and first-year growth plan for a DTC skincare line, from zero to first 10,000 orders.", tag: "0 to launch", result: "10K", metric: "orders in year one" },
  { title: "Bright Path Academy", client: "Education", category: "Web Designing", blurb: "Admissions-focused redesign for a private school, cutting form abandonment by half.", tag: "Conversion redesign", result: "-50%", metric: "application form abandonment" },
]

/* ─────────────────────────────────────────
   Project photography — real image with a brand duotone treatment
   (gradient overlay via mix-blend-mode) so photos read as part of
   one consistent visual system rather than stock-photo filler.
───────────────────────────────────────── */
function ProjectThumb({
  seed,
  category,
  compact = false,
  fill = false,
  onClick,
}: {
  seed: number
  category?: string
  compact?: boolean
  fill?: boolean
  onClick?: () => void
}) {
  const flip = seed % 2 === 1
  const keyword = category ? categoryKeyword[category] : "agency,creative"
  const src = `https://loremflickr.com/900/650/${keyword}?lock=${seed + 1}`

  return (
    <div
      onClick={onClick}
      className={`relative w-full overflow-hidden ${fill ? "h-full" : compact ? "h-28 rounded-xl" : "h-44 rounded-t-2xl"} ${onClick ? "cursor-pointer" : ""}`}
      style={{ background: flip ? "linear-gradient(135deg,#FF2D95,#8B2FC9)" : GRAD }}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
        unoptimized
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: flip ? "linear-gradient(135deg,#FF2D95,#8B2FC9)" : GRAD, mixBlendMode: "color", opacity: 0.75 }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg,rgba(27,16,35,0) 40%,rgba(27,16,35,0.45) 100%)" }} />
    </div>
  )
}

/* ─────────────────────────────────────────
   Case-study modal — the interactive core of the page. Clicking any
   project (grid card, featured switcher, or hero preview) opens a
   detail view instead of a dead link.
───────────────────────────────────────── */
type ModalProject = {
  title: string
  client: string
  category: string
  blurb: string
  result?: string
  metric?: string
  seed: number
  quote?: string
  quoteAuthor?: string
}

function CaseStudyModal({ project, onClose }: { project: ModalProject | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = "" }
  }, [project, onClose])

  if (!project) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ animation: "backdropIn 0.2s ease" }}
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: "rgba(27,16,35,0.6)", backdropFilter: "blur(4px)" }} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[26px]"
        style={{ background: "#fff", boxShadow: "0 40px 100px rgba(27,16,35,0.4)", animation: "modalIn 0.3s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <button
          onClick={onClose}
          aria-label="Close case study"
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
          style={{ background: "rgba(27,16,35,0.55)", color: "#fff", backdropFilter: "blur(6px)" }}
        >
          <FaTimes size={13} />
        </button>

        <div className="relative h-56 md:h-72 group">
          <ProjectThumb seed={project.seed} category={project.category} fill />
          <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold text-white mb-2" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.3)" }}>
                {categoryIcon[project.category]} {project.category}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight" style={{ fontFamily: DISPLAY }}>{project.title}</h3>
            </div>
          </div>
        </div>

        <div className="p-7 md:p-9">
          <p className="text-sm font-bold mb-1" style={{ color: "#8B2FC9" }}>{project.client}</p>
          <p className="text-[15px] leading-relaxed mb-6" style={{ color: "#6b6560" }}>{project.blurb}</p>

          {project.result && (
            <div className="flex items-center gap-4 p-5 rounded-2xl mb-6" style={{ background: "#FBF7FC", border: "1px solid rgba(139,47,201,0.14)" }}>
              <p className="text-3xl md:text-4xl font-bold tabular-nums" style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: DISPLAY }}>
                {project.result}
              </p>
              <p className="text-sm font-medium" style={{ color: "#1B1023" }}>{project.metric}</p>
            </div>
          )}

          {project.quote && (
            <div className="flex gap-3 mb-8">
              <FaQuoteLeft size={16} style={{ color: "#e3c8f0", flexShrink: 0, marginTop: 3 }} />
              <div>
                <p className="text-[15px] italic leading-relaxed mb-1.5" style={{ color: "#1B1023" }}>{project.quote}</p>
                {project.quoteAuthor && <p className="text-xs font-semibold" style={{ color: "#8B2FC9" }}>{project.quoteAuthor}</p>}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 font-bold text-sm px-7 py-3.5 rounded-xl" style={{ background: GRAD, color: "#fff", boxShadow: "0 10px 26px rgba(139,47,201,0.3)", fontFamily: DISPLAY }}>
              Get results like this <FaArrowRight size={11} />
            </Link>
            <button onClick={onClose} className="inline-flex items-center justify-center font-bold text-sm px-7 py-3.5 rounded-xl" style={{ border: "1px solid rgba(139,47,201,0.2)", color: "#1B1023", fontFamily: DISPLAY }}>
              Back to portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Hero — same layered composition language as the home page,
   rebuilt around portfolio content instead of a site mockup
───────────────────────────────────────── */
function Hero({ visible, onOpenProject }: { visible: boolean; onOpenProject: (p: ModalProject) => void }) {
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
              <FaLayerGroup size={11} /> Portfolio — 120+ projects across Pakistan &amp; UK
            </span>
          </div>

          <h1
            style={{
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", color: "#1B1023", fontFamily: DISPLAY,
            }}
            className="text-4xl sm:text-5xl md:text-[58px] font-bold leading-[1.05] tracking-tight mb-7"
          >
            Work across nine services, <GradWord>nine ways to grow.</GradWord>
          </h1>

          <p
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", color: "#6b6560" }}
            className="text-base md:text-lg leading-relaxed mb-10 max-w-xl"
          >
            Every project below started the same way — a business that needed a site, a campaign, or both, and a straight answer about what would actually move the number they cared about.
          </p>

          <div
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s" }}
            className="flex flex-wrap gap-4"
          >
            <MagneticLink href="/contact" variant="solid">Start your project <FaArrowRight size={12} /></MagneticLink>
            <MagneticLink href="/services" variant="outline">See our services</MagneticLink>
          </div>
        </div>

        {/* Layered project composition, mirroring the home hero's device + floating cards */}
        <div
          className="relative hidden lg:block h-[480px]"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s" }}
        >
          {/* main stacked case card — clickable */}
          <button
            onClick={() => onOpenProject({ title: "Boutique fashion retailer", client: "Boutique fashion retailer, UK", category: "Shopify Development", blurb: featured[0].detail, result: `+${featured[0].result}${featured[0].suffix}`, metric: featured[0].metric, seed: 0, quote: featured[0].quote, quoteAuthor: featured[0].quoteAuthor })}
            className="absolute top-2 left-6 right-16 rounded-[22px] overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1 group"
            style={{ boxShadow: "0 30px 70px rgba(27,16,35,0.22)", border: "1px solid rgba(139,47,201,0.15)", background: "#fff" }}
          >
            <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: "#1B1023" }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF2D95" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFB648" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#8B2FC9" }} />
              <span className="ml-3 text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.5)", fontFamily: DISPLAY }}>Featured case study</span>
            </div>
            <div className="overflow-hidden"><ProjectThumb seed={0} category="Shopify Development" /></div>
            <div className="px-5 py-4">
              <p className="text-sm font-bold" style={{ color: "#1B1023" }}>Boutique fashion retailer, UK</p>
              <p className="text-[12px] mt-0.5" style={{ color: "#6b6560" }}>Shopify Development · +3.2x organic traffic</p>
            </div>
          </button>

          {/* floating projects-delivered card */}
          <div
            className="absolute left-0 bottom-16 rounded-2xl px-5 py-4 flex items-center gap-3"
            style={{ ["--rot" as string]: "-2deg", animation: "floatSlow 6s ease-in-out infinite", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GRAD, color: "#fff" }}>
              <FaBriefcase size={13} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: "#1B1023", fontFamily: DISPLAY }}>120+ projects</p>
              <p className="text-[11px] font-medium" style={{ color: "#6b6560" }}>delivered since 2011</p>
            </div>
          </div>

          {/* floating second thumbnail — clickable */}
          <button
            onClick={() => onOpenProject({ title: "Fielder Health", client: "Healthcare", category: "Application Development", blurb: portfolio[3].blurb, result: portfolio[3].result, metric: portfolio[3].metric, seed: 3 })}
            className="absolute right-0 bottom-2 rounded-2xl overflow-hidden w-40 text-left transition-transform duration-300 hover:-translate-y-1"
            style={{ ["--rot" as string]: "3deg", animation: "floatSlow 7s ease-in-out infinite 0.6s", background: "#fff", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <div className="overflow-hidden"><ProjectThumb seed={3} category="Application Development" compact /></div>
            <div className="px-3 py-2.5">
              <p className="text-[11px] font-bold" style={{ color: "#1B1023" }}>Fielder Health</p>
              <p className="text-[10px]" style={{ color: "#6b6560" }}>iOS + Android app</p>
            </div>
          </button>

          {/* floating industries pill */}
          <div
            className="absolute right-6 top-6 rounded-full px-5 py-3 flex items-center gap-2"
            style={{ ["--rot" as string]: "-1deg", animation: "floatSlow 5.5s ease-in-out infinite 0.3s", background: "#1B1023", boxShadow: "0 14px 34px rgba(27,16,35,0.28)" }}
          >
            <FaLayerGroup size={12} style={{ color: "#FFB648" }} />
            <span className="text-sm font-bold" style={{ color: "#fff", fontFamily: DISPLAY }}>8 industries</span>
          </div>

          <div className="absolute -z-10 -bottom-10 -right-10 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(139,47,201,0.16) 0%,transparent 70%)" }} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none">
        <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10" style={{ fill: "#FBF7FC" }}>
          <path d="M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z" />
        </svg>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Featured results — tabbed switcher, same pattern as the home page's case studies
───────────────────────────────────────── */
function FeaturedSwitcher({ onOpenProject }: { onOpenProject: (p: ModalProject) => void }) {
  const [active, setActive] = useState(0)
  const c = featured[active]
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {featured.map((cs, i) => (
          <button
            key={cs.client}
            onClick={() => setActive(i)}
            className="px-4 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200"
            style={{
              background: active === i ? GRAD : "#ffffff",
              color: active === i ? "#fff" : "#6b6560",
              border: active === i ? "1px solid transparent" : "1px solid rgba(139,47,201,0.18)",
              boxShadow: active === i ? "0 8px 22px rgba(139,47,201,0.28)" : "none",
            }}
          >
            {cs.client}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-0 rounded-[28px] overflow-hidden" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 24px 60px rgba(27,16,35,0.08)" }}>
        <button
          onClick={() => onOpenProject({ title: c.client, client: `${c.client} — ${c.region}`, category: c.category, blurb: c.detail, result: `+${c.result}${c.suffix}`, metric: c.metric, seed: active, quote: c.quote, quoteAuthor: c.quoteAuthor })}
          className="relative h-64 lg:h-auto overflow-hidden text-left group"
        >
          <div key={c.client} style={{ animation: "wordFade 0.5s ease", height: "100%" }}>
            <ProjectThumb seed={active} category={c.category} fill />
          </div>
          <span className="absolute bottom-5 left-6 text-[12px] font-bold px-3 py-1.5 rounded-full text-white" style={{ background: "rgba(27,16,35,0.4)", backdropFilter: "blur(6px)" }}>{c.category}</span>
          <span className="absolute top-5 right-5 text-[12px] font-bold px-3 py-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(27,16,35,0.5)", backdropFilter: "blur(6px)" }}>View case study</span>
        </button>
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <p key={c.client + "num"} className="text-6xl font-bold tabular-nums leading-none mb-2" style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: DISPLAY, animation: "wordFade 0.5s ease" }}>
            +<CountUp value={`${c.result}${c.suffix}`} start={true} />
          </p>
          <p className="text-sm font-bold mb-4" style={{ color: "#1B1023" }}>{c.metric}</p>
          <p className="text-[15px] leading-relaxed mb-5" style={{ color: "#6b6560" }}>{c.detail}</p>
          <p className="text-sm font-bold mb-5" style={{ color: "#1B1023" }}>
            {c.client} <span style={{ color: "#c9a8dd", fontWeight: 500 }}>— {c.region}</span>
          </p>
          <button
            onClick={() => onOpenProject({ title: c.client, client: `${c.client} — ${c.region}`, category: c.category, blurb: c.detail, result: `+${c.result}${c.suffix}`, metric: c.metric, seed: active, quote: c.quote, quoteAuthor: c.quoteAuthor })}
            className="inline-flex items-center gap-2 text-sm font-bold w-fit"
            style={{ color: "#8B2FC9" }}
          >
            Read the full case study <FaArrowRight size={11} />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function Portfolio() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [activeCategory, setActiveCategory] = useState("All")
  const [openProject, setOpenProject] = useState<ModalProject | null>(null)
  const statsReveal = useReveal(0.3)

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t) }, [])

  const filtered = useMemo(
    () => (activeCategory === "All" ? portfolio : portfolio.filter((p) => p.category === activeCategory)),
    [activeCategory]
  )

  return (
    <main
      className={`${display.variable} ${body.variable} font-sans min-h-screen overflow-x-hidden`}
      style={{ background: "linear-gradient(160deg,#ffffff 0%,#FBF7FC 50%,#ffffff 100%)", fontFamily: "var(--font-body)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: pageCSS }} />

      <Hero visible={heroVisible} onOpenProject={setOpenProject} />

      {/* MARQUEE STRIP — categories instead of home's industries */}
      <div className="py-5 overflow-hidden" style={{ background: "#1B1023" }}>
        <div className="flex items-center gap-10" style={{ animation: "marquee 24s linear infinite", width: "max-content" }}>
          {[...categories.filter((c) => c !== "All"), ...categories.filter((c) => c !== "All")].map((t, i) => (
            <span key={i} className="flex items-center gap-10 text-[13px] font-bold whitespace-nowrap tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.85)", fontFamily: DISPLAY }}>
              {t}
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: i % 2 === 0 ? "#FF2D95" : "#8B2FC9" }} />
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="py-16" style={{ background: "#FBF7FC", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div ref={statsReveal.ref} className="w-11/12 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {heroStats.map((s) => (
            <div
              key={s.label}
              className="group relative text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
              style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.12)", boxShadow: "0 10px 26px rgba(27,16,35,0.05)" }}
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ background: GRAD_SOFT, color: "#8B2FC9" }}>{s.icon}</div>
              <p className="text-4xl md:text-5xl font-bold tabular-nums mb-1" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
                <CountUp value={`${s.value}${s.suffix}`} start={statsReveal.visible} />
              </p>
              <p className="text-sm font-medium" style={{ color: "#6b6560" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED RESULTS */}
      <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-12 max-w-xl">
            <SectionMark>Proof, not promises</SectionMark>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1] mb-4" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              Recent results, by the client.
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>Click through to see how each engagement actually played out.</p>
          </Reveal>
          <Reveal delay={80}><FeaturedSwitcher onOpenProject={setOpenProject} /></Reveal>
        </div>
      </section>

      {/* FILTERABLE GRID */}
      <section className="py-24 md:py-28" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-8 max-w-xl">
            <SectionMark>Browse the work</SectionMark>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              All projects, filtered by service.
            </h2>
          </Reveal>

          <Reveal delay={60} className="flex flex-wrap items-center gap-2.5 mb-3">
            {categories.map((cat) => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200"
                  style={{
                    background: active ? GRAD : "#ffffff",
                    color: active ? "#fff" : "#1B1023",
                    border: active ? "1px solid transparent" : "1px solid rgba(139,47,201,0.18)",
                    boxShadow: active ? "0 8px 22px rgba(139,47,201,0.28)" : "none",
                  }}
                >
                  {cat !== "All" && <span style={{ color: active ? "#fff" : "#8B2FC9" }}>{categoryIcon[cat]}</span>}
                  {cat}
                </button>
              )
            })}
          </Reveal>

          <p className="text-sm font-medium mb-9" style={{ color: "#a48fb5" }}>
            {filtered.length} {filtered.length === 1 ? "project" : "projects"}{activeCategory !== "All" ? ` in ${activeCategory}` : ""}
          </p>

          <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtered.map((p, i) => (
              <button
                key={p.title}
                onClick={() => setOpenProject({ title: p.title, client: p.client, category: p.category, blurb: p.blurb, result: p.result, metric: p.metric, seed: i })}
                className="card-in group text-left overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1.5"
                style={{ animationDelay: `${i * 0.05}s`, background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 10px 26px rgba(27,16,35,0.05)" }}
              >
                <div className="overflow-hidden relative">
                  <ProjectThumb seed={i} category={p.category} />
                  <span className="absolute inset-x-0 bottom-0 top-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(180deg,rgba(27,16,35,0) 40%,rgba(27,16,35,0.55) 100%)" }}>
                    <span className="text-white text-sm font-bold">{p.result} · {p.metric}</span>
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: GRAD_SOFT, color: "#8B2FC9" }}>
                      {categoryIcon[p.category]} {p.category}
                    </span>
                    <span className="text-xs font-medium" style={{ color: "#c9a8dd" }}>{p.tag}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold" style={{ color: "#1B1023", fontFamily: DISPLAY }}>{p.title}</h3>
                  <p className="mt-1 text-sm font-medium" style={{ color: "#6b6560" }}>{p.client}</p>
                  <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>{p.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold transition-transform duration-200 group-hover:translate-x-1" style={{ color: "#8B2FC9" }}>
                    View case study <FaArrowRight size={11} />
                  </span>
                </div>
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="mt-16 text-center" style={{ color: "#6b6560" }}>No projects in this category yet.</p>
          )}
        </div>
      </section>

      {/* CONTACT STRIP — mirrors the home page's contact strip */}
      <section className="py-16" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { label: "Office", lines: ["PAK Arab Society, Gulberg", "Lahore, Pakistan"], icon: <FaMapMarkerAlt size={16} /> },
            { label: "Industries", lines: ["Retail, healthcare, education,", "hospitality, SaaS & more"], icon: <FaLayerGroup size={15} /> },
            { label: "Delivered", lines: ["120+ projects since 2011"], icon: <FaBriefcase size={15} /> },
          ].map((c) => (
            <div key={c.label} className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1" style={{ background: "#FBF7FC", border: "1px solid rgba(139,47,201,0.14)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: GRAD, color: "#fff" }}>
                {c.icon}
              </div>
              <p className="text-sm font-bold mb-2" style={{ color: "#8B2FC9", fontFamily: DISPLAY }}>{c.label}</p>
              {c.lines.map((l) => <p key={l} className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{l}</p>)}
            </div>
          ))}
        </div>
      </section>

      {/* CTA BAND — same gradient treatment as the home page */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1B1023 0%,#8B2FC9 60%,#FF2D95 100%)" }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 65%)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full pointer-events-none hidden md:block" style={{ background: "radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 70%)" }} />
        <div
          className="absolute bottom-16 right-[14%] rounded-2xl px-5 py-4 items-center gap-3 hidden md:flex"
          style={{ ["--rot" as string]: "-2deg", animation: "floatSlow 6s ease-in-out infinite", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <FaBriefcase size={14} style={{ color: "#fff" }} />
          <span className="text-sm font-bold text-white" style={{ fontFamily: DISPLAY }}>Project #121, open</span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-[50px] font-bold text-white tracking-tight mb-5" style={{ fontFamily: DISPLAY }}>
              See your project here next.
            </h2>
            <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.8)" }}>
              Tell us what you&apos;re building and we&apos;ll send a fixed quote within two business days.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 font-bold text-sm px-10 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ background: "#ffffff", color: "#8B2FC9", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", fontFamily: DISPLAY }}>
                Start your project <FaArrowRight size={13} />
              </Link>
              <MagneticLink href="/contact" variant="onDark">Talk to our team</MagneticLink>
            </div>
          </Reveal>
        </div>
      </section>

      <CaseStudyModal project={openProject} onClose={() => setOpenProject(null)} />
    </main>
  )
}