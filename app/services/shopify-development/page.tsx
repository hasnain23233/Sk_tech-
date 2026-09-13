"use client"

import React, { useEffect, useRef, useState, ReactNode } from "react"
import Link from "next/link"
import { Bricolage_Grotesque, Manrope } from "next/font/google"
import { FaArrowRight, FaShoppingBag, FaBolt } from "react-icons/fa"

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] })
const body = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700", "800"] })

/* ─────────────────────────────────────────
   Brand tokens — same system as the home / portfolio / contact / content-writing /
   pay-per-click / seo-content-marketing pages
   purple #8B2FC9   pink #FF2D95   ink #1B1023   paper #FBF7FC   muted #6b6560
───────────────────────────────────────── */
const GRAD = "linear-gradient(135deg,#8B2FC9,#FF2D95)"
const GRAD_SOFT = "linear-gradient(135deg,rgba(139,47,201,0.12),rgba(255,45,149,0.12))"
const DISPLAY = "var(--font-display)"

/* ─────────────────────────────────────────
   Shared motion primitives (ported from the other pages, kept local
   so this page matches the rest of the service pages exactly)
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
  { value: "2–4 wks", label: "Store build, theme to checkout" },
  { value: "Online Store 2.0", label: "Theme architecture, section-based" },
  { value: "Plus & Hydrogen", label: "Ready for scale when you are" },
]

const benefits = [
  "Custom Liquid theme built around your products, not a stock theme with a new logo",
  "Checkout tuned for mobile, where most Shopify traffic actually converts",
  "Clean data migration from your current platform — products, orders, and customers intact",
  "Only the apps you need, chosen and configured so they don't collide or slow the store down",
  "Page speed treated as a launch requirement, not an afterthought",
  "Support after launch for theme updates, app changes, and seasonal campaigns",
]

const features = [
  {
    title: "Custom theme development",
    desc: "Liquid themes built section-by-section on Online Store 2.0, styled to your brand from the ground up.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M6 3l1 4h10l1-4M4 8h16l-1.5 12a2 2 0 01-2 1.7H7.5a2 2 0 01-2-1.7L4 8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Store migration",
    desc: "Moving from WooCommerce, Magento, or another platform, with products, history, and SEO redirects preserved.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 12h13M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "App integrations",
    desc: "Reviews, subscriptions, loyalty, ERP, or a custom app built against the Shopify API when nothing off-the-shelf fits.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="white" strokeWidth="2" />
        <path d="M16.5 14v6M13.5 17h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Shopify Plus & headless",
    desc: "Custom checkout extensibility on Plus, or a Hydrogen storefront when the front end needs to break from Liquid entirely.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 3v18M4 7.5l8 4.5 8-4.5" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Checkout & conversion",
    desc: "Cart flow, shipping and payment options, and page speed, all tuned against where shoppers actually drop off.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M4 6h2l2 11h10l2-8H7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="1.4" fill="white" />
        <circle cx="16" cy="20" r="1.4" fill="white" />
      </svg>
    ),
  },
  {
    title: "Ongoing support",
    desc: "Theme updates, seasonal changes, and app troubleshooting, on retainer or as needed after launch.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3a9 9 0 100 18 9 9 0 000-18z" stroke="white" strokeWidth="2" />
        <path d="M12 7v5l3.5 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const process = [
  { num: "01", title: "Store audit & planning", desc: "We review your catalog, current platform, and goals, and scope the theme, apps, and migration needed." },
  { num: "02", title: "Design & theme build", desc: "Section-based Liquid theme built around your products, reviewed page by page as it's built." },
  { num: "03", title: "Apps & data migration", desc: "Products, customers, and order history migrated; apps configured and tested against the live catalog." },
  { num: "04", title: "Launch & growth", desc: "Go-live, then speed checks, conversion tracking, and support through your first campaigns." },
]

const faqs = [
  { q: "Do we need Shopify Plus?", a: "Only if you need custom checkout logic, higher API limits, or multi-store management. Most stores run well on Shopify's standard plans." },
  { q: "Can you migrate our existing store without losing data?", a: "Yes. Products, customers, and order history move over, and we set up redirects so existing SEO rankings and bookmarked links keep working." },
  { q: "Will a custom theme be slower than a template?", a: "No — done properly it's usually faster, since we're not carrying unused template code. We treat page speed as a requirement, not an extra." },
  { q: "What ongoing costs should we expect?", a: "Shopify's own plan fee, plus whatever apps you keep active. We help pick apps that earn their monthly cost rather than stacking subscriptions." },
  { q: "Can you build a headless storefront on Shopify?", a: "Yes, using Hydrogen and the Storefront API, when the front end needs more flexibility than a Liquid theme allows." },
]

const relatedLinks = [
  { title: "Web Development", href: "/services/web-development" },
  { title: "Web Designing", href: "/services/web-designing" },
  { title: "SEO Optimization", href: "/services/seo-optimization" },
  { title: "Pay Per Click", href: "/services/pay-per-click" },
]

/* ─────────────────────────────────────────
   Hero visual — a tilting product-page mockup with a price, an add-to-cart
   button, and a floating cart badge, set inside the same layered-composition
   frame used by the content-writing / pay-per-click / seo hero pattern.
───────────────────────────────────────── */
function StorefrontMockup() {
  const ref = useRef<HTMLDivElement | null>(null)
  const [tilt, setTilt] = useState({ x: 10, y: -12 })

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: 10 + py * -10, y: -12 + px * 14 })
  }
  function handleLeave() { setTilt({ x: 10, y: -12 }) }

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className="relative flex h-full items-center justify-center" style={{ perspective: "1100px" }}>
      <div
        className="relative w-full max-w-sm"
        style={{ transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: "transform 0.28s ease-out" }}
      >
        <div className="overflow-hidden rounded-2xl bg-white" style={{ boxShadow: "0 30px 70px rgba(27,16,35,0.22)", border: "1px solid rgba(139,47,201,0.15)" }}>
          <div className="flex items-center gap-1.5 border-b border-neutral-100 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,45,149,0.7)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(200,55,171,0.5)" }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(139,47,201,0.4)" }} />
            <span className="ml-3 text-[11px] font-medium text-neutral-400">product page</span>
          </div>
          <div className="px-5 py-6">
            <div className="h-32 rounded-lg" style={{ background: "linear-gradient(135deg,#F6D3EC,#EBC7EE,#DDB6EE)" }} />
            <div className="mt-4 h-2.5 w-2/3 rounded-full bg-neutral-200" />
            <div className="mt-2 h-2.5 w-1/3 rounded-full bg-neutral-100" />
            <div className="mt-5 flex items-center justify-between">
              <span className="font-bold text-lg" style={{ color: "#1B1023", fontFamily: DISPLAY }}>$68.00</span>
              <span className="rounded-full px-4 py-2 text-[12px] font-semibold text-white" style={{ background: GRAD }}>
                Add to cart
              </span>
            </div>
          </div>
        </div>

        <div
          className="absolute -right-5 -top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white"
          style={{ transform: "translateZ(24px)", boxShadow: "0 14px 30px rgba(111,31,158,0.2)" }}
        >
          <span className="relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6h15l-1.5 9h-12L6 6z" stroke="#8B2FC9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L4.5 2.5H2" stroke="#8B2FC9" strokeWidth="2" strokeLinecap="round" />
              <circle cx="9.5" cy="20" r="1.4" fill="#8B2FC9" />
              <circle cx="17.5" cy="20" r="1.4" fill="#8B2FC9" />
            </svg>
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ background: "#FF2D95" }}>
              3
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Hero — same layered composition language as the other pages, built around
   the storefront mockup plus a real photo card for a more grounded, human feel
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
              <FaShoppingBag size={11} /> Stores built on Shopify, tuned to sell
            </span>
          </div>

          <h1
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", color: "#1B1023", fontFamily: DISPLAY }}
            className="text-4xl sm:text-5xl md:text-[58px] font-bold leading-[1.05] tracking-tight mb-7"
          >
            Shopify stores built to <GradWord>sell, not just launch.</GradWord>
          </h1>

          <p
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", color: "#6b6560" }}
            className="text-base md:text-lg leading-relaxed mb-10 max-w-xl"
          >
            Custom themes, clean migrations, and checkout tuned for conversion — built on Shopify's platform and unlocked further with Plus or a headless storefront when you need it.
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

        {/* Layered composition — storefront mockup plus a real photo card, mirroring
            the home/portfolio/contact/content-writing/pay-per-click/seo hero pattern */}
        <div
          className="relative hidden lg:block h-[440px]"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s" }}
        >
          <div className="absolute inset-0 rounded-[28px]" style={{ background: "#FBF7FC" }} />
          <StorefrontMockup />

          {/* floating photo card — a real image, not another mockup */}
          <div
            className="absolute right-0 top-2 rounded-2xl overflow-hidden w-40"
            style={{ background: "#fff", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80"
              alt="Packing a product order for a Shopify store"
              className="w-full h-24 object-cover"
              loading="lazy"
            />
            <div className="px-3 py-2.5">
              <p className="text-[11px] font-bold" style={{ color: "#1B1023" }}>Built to convert</p>
              <p className="text-[10px]" style={{ color: "#6b6560" }}>Not just to launch</p>
            </div>
          </div>

          {/* floating speed card */}
          <div
            className="absolute left-2 bottom-4 rounded-2xl px-5 py-4 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GRAD, color: "#fff" }}>
              <FaBolt size={13} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: "#1B1023", fontFamily: DISPLAY }}>Speed-checked</p>
              <p className="text-[11px] font-medium" style={{ color: "#6b6560" }}>a launch requirement</p>
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
export default function ShopifyDevelopmentPage() {
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
                src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80"
                alt="Small business owner managing an online store"
                className="w-full h-[280px] object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <SectionMark>Why it works</SectionMark>
            <p className="text-lg leading-relaxed" style={{ color: "#1B1023" }}>
              Shopify handles hosting, payments, and security — what determines whether a store actually sells is the theme, the checkout experience, and how well the apps behind it are chosen. We build custom Liquid themes, migrate stores cleanly from other platforms, and keep the whole thing fast on mobile, where most Shopify traffic converts or doesn&apos;t.
            </p>
          </Reveal>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-24" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-6xl mx-auto grid grid-cols-1 gap-14 lg:grid-cols-[0.9fr_1.6fr]">
          <Reveal>
            <SectionMark>What you get</SectionMark>
            <h2 className="text-3xl md:text-[38px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>Standard on every store we ship.</h2>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>Not sold back as add-ons.</p>
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
            <SectionMark>What we build</SectionMark>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>Six parts of a Shopify build, one team.</h2>
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
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1] text-white" style={{ fontFamily: DISPLAY }}>How a store build runs.</h2>
            <p className="mt-4" style={{ color: "rgba(255,255,255,0.6)" }}>Four stages, catalog to checkout.</p>
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
            Ready for a store that earns its traffic?
          </h2>
          <Link href="/contact" className="shrink-0 inline-flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ background: "#ffffff", color: "#8B2FC9", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", fontFamily: DISPLAY }}>
            Get in touch <FaArrowRight size={13} />
          </Link>
        </div>
      </section>
    </main>
  )
}