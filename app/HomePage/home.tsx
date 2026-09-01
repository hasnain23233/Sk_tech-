"use client"

import React, { useEffect, useRef, useState, ReactNode } from "react"
import Link from "next/link"
import { Sora, Inter } from "next/font/google"
import {
  FaCode, FaSearch, FaHashtag, FaChartLine, FaPaintBrush,
  FaMobileAlt, FaStore, FaPenNib, FaArrowRight, FaArrowLeft,
  FaQuoteLeft, FaChevronDown, FaStar,
} from "react-icons/fa"

const sora = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] })
const inter = Inter({ subsets: ["latin"], variable: "--font-body" })

/* ─────────────────────────────────────────
   Brand tokens — original palette
   purple #8B2FC9   pink #FF2D95   ink #1B1023
   paper  #FBF7FC    muted #6b6560  line rgba(139,47,201,.14)
───────────────────────────────────────── */
const GRAD = "linear-gradient(135deg,#8B2FC9,#FF2D95)"

/* ─────────────────────────────────────────
   Scroll reveal — one clean entrance per section
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

/* ─────────────────────────────────────────
   CountUp
───────────────────────────────────────── */
function CountUp({ value, start }: { value: string; start: boolean }) {
  const match = value.match(/^([\d.]+)(.*)$/)
  const target = match ? parseFloat(match[1]) : 0
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0
  const suffix = match ? match[2] : ""
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number>(0)
  const startTs = useRef<number>(0)

  useEffect(() => {
    if (!start) { startTs.current = 0; return }
    const dur = 1200
    const step = (ts: number) => {
      if (!startTs.current) startTs.current = ts
      const p = Math.min((ts - startTs.current) / dur, 1)
      setDisplay((1 - Math.pow(1 - p, 3)) * target)
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, start])

  return <>{(start ? display : 0).toFixed(decimals)}{suffix}</>
}

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const stats = [
  { value: "15", suffix: "+", label: "Years running" },
  { value: "9", suffix: "", label: "Services, one team" },
  { value: "2", suffix: "", label: "Countries covered" },
  { value: "3.2", suffix: "x", label: "Avg. client growth" },
]

const coreServices = [
  {
    id: 1, num: "01", title: "Web Development", icon: <FaCode size={18} />, href: "/services/web-development",
    detail: "We build on frameworks that scale with your traffic, not against it. Every build ships with clean semantic markup, real performance budgets, and a CMS your team can actually use.",
    bullets: ["Core Web Vitals built in from day one", "Headless or traditional CMS, your call", "Handover documentation, not a black box"],
  },
  {
    id: 2, num: "02", title: "Shopify Development", icon: <FaStore size={18} />, href: "/services/shopify-development",
    detail: "Theme customisation, app integrations, and checkout flows engineered around cart-abandonment data — not stock templates.",
    bullets: ["Custom theme builds, not stock templates", "Subscription, wholesale & multi-currency setups", "Speed-audited before launch, every time"],
  },
  {
    id: 3, num: "03", title: "SEO & Content Marketing", icon: <FaSearch size={18} />, href: "/services/seo-content-marketing",
    detail: "No keyword-stuffed filler. We map content to the questions your buyers actually type into Google, then build the technical SEO underneath it.",
    bullets: ["Technical audit before any content plan", "Buyer-intent content calendars", "Monthly ranking reports in plain language"],
  },
  {
    id: 4, num: "04", title: "Social Media Marketing", icon: <FaHashtag size={18} />, href: "/services/social-media-marketing",
    detail: "We pick platforms based on where your buyers already spend time. Content calendars and creative that looks like your brand made it — because we made it as your brand.",
    bullets: ["Platform strategy before content, always", "Native creative per platform", "Engagement handled inside business hours"],
  },
  {
    id: 5, num: "05", title: "Pay-Per-Click Advertising", icon: <FaChartLine size={18} />, href: "/services/ppc-advertising",
    detail: "Campaigns structured around your actual margin, not a vanity click-through rate. We report cost per qualified lead and kill underperforming ad sets fast.",
    bullets: ["Landing pages built to match ad intent", "Weekly bid & budget review", "Kill/scale decisions inside 14 days"],
  },
]

const moreServices = [
  { title: "Web Designing", href: "/services/web-designing", icon: <FaPaintBrush size={15} /> },
  { title: "Application Development", href: "/services/application-development", icon: <FaMobileAlt size={15} /> },
  { title: "Graphic Designing", href: "/services/graphic-designing", icon: <FaPaintBrush size={15} /> },
  { title: "Content Writing", href: "/services/content-writing", icon: <FaPenNib size={15} /> },
]

const checks = [
  { title: "One team, not three vendors", desc: "Design, development and marketing sit in the same room, so nothing gets lost between handoffs." },
  { title: "Plain-number reporting", desc: "Every monthly report reads in minutes and says what changed, why, and what's next." },
  { title: "Direct access to the people doing the work", desc: "You talk to the developer and the strategist, not an account manager relaying messages." },
  { title: "The same playbook since 2011", desc: "Fifteen years of the same accountable process, refined, not reinvented every quarter." },
]

const industries = ["E-commerce", "Healthcare", "Real Estate", "Hospitality", "Education", "Professional Services", "Startups", "Retail"]

const process = [
  { num: "01", title: "Discover", desc: "We learn your business, your customers, and what's actually stopping growth right now." },
  { num: "02", title: "Design & Build", desc: "Websites, apps and creative that look considered and load fast, on solid foundations." },
  { num: "03", title: "Launch", desc: "SEO, social and paid campaigns go live with tracking in place from day one." },
  { num: "04", title: "Grow", desc: "We read the numbers monthly and adjust the plan, so spend keeps turning into results." },
]

const caseStudies = [
  { client: "Boutique fashion retailer", region: "UK", result: "3.2", suffix: "x", metric: "organic traffic in 6 months", detail: "Rebuilt their Shopify store and rebuilt SEO from the ground up around actual buyer intent, not keyword volume alone." },
  { client: "Healthcare clinic network", region: "Pakistan", result: "4", suffix: "x", metric: "qualified leads from paid search", detail: "Restructured Google Ads campaigns and landing pages around each clinic's specialty instead of one generic funnel." },
  { client: "B2B SaaS startup", region: "UK", result: "58", suffix: "%", metric: "lower cost per lead", detail: "Replaced a scattershot social strategy with a focused content and PPC funnel built around one buyer persona." },
]

const testimonials = [
  { quote: "They rebuilt our site in six weeks and our bounce rate dropped almost immediately. First agency that actually explained what they were doing.", author: "Operations Lead", role: "Retail client" },
  { quote: "We'd worked with three agencies before SK Techs. This is the first one where design and marketing weren't fighting each other.", author: "Founder", role: "Hospitality client" },
  { quote: "Monthly reports are in plain language. I can tell my board what happened without translating anything.", author: "Marketing Manager", role: "Healthcare client" },
]

const faqs = [
  { q: "How long does a typical website project take?", a: "A standard business website runs 3–5 weeks from kickoff to launch. Larger builds with custom features or e-commerce typically take 6–10 weeks, depending on scope." },
  { q: "Do you work with businesses outside Pakistan and the UK?", a: "Yes. Most of our work is remote and we run projects for clients across time zones, with weekly check-ins scheduled around your hours." },
  { q: "Can you just run marketing for a site you didn't build?", a: "Often, yes. We'll audit the existing site first so campaigns aren't sending traffic to pages that won't convert." },
  { q: "How do you report on results?", a: "You get a monthly report in plain language: traffic, leads, cost per result, and what we're changing next. No jargon-only dashboards." },
  { q: "What does a project cost?", a: "It depends on scope — a landing page and a multi-market e-commerce build aren't priced the same way. Tell us what you need and we'll send a fixed quote within two business days." },
]

const estimatorIndustries = [
  { key: "ecommerce", label: "E-commerce", multiplier: 3.2 },
  { key: "healthcare", label: "Healthcare", multiplier: 2.4 },
  { key: "b2b", label: "B2B / SaaS", multiplier: 2.1 },
  { key: "hospitality", label: "Hospitality", multiplier: 2.8 },
]

/* ─────────────────────────────────────────
   Section tag
───────────────────────────────────────── */
function SectionTag({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full mb-5"
      style={{ background: "rgba(139,47,201,0.08)", border: "1px solid rgba(139,47,201,0.22)", color: "#8B2FC9" }}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────
   Service Explorer — click-through tabs
───────────────────────────────────────── */
function ServiceExplorer() {
  const [active, setActive] = useState(0)
  const s = coreServices[active]
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 20px 60px rgba(27,16,35,0.08)" }}>
      <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible" style={{ background: "#1B1023" }}>
        {coreServices.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActive(i)}
            className="flex items-center gap-3 px-5 py-4 text-left flex-shrink-0 lg:flex-shrink w-full transition-all duration-300"
            style={{ background: active === i ? GRAD : "transparent", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
          >
            <span className="text-[12px] font-black tabular-nums" style={{ color: active === i ? "#fff" : "rgba(255,255,255,0.35)" }}>{item.num}</span>
            <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: active === i ? "#fff" : "rgba(255,255,255,0.75)" }}>{item.title}</span>
          </button>
        ))}
      </div>

      <div className="p-8 md:p-10" style={{ background: "#ffffff" }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: GRAD, color: "#fff" }}>
          {s.icon}
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{ color: "#1B1023" }}>{s.title}</h3>
        <p className="text-[15px] leading-relaxed mb-5 max-w-lg" style={{ color: "#6b6560" }}>{s.detail}</p>
        <ul className="flex flex-col gap-2.5 mb-7">
          {s.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-sm font-medium" style={{ color: "#1B1023" }}>
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#FF2D95" }} />
              {b}
            </li>
          ))}
        </ul>
        <Link href={s.href} className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: "#8B2FC9" }}>
          More on {s.title} <FaArrowRight size={11} />
        </Link>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Growth Estimator — signature interactive moment
───────────────────────────────────────── */
function GrowthEstimator() {
  const [traffic, setTraffic] = useState(2000)
  const [industryKey, setIndustryKey] = useState("ecommerce")
  const industry = estimatorIndustries.find((i) => i.key === industryKey)!
  const projected = Math.round(traffic * industry.multiplier)

  return (
    <div className="rounded-3xl p-8 md:p-12 relative overflow-hidden" style={{ background: "#1B1023" }}>
      <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(139,47,201,0.35) 0%,transparent 65%)", transform: "translate(30%,-35%)" }} />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "#FF2D95" }}>Try it yourself</p>
          <h3 className="text-2xl md:text-[32px] font-black leading-tight mb-7" style={{ color: "#fff" }}>
            What could six months of this look like for you?
          </h3>

          <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.65)" }}>
            Current monthly visitors: <span style={{ color: "#fff", fontWeight: 800 }}>{traffic.toLocaleString()}</span>
          </label>
          <input
            type="range" min={200} max={20000} step={100} value={traffic}
            onChange={(e) => setTraffic(Number(e.target.value))}
            className="w-full mb-8"
            style={{ accentColor: "#FF2D95" }}
          />

          <label className="block text-sm font-semibold mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>Industry</label>
          <div className="flex flex-wrap gap-2">
            {estimatorIndustries.map((i) => (
              <button
                key={i.key}
                onClick={() => setIndustryKey(i.key)}
                className="px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-200"
                style={{
                  background: industryKey === i.key ? GRAD : "rgba(255,255,255,0.06)",
                  color: "#fff",
                  border: industryKey === i.key ? "1px solid transparent" : "1px solid rgba(255,255,255,0.16)",
                }}
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>Illustrative projected visitors, 6 months</p>
          <p className="text-5xl md:text-6xl font-black tabular-nums mb-4" style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {projected.toLocaleString()}
          </p>
          <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
            Based on the average {industry.multiplier}x growth {industry.label.toLowerCase()} clients saw across comparable engagements. Your real number depends on your starting point — this is a conversation starter, not a quote.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3.5 rounded-xl transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: GRAD, color: "#fff", boxShadow: "0 10px 30px rgba(139,47,201,0.4)" }}
          >
            Get a real number for my site <FaArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Case Study Switcher
───────────────────────────────────────── */
function CaseStudySwitcher() {
  const [active, setActive] = useState(0)
  const c = caseStudies[active]
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {caseStudies.map((cs, i) => (
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

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-start p-8 md:p-10 rounded-3xl" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 20px 60px rgba(27,16,35,0.06)" }}>
        <div className="md:min-w-[180px]">
          <p className="text-6xl font-black tabular-nums leading-none" style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            <CountUp value={`${c.result}${c.suffix}`} start={true} />
          </p>
          <p className="text-sm font-bold mt-3" style={{ color: "#1B1023" }}>{c.metric}</p>
        </div>
        <div>
          <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#6b6560" }}>{c.detail}</p>
          <p className="text-sm font-bold" style={{ color: "#1B1023" }}>
            {c.client} <span style={{ color: "#c9a8dd", fontWeight: 500 }}>— {c.region}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Testimonial carousel
───────────────────────────────────────── */
function TestimonialCarousel() {
  const [index, setIndex] = useState(0)
  const t = testimonials[index]
  const go = (dir: number) => setIndex((i) => (i + dir + testimonials.length) % testimonials.length)

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-7" style={{ background: GRAD, color: "#fff" }}>
        <FaQuoteLeft size={18} />
      </div>
      <div className="flex justify-center gap-0.5 mb-5">{[1, 2, 3, 4, 5].map((s) => <FaStar key={s} size={14} className="text-yellow-400" />)}</div>
      <p key={index} className="text-xl md:text-2xl font-medium leading-relaxed mb-8" style={{ color: "#1B1023" }}>
        {t.quote}
      </p>
      <p className="text-sm font-bold" style={{ color: "#1B1023" }}>{t.author}</p>
      <p className="text-sm mb-9" style={{ color: "#c9a8dd" }}>{t.role}</p>

      <div className="flex items-center justify-center gap-4">
        <button onClick={() => go(-1)} aria-label="Previous testimonial" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200" style={{ border: "1px solid rgba(139,47,201,0.25)", color: "#8B2FC9" }}>
          <FaArrowLeft size={12} />
        </button>
        <div className="flex gap-1.5 items-center">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className="h-2 rounded-full transition-all duration-200"
              style={{ background: i === index ? GRAD : "rgba(139,47,201,0.2)", width: i === index ? 22 : 8 }}
            />
          ))}
        </div>
        <button onClick={() => go(1)} aria-label="Next testimonial" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200" style={{ border: "1px solid rgba(139,47,201,0.25)", color: "#8B2FC9" }}>
          <FaArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */
function FAQItem({ item, isOpen, onToggle }: { item: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(139,47,201,0.12)" }}>
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen}>
        <span className="font-bold text-[16px]" style={{ color: "#1B1023" }}>{item.q}</span>
        <span
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: isOpen ? GRAD : "rgba(139,47,201,0.08)", color: isOpen ? "#fff" : "#8B2FC9", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease, background 0.3s ease, color 0.3s ease" }}
        >
          <FaChevronDown size={11} />
        </span>
      </button>
      <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
        <div className="overflow-hidden">
          <p className="pb-6 pr-10 text-sm leading-relaxed" style={{ color: "#6b6560" }}>{item.a}</p>
        </div>
      </div>
    </div>
  )
}

const marqueeCSS = `@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function HomePage() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const statsReveal = useReveal(0.3)

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t) }, [])

  return (
    <main
      className={`${sora.variable} ${inter.variable} font-sans min-h-screen overflow-x-hidden`}
      style={{ background: "linear-gradient(160deg,#ffffff 0%,#FBF7FC 50%,#ffffff 100%)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: marqueeCSS }} />

      {/* HERO */}
      <section className="relative pt-32 md:pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(ellipse 80% 60% at 15% 5%,rgba(139,47,201,0.09) 0%,transparent 60%),radial-gradient(ellipse 55% 45% at 88% 20%,rgba(255,45,149,0.06) 0%,transparent 55%)",
        }} />

        <div className="relative z-10 w-11/12 max-w-6xl mx-auto">
          <div
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] px-4 py-2 rounded-full mb-7"
          >
            <span className="inline-flex items-center gap-2 px-0" style={{ color: "#8B2FC9", background: "rgba(139,47,201,0.08)", border: "1px solid rgba(139,47,201,0.25)", borderRadius: 999, padding: "8px 16px" }}>
              <FaStar size={9} /> UK &amp; Pakistan&apos;s Digital Growth Partner
            </span>
          </div>

          <h1
            style={{
              opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", color: "#1B1023",
            }}
            className="text-4xl sm:text-5xl md:text-[62px] font-black leading-[1.06] tracking-tight mb-7 max-w-3xl"
          >
            Digital growth,{" "}
            <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>built and measured</span>
          </h1>

          <p
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", color: "#6b6560" }}
            className="text-base md:text-lg leading-relaxed mb-10 max-w-xl"
          >
            SK Techs designs your website, runs the campaigns that bring people to it, and reports back in numbers you can actually use. Since 2011.
          </p>

          <div
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s" }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/contact" className="inline-flex items-center justify-center gap-2 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ background: GRAD, boxShadow: "0 6px 28px rgba(139,47,201,0.35)" }}>
              Start a Project <FaArrowRight size={12} />
            </Link>
            <Link href="/portfolio" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-8 py-4 rounded-xl transition-all duration-200" style={{ background: "rgba(139,47,201,0.05)", border: "1px solid rgba(139,47,201,0.25)", color: "#8B2FC9" }}>
              See Our Work
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none">
          <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10" style={{ fill: "#FBF7FC" }}>
            <path d="M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z" />
          </svg>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div ref={statsReveal.ref} className="w-11/12 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl md:text-5xl font-black tabular-nums mb-1" style={{ color: "#1B1023" }}>
                <CountUp value={`${s.value}${s.suffix}`} start={statsReveal.visible} />
              </p>
              <p className="text-sm font-medium" style={{ color: "#6b6560" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Reveal>
            <SectionTag>About Our Company</SectionTag>
            <h2 className="text-3xl md:text-[42px] font-black leading-[1.1] mb-6 max-w-md" style={{ color: "#1B1023" }}>
              Most agencies do one thing well. We kept everything under one roof.
            </h2>
            <p className="leading-relaxed mb-4 max-w-md" style={{ color: "#6b6560" }}>
              Design, development and marketing waiting on each other — or on each other&apos;s excuses — is how most projects stall. We&apos;ve run the same integrated playbook since 2011 for businesses across Pakistan and the UK.
            </p>
            <Link href="/about" className="inline-flex items-center gap-2 text-white font-bold text-sm px-8 py-4 rounded-xl mt-4 transition-all duration-200 hover:-translate-y-1" style={{ background: GRAD, boxShadow: "0 6px 28px rgba(139,47,201,0.3)" }}>
              Learn More <FaArrowRight size={12} />
            </Link>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex flex-col">
              {checks.map((c, i) => (
                <div key={c.title} className="py-5" style={{ borderTop: i === 0 ? "1px solid rgba(139,47,201,0.14)" : "none", borderBottom: "1px solid rgba(139,47,201,0.14)" }}>
                  <h3 className="font-bold text-[15px] mb-1.5" style={{ color: "#1B1023" }}>{c.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{c.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* INDUSTRIES MARQUEE */}
      <div className="py-6 overflow-hidden" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="flex items-center gap-12" style={{ animation: "marquee 24s linear infinite", width: "max-content" }}>
          {[...industries, ...industries].map((t, i) => (
            <span key={i} className="text-[13px] font-semibold whitespace-nowrap px-4 py-2 rounded-lg" style={{ color: "#6b6560", border: "1px solid rgba(139,47,201,0.15)", background: "#ffffff" }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-12 max-w-xl">
            <SectionTag>What We Lead With</SectionTag>
            <h2 className="text-3xl md:text-[42px] font-black leading-[1.1] mb-4" style={{ color: "#1B1023" }}>
              Five services. One team building all of them together.
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>Click through to see how each one actually works.</p>
          </Reveal>

          <Reveal delay={80}><ServiceExplorer /></Reveal>

          <Reveal delay={140} className="mt-10">
            <p className="text-sm font-bold mb-4" style={{ color: "#1B1023" }}>And whatever else your brand needs:</p>
            <div className="flex flex-wrap gap-3">
              {moreServices.map((s) => (
                <Link key={s.title} href={s.href} className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200" style={{ border: "1px solid rgba(139,47,201,0.18)", color: "#1B1023" }}>
                  <span style={{ color: "#8B2FC9" }}>{s.icon}</span>
                  {s.title}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* GROWTH ESTIMATOR */}
      <section className="py-24 md:py-28" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal><GrowthEstimator /></Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-14 max-w-xl">
            <SectionTag>How We Work</SectionTag>
            <h2 className="text-3xl md:text-[42px] font-black leading-[1.1]" style={{ color: "#1B1023" }}>
              How a project runs, start to finish.
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {process.map((p) => (
                <div key={p.num} className="flex flex-col gap-4 p-7 rounded-2xl h-full transition-all duration-300 hover:-translate-y-2" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 2px 12px rgba(27,16,35,0.04)" }}>
                  <span className="text-[42px] font-black leading-none" style={{ background: "linear-gradient(135deg,rgba(139,47,201,0.3),rgba(255,45,149,0.08))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{p.num}</span>
                  <h3 className="font-bold text-[17px]" style={{ color: "#1B1023" }}>{p.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="py-24 md:py-28" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-12 max-w-xl">
            <SectionTag>Proof, Not Promises</SectionTag>
            <h2 className="text-3xl md:text-[42px] font-black leading-[1.1]" style={{ color: "#1B1023" }}>
              Recent results, by the client.
            </h2>
          </Reveal>
          <Reveal delay={80}><CaseStudySwitcher /></Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal><TestimonialCarousel /></Reveal>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="py-16" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
          {[
            { label: "Office", lines: ["PAK Arab Society, Gulberg", "Lahore, Pakistan"] },
            { label: "Call Us", lines: ["Pakistan: +92 336 8007788", "UK: +44 7708 568160"] },
            { label: "Email", lines: ["info@sktechs.com"] },
          ].map((c) => (
            <div key={c.label}>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2" style={{ color: "#8B2FC9" }}>{c.label}</p>
              {c.lines.map((l) => <p key={l} className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{l}</p>)}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#ffffff", borderTop: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-2xl mx-auto">
          <Reveal className="text-center pt-24 pb-10">
            <SectionTag>Got Questions?</SectionTag>
            <h2 className="text-3xl md:text-[42px] font-black leading-[1.1]" style={{ color: "#1B1023" }}>Frequently Asked Questions</h2>
          </Reveal>
          <div className="pb-24" style={{ borderTop: "1px solid rgba(139,47,201,0.12)" }}>
            {faqs.map((f, i) => (
              <FAQItem key={f.q} item={f} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1B1023 0%,#8B2FC9 60%,#FF2D95 100%)" }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 65%)", transform: "translate(30%,-30%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-[50px] font-black text-white tracking-tight mb-5">
              Ready to build your brand&apos;s growth?
            </h2>
            <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.8)" }}>
              Join the businesses across Pakistan and the UK who&apos;ve already made SK Techs their last agency search.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 font-bold text-sm px-10 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ background: "#ffffff", color: "#8B2FC9", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
                Contact Us <FaArrowRight size={13} />
              </Link>
              <Link href="/services" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-10 py-4 rounded-xl transition-all duration-200" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff" }}>
                Explore Our Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}



// "use client"

// import React, { useEffect, useRef, useState, ReactNode } from "react"
// import Link from "next/link"
// import { Sora, Inter } from "next/font/google"
// import {
//   FaCode, FaSearch, FaHashtag, FaChartLine, FaPaintBrush,
//   FaMobileAlt, FaStore, FaPenNib, FaArrowRight, FaArrowLeft,
//   FaQuoteLeft, FaChevronDown, FaStar,
// } from "react-icons/fa"

// const sora = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] })
// const inter = Inter({ subsets: ["latin"], variable: "--font-body" })

// /* ─────────────────────────────────────────
//    Brand tokens — original palette
//    purple #8B2FC9   pink #FF2D95   ink #1B1023
//    paper  #FBF7FC    muted #6b6560  line rgba(139,47,201,.14)
// ───────────────────────────────────────── */
// const GRAD = "linear-gradient(135deg,#8B2FC9,#FF2D95)"

// /* ─────────────────────────────────────────
//    Scroll reveal — one clean entrance per section
// ───────────────────────────────────────── */
// function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.12) {
//   const ref = useRef<T>(null)
//   const [visible, setVisible] = useState(false)
//   useEffect(() => {
//     const el = ref.current
//     if (!el) return
//     const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold })
//     obs.observe(el)
//     return () => obs.disconnect()
//   }, [threshold])
//   return { ref, visible }
// }

// function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
//   const { ref, visible } = useReveal()
//   return (
//     <div
//       ref={ref}
//       style={{
//         transitionDelay: `${delay}ms`,
//         opacity: visible ? 1 : 0,
//         transform: visible ? "translateY(0)" : "translateY(18px)",
//         transition: "opacity 0.6s ease, transform 0.6s ease",
//       }}
//       className={className}
//     >
//       {children}
//     </div>
//   )
// }

// /* ─────────────────────────────────────────
//    CountUp
// ───────────────────────────────────────── */
// function CountUp({ value, start }: { value: string; start: boolean }) {
//   const match = value.match(/^([\d.]+)(.*)$/)
//   const target = match ? parseFloat(match[1]) : 0
//   const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0
//   const suffix = match ? match[2] : ""
//   const [display, setDisplay] = useState(0)
//   const rafRef = useRef<number>(0)
//   const startTs = useRef<number>(0)

//   useEffect(() => {
//     if (!start) { startTs.current = 0; return }
//     const dur = 1200
//     const step = (ts: number) => {
//       if (!startTs.current) startTs.current = ts
//       const p = Math.min((ts - startTs.current) / dur, 1)
//       setDisplay((1 - Math.pow(1 - p, 3)) * target)
//       if (p < 1) rafRef.current = requestAnimationFrame(step)
//     }
//     rafRef.current = requestAnimationFrame(step)
//     return () => cancelAnimationFrame(rafRef.current)
//   }, [target, start])

//   return <>{(start ? display : 0).toFixed(decimals)}{suffix}</>
// }

// /* ─────────────────────────────────────────
//    Data
// ───────────────────────────────────────── */
// const stats = [
//   { value: "15", suffix: "+", label: "Years running" },
//   { value: "9", suffix: "", label: "Services, one team" },
//   { value: "2", suffix: "", label: "Countries covered" },
//   { value: "3.2", suffix: "x", label: "Avg. client growth" },
// ]

// const coreServices = [
//   {
//     id: 1, num: "01", title: "Web Development", icon: <FaCode size={18} />, href: "/services/web-development",
//     detail: "We build on frameworks that scale with your traffic, not against it. Every build ships with clean semantic markup, real performance budgets, and a CMS your team can actually use.",
//     bullets: ["Core Web Vitals built in from day one", "Headless or traditional CMS, your call", "Handover documentation, not a black box"],
//   },
//   {
//     id: 2, num: "02", title: "Shopify Development", icon: <FaStore size={18} />, href: "/services/shopify-development",
//     detail: "Theme customisation, app integrations, and checkout flows engineered around cart-abandonment data — not stock templates.",
//     bullets: ["Custom theme builds, not stock templates", "Subscription, wholesale & multi-currency setups", "Speed-audited before launch, every time"],
//   },
//   {
//     id: 3, num: "03", title: "SEO & Content Marketing", icon: <FaSearch size={18} />, href: "/services/seo-content-marketing",
//     detail: "No keyword-stuffed filler. We map content to the questions your buyers actually type into Google, then build the technical SEO underneath it.",
//     bullets: ["Technical audit before any content plan", "Buyer-intent content calendars", "Monthly ranking reports in plain language"],
//   },
//   {
//     id: 4, num: "04", title: "Social Media Marketing", icon: <FaHashtag size={18} />, href: "/services/social-media-marketing",
//     detail: "We pick platforms based on where your buyers already spend time. Content calendars and creative that looks like your brand made it — because we made it as your brand.",
//     bullets: ["Platform strategy before content, always", "Native creative per platform", "Engagement handled inside business hours"],
//   },
//   {
//     id: 5, num: "05", title: "Pay-Per-Click Advertising", icon: <FaChartLine size={18} />, href: "/services/ppc-advertising",
//     detail: "Campaigns structured around your actual margin, not a vanity click-through rate. We report cost per qualified lead and kill underperforming ad sets fast.",
//     bullets: ["Landing pages built to match ad intent", "Weekly bid & budget review", "Kill/scale decisions inside 14 days"],
//   },
// ]

// const moreServices = [
//   { title: "Web Designing", href: "/services/web-designing", icon: <FaPaintBrush size={15} /> },
//   { title: "Application Development", href: "/services/application-development", icon: <FaMobileAlt size={15} /> },
//   { title: "Graphic Designing", href: "/services/graphic-designing", icon: <FaPaintBrush size={15} /> },
//   { title: "Content Writing", href: "/services/content-writing", icon: <FaPenNib size={15} /> },
// ]

// const checks = [
//   { title: "One team, not three vendors", desc: "Design, development and marketing sit in the same room, so nothing gets lost between handoffs." },
//   { title: "Plain-number reporting", desc: "Every monthly report reads in minutes and says what changed, why, and what's next." },
//   { title: "Direct access to the people doing the work", desc: "You talk to the developer and the strategist, not an account manager relaying messages." },
//   { title: "The same playbook since 2011", desc: "Fifteen years of the same accountable process, refined, not reinvented every quarter." },
// ]

// const industries = ["E-commerce", "Healthcare", "Real Estate", "Hospitality", "Education", "Professional Services", "Startups", "Retail"]

// const process = [
//   { num: "01", title: "Discover", desc: "We learn your business, your customers, and what's actually stopping growth right now." },
//   { num: "02", title: "Design & Build", desc: "Websites, apps and creative that look considered and load fast, on solid foundations." },
//   { num: "03", title: "Launch", desc: "SEO, social and paid campaigns go live with tracking in place from day one." },
//   { num: "04", title: "Grow", desc: "We read the numbers monthly and adjust the plan, so spend keeps turning into results." },
// ]

// const caseStudies = [
//   { client: "Boutique fashion retailer", region: "UK", result: "3.2", suffix: "x", metric: "organic traffic in 6 months", detail: "Rebuilt their Shopify store and rebuilt SEO from the ground up around actual buyer intent, not keyword volume alone." },
//   { client: "Healthcare clinic network", region: "Pakistan", result: "4", suffix: "x", metric: "qualified leads from paid search", detail: "Restructured Google Ads campaigns and landing pages around each clinic's specialty instead of one generic funnel." },
//   { client: "B2B SaaS startup", region: "UK", result: "58", suffix: "%", metric: "lower cost per lead", detail: "Replaced a scattershot social strategy with a focused content and PPC funnel built around one buyer persona." },
// ]

// const testimonials = [
//   { quote: "They rebuilt our site in six weeks and our bounce rate dropped almost immediately. First agency that actually explained what they were doing.", author: "Operations Lead", role: "Retail client" },
//   { quote: "We'd worked with three agencies before SK Techs. This is the first one where design and marketing weren't fighting each other.", author: "Founder", role: "Hospitality client" },
//   { quote: "Monthly reports are in plain language. I can tell my board what happened without translating anything.", author: "Marketing Manager", role: "Healthcare client" },
// ]

// const faqs = [
//   { q: "How long does a typical website project take?", a: "A standard business website runs 3–5 weeks from kickoff to launch. Larger builds with custom features or e-commerce typically take 6–10 weeks, depending on scope." },
//   { q: "Do you work with businesses outside Pakistan and the UK?", a: "Yes. Most of our work is remote and we run projects for clients across time zones, with weekly check-ins scheduled around your hours." },
//   { q: "Can you just run marketing for a site you didn't build?", a: "Often, yes. We'll audit the existing site first so campaigns aren't sending traffic to pages that won't convert." },
//   { q: "How do you report on results?", a: "You get a monthly report in plain language: traffic, leads, cost per result, and what we're changing next. No jargon-only dashboards." },
//   { q: "What does a project cost?", a: "It depends on scope — a landing page and a multi-market e-commerce build aren't priced the same way. Tell us what you need and we'll send a fixed quote within two business days." },
// ]

// const estimatorIndustries = [
//   { key: "ecommerce", label: "E-commerce", multiplier: 3.2 },
//   { key: "healthcare", label: "Healthcare", multiplier: 2.4 },
//   { key: "b2b", label: "B2B / SaaS", multiplier: 2.1 },
//   { key: "hospitality", label: "Hospitality", multiplier: 2.8 },
// ]

// /* ─────────────────────────────────────────
//    Section tag
// ───────────────────────────────────────── */
// function SectionTag({ children }: { children: ReactNode }) {
//   return (
//     <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full mb-5"
//       style={{ background: "rgba(139,47,201,0.08)", border: "1px solid rgba(139,47,201,0.22)", color: "#8B2FC9" }}>
//       {children}
//     </div>
//   )
// }

// /* ─────────────────────────────────────────
//    Service Explorer — click-through tabs
// ───────────────────────────────────────── */
// function ServiceExplorer() {
//   const [active, setActive] = useState(0)
//   const s = coreServices[active]
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] rounded-3xl overflow-hidden" style={{ border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 20px 60px rgba(27,16,35,0.08)" }}>
//       <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible" style={{ background: "#1B1023" }}>
//         {coreServices.map((item, i) => (
//           <button
//             key={item.id}
//             onClick={() => setActive(i)}
//             className="flex items-center gap-3 px-5 py-4 text-left flex-shrink-0 lg:flex-shrink w-full transition-all duration-300"
//             style={{ background: active === i ? GRAD : "transparent", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
//           >
//             <span className="text-[12px] font-black tabular-nums" style={{ color: active === i ? "#fff" : "rgba(255,255,255,0.35)" }}>{item.num}</span>
//             <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: active === i ? "#fff" : "rgba(255,255,255,0.75)" }}>{item.title}</span>
//           </button>
//         ))}
//       </div>

//       <div className="p-8 md:p-10" style={{ background: "#ffffff" }}>
//         <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ background: GRAD, color: "#fff" }}>
//           {s.icon}
//         </div>
//         <h3 className="text-2xl font-bold mb-3" style={{ color: "#1B1023" }}>{s.title}</h3>
//         <p className="text-[15px] leading-relaxed mb-5 max-w-lg" style={{ color: "#6b6560" }}>{s.detail}</p>
//         <ul className="flex flex-col gap-2.5 mb-7">
//           {s.bullets.map((b) => (
//             <li key={b} className="flex items-start gap-3 text-sm font-medium" style={{ color: "#1B1023" }}>
//               <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#FF2D95" }} />
//               {b}
//             </li>
//           ))}
//         </ul>
//         <Link href={s.href} className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: "#8B2FC9" }}>
//           More on {s.title} <FaArrowRight size={11} />
//         </Link>
//       </div>
//     </div>
//   )
// }

// /* ─────────────────────────────────────────
//    Growth Estimator — signature interactive moment
// ───────────────────────────────────────── */
// function GrowthEstimator() {
//   const [traffic, setTraffic] = useState(2000)
//   const [industryKey, setIndustryKey] = useState("ecommerce")
//   const industry = estimatorIndustries.find((i) => i.key === industryKey)!
//   const projected = Math.round(traffic * industry.multiplier)

//   return (
//     <div className="rounded-3xl p-8 md:p-12 relative overflow-hidden" style={{ background: "#1B1023" }}>
//       <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(139,47,201,0.35) 0%,transparent 65%)", transform: "translate(30%,-35%)" }} />
//       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
//         <div>
//           <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "#FF2D95" }}>Try it yourself</p>
//           <h3 className="text-2xl md:text-[32px] font-black leading-tight mb-7" style={{ color: "#fff" }}>
//             What could six months of this look like for you?
//           </h3>

//           <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.65)" }}>
//             Current monthly visitors: <span style={{ color: "#fff", fontWeight: 800 }}>{traffic.toLocaleString()}</span>
//           </label>
//           <input
//             type="range" min={200} max={20000} step={100} value={traffic}
//             onChange={(e) => setTraffic(Number(e.target.value))}
//             className="w-full mb-8"
//             style={{ accentColor: "#FF2D95" }}
//           />

//           <label className="block text-sm font-semibold mb-3" style={{ color: "rgba(255,255,255,0.65)" }}>Industry</label>
//           <div className="flex flex-wrap gap-2">
//             {estimatorIndustries.map((i) => (
//               <button
//                 key={i.key}
//                 onClick={() => setIndustryKey(i.key)}
//                 className="px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-200"
//                 style={{
//                   background: industryKey === i.key ? GRAD : "rgba(255,255,255,0.06)",
//                   color: "#fff",
//                   border: industryKey === i.key ? "1px solid transparent" : "1px solid rgba(255,255,255,0.16)",
//                 }}
//               >
//                 {i.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)" }}>
//           <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>Illustrative projected visitors, 6 months</p>
//           <p className="text-5xl md:text-6xl font-black tabular-nums mb-4" style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
//             {projected.toLocaleString()}
//           </p>
//           <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)" }}>
//             Based on the average {industry.multiplier}x growth {industry.label.toLowerCase()} clients saw across comparable engagements. Your real number depends on your starting point — this is a conversation starter, not a quote.
//           </p>
//           <Link
//             href="/contact"
//             className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3.5 rounded-xl transition-transform duration-200 hover:-translate-y-0.5"
//             style={{ background: GRAD, color: "#fff", boxShadow: "0 10px 30px rgba(139,47,201,0.4)" }}
//           >
//             Get a real number for my site <FaArrowRight size={11} />
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ─────────────────────────────────────────
//    Case Study Switcher
// ───────────────────────────────────────── */
// function CaseStudySwitcher() {
//   const [active, setActive] = useState(0)
//   const c = caseStudies[active]
//   return (
//     <div>
//       <div className="flex flex-wrap gap-2 mb-8">
//         {caseStudies.map((cs, i) => (
//           <button
//             key={cs.client}
//             onClick={() => setActive(i)}
//             className="px-4 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200"
//             style={{
//               background: active === i ? GRAD : "#ffffff",
//               color: active === i ? "#fff" : "#6b6560",
//               border: active === i ? "1px solid transparent" : "1px solid rgba(139,47,201,0.18)",
//               boxShadow: active === i ? "0 8px 22px rgba(139,47,201,0.28)" : "none",
//             }}
//           >
//             {cs.client}
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-start p-8 md:p-10 rounded-3xl" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 20px 60px rgba(27,16,35,0.06)" }}>
//         <div className="md:min-w-[180px]">
//           <p className="text-6xl font-black tabular-nums leading-none" style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
//             <CountUp value={`${c.result}${c.suffix}`} start={true} />
//           </p>
//           <p className="text-sm font-bold mt-3" style={{ color: "#1B1023" }}>{c.metric}</p>
//         </div>
//         <div>
//           <p className="text-[15px] leading-relaxed mb-4" style={{ color: "#6b6560" }}>{c.detail}</p>
//           <p className="text-sm font-bold" style={{ color: "#1B1023" }}>
//             {c.client} <span style={{ color: "#c9a8dd", fontWeight: 500 }}>— {c.region}</span>
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// /* ─────────────────────────────────────────
//    Testimonial carousel
// ───────────────────────────────────────── */
// function TestimonialCarousel() {
//   const [index, setIndex] = useState(0)
//   const t = testimonials[index]
//   const go = (dir: number) => setIndex((i) => (i + dir + testimonials.length) % testimonials.length)

//   return (
//     <div className="max-w-2xl mx-auto text-center">
//       <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-7" style={{ background: GRAD, color: "#fff" }}>
//         <FaQuoteLeft size={18} />
//       </div>
//       <div className="flex justify-center gap-0.5 mb-5">{[1, 2, 3, 4, 5].map((s) => <FaStar key={s} size={14} className="text-yellow-400" />)}</div>
//       <p key={index} className="text-xl md:text-2xl font-medium leading-relaxed mb-8" style={{ color: "#1B1023" }}>
//         {t.quote}
//       </p>
//       <p className="text-sm font-bold" style={{ color: "#1B1023" }}>{t.author}</p>
//       <p className="text-sm mb-9" style={{ color: "#c9a8dd" }}>{t.role}</p>

//       <div className="flex items-center justify-center gap-4">
//         <button onClick={() => go(-1)} aria-label="Previous testimonial" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200" style={{ border: "1px solid rgba(139,47,201,0.25)", color: "#8B2FC9" }}>
//           <FaArrowLeft size={12} />
//         </button>
//         <div className="flex gap-1.5 items-center">
//           {testimonials.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setIndex(i)}
//               aria-label={`Show testimonial ${i + 1}`}
//               className="h-2 rounded-full transition-all duration-200"
//               style={{ background: i === index ? GRAD : "rgba(139,47,201,0.2)", width: i === index ? 22 : 8 }}
//             />
//           ))}
//         </div>
//         <button onClick={() => go(1)} aria-label="Next testimonial" className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200" style={{ border: "1px solid rgba(139,47,201,0.25)", color: "#8B2FC9" }}>
//           <FaArrowRight size={12} />
//         </button>
//       </div>
//     </div>
//   )
// }

// /* ─────────────────────────────────────────
//    FAQ
// ───────────────────────────────────────── */
// function FAQItem({ item, isOpen, onToggle }: { item: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
//   return (
//     <div style={{ borderBottom: "1px solid rgba(139,47,201,0.12)" }}>
//       <button onClick={onToggle} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen}>
//         <span className="font-bold text-[16px]" style={{ color: "#1B1023" }}>{item.q}</span>
//         <span
//           className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
//           style={{ background: isOpen ? GRAD : "rgba(139,47,201,0.08)", color: isOpen ? "#fff" : "#8B2FC9", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease, background 0.3s ease, color 0.3s ease" }}
//         >
//           <FaChevronDown size={11} />
//         </span>
//       </button>
//       <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
//         <div className="overflow-hidden">
//           <p className="pb-6 pr-10 text-sm leading-relaxed" style={{ color: "#6b6560" }}>{item.a}</p>
//         </div>
//       </div>
//     </div>
//   )
// }

// const marqueeCSS = `@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`

// /* ─────────────────────────────────────────
//    Page
// ───────────────────────────────────────── */
// export default function HomePage() {
//   const [heroVisible, setHeroVisible] = useState(false)
//   const [openFaq, setOpenFaq] = useState<number | null>(0)
//   const statsReveal = useReveal(0.3)

//   useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t) }, [])

//   return (
//     <main
//       className={`${sora.variable} ${inter.variable} font-sans min-h-screen overflow-x-hidden`}
//       style={{ background: "linear-gradient(160deg,#ffffff 0%,#FBF7FC 50%,#ffffff 100%)" }}
//     >
//       <style dangerouslySetInnerHTML={{ __html: marqueeCSS }} />

//       {/* HERO */}
//       <section className="relative pt-32 md:pt-40 pb-24 overflow-hidden">
//         <div className="absolute inset-0 pointer-events-none" style={{
//           backgroundImage: "radial-gradient(ellipse 80% 60% at 15% 5%,rgba(139,47,201,0.09) 0%,transparent 60%),radial-gradient(ellipse 55% 45% at 88% 20%,rgba(255,45,149,0.06) 0%,transparent 55%)",
//         }} />

//         <div className="relative z-10 w-11/12 max-w-6xl mx-auto">
//           <div
//             style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
//             className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] px-4 py-2 rounded-full mb-7"
//           >
//             <span className="inline-flex items-center gap-2 px-0" style={{ color: "#8B2FC9", background: "rgba(139,47,201,0.08)", border: "1px solid rgba(139,47,201,0.25)", borderRadius: 999, padding: "8px 16px" }}>
//               <FaStar size={9} /> UK &amp; Pakistan&apos;s Digital Growth Partner
//             </span>
//           </div>

//           <h1
//             style={{
//               opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(24px)",
//               transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", color: "#1B1023",
//             }}
//             className="text-4xl sm:text-5xl md:text-[62px] font-black leading-[1.06] tracking-tight mb-7 max-w-3xl"
//           >
//             Digital growth,{" "}
//             <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>built and measured</span>
//           </h1>

//           <p
//             style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", color: "#6b6560" }}
//             className="text-base md:text-lg leading-relaxed mb-10 max-w-xl"
//           >
//             SK Techs designs your website, runs the campaigns that bring people to it, and reports back in numbers you can actually use. Since 2011.
//           </p>

//           <div
//             style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s" }}
//             className="flex flex-wrap gap-4"
//           >
//             <Link href="/contact" className="inline-flex items-center justify-center gap-2 text-white font-bold text-sm px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ background: GRAD, boxShadow: "0 6px 28px rgba(139,47,201,0.35)" }}>
//               Start a Project <FaArrowRight size={12} />
//             </Link>
//             <Link href="/portfolio" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-8 py-4 rounded-xl transition-all duration-200" style={{ background: "rgba(139,47,201,0.05)", border: "1px solid rgba(139,47,201,0.25)", color: "#8B2FC9" }}>
//               See Our Work
//             </Link>
//           </div>
//         </div>

//         <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] pointer-events-none">
//           <svg viewBox="0 0 1440 48" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-10" style={{ fill: "#FBF7FC" }}>
//             <path d="M0,24 C360,48 1080,0 1440,24 L1440,48 L0,48 Z" />
//           </svg>
//         </div>
//       </section>

//       {/* STATS */}
//       <section className="py-16" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
//         <div ref={statsReveal.ref} className="w-11/12 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
//           {stats.map((s) => (
//             <div key={s.label} className="text-center">
//               <p className="text-4xl md:text-5xl font-black tabular-nums mb-1" style={{ color: "#1B1023" }}>
//                 <CountUp value={`${s.value}${s.suffix}`} start={statsReveal.visible} />
//               </p>
//               <p className="text-sm font-medium" style={{ color: "#6b6560" }}>{s.label}</p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* ABOUT */}
//       <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
//         <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
//           <Reveal>
//             <SectionTag>About Our Company</SectionTag>
//             <h2 className="text-3xl md:text-[42px] font-black leading-[1.1] mb-6 max-w-md" style={{ color: "#1B1023" }}>
//               Most agencies do one thing well. We kept everything under one roof.
//             </h2>
//             <p className="leading-relaxed mb-4 max-w-md" style={{ color: "#6b6560" }}>
//               Design, development and marketing waiting on each other — or on each other&apos;s excuses — is how most projects stall. We&apos;ve run the same integrated playbook since 2011 for businesses across Pakistan and the UK.
//             </p>
//             <Link href="/about" className="inline-flex items-center gap-2 text-white font-bold text-sm px-8 py-4 rounded-xl mt-4 transition-all duration-200 hover:-translate-y-1" style={{ background: GRAD, boxShadow: "0 6px 28px rgba(139,47,201,0.3)" }}>
//               Learn More <FaArrowRight size={12} />
//             </Link>
//           </Reveal>

//           <Reveal delay={100}>
//             <div className="flex flex-col">
//               {checks.map((c, i) => (
//                 <div key={c.title} className="py-5" style={{ borderTop: i === 0 ? "1px solid rgba(139,47,201,0.14)" : "none", borderBottom: "1px solid rgba(139,47,201,0.14)" }}>
//                   <h3 className="font-bold text-[15px] mb-1.5" style={{ color: "#1B1023" }}>{c.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{c.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </Reveal>
//         </div>
//       </section>

//       {/* INDUSTRIES MARQUEE */}
//       <div className="py-6 overflow-hidden" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
//         <div className="flex items-center gap-12" style={{ animation: "marquee 24s linear infinite", width: "max-content" }}>
//           {[...industries, ...industries].map((t, i) => (
//             <span key={i} className="text-[13px] font-semibold whitespace-nowrap px-4 py-2 rounded-lg" style={{ color: "#6b6560", border: "1px solid rgba(139,47,201,0.15)", background: "#ffffff" }}>
//               {t}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* SERVICES */}
//       <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
//         <div className="w-11/12 max-w-6xl mx-auto">
//           <Reveal className="mb-12 max-w-xl">
//             <SectionTag>What We Lead With</SectionTag>
//             <h2 className="text-3xl md:text-[42px] font-black leading-[1.1] mb-4" style={{ color: "#1B1023" }}>
//               Five services. One team building all of them together.
//             </h2>
//             <p className="text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>Click through to see how each one actually works.</p>
//           </Reveal>

//           <Reveal delay={80}><ServiceExplorer /></Reveal>

//           <Reveal delay={140} className="mt-10">
//             <p className="text-sm font-bold mb-4" style={{ color: "#1B1023" }}>And whatever else your brand needs:</p>
//             <div className="flex flex-wrap gap-3">
//               {moreServices.map((s) => (
//                 <Link key={s.title} href={s.href} className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200" style={{ border: "1px solid rgba(139,47,201,0.18)", color: "#1B1023" }}>
//                   <span style={{ color: "#8B2FC9" }}>{s.icon}</span>
//                   {s.title}
//                 </Link>
//               ))}
//             </div>
//           </Reveal>
//         </div>
//       </section>

//       {/* GROWTH ESTIMATOR */}
//       <section className="py-24 md:py-28" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
//         <div className="w-11/12 max-w-6xl mx-auto">
//           <Reveal><GrowthEstimator /></Reveal>
//         </div>
//       </section>

//       {/* PROCESS */}
//       <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
//         <div className="w-11/12 max-w-6xl mx-auto">
//           <Reveal className="mb-14 max-w-xl">
//             <SectionTag>How We Work</SectionTag>
//             <h2 className="text-3xl md:text-[42px] font-black leading-[1.1]" style={{ color: "#1B1023" }}>
//               How a project runs, start to finish.
//             </h2>
//           </Reveal>

//           <Reveal delay={80}>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//               {process.map((p) => (
//                 <div key={p.num} className="flex flex-col gap-4 p-7 rounded-2xl h-full transition-all duration-300 hover:-translate-y-2" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 2px 12px rgba(27,16,35,0.04)" }}>
//                   <span className="text-[42px] font-black leading-none" style={{ background: "linear-gradient(135deg,rgba(139,47,201,0.3),rgba(255,45,149,0.08))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{p.num}</span>
//                   <h3 className="font-bold text-[17px]" style={{ color: "#1B1023" }}>{p.title}</h3>
//                   <p className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{p.desc}</p>
//                 </div>
//               ))}
//             </div>
//           </Reveal>
//         </div>
//       </section>

//       {/* CASE STUDIES */}
//       <section className="py-24 md:py-28" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
//         <div className="w-11/12 max-w-6xl mx-auto">
//           <Reveal className="mb-12 max-w-xl">
//             <SectionTag>Proof, Not Promises</SectionTag>
//             <h2 className="text-3xl md:text-[42px] font-black leading-[1.1]" style={{ color: "#1B1023" }}>
//               Recent results, by the client.
//             </h2>
//           </Reveal>
//           <Reveal delay={80}><CaseStudySwitcher /></Reveal>
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
//         <div className="w-11/12 max-w-6xl mx-auto">
//           <Reveal><TestimonialCarousel /></Reveal>
//         </div>
//       </section>

//       {/* CONTACT STRIP */}
//       <section className="py-16" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
//         <div className="w-11/12 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10">
//           {[
//             { label: "Office", lines: ["PAK Arab Society, Gulberg", "Lahore, Pakistan"] },
//             { label: "Call Us", lines: ["Pakistan: +92 336 8007788", "UK: +44 7708 568160"] },
//             { label: "Email", lines: ["info@sktechs.com"] },
//           ].map((c) => (
//             <div key={c.label}>
//               <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-2" style={{ color: "#8B2FC9" }}>{c.label}</p>
//               {c.lines.map((l) => <p key={l} className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{l}</p>)}
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* FAQ */}
//       <section style={{ background: "#ffffff", borderTop: "1px solid rgba(139,47,201,0.1)" }}>
//         <div className="w-11/12 max-w-2xl mx-auto">
//           <Reveal className="text-center pt-24 pb-10">
//             <SectionTag>Got Questions?</SectionTag>
//             <h2 className="text-3xl md:text-[42px] font-black leading-[1.1]" style={{ color: "#1B1023" }}>Frequently Asked Questions</h2>
//           </Reveal>
//           <div className="pb-24" style={{ borderTop: "1px solid rgba(139,47,201,0.12)" }}>
//             {faqs.map((f, i) => (
//               <FAQItem key={f.q} item={f} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA BAND */}
//       <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1B1023 0%,#8B2FC9 60%,#FF2D95 100%)" }}>
//         <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 65%)", transform: "translate(30%,-30%)" }} />
//         <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
//           <Reveal>
//             <h2 className="text-4xl md:text-[50px] font-black text-white tracking-tight mb-5">
//               Ready to build your brand&apos;s growth?
//             </h2>
//             <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.8)" }}>
//               Join the businesses across Pakistan and the UK who&apos;ve already made SK Techs their last agency search.
//             </p>
//             <div className="flex flex-wrap gap-4 justify-center">
//               <Link href="/contact" className="inline-flex items-center justify-center gap-2 font-bold text-sm px-10 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ background: "#ffffff", color: "#8B2FC9", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
//                 Contact Us <FaArrowRight size={13} />
//               </Link>
//               <Link href="/services" className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-10 py-4 rounded-xl transition-all duration-200" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.35)", color: "#fff" }}>
//                 Explore Our Services
//               </Link>
//             </div>
//           </Reveal>
//         </div>
//       </section>
//     </main>
//   )
}