"use client"

import React, { useEffect, useRef, useState, ReactNode } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Bricolage_Grotesque, Manrope } from "next/font/google"
import {
  FaCode, FaSearch, FaHashtag, FaChartLine, FaPaintBrush,
  FaMobileAlt, FaStore, FaPenNib, FaArrowRight, FaArrowLeft,
  FaQuoteLeft, FaChevronDown, FaStar, FaPhoneAlt, FaEnvelope,
  FaMapMarkerAlt, FaUsers, FaAngleDown, FaArrowUp, FaBullhorn,
} from "react-icons/fa"

// 3D fabric/silk hero background — client-only, code-split away from
// the main bundle since it pulls in three.js + @react-three/fiber.
const HeroScene = dynamic(() => import("../components/Heroscene"), { ssr: false })

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] })
const body = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700", "800"] })

/* ─────────────────────────────────────────
   Brand tokens
   purple #8B2FC9   pink #FF2D95   ink #1B1023   paper #FBF7FC
   muted #6b6560    gold #FFB648 (accent highlight, used sparingly)
───────────────────────────────────────── */
const GRAD = "linear-gradient(135deg,#8B2FC9,#FF2D95)"
const GRAD_SOFT = "linear-gradient(135deg,rgba(139,47,201,0.12),rgba(255,45,149,0.12))"
const DISPLAY = "var(--font-display)"

/* ─────────────────────────────────────────
   Scroll reveal
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

/* ─────────────────────────────────────────
   Magnetic link
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const stats = [
  { value: "15", suffix: "+", label: "Years running", icon: <FaChartLine size={15} /> },
  { value: "9", suffix: "", label: "Services, one team", icon: <FaBullhorn size={15} /> },
  { value: "2", suffix: "", label: "Countries covered", icon: <FaMapMarkerAlt size={15} /> },
  { value: "3.2", suffix: "x", label: "Avg. client growth", icon: <FaArrowUp size={15} /> },
]

const coreServices = [
  {
    id: 1, title: "Web Development", icon: <FaCode size={18} />, href: "/services/web-development",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80",
    benefit: "A site that loads fast and converts, not just one that looks nice in a screenshot.",
    detail: "We build on frameworks that scale with your traffic, not against it. Every build ships with clean semantic markup, real performance budgets, and a CMS your team can actually use.",
    bullets: ["Core Web Vitals built in from day one", "Headless or traditional CMS, your call", "Handover documentation, not a black box"],
  },
  {
    id: 2, title: "Shopify Development", icon: <FaStore size={18} />, href: "/services/shopify-development",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80",
    benefit: "A storefront tuned to sell, built around how your buyers actually check out.",
    detail: "Theme customisation, app integrations, and checkout flows engineered around cart-abandonment data — not stock templates.",
    bullets: ["Custom theme builds, not stock templates", "Subscription, wholesale & multi-currency setups", "Speed-audited before launch, every time"],
  },
  {
    id: 3, title: "SEO & Content Marketing", icon: <FaSearch size={18} />, href: "/services/seo-content-marketing",
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=800&q=80",
    benefit: "Rankings built on what buyers actually search, not keyword-stuffed filler.",
    detail: "We map content to the questions your buyers actually type into Google, then build the technical SEO underneath it.",
    bullets: ["Technical audit before any content plan", "Buyer-intent content calendars", "Monthly ranking reports in plain language"],
  },
  {
    id: 4, title: "Social Media Marketing", icon: <FaHashtag size={18} />, href: "/services/social-media-marketing",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
    benefit: "Content that looks like your brand made it — because we made it as your brand.",
    detail: "We pick platforms based on where your buyers already spend time, then build creative and calendars around that behaviour.",
    bullets: ["Platform strategy before content, always", "Native creative per platform", "Engagement handled inside business hours"],
  },
  {
    id: 5, title: "Pay-Per-Click Advertising", icon: <FaChartLine size={18} />, href: "/services/ppc-advertising",
    image: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80",
    benefit: "Campaigns built around your margin, not a vanity click-through rate.",
    detail: "We report cost per qualified lead and kill underperforming ad sets fast, so spend keeps turning into pipeline.",
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

const collage = [
  { src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80", alt: "Developers pairing on a website build", label: "Website build" },
  { src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80", alt: "Social media campaign creative on a screen", label: "Campaign creative" },
  { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80", alt: "Analytics dashboard showing traffic growth", label: "Growth reporting" },
]

const industries = ["WEB DESIGN", "SEO", "SOCIAL MEDIA", "PPC", "BRANDING", "CONTENT", "E-COMMERCE", "DIGITAL GROWTH"]

const journeyBubbles = ["Branding", "Website", "SEO", "Social", "Content", "PPC", "E-commerce", "Analytics"]

const process = [
  { num: "01", title: "Discover", desc: "We learn your business, your customers, and what's actually stopping growth right now." },
  { num: "02", title: "Design & Build", desc: "Websites, apps and creative that look considered and load fast, on solid foundations." },
  { num: "03", title: "Launch", desc: "SEO, social and paid campaigns go live with tracking in place from day one." },
  { num: "04", title: "Grow", desc: "We read the numbers monthly and adjust the plan, so spend keeps turning into results." },
]

const caseStudies = [
  { client: "Boutique fashion retailer", region: "UK", result: "3.2", suffix: "x", metric: "organic traffic in 6 months", tag: "Shopify + SEO", detail: "Rebuilt their Shopify store and rebuilt SEO from the ground up around actual buyer intent, not keyword volume alone.", image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=900&q=80" },
  { client: "Healthcare clinic network", region: "Pakistan", result: "4", suffix: "x", metric: "qualified leads from paid search", tag: "PPC + Landing Pages", detail: "Restructured Google Ads campaigns and landing pages around each clinic's specialty instead of one generic funnel.", image: "https://images.unsplash.com/photo-1587351021355-a479a299d2f9?auto=format&fit=crop&w=900&q=80" },
  { client: "B2B SaaS startup", region: "UK", result: "58", suffix: "%", metric: "lower cost per lead", tag: "Content + PPC", detail: "Replaced a scattershot social strategy with a focused content and PPC funnel built around one buyer persona.", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80" },
]

const resultMetrics = [
  { label: "Traffic", value: 82, display: "+82%" },
  { label: "Leads", value: 64, display: "+64%" },
  { label: "Conversions", value: 47, display: "+47%" },
  { label: "Engagement", value: 71, display: "+71%" },
]

const testimonials = [
  { quote: "They rebuilt our site in six weeks and our bounce rate dropped almost immediately. First agency that actually explained what they were doing.", author: "Operations Lead", role: "Retail client", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" },
  { quote: "We'd worked with three agencies before SK Techs. This is the first one where design and marketing weren't fighting each other.", author: "Founder", role: "Hospitality client", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" },
  { quote: "Monthly reports are in plain language. I can tell my board what happened without translating anything.", author: "Marketing Manager", role: "Healthcare client", avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=120&q=80" },
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
   Section marker — used sparingly, not on every section
───────────────────────────────────────── */
function SectionMark({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: GRAD }} />
      <span className="text-[14px] font-semibold" style={{ color: "#8B2FC9", fontFamily: DISPLAY }}>{children}</span>
    </div>
  )
}

const wordFadeCSS = `
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes bounceDown{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
@keyframes wordFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes floatSlow{0%,100%{transform:translateY(0) rotate(var(--rot,0deg))}50%{transform:translateY(-14px) rotate(var(--rot,0deg))}}
@keyframes growBar{from{width:0}to{width:var(--w)}}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`

/* ─────────────────────────────────────────
   Rotating word (headline gradient words)
───────────────────────────────────────── */
function GradWord({ children }: { children: ReactNode }) {
  return <span style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{children}</span>
}

/* ─────────────────────────────────────────
   Hero — cinematic centered composition with an animated 3D
   fabric/silk form behind the copy. Same content as before,
   rearranged into the reference's layout: eyebrow → dominant
   headline → accent line → supporting copy → CTAs → category tags.
───────────────────────────────────────── */
function Hero({ visible }: { visible: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReducedMotion(mq.matches)
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  return (
    <section
      className="relative min-h-screen md:min-h-[100svh] flex items-center overflow-hidden"
      style={{ background: "#1B1023" }}
    >
      {/* Layer 1 — animated 3D fabric/silk background */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* Layer 2 — readability overlay, heavier toward the bottom where the scroll cue sits */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(27,16,35,0.25) 0%, rgba(27,16,35,0.15) 30%, rgba(27,16,35,0.5) 78%, rgba(27,16,35,0.92) 100%)",
        }}
      />

      {/* Layer 3 — hero content */}
      <div className="relative z-10 w-11/12 max-w-4xl mx-auto text-center pt-28 pb-24">
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span
            className="inline-flex items-center gap-2"
            style={{ color: "#fff", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 999, padding: "8px 16px", fontFamily: DISPLAY, fontWeight: 600, fontSize: 13 }}
          >
            <FaStar size={9} style={{ color: "#FFB648" }} /> Digital growth partner for Pakistan &amp; UK
          </span>
        </div>

        <h1
          style={{
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", color: "#fff", fontFamily: DISPLAY,
          }}
          className="text-[42px] sm:text-6xl md:text-[74px] font-bold leading-[1.03] tracking-tight mb-7"
        >
          Your brand deserves more than<br className="hidden sm:block" /> just a <GradWord>website.</GradWord>
        </h1>

        <p
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", color: "rgba(255,255,255,0.68)" }}
          className="text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
        >
          We build brands, websites and marketing systems that turn attention into measurable growth — design, development and marketing, run by one accountable team since 2011.
        </p>

        <div
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s" }}
          className="flex flex-wrap gap-4 justify-center mb-14"
        >
          <MagneticLink href="/contact" variant="solid">Start your project <FaArrowRight size={12} /></MagneticLink>
          <MagneticLink href="/portfolio" variant="onDark">Explore our work</MagneticLink>
        </div>

        <div
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.4s" }}
          className="flex flex-wrap justify-center gap-2.5"
        >
          {["Web Development", "SEO", "Social Media", "PPC"].map((t) => (
            <span
              key={t}
              className="px-4 py-2 rounded-full text-[12px] font-semibold"
              style={{ color: "rgba(255,255,255,0.72)", border: "1px solid rgba(255,255,255,0.16)" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* scroll cue */}
      <div
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity: visible ? 0.55 : 0, transition: "opacity 1s ease 0.6s", animation: visible && !reducedMotion ? "bounceDown 2.2s ease-in-out infinite" : "none" }}
      >
        <FaAngleDown size={18} style={{ color: "rgba(255,255,255,0.6)" }} />
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Service Explorer — large interactive cards with pill tabs
───────────────────────────────────────── */
function ServiceExplorer() {
  const [active, setActive] = useState(0)
  const s = coreServices[active]
  return (
    <div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: "none" }}>
        {coreServices.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActive(i)}
            className="flex items-center gap-2.5 px-5 py-3 rounded-full flex-shrink-0 transition-all duration-300"
            style={{
              background: active === i ? GRAD : "#ffffff",
              border: active === i ? "1px solid transparent" : "1px solid rgba(139,47,201,0.18)",
              boxShadow: active === i ? "0 10px 26px rgba(139,47,201,0.3)" : "none",
            }}
          >
            <span style={{ color: active === i ? "#fff" : "#8B2FC9" }}>{item.icon}</span>
            <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: active === i ? "#fff" : "#1B1023", fontFamily: DISPLAY }}>{item.title}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] rounded-[28px] overflow-hidden" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 24px 60px rgba(27,16,35,0.09)" }}>
        <div className="relative h-56 lg:h-auto overflow-hidden">
          <img key={s.id} src={s.image} alt={`${s.title} work sample`} className="w-full h-full object-cover" loading="lazy" style={{ animation: "wordFade 0.5s ease" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(27,16,35,0.5) 0%,transparent 45%)" }} />
          <div className="absolute bottom-5 left-6 right-6">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: GRAD, color: "#fff" }}>{s.icon}</div>
            <p className="text-white text-sm font-semibold leading-snug max-w-xs">{s.benefit}</p>
          </div>
        </div>

        <div className="p-8 md:p-10 flex flex-col justify-center">
          <h3 className="text-2xl md:text-[28px] font-bold mb-3" style={{ color: "#1B1023", fontFamily: DISPLAY }}>{s.title}</h3>
          <p className="text-[15px] leading-relaxed mb-5" style={{ color: "#6b6560" }}>{s.detail}</p>
          <ul className="flex flex-col gap-2.5 mb-7">
            {s.bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm font-medium" style={{ color: "#1B1023" }}>
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#FF2D95" }} />
                {b}
              </li>
            ))}
          </ul>
          <Link href={s.href} className="inline-flex items-center gap-2 text-sm font-bold transition-transform duration-200 hover:translate-x-1 w-fit" style={{ color: "#8B2FC9" }}>
            More on {s.title} <FaArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Journey bubbles — first impression to conversion
───────────────────────────────────────── */
function JourneyFlow() {
  return (
    <div className="relative">
      <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px -translate-y-1/2" style={{ background: "linear-gradient(90deg,transparent,rgba(139,47,201,0.35),rgba(255,45,149,0.35),transparent)" }} />
      <div className="relative flex flex-wrap justify-center gap-3 md:gap-4">
        {journeyBubbles.map((b, i) => (
          <span
            key={b}
            className="px-5 py-3 rounded-full text-sm font-bold"
            style={{
              background: "#ffffff",
              color: "#1B1023",
              border: `1px solid ${i % 2 === 0 ? "rgba(139,47,201,0.3)" : "rgba(255,45,149,0.3)"}`,
              boxShadow: "0 8px 20px rgba(27,16,35,0.06)",
              fontFamily: DISPLAY,
            }}
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Growth Estimator — dashboard-style result
───────────────────────────────────────── */
function GrowthEstimator() {
  const [traffic, setTraffic] = useState(2000)
  const [industryKey, setIndustryKey] = useState("ecommerce")
  const industry = estimatorIndustries.find((i) => i.key === industryKey)!
  const projected = Math.round(traffic * industry.multiplier)
  const pct = Math.min(100, Math.round((industry.multiplier - 1) * 45))
  const cardRef = useRef<HTMLDivElement>(null)

  const onTilt = (e: React.MouseEvent) => {
    const el = cardRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(800px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`
  }
  const onTiltLeave = () => { if (cardRef.current) cardRef.current.style.transform = "perspective(800px) rotateY(0) rotateX(0)" }

  const bars = [40, 55, 48, 70, 62, 85, pct]

  return (
    <div className="rounded-3xl p-8 md:p-12 relative overflow-hidden" style={{ background: "#1B1023" }}>
      <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(139,47,201,0.35) 0%,transparent 65%)", transform: "translate(30%,-35%)" }} />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(255,45,149,0.18) 0%,transparent 65%)", transform: "translate(-25%,35%)" }} />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div>
          <p className="text-sm font-semibold mb-4" style={{ color: "#FF2D95", fontFamily: DISPLAY }}>Try it yourself</p>
          <h3 className="text-2xl md:text-[32px] font-bold leading-tight mb-7" style={{ color: "#fff", fontFamily: DISPLAY }}>
            Let&apos;s see what growth could look like.
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

        <div
          ref={cardRef}
          onMouseMove={onTilt}
          onMouseLeave={onTiltLeave}
          className="rounded-2xl p-8"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", transition: "transform 0.2s ease-out", willChange: "transform" }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>Potential growth, 6 months</p>
            <span className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,45,149,0.18)", color: "#FF87BE" }}>
              <FaArrowUp size={9} /> {industry.multiplier}x
            </span>
          </div>
          <p className="text-5xl md:text-6xl font-bold tabular-nums mb-5" style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: DISPLAY }}>
            <CountUp value={String(projected)} start={true} /> visitors
          </p>

          {/* mini bar chart */}
          <div className="flex items-end gap-1.5 h-16 mb-6">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, background: i === bars.length - 1 ? GRAD : "rgba(255,255,255,0.14)" }} />
            ))}
          </div>

          {/* progress indicator */}
          <div className="h-1.5 rounded-full mb-6 overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: GRAD, transition: "width 0.4s ease" }} />
          </div>

          <p className="text-[13px] leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
            Illustrative estimate based on average outcomes for comparable {industry.label.toLowerCase()} clients — a conversation starter, not a quote.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3.5 rounded-xl transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: GRAD, color: "#fff", boxShadow: "0 10px 30px rgba(139,47,201,0.4)", fontFamily: DISPLAY }}
          >
            Get a real number for my site
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-0 rounded-[28px] overflow-hidden" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 24px 60px rgba(27,16,35,0.08)" }}>
        <div className="relative h-64 lg:h-auto overflow-hidden">
          <img key={c.client} src={c.image} alt={`${c.client} project work`} className="w-full h-full object-cover" loading="lazy" style={{ animation: "wordFade 0.5s ease" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(27,16,35,0.55) 0%,transparent 50%)" }} />
          <span className="absolute bottom-5 left-6 text-[12px] font-bold px-3 py-1.5 rounded-full text-white" style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}>{c.tag}</span>
        </div>
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <p key={c.client + "num"} className="text-6xl font-bold tabular-nums leading-none mb-2" style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: DISPLAY, animation: "wordFade 0.5s ease" }}>
            +<CountUp value={`${c.result}${c.suffix}`} start={true} />
          </p>
          <p className="text-sm font-bold mb-4" style={{ color: "#1B1023" }}>{c.metric}</p>
          <p className="text-[15px] leading-relaxed mb-5" style={{ color: "#6b6560" }}>{c.detail}</p>
          <p className="text-sm font-bold mb-5" style={{ color: "#1B1023" }}>
            {c.client} <span style={{ color: "#c9a8dd", fontWeight: 500 }}>— {c.region}</span>
          </p>
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-bold transition-transform duration-200 hover:translate-x-1 w-fit" style={{ color: "#8B2FC9" }}>
            View case study <FaArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Results dashboard — traffic/leads/conversions/engagement
───────────────────────────────────────── */
function ResultsDashboard({ start }: { start: boolean }) {
  return (
    <div className="rounded-[28px] p-8 md:p-12" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 24px 60px rgba(27,16,35,0.07)" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {resultMetrics.map((m) => (
          <div key={m.label} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold" style={{ color: "#1B1023" }}>{m.label}</span>
              <span className="inline-flex items-center gap-1 text-[13px] font-bold" style={{ color: "#8B2FC9" }}>
                <FaArrowUp size={10} /> {m.display}
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(139,47,201,0.1)" }}>
              <div
                className="h-full rounded-full"
                style={{ ["--w" as string]: `${m.value}%`, width: start ? `${m.value}%` : 0, background: GRAD, transition: "width 1.1s cubic-bezier(0.22,1,0.36,1)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Testimonial carousel — glass card
───────────────────────────────────────── */
function TestimonialCarousel() {
  const [index, setIndex] = useState(0)
  const t = testimonials[index]
  const go = (dir: number) => setIndex((i) => (i + dir + testimonials.length) % testimonials.length)
  const touchX = useRef<number | null>(null)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1)
    if (e.key === "ArrowLeft") go(-1)
  }
  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="absolute -top-16 -left-10 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(139,47,201,0.14) 0%,transparent 70%)" }} />
      <div className="absolute -bottom-16 -right-10 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(255,45,149,0.12) 0%,transparent 70%)" }} />

      <div
        className="relative text-center outline-none rounded-[28px] px-8 py-12 md:px-14 md:py-14"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(14px)", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 24px 60px rgba(27,16,35,0.1)" }}
      >
        <div className="relative w-16 h-16 rounded-2xl mx-auto mb-6 overflow-hidden" style={{ boxShadow: "0 10px 26px rgba(27,16,35,0.18)", border: "2px solid #fff", outline: "1px solid rgba(139,47,201,0.2)" }}>
          <img key={index} src={t.avatar} alt={`${t.author}, ${t.role}`} className="w-full h-full object-cover" loading="lazy" style={{ animation: "wordFade 0.4s ease" }} />
        </div>
        <div className="flex justify-center gap-0.5 mb-5">{[1, 2, 3, 4, 5].map((s) => <FaStar key={s} size={14} className="text-yellow-400" />)}</div>
        <p key={index} className="text-xl md:text-2xl font-medium leading-relaxed mb-8" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
          <FaQuoteLeft size={14} style={{ color: "#8B2FC9", display: "inline", marginRight: 8, verticalAlign: "middle" }} />
          {t.quote}
        </p>
        <p className="text-sm font-bold" style={{ color: "#1B1023" }}>{t.author}</p>
        <p className="text-sm mb-9" style={{ color: "#c9a8dd" }}>{t.role}</p>

        <div className="flex items-center justify-center gap-4">
          <button onClick={() => go(-1)} aria-label="Previous testimonial" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-x-0.5" style={{ border: "1px solid rgba(139,47,201,0.25)", color: "#8B2FC9" }}>
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
          <button onClick={() => go(1)} aria-label="Next testimonial" className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:translate-x-0.5" style={{ border: "1px solid rgba(139,47,201,0.25)", color: "#8B2FC9" }}>
            <FaArrowRight size={12} />
          </button>
        </div>
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
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-6 py-7 text-left" aria-expanded={isOpen}>
        <span className="font-bold text-[17px]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>{item.q}</span>
        <span
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: isOpen ? GRAD : "rgba(139,47,201,0.08)", color: isOpen ? "#fff" : "#8B2FC9", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease, background 0.3s ease, color 0.3s ease" }}
        >
          <FaChevronDown size={12} />
        </span>
      </button>
      <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
        <div className="overflow-hidden">
          <p className="pb-7 pr-10 text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>{item.a}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function HomePage() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const statsReveal = useReveal(0.3)
  const resultsReveal = useReveal(0.3)

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t) }, [])

  return (
    <main
      className={`${display.variable} ${body.variable} font-sans min-h-screen overflow-x-hidden`}
      style={{ background: "linear-gradient(160deg,#ffffff 0%,#FBF7FC 50%,#ffffff 100%)", fontFamily: "var(--font-body)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: wordFadeCSS }} />

      <Hero visible={heroVisible} />

      {/* MARQUEE STRIP */}
      <div className="py-5 overflow-hidden" style={{ background: "#1B1023" }}>
        <div className="flex items-center gap-10" style={{ animation: "marquee 22s linear infinite", width: "max-content" }}>
          {[...industries, ...industries].map((t, i) => (
            <span key={i} className="flex items-center gap-10 text-[13px] font-bold whitespace-nowrap tracking-wide" style={{ color: "rgba(255,255,255,0.85)", fontFamily: DISPLAY }}>
              {t}
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: i % 2 === 0 ? "#FF2D95" : "#8B2FC9" }} />
            </span>
          ))}
        </div>
      </div>

      {/* STATS */}
      <section className="py-16" style={{ background: "#FBF7FC", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div ref={statsReveal.ref} className="w-11/12 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s) => (
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

      {/* ABOUT — split screen */}
      <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20 items-center">
          <Reveal>
            <h2 className="text-4xl md:text-[52px] font-bold leading-[1.05] mb-2" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              Strategy.<br />Creativity.<br /><GradWord>Technology.</GradWord><br />Growth.
            </h2>
          </Reveal>

          <Reveal delay={100}>
            <p className="leading-relaxed mb-4 max-w-md" style={{ color: "#6b6560" }}>
              Most agencies do one thing well. We kept design, development and marketing under one roof — so nothing waits on a handoff, and nothing stalls on someone else&apos;s excuse.
            </p>
            <p className="leading-relaxed mb-8 max-w-md" style={{ color: "#6b6560" }}>
              We&apos;ve run the same integrated playbook since 2011 for businesses across Pakistan and the UK.
            </p>
            <div className="flex flex-col mb-8">
              {checks.map((c, i) => (
                <div key={c.title} className="py-4" style={{ borderTop: i === 0 ? "1px solid rgba(139,47,201,0.14)" : "none", borderBottom: "1px solid rgba(139,47,201,0.14)" }}>
                  <h3 className="font-bold text-[15px] mb-1" style={{ color: "#1B1023" }}>{c.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{c.desc}</p>
                </div>
              ))}
            </div>
            <MagneticLink href="/about" variant="solid">Why SK Techs <FaArrowRight size={12} /></MagneticLink>
          </Reveal>
        </div>

        {/* overlapping collage */}
        <Reveal delay={140} className="w-11/12 max-w-6xl mx-auto">
          <div className="relative h-[340px] md:h-[380px] max-w-4xl mx-auto">
            <div className="absolute left-0 top-4 w-[46%] h-[78%] rounded-2xl overflow-hidden" style={{ boxShadow: "0 20px 45px rgba(27,16,35,0.16)", zIndex: 1 }}>
              <img src={collage[0].src} alt={collage[0].alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              <span className="absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "rgba(27,16,35,0.55)", backdropFilter: "blur(4px)" }}>{collage[0].label}</span>
            </div>
            <div className="absolute right-0 top-0 w-[44%] h-[58%] rounded-2xl overflow-hidden" style={{ boxShadow: "0 20px 45px rgba(27,16,35,0.16)", zIndex: 2 }}>
              <img src={collage[1].src} alt={collage[1].alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              <span className="absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "rgba(27,16,35,0.55)", backdropFilter: "blur(4px)" }}>{collage[1].label}</span>
            </div>
            <div className="absolute right-6 bottom-0 w-[40%] h-[46%] rounded-2xl overflow-hidden" style={{ boxShadow: "0 20px 45px rgba(27,16,35,0.2)", zIndex: 3, border: "4px solid #fff" }}>
              <img src={collage[2].src} alt={collage[2].alt} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
              <span className="absolute bottom-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "rgba(27,16,35,0.55)", backdropFilter: "blur(4px)" }}>{collage[2].label}</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* SERVICES */}
      <section className="py-24 md:py-28" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-12 max-w-xl">
            <SectionMark>What we lead with</SectionMark>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1] mb-4" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              Five services. One team building all of them together.
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>Click through to see how each one actually works.</p>
          </Reveal>

          <Reveal delay={80}><ServiceExplorer /></Reveal>

          <Reveal delay={140} className="mt-10">
            <p className="text-sm font-bold mb-4" style={{ color: "#1B1023" }}>And whatever else your brand needs:</p>
            <div className="flex flex-wrap gap-3">
              {moreServices.map((s) => (
                <Link key={s.title} href={s.href} className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5" style={{ border: "1px solid rgba(139,47,201,0.18)", color: "#1B1023", background: "#ffffff" }}>
                  <span style={{ color: "#8B2FC9" }}>{s.icon}</span>
                  {s.title}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="py-20" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-2xl md:text-[34px] font-bold leading-tight mb-10" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              From first impression to final conversion.
            </h2>
          </Reveal>
          <Reveal delay={80}><JourneyFlow /></Reveal>
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
            <SectionMark>How we work</SectionMark>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              How a project runs, start to finish.
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <div className="relative">
              <div className="hidden lg:block absolute top-[26px] left-[12%] right-[12%] h-px" style={{ background: "linear-gradient(90deg,#8B2FC9,#FF2D95)" }} />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {process.map((p, i) => (
                  <div key={p.num} className="relative flex flex-col gap-4 p-7 rounded-2xl h-full transition-all duration-300 hover:-translate-y-2" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.12)", boxShadow: "0 10px 26px rgba(27,16,35,0.05)" }}>
                    <span className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: GRAD, color: "#fff", fontFamily: DISPLAY }}>{p.num}</span>
                    <h3 className="font-bold text-[17px]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="py-24 md:py-28" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-12 max-w-xl">
            <SectionMark>Proof, not promises</SectionMark>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              Recent results, by the client.
            </h2>
          </Reveal>
          <Reveal delay={80}><CaseStudySwitcher /></Reveal>
        </div>
      </section>

      {/* RESULTS DASHBOARD */}
      <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
        <div ref={resultsReveal.ref} className="w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-12 max-w-2xl">
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              Marketing that looks good. Results that look better.
            </h2>
            <p className="text-[15px] leading-relaxed mt-4" style={{ color: "#6b6560" }}>
              Averages across active client engagements over their most recent quarter.
            </p>
          </Reveal>
          <Reveal delay={80}><ResultsDashboard start={resultsReveal.visible} /></Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-28" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal><TestimonialCarousel /></Reveal>
        </div>
      </section>

      {/* CONTACT STRIP */}
      <section className="py-16" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            { label: "Office", lines: ["PAK Arab Society, Gulberg", "Lahore, Pakistan"], icon: <FaMapMarkerAlt size={16} /> },
            { label: "Call us", lines: ["Pakistan: +92 336 8007788", "UK: +44 7708 568160"], icon: <FaPhoneAlt size={15} /> },
            { label: "Email", lines: ["info@sktechs.com"], icon: <FaEnvelope size={16} /> },
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

      {/* FAQ */}
      <section style={{ background: "#ffffff", borderTop: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-2xl mx-auto">
          <Reveal className="text-center pt-24 pb-10">
            <div className="flex justify-center"><SectionMark>Got questions?</SectionMark></div>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>Frequently asked questions</h2>
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
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full pointer-events-none hidden md:block" style={{ background: "radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 70%)" }} />
        <div
          className="absolute bottom-16 right-[14%] rounded-2xl px-5 py-4 items-center gap-3 hidden md:flex"
          style={{ ["--rot" as string]: "-2deg", animation: "floatSlow 6s ease-in-out infinite", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <FaArrowUp size={14} style={{ color: "#fff" }} />
          <span className="text-sm font-bold text-white" style={{ fontFamily: DISPLAY }}>+42% growth</span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-[50px] font-bold text-white tracking-tight mb-5" style={{ fontFamily: DISPLAY }}>
              Ready to make your brand impossible to ignore?
            </h2>
            <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.8)" }}>
              Let&apos;s build something people notice — and results your business can measure.
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
    </main>
  )
}