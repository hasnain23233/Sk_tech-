"use client"

import React, { useEffect, useRef, useState, ReactNode } from "react"
import { Bricolage_Grotesque, Manrope } from "next/font/google"
import {
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaArrowRight, FaCheck,
  FaClock, FaGlobeAmericas,
} from "react-icons/fa"

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] })
const body = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700", "800"] })

/* ─────────────────────────────────────────
   Brand tokens — same system as the home & portfolio pages
   purple #8B2FC9   pink #FF2D95   ink #1B1023   paper #FBF7FC   muted #6b6560
───────────────────────────────────────── */
const GRAD = "linear-gradient(135deg,#8B2FC9,#FF2D95)"
const GRAD_SOFT = "linear-gradient(135deg,rgba(139,47,201,0.12),rgba(255,45,149,0.12))"
const DISPLAY = "var(--font-display)"

/* ─────────────────────────────────────────
   Shared motion primitives (ported from the home & portfolio pages)
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

/* Magnetic wrapper that works for both <a> and <button> — used for every
   primary call-to-action so hover motion feels identical across pages. */
function useMagneticEl<T extends HTMLElement>(strength = 0.25) {
  const ref = useRef<T>(null)
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

function MagneticButton({
  children, type = "button", onClick, disabled = false, className = "", style = {},
}: {
  children: ReactNode; type?: "button" | "submit"; onClick?: () => void; disabled?: boolean
  className?: string; style?: React.CSSProperties
}) {
  const { ref, onMove, onLeave } = useMagneticEl<HTMLButtonElement>(0.2)
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 0.15s ease-out", fontFamily: DISPLAY, ...style }}
      className={className}
    >
      {children}
    </button>
  )
}

const pageCSS = `
@keyframes wordFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes floatSlow{0%,100%{transform:translateY(0) rotate(var(--rot,0deg))}50%{transform:translateY(-14px) rotate(var(--rot,0deg))}}
@keyframes bounceDown{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`

/* ─────────────────────────────────────────
   Data
───────────────────────────────────────── */
const services = [
  "Web Development",
  "Web Designing",
  "Shopify Development",
  "Application Development",
  "Social Media Marketing",
  "SEO & Content Marketing",
  "Graphic Designing",
  "Content Writing",
  "Pay-Per-Click Advertising",
  "Not sure yet",
]

const budgets = ["Under $2,000", "$2,000 – $5,000", "$5,000 – $15,000", "$15,000+", "Let's discuss"]

const steps = [
  { num: "01", title: "You reach out", desc: "Send the form or an email — it takes about a minute." },
  { num: "02", title: "We reply within 2 days", desc: "A straight answer on scope, timeline, and rough cost." },
  { num: "03", title: "Free scoping call", desc: "30 minutes to walk through what you actually need." },
  { num: "04", title: "Fixed quote", desc: "No hourly guesswork — a number you can plan around." },
]

const offices = [
  { country: "Pakistan", address: "PAK Arab Society, Gulberg, Lahore", phone: "+92 336 8007788", phoneHref: "tel:+923368007788" },
  { country: "United Kingdom", address: "Remote team, London-based hours", phone: "+44 7708 568160", phoneHref: "tel:+447708568160" },
]

type FormState = { name: string; email: string; phone: string; service: string; budget: string; message: string }
const initialForm: FormState = { name: "", email: "", phone: "", service: "", budget: "", message: "" }

const inputStyle: React.CSSProperties = { border: "1px solid rgba(139,47,201,0.16)", background: "#ffffff", color: "#1B1023" }

function FieldLabel({ children, htmlFor }: { children: ReactNode; htmlFor: string }) {
  return <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold" style={{ color: "#1B1023" }}>{children}</label>
}

const inputClass = "w-full rounded-xl px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-neutral-400 focus:ring-2"

/* ─────────────────────────────────────────
   Hero — same layered composition language as home & portfolio,
   built around a real photo of the team since this page is about talking to people
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
      className="relative pt-28 md:pt-36 pb-16 overflow-hidden"
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
              <FaEnvelope size={11} /> Replies within 2 business days
            </span>
          </div>

          <h1
            style={{
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", color: "#1B1023", fontFamily: DISPLAY,
            }}
            className="text-4xl sm:text-5xl md:text-[58px] font-bold leading-[1.05] tracking-tight mb-7"
          >
            Let&apos;s start <GradWord>something.</GradWord>
          </h1>

          <p
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", color: "#6b6560" }}
            className="text-base md:text-lg leading-relaxed mb-10 max-w-xl"
          >
            Tell us what you&apos;re building. We reply within two business days with a real answer about scope, timeline, and cost — not a form-letter.
          </p>

          <div
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s" }}
            className="flex flex-wrap gap-4"
          >
            <a href="#contact-form" className="inline-flex items-center justify-center gap-2 font-bold text-sm px-8 py-4 rounded-xl" style={{ background: GRAD, color: "#fff", boxShadow: "0 10px 30px rgba(139,47,201,0.35)", fontFamily: DISPLAY }}>
              Fill out the form <FaArrowRight size={12} />
            </a>
            <a href="mailto:info@sktechs.com" className="inline-flex items-center justify-center gap-2 font-bold text-sm px-8 py-4 rounded-xl" style={{ background: "rgba(139,47,201,0.05)", border: "1px solid rgba(139,47,201,0.25)", color: "#8B2FC9", fontFamily: DISPLAY }}>
              info@sktechs.com
            </a>
          </div>
        </div>

        {/* Layered photo composition, mirroring the home/portfolio hero pattern */}
        <div
          className="relative hidden lg:block h-[440px]"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s" }}
        >
          {/* main photo card */}
          <div className="absolute top-2 left-6 right-16 rounded-[22px] overflow-hidden" style={{ boxShadow: "0 30px 70px rgba(27,16,35,0.22)", border: "1px solid rgba(139,47,201,0.15)" }}>
            <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: "#1B1023" }}>
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF2D95" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FFB648" }} />
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#8B2FC9" }} />
              <span className="ml-3 text-[11px] font-semibold" style={{ color: "rgba(255,255,255,0.5)", fontFamily: DISPLAY }}>say hello</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="SK Techs team discussing a client project"
              className="w-full h-[280px] object-cover"
              loading="lazy"
            />
          </div>

          {/* floating response-time card */}
          <div
            className="absolute left-0 bottom-16 rounded-2xl px-5 py-4 flex items-center gap-3"
            style={{ ["--rot" as string]: "-2deg", animation: "floatSlow 6s ease-in-out infinite", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GRAD, color: "#fff" }}>
              <FaClock size={13} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: "#1B1023", fontFamily: DISPLAY }}>2-day reply</p>
              <p className="text-[11px] font-medium" style={{ color: "#6b6560" }}>every single time</p>
            </div>
          </div>

          {/* floating email card */}
          <div
            className="absolute right-0 bottom-2 rounded-2xl px-4 py-3 flex items-center gap-2.5 w-44"
            style={{ ["--rot" as string]: "3deg", animation: "floatSlow 7s ease-in-out infinite 0.6s", background: "#fff", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GRAD_SOFT, color: "#8B2FC9" }}>
              <FaEnvelope size={12} />
            </div>
            <div>
              <p className="text-[11px] font-bold" style={{ color: "#1B1023" }}>No form-letters</p>
              <p className="text-[10px]" style={{ color: "#6b6560" }}>Real answers</p>
            </div>
          </div>

          {/* floating locations pill */}
          <div
            className="absolute right-8 top-6 rounded-full px-5 py-3 flex items-center gap-2"
            style={{ ["--rot" as string]: "-1deg", animation: "floatSlow 5.5s ease-in-out infinite 0.3s", background: "#1B1023", boxShadow: "0 14px 34px rgba(27,16,35,0.28)" }}
          >
            <FaGlobeAmericas size={12} style={{ color: "#FFB648" }} />
            <span className="text-sm font-bold" style={{ color: "#fff", fontFamily: DISPLAY }}>PK + UK</span>
          </div>

          <div className="absolute -z-10 -bottom-10 -right-10 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(139,47,201,0.16) 0%,transparent 70%)" }} />
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function Contact() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t) }, [])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (!form.name.trim()) next.name = "Tell us your name."
    if (!form.email.trim()) {
      next.email = "We'll need an email to reply."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "That email doesn't look right."
    }
    if (!form.message.trim()) next.message = "A few lines about the project helps."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    // Simulated network delay — wire this up to your form endpoint / API route.
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 900)
  }

  return (
    <main
      className={`${display.variable} ${body.variable} font-sans min-h-screen overflow-x-hidden`}
      style={{ background: "linear-gradient(160deg,#ffffff 0%,#FBF7FC 50%,#ffffff 100%)", fontFamily: "var(--font-body)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: pageCSS }} />

      {submitted ? (
        <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
          <Reveal>
            <div className="flex h-16 w-16 items-center justify-center rounded-full mx-auto mb-6" style={{ background: GRAD, boxShadow: "0 14px 34px rgba(139,47,201,0.32)" }}>
              <FaCheck size={22} color="#fff" />
            </div>
            <h1 className="text-3xl md:text-[40px] font-bold" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              Message <GradWord>sent.</GradWord>
            </h1>
            <p className="mt-4 max-w-md mx-auto text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>
              Thanks, {form.name.split(" ")[0] || "there"} — we&apos;ll get back to you within two business days at{" "}
              <span className="font-semibold" style={{ color: "#1B1023" }}>{form.email}</span>.
            </p>
            <button
              onClick={() => { setForm(initialForm); setSubmitted(false) }}
              className="mt-8 text-sm font-bold underline underline-offset-4"
              style={{ color: "#8B2FC9", fontFamily: DISPLAY }}
            >
              Send another message
            </button>
          </Reveal>
        </section>
      ) : (
        <>
          <Hero visible={heroVisible} />

          {/* FORM + INFO */}
          <section id="contact-form" className="w-11/12 max-w-6xl mx-auto py-8 md:py-14 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10">
            <Reveal>
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-[28px] p-7 sm:p-9"
                style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 24px 60px rgba(27,16,35,0.07)" }}
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <input
                      id="name" type="text" value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Jordan Smith"
                      className={inputClass}
                      style={{ ...inputStyle, boxShadow: errors.name ? "0 0 0 2px rgba(255,45,149,0.15)" : undefined, borderColor: errors.name ? "rgba(255,45,149,0.4)" : undefined }}
                    />
                    {errors.name && <p className="mt-1.5 text-sm font-medium" style={{ color: "#D92D5C" }}>{errors.name}</p>}
                  </div>
                  <div>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <input
                      id="email" type="email" value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@company.com"
                      className={inputClass}
                      style={{ ...inputStyle, boxShadow: errors.email ? "0 0 0 2px rgba(255,45,149,0.15)" : undefined, borderColor: errors.email ? "rgba(255,45,149,0.4)" : undefined }}
                    />
                    {errors.email && <p className="mt-1.5 text-sm font-medium" style={{ color: "#D92D5C" }}>{errors.email}</p>}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="phone">Phone (optional)</FieldLabel>
                    <input
                      id="phone" type="tel" value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+92 3XX XXXXXXX"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="service">Service you need</FieldLabel>
                    <select
                      id="service" value={form.service}
                      onChange={(e) => update("service", e.target.value)}
                      className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22 fill=%22none%22><path d=%22M2.5 4.5L6 8l3.5-3.5%22 stroke=%22%238B2FC9%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-[right_1rem_center] bg-no-repeat pr-10`}
                      style={inputStyle}
                    >
                      <option value="">Select a service</option>
                      {services.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mt-5">
                  <FieldLabel htmlFor="budget">Rough budget</FieldLabel>
                  <div className="flex flex-wrap gap-2.5">
                    {budgets.map((b) => {
                      const active = form.budget === b
                      return (
                        <button
                          key={b}
                          type="button"
                          onClick={() => update("budget", b)}
                          className="rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200"
                          style={{
                            background: active ? GRAD : "#ffffff",
                            color: active ? "#fff" : "#1B1023",
                            border: active ? "1px solid transparent" : "1px solid rgba(139,47,201,0.18)",
                            boxShadow: active ? "0 8px 22px rgba(139,47,201,0.28)" : "none",
                          }}
                        >
                          {b}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-5">
                  <FieldLabel htmlFor="message">Tell us about the project</FieldLabel>
                  <textarea
                    id="message" rows={5} value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="What are you trying to build or fix, and what does success look like?"
                    className={`${inputClass} resize-none`}
                    style={{ ...inputStyle, boxShadow: errors.message ? "0 0 0 2px rgba(255,45,149,0.15)" : undefined, borderColor: errors.message ? "rgba(255,45,149,0.4)" : undefined }}
                  />
                  {errors.message && <p className="mt-1.5 text-sm font-medium" style={{ color: "#D92D5C" }}>{errors.message}</p>}
                </div>

                <MagneticButton
                  type="submit"
                  disabled={submitting}
                  className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold disabled:opacity-70"
                  style={{ background: GRAD, color: "#fff", boxShadow: "0 10px 30px rgba(139,47,201,0.35)" }}
                >
                  {submitting ? "Sending…" : <>Send message <FaArrowRight size={12} /></>}
                </MagneticButton>
                <p className="mt-4 text-xs" style={{ color: "#a89aad" }}>
                  We&apos;ll only use these details to reply about your project.
                </p>
              </form>
            </Reveal>

            {/* Info sidebar */}
            <Reveal delay={100} className="flex flex-col gap-6">
              <div className="rounded-[24px] p-7" style={{ background: "#FBF7FC", border: "1px solid rgba(139,47,201,0.14)" }}>
                <p className="text-sm font-bold mb-4" style={{ color: "#8B2FC9", fontFamily: DISPLAY }}>Prefer email or a call?</p>
                <div className="flex flex-col gap-3">
                  <a href="mailto:info@sktechs.com" className="flex items-center gap-3 text-[15px] font-semibold transition-colors" style={{ color: "#1B1023" }}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: GRAD, color: "#fff" }}><FaEnvelope size={13} /></span>
                    info@sktechs.com
                  </a>
                  {offices.map((o) => (
                    <a key={o.country} href={o.phoneHref} className="flex items-center gap-3 text-[15px] font-semibold transition-colors" style={{ color: "#1B1023" }}>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: GRAD, color: "#fff" }}><FaPhoneAlt size={12} /></span>
                      {o.country}: {o.phone}
                    </a>
                  ))}
                </div>
              </div>

              {offices.map((o) => (
                <div key={o.country} className="rounded-[24px] p-7 transition-all duration-300 hover:-translate-y-1" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 10px 26px rgba(27,16,35,0.05)" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: GRAD_SOFT, color: "#8B2FC9" }}><FaMapMarkerAlt size={13} /></span>
                    <p className="text-sm font-bold" style={{ color: "#1B1023", fontFamily: DISPLAY }}>{o.country} office</p>
                  </div>
                  <p className="text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>{o.address}</p>
                </div>
              ))}

              <div className="rounded-[24px] p-7" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 10px 26px rgba(27,16,35,0.05)" }}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ background: GRAD_SOFT, color: "#8B2FC9" }}><FaClock size={13} /></span>
                  <p className="text-sm font-bold" style={{ color: "#1B1023", fontFamily: DISPLAY }}>Response time</p>
                </div>
                <p className="text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>
                  We reply within two business days, usually sooner. If it&apos;s urgent, call the Pakistan office directly.
                </p>
              </div>
            </Reveal>
          </section>

          {/* WHAT HAPPENS NEXT — same numbered-step pattern as the home page's process section */}
          <section className="py-24 md:py-28" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)" }}>
            <div className="w-11/12 max-w-6xl mx-auto">
              <Reveal className="mb-14 max-w-xl">
                <SectionMark>What happens next</SectionMark>
                <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
                  What happens after you reach out.
                </h2>
              </Reveal>

              <Reveal delay={80}>
                <div className="relative">
                  <div className="hidden lg:block absolute top-[26px] left-[12%] right-[12%] h-px" style={{ background: "linear-gradient(90deg,#8B2FC9,#FF2D95)" }} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((s) => (
                      <div key={s.num} className="relative flex flex-col gap-4 p-7 rounded-2xl h-full transition-all duration-300 hover:-translate-y-2" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.12)", boxShadow: "0 10px 26px rgba(27,16,35,0.05)" }}>
                        <span className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: GRAD, color: "#fff", fontFamily: DISPLAY }}>{s.num}</span>
                        <h3 className="font-bold text-[17px]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>{s.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: "#6b6560" }}>{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </section>
        </>
      )}
    </main>
  )
}