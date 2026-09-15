"use client"

import React, { useEffect, useRef, useState, ReactNode } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Bricolage_Grotesque, Manrope } from "next/font/google"
import {
  FaArrowRight, FaArrowUp, FaStar, FaChevronDown, FaUsers,
  FaCode, FaBullhorn, FaPenNib, FaMapMarkerAlt, FaAngleDown,
  FaClock, FaCheck,
} from "react-icons/fa"
import { Tilt3D, Magnetic } from "../components/Tilt3d"

// The 3D scene uses WebGL / DOM APIs — load it client-only, same pattern as
// the home page's HeroScene.
const AboutScene = dynamic(() => import("../components/Aboutscene"), { ssr: false })

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] })
const body = Manrope({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700", "800"] })

/* ─────────────────────────────────────────
   Brand tokens — identical to the home page
   purple #8B2FC9   pink #FF2D95   ink #1B1023   paper #FBF7FC
   muted #6b6560    gold #FFB648 (accent highlight, used sparingly)
───────────────────────────────────────── */
const GRAD = "linear-gradient(135deg,#8B2FC9,#FF2D95)"
const GRAD_SOFT = "linear-gradient(135deg,rgba(139,47,201,0.12),rgba(255,45,149,0.12))"
const DISPLAY = "var(--font-display)"

/* ─────────────────────────────────────────
   Shared primitives (mirrored from the home page)
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

const sharedCSS = `
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes bounceDown{0%,100%{transform:translateY(0)}50%{transform:translateY(8px)}}
@keyframes wordFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes floatSlow{0%,100%{transform:translateY(0) rotate(var(--rot,0deg))}50%{transform:translateY(-14px) rotate(var(--rot,0deg))}}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
`

/* ─────────────────────────────────────────
   Content
───────────────────────────────────────── */
const aboutStats = [
  { value: "15", suffix: "+", label: "Years running", icon: <FaClock size={15} /> },
  { value: "300", suffix: "+", label: "Projects shipped", icon: <FaCode size={15} /> },
  { value: "2", suffix: "", label: "Offices, one team", icon: <FaMapMarkerAlt size={15} /> },
  { value: "3", suffix: "", label: "Disciplines under one lead", icon: <FaUsers size={15} /> },
]

const milestones = [
  {
    year: "2011", title: "Two people, one client",
    body: "Started in Lahore building websites for a handful of local shops, one project at a time.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2014", title: "Clients started asking for traffic, not just sites",
    body: "Added SEO and paid search so the websites we built actually had people arriving on them.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2017", title: "Opened a UK desk",
    body: "Took on our first UK retail client and set up a second desk to work their hours properly.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2020", title: "Became a full team",
    body: "Design, development, content and paid media started working from the same brief instead of four separate ones.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80",
  },
  {
    year: "2025", title: "300+ projects in, still the same desk",
    body: "Same founders, same two offices, more people — the handoffs we started out avoiding are still gone.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  },
]

const teams = [
  { label: "Build", role: "Design & development", icon: <FaCode size={16} />, body: "The people who turn a brief into a site or app that loads fast and holds up after launch. They stay on a project through QA, not just the handoff." },
  { label: "Grow", role: "SEO & paid media", icon: <FaBullhorn size={16} />, body: "The people who read the analytics every week and adjust spend accordingly, rather than setting a campaign live and checking back at the end of the month." },
  { label: "Create", role: "Content & design", icon: <FaPenNib size={16} />, body: "The people writing the pages and designing the graphics that Build ships and Grow promotes — briefed once, not three times." },
]

const principles = [
  { title: "We scope before we quote", detail: "A fixed price for a defined set of deliverables. If the scope changes mid-project, you see the new number before we start, not after." },
  { title: "One lead across every discipline", detail: "The same person who agreed your brief is the one your developer and your copywriter both report to — you're not repeating context three times." },
  { title: "Reports are numbers, not screenshots", detail: "Traffic, leads, and cost per result each month, plus one paragraph on what we're changing next. No dashboard tour required." },
  { title: "We stay on after launch", detail: "Most of our clients started with a website and stayed on for the marketing — the two teams already know each other's work." },
]

const offices = [
  { city: "Lahore", country: "Pakistan", timeZone: "Asia/Karachi", detail: "PAK Arab Society, Gulberg", note: "Development and design desk", image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=700&q=80" },
  { city: "Remote desk", country: "United Kingdom", timeZone: "Europe/London", detail: "Working UK hours", note: "Client strategy and accounts", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80" },
]

const valuesStrip = ["SINCE 2011", "LAHORE", "LONDON HOURS", "300+ PROJECTS", "ONE TEAM", "NO HANDOFFS"]

/* ─────────────────────────────────────────
   Hero — layered photo composition sits in front of the
   animated 3D twin-ribbon scene (client-only Canvas), with
   the same mouse-tracked glow, magnetic CTAs and floating
   cards as before, now given real 3D tilt.
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
      {/* Animated 3D backdrop — same shader language as the home page,
          reworked as two woven ribbons. Sits behind everything, quiet
          enough to read as texture rather than compete with the copy. */}
      <div className="absolute inset-0 pointer-events-none opacity-70 mix-blend-normal">
        <AboutScene />
      </div>

      <div
        className="absolute inset-0 pointer-events-none transition-[background] duration-300"
        style={{
          backgroundImage:
            "radial-gradient(650px circle at var(--mx) var(--my),rgba(139,47,201,0.13) 0%,transparent 60%),radial-gradient(ellipse 55% 45% at 88% 15%,rgba(255,45,149,0.08) 0%,transparent 55%), linear-gradient(180deg, rgba(251,247,252,0) 0%, rgba(251,247,252,0.55) 78%, #FBF7FC 100%)",
        }}
      />

      <div className="relative z-10 w-11/12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-14 items-center">
        <div>
          <div
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}
            className="inline-flex items-center gap-2 mb-7"
          >
            <span className="inline-flex items-center gap-2" style={{ color: "#8B2FC9", background: "rgba(139,47,201,0.08)", border: "1px solid rgba(139,47,201,0.25)", borderRadius: 999, padding: "8px 16px", fontFamily: DISPLAY, fontWeight: 600, fontSize: 13 }}>
              <FaStar size={9} /> About SK Techs
            </span>
          </div>

          <h1
            style={{
              opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s", color: "#1B1023", fontFamily: DISPLAY,
            }}
            className="text-4xl sm:text-5xl md:text-[56px] font-bold leading-[1.06] tracking-tight mb-7"
          >
            Two founders, one desk, <GradWord>since 2011.</GradWord>
          </h1>

          <p
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", color: "#6b6560" }}
            className="text-base md:text-lg leading-relaxed mb-10 max-w-md"
          >
            We still run the way we started: build the thing, then run the marketing for it ourselves, so nothing gets lost between agencies.
          </p>

          <div
            style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.7s ease 0.3s, transform 0.7s ease 0.3s" }}
            className="flex flex-wrap gap-4"
          >
            <MagneticLink href="/contact" variant="solid">Get in touch <FaArrowRight size={12} /></MagneticLink>
            <MagneticLink href="/portfolio" variant="outline">See our work</MagneticLink>
          </div>
        </div>

        {/* Layered photo composition, floating above the 3D backdrop */}
        <div
          className="relative hidden lg:block h-[480px]"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s" }}
        >
          {/* main team photo — now with real 3D tilt on hover */}
          <Tilt3D max={7} className="absolute top-2 left-6 right-16 rounded-[22px] overflow-hidden" style={{ boxShadow: "0 30px 70px rgba(27,16,35,0.22)", border: "1px solid rgba(139,47,201,0.15)" }}>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="SK Techs team working together in the studio"
              className="w-full h-[300px] object-cover"
              loading="lazy"
            />
          </Tilt3D>

          {/* secondary office photo, tucked behind top-right */}
          <Tilt3D max={14} className="absolute right-0 top-10 w-32 h-32 rounded-2xl overflow-hidden" style={{ boxShadow: "0 20px 45px rgba(27,16,35,0.2)", border: "4px solid #fff" }}>
            <img
              src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=300&q=80"
              alt="SK Techs desk setup"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Tilt3D>

          {/* floating years card */}
          <div
            className="absolute left-0 bottom-28 rounded-2xl px-5 py-4 flex items-center gap-3"
            style={{ ["--rot" as string]: "-2deg", animation: "floatSlow 6s ease-in-out infinite", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: GRAD, color: "#fff" }}>
              <FaClock size={13} />
            </div>
            <div>
              <p className="text-lg font-bold leading-none" style={{ color: "#1B1023", fontFamily: DISPLAY }}>15+ years</p>
              <p className="text-[11px] font-medium" style={{ color: "#6b6560" }}>Same two founders</p>
            </div>
          </div>

          {/* floating avatar-stack card */}
          <div
            className="absolute right-4 bottom-2 rounded-2xl px-5 py-4"
            style={{ ["--rot" as string]: "3deg", animation: "floatSlow 7s ease-in-out infinite 0.6s", background: "#fff", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 18px 40px rgba(27,16,35,0.16)" }}
          >
            <div className="flex -space-x-2.5 mb-2">
              {["https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80",
                "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=80&q=80"].map((src, i) => (
                <img key={i} src={src} alt="Team member" className="w-8 h-8 rounded-full object-cover" style={{ border: "2px solid #fff" }} loading="lazy" />
              ))}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: GRAD, color: "#fff", border: "2px solid #fff" }}>+40</div>
            </div>
            <p className="text-[11px] font-bold" style={{ color: "#1B1023" }}>One team, three desks</p>
          </div>

          {/* floating location pill — now magnetic */}
          <Magnetic strength={0.3} className="absolute right-24 top-4 rounded-full px-5 py-3 flex items-center gap-2" style={{ ["--rot" as string]: "-1deg" as any, animation: "floatSlow 5.5s ease-in-out infinite 0.3s", background: "#1B1023", boxShadow: "0 14px 34px rgba(27,16,35,0.28)" }}>
            <FaMapMarkerAlt size={12} style={{ color: "#FFB648" }} />
            <span className="text-sm font-bold" style={{ color: "#fff", fontFamily: DISPLAY }}>Lahore + UK</span>
          </Magnetic>

          {/* decorative gradient blob */}
          <div className="absolute -z-10 -bottom-10 -right-10 w-56 h-56 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(139,47,201,0.16) 0%,transparent 70%)" }} />
        </div>
      </div>

      <div
        className="relative z-10 flex justify-center mt-14"
        style={{ opacity: visible ? 0.6 : 0, transition: "opacity 1s ease 0.6s", animation: visible ? "bounceDown 2.2s ease-in-out infinite" : "none" }}
      >
        <FaAngleDown size={18} style={{ color: "#8B2FC9" }} />
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
   Story timeline — pill tabs + image/content split.
   Image now has a subtle cursor-driven parallax zoom in
   addition to the crossfade, so the timeline feels alive
   under the pointer, not just on tab change.
───────────────────────────────────────── */
function StoryExplorer() {
  const [active, setActive] = useState(milestones.length - 1)
  const imgWrapRef = useRef<HTMLDivElement>(null)
  const [imgTransform, setImgTransform] = useState("scale(1) translate(0,0)")
  const m = milestones[active]

  const onImgMove = (e: React.MouseEvent) => {
    const el = imgWrapRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setImgTransform(`scale(1.08) translate(${-px * 16}px, ${-py * 16}px)`)
  }
  const onImgLeave = () => setImgTransform("scale(1) translate(0,0)")

  return (
    <div>
      <div className="flex gap-2.5 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: "none" }}>
        {milestones.map((item, i) => (
          <Magnetic as="button" key={item.year} strength={0.18} onClick={() => setActive(i)}>
            <div
              className="flex items-center gap-2.5 px-5 py-3 rounded-full flex-shrink-0 transition-all duration-300"
              style={{
                background: active === i ? GRAD : "#ffffff",
                border: active === i ? "1px solid transparent" : "1px solid rgba(139,47,201,0.18)",
                boxShadow: active === i ? "0 10px 26px rgba(139,47,201,0.3)" : "none",
              }}
            >
              <span className="text-[14px] font-bold whitespace-nowrap" style={{ color: active === i ? "#fff" : "#1B1023", fontFamily: DISPLAY }}>{item.year}</span>
            </div>
          </Magnetic>
        ))}
      </div>

      <Tilt3D max={3} glare={false} className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] rounded-[28px] overflow-hidden" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 24px 60px rgba(27,16,35,0.09)" }}>
        <div ref={imgWrapRef} onMouseMove={onImgMove} onMouseLeave={onImgLeave} className="relative h-56 lg:h-auto overflow-hidden">
          <img
            key={m.year}
            src={m.image}
            alt={`SK Techs, ${m.year}`}
            className="w-full h-full object-cover"
            loading="lazy"
            style={{ animation: "wordFade 0.5s ease", transform: imgTransform, transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(27,16,35,0.5) 0%,transparent 45%)" }} />
          <span className="absolute bottom-5 left-6 text-3xl font-bold text-white" style={{ fontFamily: DISPLAY }}>{m.year}</span>
        </div>

        <div className="p-8 md:p-10 flex flex-col justify-center">
          <h3 className="text-2xl md:text-[28px] font-bold mb-3" style={{ color: "#1B1023", fontFamily: DISPLAY }}>{m.title}</h3>
          <p className="text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>{m.body}</p>
        </div>
      </Tilt3D>
    </div>
  )
}

/* ─────────────────────────────────────────
   Teams — accordion rows, with a tilt-responsive icon chip
───────────────────────────────────────── */
function TeamItem({ item, isOpen, onToggle }: { item: typeof teams[number]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(139,47,201,0.12)" }}>
      <button onClick={onToggle} className="flex w-full items-center justify-between gap-6 py-7 text-left" aria-expanded={isOpen}>
        <span className="flex items-center gap-4">
          <Tilt3D max={20} glare={false} shadow={false}>
            <span className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isOpen ? GRAD : "rgba(139,47,201,0.08)", color: isOpen ? "#fff" : "#8B2FC9", transition: "background 0.3s ease, color 0.3s ease" }}>
              {item.icon}
            </span>
          </Tilt3D>
          <span>
            <span className="block font-bold text-[17px]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>{item.label}</span>
            <span className="block text-sm" style={{ color: "#6b6560" }}>{item.role}</span>
          </span>
        </span>
        <span
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: isOpen ? GRAD : "rgba(139,47,201,0.08)", color: isOpen ? "#fff" : "#8B2FC9", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease, background 0.3s ease, color 0.3s ease" }}
        >
          <FaChevronDown size={12} />
        </span>
      </button>
      <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.35s cubic-bezier(0.22,1,0.36,1)" }}>
        <div className="overflow-hidden">
          <p className="pb-7 pr-10 pl-[60px] text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>{item.body}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Principles — dark panel with radial blobs, cards now
   tilt in 3D on hover in addition to expanding
───────────────────────────────────────── */
function PrinciplesPanel() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="rounded-3xl p-8 md:p-12 relative overflow-hidden" style={{ background: "#1B1023" }}>
      <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(139,47,201,0.35) 0%,transparent 65%)", transform: "translate(30%,-35%)" }} />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(255,45,149,0.18) 0%,transparent 65%)", transform: "translate(-25%,35%)" }} />

      <div className="relative z-10">
        <p className="text-sm font-semibold mb-4" style={{ color: "#FF2D95", fontFamily: DISPLAY }}>How we work with clients</p>
        <h3 className="text-2xl md:text-[32px] font-bold leading-tight mb-9 max-w-lg" style={{ color: "#fff", fontFamily: DISPLAY }}>
          Four habits we don&apos;t compromise on.
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {principles.map((p, i) => {
            const isOpen = open === i
            return (
              <Tilt3D key={p.title} max={6} scale={1.01} shadow={false}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="rounded-2xl p-6 text-left transition-colors duration-200 w-full"
                  style={{ background: isOpen ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)", border: isOpen ? "1px solid rgba(255,45,149,0.4)" : "1px solid rgba(255,255,255,0.12)" }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="font-bold text-[16px] leading-snug" style={{ color: "#fff", fontFamily: DISPLAY }}>{p.title}</h4>
                    <span
                      className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: isOpen ? GRAD : "rgba(255,255,255,0.1)", color: "#fff", transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s ease, background 0.3s ease" }}
                    >
                      <FaChevronDown size={10} />
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 0.3s cubic-bezier(0.22,1,0.36,1)" }}>
                    <div className="overflow-hidden">
                      <p className="pt-3 text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{p.detail}</p>
                    </div>
                  </div>
                </button>
              </Tilt3D>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   Offices — tab switcher + card, card now tilts in 3D
───────────────────────────────────────── */
function TimezoneClock({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  if (!now) return <span className="tabular-nums">--:--:--</span>
  return <span className="tabular-nums">{now.toLocaleTimeString("en-US", { timeZone, hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
}

function OfficeSwitcher() {
  const [active, setActive] = useState(0)
  const o = offices[active]
  return (
    <div>
      <div className="flex gap-2.5 mb-6">
        {offices.map((item, i) => (
          <Magnetic as="button" key={item.city} strength={0.15} onClick={() => setActive(i)} className="flex-1">
            <div
              className="flex items-center gap-2.5 px-5 py-3 rounded-full justify-center transition-all duration-300"
              style={{
                background: active === i ? GRAD : "#ffffff",
                border: active === i ? "1px solid transparent" : "1px solid rgba(139,47,201,0.18)",
                boxShadow: active === i ? "0 10px 26px rgba(139,47,201,0.3)" : "none",
              }}
            >
              <FaMapMarkerAlt size={12} style={{ color: active === i ? "#fff" : "#8B2FC9" }} />
              <span className="text-[14px] font-bold whitespace-nowrap" style={{ color: active === i ? "#fff" : "#1B1023", fontFamily: DISPLAY }}>{item.city}</span>
            </div>
          </Magnetic>
        ))}
      </div>

      <Tilt3D max={4} glare={false} className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] rounded-[28px] overflow-hidden" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.16)", boxShadow: "0 24px 60px rgba(27,16,35,0.09)" }}>
        <div className="relative h-52 lg:h-auto overflow-hidden">
          <img key={o.city} src={o.image} alt={`${o.city} office`} className="w-full h-full object-cover" loading="lazy" style={{ animation: "wordFade 0.5s ease" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(0deg,rgba(27,16,35,0.5) 0%,transparent 45%)" }} />
          <div className="absolute bottom-5 left-6">
            <p className="text-white text-lg font-bold" style={{ fontFamily: DISPLAY }}>{o.city}</p>
            <p className="text-white/75 text-sm">{o.country}</p>
          </div>
        </div>

        <div className="p-8 md:p-10 flex flex-col justify-center">
          <p className="text-sm font-medium mb-1" style={{ color: "#6b6560" }}>{o.detail}</p>
          <p className="text-sm font-bold mb-7" style={{ color: "#1B1023" }}>{o.note}</p>
          <div className="flex items-center justify-between rounded-2xl px-6 py-5" style={{ background: "#FBF7FC", border: "1px solid rgba(139,47,201,0.14)" }}>
            <span className="text-sm font-semibold" style={{ color: "#6b6560" }}>Local time</span>
            <span className="text-2xl font-bold" style={{ background: GRAD, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: DISPLAY }}>
              <TimezoneClock timeZone={o.timeZone} />
            </span>
          </div>
        </div>
      </Tilt3D>
    </div>
  )
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function AboutPage() {
  const [heroVisible, setHeroVisible] = useState(false)
  const [openTeam, setOpenTeam] = useState(0)
  const statsReveal = useReveal(0.3)

  useEffect(() => { const t = setTimeout(() => setHeroVisible(true), 80); return () => clearTimeout(t) }, [])

  return (
    <main
      className={`${display.variable} ${body.variable} font-sans min-h-screen overflow-x-hidden`}
      style={{ background: "linear-gradient(160deg,#ffffff 0%,#FBF7FC 50%,#ffffff 100%)", fontFamily: "var(--font-body)" }}
    >
      <style dangerouslySetInnerHTML={{ __html: sharedCSS }} />

      <Hero visible={heroVisible} />

      {/* MARQUEE STRIP */}
      <div className="py-5 overflow-hidden" style={{ background: "#1B1023" }}>
        <div className="flex items-center gap-10" style={{ animation: "marquee 22s linear infinite", width: "max-content" }}>
          {[...valuesStrip, ...valuesStrip].map((t, i) => (
            <span key={i} className="flex items-center gap-10 text-[13px] font-bold whitespace-nowrap tracking-wide" style={{ color: "rgba(255,255,255,0.85)", fontFamily: DISPLAY }}>
              {t}
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: i % 2 === 0 ? "#FF2D95" : "#8B2FC9" }} />
            </span>
          ))}
        </div>
      </div>

      {/* STATS — now with real 3D tilt on hover, not just lift */}
      <section className="py-16" style={{ background: "#FBF7FC", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div ref={statsReveal.ref} className="w-11/12 max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {aboutStats.map((s) => (
            <Tilt3D key={s.label} max={12}>
              <div
                className="group relative text-center p-6 rounded-2xl"
                style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.12)" }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ background: GRAD_SOFT, color: "#8B2FC9" }}>{s.icon}</div>
                <p className="text-4xl md:text-5xl font-bold tabular-nums mb-1" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
                  <CountUp value={`${s.value}${s.suffix}`} start={statsReveal.visible} />
                </p>
                <p className="text-sm font-medium" style={{ color: "#6b6560" }}>{s.label}</p>
              </div>
            </Tilt3D>
          ))}
        </div>
      </section>

      {/* STORY */}
      <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-12 max-w-xl">
            <SectionMark>How we got here</SectionMark>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1] mb-4" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              Fifteen years, five turning points.
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>Pick a year to see what changed.</p>
          </Reveal>
          <Reveal delay={80}><StoryExplorer /></Reveal>
        </div>
      </section>

      {/* TEAMS */}
      <section className="py-24 md:py-28" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-3xl mx-auto">
          <Reveal className="mb-10">
            <SectionMark>Who does the work</SectionMark>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1] mb-4" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              Three groups, one project lead.
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "#6b6560" }}>Nobody hears about your brief secondhand.</p>
          </Reveal>

          <Reveal delay={80}>
            <div className="rounded-[28px] px-6 md:px-10" style={{ background: "#ffffff", border: "1px solid rgba(139,47,201,0.14)", boxShadow: "0 24px 60px rgba(27,16,35,0.07)" }}>
              {teams.map((t, i) => (
                <TeamItem key={t.label} item={t} isOpen={openTeam === i} onToggle={() => setOpenTeam(openTeam === i ? -1 : i)} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="py-24 md:py-28" style={{ background: "#ffffff" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal><PrinciplesPanel /></Reveal>
        </div>
      </section>

      {/* OFFICES */}
      <section className="py-24 md:py-28" style={{ background: "#FBF7FC", borderTop: "1px solid rgba(139,47,201,0.1)", borderBottom: "1px solid rgba(139,47,201,0.1)" }}>
        <div className="w-11/12 max-w-6xl mx-auto">
          <Reveal className="mb-12 max-w-xl">
            <SectionMark>Where we work</SectionMark>
            <h2 className="text-3xl md:text-[42px] font-bold leading-[1.1]" style={{ color: "#1B1023", fontFamily: DISPLAY }}>
              Two desks, one working day.
            </h2>
          </Reveal>
          <Reveal delay={80}><OfficeSwitcher /></Reveal>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: "linear-gradient(135deg,#1B1023 0%,#8B2FC9 60%,#FF2D95 100%)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <AboutScene interactive={false} />
        </div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(255,255,255,0.12) 0%,transparent 65%)", transform: "translate(30%,-30%)" }} />
        <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full pointer-events-none hidden md:block" style={{ background: "radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 70%)" }} />
        <div
          className="absolute bottom-16 right-[14%] rounded-2xl px-5 py-4 items-center gap-3 hidden md:flex"
          style={{ ["--rot" as string]: "-2deg", animation: "floatSlow 6s ease-in-out infinite", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.25)" }}
        >
          <FaCheck size={13} style={{ color: "#fff" }} />
          <span className="text-sm font-bold text-white" style={{ fontFamily: DISPLAY }}>One desk since 2011</span>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-[50px] font-bold text-white tracking-tight mb-5" style={{ fontFamily: DISPLAY }}>
              Want to work with the same desk twice?
            </h2>
            <p className="text-lg mb-10" style={{ color: "rgba(255,255,255,0.8)" }}>
              Tell us what you&apos;re building — you&apos;ll hear back from the person who&apos;ll actually run it.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 font-bold text-sm px-10 py-4 rounded-xl transition-all duration-200 hover:-translate-y-1" style={{ background: "#ffffff", color: "#8B2FC9", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", fontFamily: DISPLAY }}>
                Start your project <FaArrowRight size={13} />
              </Link>
              <MagneticLink href="/portfolio" variant="onDark">See our work</MagneticLink>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  )
}